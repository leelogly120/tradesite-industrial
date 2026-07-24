import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string().min(10),
    description: z.string().min(50).max(160),
    category: z.string().optional(),
    price: z.object({
      min: z.number(),
      max: z.number(),
      currency: z.string().default('USD'),
    }).optional(),
    specifications: z.record(z.string()).optional(),
    images: z.array(z.string()).optional(),
    moq: z.number().positive().optional(),
    features: z.array(z.string()).optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    relatedProducts: z.array(z.string()).optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
    author: z.string().default('ARCLIFT Team'),
    coverImage: z.string().optional(),
    coverAlt: z.string().min(20),
    coverCaption: z.string().min(20),
  }),
});

export const collections = { products, blog };
