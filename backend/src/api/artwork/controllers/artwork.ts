/**
 * artwork controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::artwork.artwork', ({ strapi }) => ({
  /**
   * Custom action to increment view count for an artwork
   */
  async incrementView(ctx) {
    try {
      const { id } = ctx.params;
      
      if (!id) {
        return ctx.badRequest('Artwork ID is required');
      }

      // Get the current artwork
      const artwork = await strapi.entityService.findOne('api::artwork.artwork', id);
      
      if (!artwork) {
        return ctx.notFound('Artwork not found');
      }

      // Increment view count
      const updatedArtwork = await strapi.entityService.update('api::artwork.artwork', id, {
        data: { 
          views: (artwork.views || 0) + 1 
        }
      });

      ctx.send({
        views: updatedArtwork.views,
        success: true
      });

    } catch (error) {
      strapi.log.error('Error incrementing artwork view count:', error);
      ctx.internalServerError('Failed to increment view count');
    }
  }
}));
