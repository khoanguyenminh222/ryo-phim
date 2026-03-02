import { signToken } from '@/lib/auth';
import { getLang, t } from '@/lib/i18n';

export async function POST(req) {
    try {
        await dbConnect();
        const lang = getLang(req);
        const { email, password } = await req.json();

        // 1. Basic Validation
        if (!email || !password) {
            return NextResponse.json(
                { status: 'error', message: t('all_fields_required', lang) },
                { status: 400 }
            );
        }

        // 2. Find User
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { status: 'error', message: t('invalid_credentials', lang) },
                { status: 401 }
            );
        }

        // 3. Verify Password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return NextResponse.json(
                { status: 'error', message: t('invalid_credentials', lang) },
                { status: 401 }
            );
        }

        // 4. Generate Token
        const token = signToken(user);

        // 5. Return Response
        return NextResponse.json({
            status: 'success',
            message: t('login_successful', lang),
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                },
                token
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Internal server error' },
            { status: 500 }
        );
    }
}
