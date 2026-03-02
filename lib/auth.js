import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object containing _id and username
 * @returns {string} - Signed JWT token
 */
export function signToken(user) {
    return jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token from Authorization header 
 * @returns {Object} - Decoded token payload
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}
