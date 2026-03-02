import mongoose from 'mongoose';

const AdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        enum: ['Top', 'Sidebar', 'Bottom', 'In-Player'],
        required: true,
        index: true
    },
    content: {
        type: String, // Banner HTML or image URL
        required: true
    },
    link_url: {
        type: String, // Destination URL for the ad
        trim: true
    },
    click_count: {
        type: Number,
        default: 0
    },
    script: String, // Pop-under or other scripts
    priority: {
        type: Number,
        default: 0
    },
    start_date: Date,
    end_date: Date,
    is_active: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }
});

export default mongoose.models.Ad || mongoose.model('Ad', AdSchema);
