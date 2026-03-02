import { getLang, t } from '@/lib/i18n';

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const lang = getLang(req);
        const { id } = await params;

        const movie = await Movie.findById(id);

        if (!movie) {
            return NextResponse.json(
                { status: 'error', message: t('movie_not_found', lang) },
                { status: 404 }
            );
        }

        // Increment view count
        await Movie.findByIdAndUpdate(id, { $inc: { view_count: 1 } });

        return NextResponse.json({
            status: 'success',
            data: { movie }
        });

    } catch (error) {
        console.error('Movie Detail Error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Internal server error' },
            { status: 500 }
        );
    }
}
