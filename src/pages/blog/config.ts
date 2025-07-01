import { z, defineCollection } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
    coverImage: z.string().optional(),
  }),
});

export const collections = { blog };