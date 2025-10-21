import { defineCollection, z } from 'astro:content';

const locations = defineCollection({
  type: 'content',
  schema: z.object({
    city: z.string(),
    state: z.string(),
    type: z.enum(['major_city', 'suburb']),
    parent_slug: z.string().optional(),
    hero_image: z.string(),
    zip_codes: z.array(z.string()).optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
  })
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    // 🎯 FIX: Removed long_description and slug.
    // The main body content is now correctly accessed via 'service.body'.
    // The slug is correctly accessed via 'service.slug'.
    hero_image: z.string(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
  })
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publish_date: z.date(),
    author: z.string(),
    featured_image: z.string(),
    // 🎯 NOTE: The blog post body content will also be accessed via 'post.body'
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
  })
});

export const collections = {
  locations,
  services,
  blog
};
