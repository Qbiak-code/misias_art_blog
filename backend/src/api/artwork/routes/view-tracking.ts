/**
 * Custom route for artwork view tracking
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/artworks/:id/view',
      handler: 'artwork.incrementView',
      config: {
        // No authentication required for view tracking
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};