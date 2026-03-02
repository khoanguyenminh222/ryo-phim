import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
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
    },
    episode_number: {
        type: String,
        required: true
    },
    last_time_seconds: {
        type: Number,
        default: 0
    },
    progress_percentage: {
        type: Number,
        default: 0
    }
}, {
    timestamps: { createdAt: false, updatedAt: 'updated_at' }
});

// Compound index for user history lookup and uniqueness per movie
HistorySchema.index({ user_id: 1, movie_id: 1 }, { unique: true });
HistorySchema.index({ user_id: 1, updated_at: -1 });

export default mongoose.models.History || mongoose.model('History', HistorySchema);
