import { defineCollection, z } from 'astro:content';

const locations = defineCollection({
  type: 'content',
  schema: z.object({
    city: z.string(),
    state: z.string(),
    slug: z.string(),
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
    slug: z.string(),
    tagline: z.string(),
    long_description: z.string(),
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
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
  })
});

export const collections = {
  locations,
  services,
  blog
};
