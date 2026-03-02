import mongoose from 'mongoose';

const EpisodeSchema = new mongoose.Schema({
    name: String,
    slug: String,
    filename: String,
    link_embed: String,
    link_m3u8: String
});

const ServerSchema = new mongoose.Schema({
    server_name: String,
    server_data: [EpisodeSchema]
});

const MovieSchema = new mongoose.Schema({
    tmdb_id: {
        type: Number,
        index: true
    },
    nguonc_slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        index: true
    },
    original_title: String,
    poster_url: String,
    backdrop_url: String,
    description: String,
    year: {
        type: Number,
        index: true
    },
    country: [{
        type: String,
        index: true
    }],
    genres: [{
        type: String,
        index: true
    }],
    type: {
        type: String,
        enum: ['phim_le', 'phim_bo', 'tv_shows', 'hoat_hinh'],
        required: true,
        index: true
    },
    quality: String,
    episode_current: String,
    episode_total: Number,
    status: String,
    servers: [ServerSchema],
    cast: [{
        name: String,
        character: String,
        profile_path: String
    }],
    view_count: {
        type: Number,
        default: 0
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Text search index for title and original_title
MovieSchema.index({ title: 'text', original_title: 'text' });

export default mongoose.models.Movie || mongoose.model('Movie', MovieSchema);
