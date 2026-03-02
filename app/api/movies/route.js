import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;
        const type = searchParams.get('type');
        const genre = searchParams.get('genre');
        const country = searchParams.get('country');
        const year = searchParams.get('year');

        const filter = {};
        if (type) filter.type = type;
        if (genre) filter.genres = { $in: [genre] };
        if (country) filter.country = { $in: [country] };
        if (year) filter.year = parseInt(year);

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
        console.error('Movies List Error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Internal server error' },
            { status: 500 }
        );
    }
}
