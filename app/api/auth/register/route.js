import { signToken } from '@/lib/auth';
import { getLang, t } from '@/lib/i18n';

export async function POST(req) {
    try {
        await dbConnect();
        const lang = getLang(req);
        const { username, email, password } = await req.json();

        // 1. Basic Validation
        if (!username || !email || !password) {
            return NextResponse.json(
                { status: 'error', message: t('all_fields_required', lang) },
                { status: 400 }
            );
        }

        // 2. Check for existing user
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return NextResponse.json(
                { status: 'error', message: t('user_exists', lang) },
                { status: 409 }
            );
        }

        // 3. Hash Password
        const password_hash = await bcrypt.hash(password, 12);

        // 4. Create User
        const user = await User.create({
            username,
            email,
            password_hash
        });

        // 5. Generate Token
        const token = signToken(user);

        // 6. Return response
        return NextResponse.json({
            status: 'success',
            message: t('user_registered', lang),
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                },
                token
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Internal server error' },
            { status: 500 }
        );
    }
}
