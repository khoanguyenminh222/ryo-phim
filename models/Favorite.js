import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    movie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
        index: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }
});

// Compound unique index to prevent duplicate favorites
FavoriteSchema.index({ user_id: 1, movie_id: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
