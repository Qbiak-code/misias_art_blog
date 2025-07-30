const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::artwork.artwork', ({ strapi }) => ({
    async findBySlug(ctx) {
        const { slug } = ctx.params;

        const entity = await strapi.db.query('api::artwork.artwork').findOne({
            where: { slug, publishedAt: { $notNull: true } },
            populate: {
                image: true,
                additionalImages: true,
                comments: {
                    where: { approved: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!entity) {
            return ctx.notFound('Artwork not found');
        }

        return this.sanitizeOutput(entity, ctx);
    },

    async findByCategory(ctx) {
        const { category } = ctx.params;

        const entities = await strapi.db.query('api::artwork.artwork').findMany({
            where: {
                category,
                publishedAt: { $notNull: true }
            },
            populate: {
                image: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return this.sanitizeOutput(entities, ctx);
    }
}));