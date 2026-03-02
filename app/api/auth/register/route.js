import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req) {
    try {
        await dbConnect();
        const { username, email, password } = await req.json();

        // 1. Basic Validation
        if (!username || !email || !password) {
            return NextResponse.json(
                { status: 'error', message: 'All fields are required' },
                { status: 400 }
            );
        }

        // 2. Check for existing user
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return NextResponse.json(
                { status: 'error', message: 'Email or username already exists' },
                { status: 409 }
            );
        }

        // 3. Hash Password
        const password_hash = await bcrypt.hash(password, 12);

        // 4. Create User
        const user = await User.create({
            username,
            email,
            password_hash
        });

        // 5. Generate Token
        const token = signToken(user);

        // 6. Return response
        return NextResponse.json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                },
                token
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Internal server error' },
            { status: 500 }
        );
    }
}
