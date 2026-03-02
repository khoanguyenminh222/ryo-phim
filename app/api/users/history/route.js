import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import History from '@/models/History';
import Movie from '@/models/Movie';
import { verifyToken } from '@/lib/auth';
import { getLang, t } from '@/lib/i18n';

export async function GET(req) {
    try {
        await dbConnect();
        const lang = getLang(req);

        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { status: 'error', message: t('no_token', lang) },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { status: 'error', message: t('token_invalid', lang) },
                { status: 401 }
            );
        }

        const userId = decoded.userId;

        const history = await History.find({ user_id: userId })
            .populate({
                path: 'movie_id',
                select: 'title poster_url year quality type episode_total'
            })
            .sort({ updated_at: -1 })
            .limit(20);

        return NextResponse.json({
            status: 'success',
            data: { history }
        });

    } catch (error) {
        console.error('Get History Error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const lang = getLang(req);

        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { status: 'error', message: t('no_token', lang) },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { status: 'error', message: t('token_invalid', lang) },
                { status: 401 }
            );
        }

        const userId = decoded.userId;
        const { movieId, episodeNumber, lastTimeSeconds } = await req.json();

        if (!movieId || !episodeNumber) {
            return NextResponse.json(
                { status: 'error', message: t('all_fields_required', lang) },
                { status: 400 }
            );
        }

        // Calculate progress percentage (simple estimation if duration not provided by client)
        // In a real app, duration would come from the client or movie metadata
        const progressPercentage = Math.min((lastTimeSeconds / (24 * 60)) * 100, 100);

        await History.findOneAndUpdate(
            { user_id: userId, movie_id: movieId },
            {
                episode_number: episodeNumber,
                last_time_seconds: lastTimeSeconds,
                progress_percentage: progressPercentage,
                updated_at: new Date()
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            status: 'success',
            message: t('progress_saved', lang)
        });

    } catch (error) {
        console.error('Update History Error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Internal server error' },
            { status: 500 }
        );
    }
}
