import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';

export async function GET() {
    try {
        await dbConnect();

        const movies = await Movie.find()
            .sort({ updated_at: -1 })
            .limit(10)
            .select('title poster_url backdrop_url year quality description');

        return NextResponse.json({
            status: 'success',
            data: { movies }
        });

    } catch (error) {
        console.error('Trending Movies Error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Internal server error' },
            { status: 500 }
        );
    }
}
