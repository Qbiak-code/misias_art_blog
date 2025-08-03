/**
 * contact-message controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::contact-message.contact-message', ({ strapi }) => ({
  /**
   * Custom action to forward approved contact message to artist
   */
  async forwardToArtist(ctx) {
    try {
      const { id } = ctx.params;
      
      if (!id) {
        return ctx.badRequest('Message ID is required');
      }

      // Get the contact message
      const contactMessage = await strapi.entityService.findOne('api::contact-message.contact-message', id);
      
      if (!contactMessage) {
        return ctx.notFound('Contact message not found');
      }

      // Check if already forwarded (optional - add a 'forwarded' field to prevent double forwarding)
      if (contactMessage.forwardedToArtist) {
        return ctx.badRequest('Message has already been forwarded to artist');
      }

      // Get the service and forward to artist
      const contactService = strapi.service('api::contact-message.contact-message');
      await contactService.forwardToArtist(contactMessage);

      // Mark as forwarded
      await strapi.entityService.update('api::contact-message.contact-message', id, {
        data: { forwardedToArtist: true }
      });

      ctx.send({
        message: 'Contact message successfully forwarded to artist',
        success: true
      });

    } catch (error) {
      strapi.log.error('Error forwarding message to artist:', error);
      ctx.internalServerError('Failed to forward message to artist');
    }
  }
}));
