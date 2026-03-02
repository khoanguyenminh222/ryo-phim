import { getLang, t } from '@/lib/i18n';

export async function GET(req) {
    try {
        await dbConnect();
        const lang = getLang(req);
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q');
        const limit = parseInt(searchParams.get('limit')) || 50;

        if (!q || q.length < 2) {
            return NextResponse.json(
                { status: 'error', message: t('search_query_short', lang) },
                { status: 400 }
            );
        }

        const movies = await Movie.find(
            { $text: { $search: q } },
            { score: { $meta: 'textScore' } }
        )
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit)
            .select('title poster_url year quality type episode_current');

        return NextResponse.json({
            status: 'success',
            data: { movies }
        });

    } catch (error) {
        console.error('Search Error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Internal server error' },
            { status: 500 }
        );
    }
}
