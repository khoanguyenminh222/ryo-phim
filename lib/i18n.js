const translations = {
    vi: {
        all_fields_required: 'Tất cả các trường là bắt buộc',
        user_exists: 'Email hoặc tên đăng nhập đã tồn tại',
        user_registered: 'Đăng ký thành công',
        invalid_credentials: 'Thông tin đăng nhập không chính xác',
        login_successful: 'Đăng nhập thành công',
        movie_not_found: 'Không tìm thấy phim',
        search_query_short: 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự',
        unauthorized: 'Không có quyền truy cập',
        token_invalid: 'Token không hợp lệ hoặc đã hết hạn',
        no_token: 'Không tìm thấy token access',
        favorite_added: 'Đã thêm vào yêu thích',
        favorite_removed: 'Đã xóa khỏi yêu thích',
        progress_saved: 'Đã lưu tiến trình xem',
        success: 'Thành công',
        error: 'Lỗi'
    },
    en: {
        all_fields_required: 'All fields are required',
        user_exists: 'Email or username already exists',
        user_registered: 'User registered successfully',
        invalid_credentials: 'Invalid credentials',
        login_successful: 'Login successful',
        movie_not_found: 'Movie not found',
        search_query_short: 'Search query must be at least 2 characters',
        unauthorized: 'Unauthorized',
        token_invalid: 'Invalid or expired token',
        no_token: 'No token provided',
        favorite_added: 'Added to favorites',
        favorite_removed: 'Removed from favorites',
        progress_saved: 'Progress saved',
        success: 'Success',
        error: 'Error'
    }
};

/**
 * Get translation based on language code
 * @param {string} key - Translation key
 * @param {string} lang - Language code ('vi' or 'en')
 * @returns {string} - Translated string
 */
export function t(key, lang = 'vi') {
    const l = lang === 'en' ? 'en' : 'vi';
    return translations[l][key] || key;
}

/**
 * Extract language from request
 * @param {Request} req 
 * @returns {string} - 'vi' or 'en'
 */
export function getLang(req) {
    const { searchParams } = new URL(req.url);
    const langParam = searchParams.get('lang');
    if (langParam === 'en' || langParam === 'vi') return langParam;

    const acceptLang = req.headers.get('accept-language');
    if (acceptLang && acceptLang.startsWith('en')) return 'en';

    return 'vi';
}
