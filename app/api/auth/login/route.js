import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        // 1. Basic Validation
        if (!email || !password) {
            return NextResponse.json(
                { status: 'error', message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // 2. Find User
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { status: 'error', message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // 3. Verify Password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return NextResponse.json(
                { status: 'error', message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // 4. Generate Token
        const token = signToken(user);

        // 5. Return Response
        return NextResponse.json({
            status: 'success',
            message: 'Login successful',
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
