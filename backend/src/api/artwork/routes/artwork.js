module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/artworks',
            handler: 'artwork.find',
            config: {
                auth: false, // Public access
            },
        },
        {
            method: 'GET',
            path: '/artworks/:slug',
            handler: 'artwork.findBySlug',
            config: {
                auth: false,
            },
        },
        {
            method: 'GET',
            path: '/artworks/category/:category',
            handler: 'artwork.findByCategory',
            config: {
                auth: false,
            },
        },
    ],
};
