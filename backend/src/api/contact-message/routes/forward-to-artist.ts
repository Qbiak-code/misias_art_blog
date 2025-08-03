/**
 * Custom route for forwarding contact messages to artist
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/contact-messages/:id/forward-to-artist',
      handler: 'contact-message.forwardToArtist',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
  ],
};