import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Favorite from '@/models/Favorite';
import { verifyToken } from '@/lib/auth';
import { getLang, t } from '@/lib/i18n';

export async function POST(req, { params }) {
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

        const { movieId } = await params;
        const userId = decoded.userId;

        const existing = await Favorite.findOne({
            user_id: userId,
            movie_id: movieId
        });

        if (existing) {
            await Favorite.deleteOne({ _id: existing._id });
            return NextResponse.json({
                status: 'success',
                message: t('favorite_removed', lang),
                data: { isFavorite: false }
            });
        } else {
            await Favorite.create({
                user_id: userId,
                movie_id: movieId
            });
            return NextResponse.json({
                status: 'success',
                message: t('favorite_added', lang),
                data: { isFavorite: true }
            });
        }

    } catch (error) {
        console.error('Toggle Favorite Error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Internal server error' },
            { status: 500 }
        );
    }
}
