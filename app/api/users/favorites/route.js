import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Favorite from '@/models/Favorite';
import Movie from '@/models/Movie'; // Ensure Movie model is registered
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

        const favorites = await Favorite.find({ user_id: userId })
            .populate({
                path: 'movie_id',
                select: 'title poster_url year quality type episode_current'
            })
            .sort({ created_at: -1 });

        return NextResponse.json({
            status: 'success',
            data: { favorites }
        });

    } catch (error) {
        console.error('Get Favorites Error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Internal server error' },
            { status: 500 }
        );
    }
}
