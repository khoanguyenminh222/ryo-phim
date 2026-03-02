import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { category } = await params;
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;

        const categoryMap = {
            'phim-bo-moi': { type: 'phim_bo' },
            'phim-le-moi': { type: 'phim_le' },
            'phim-chieu-rap': { quality: 'Cam' },
            'tv-shows': { type: 'tv_shows' },
            'phim-au-my': { country: { $in: ['Âu Mỹ', 'Mỹ'] } },
            'phim-han-quoc': { country: { $in: ['Hàn Quốc'] } }
        };

        const filter = categoryMap[category] || {};
        const skip = (page - 1) * limit;

        const movies = await Movie.find(filter)
            .sort({ updated_at: -1 })
            .skip(skip)
            .limit(limit)
            .select('title poster_url year quality type episode_current episode_total');

        const total = await Movie.countDocuments(filter);

        return NextResponse.json({
            status: 'success',
            data: {
                movies,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Category Movies Error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Internal server error' },
            { status: 500 }
        );
    }
}
