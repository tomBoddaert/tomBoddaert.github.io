import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const ProjectFrontmatter = z.object({
  name: z.string(),
  title: z.string().optional(),
  updated: z.date(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  description: z.string(),
  hasScript: z.boolean().default(false),
}).refine((value) => Boolean(value.image) === Boolean(value.imageAlt), {
  error: 'Project should have an imageAlt if and only if it has an image',
  path: ['imageAlt'],
}).transform((value) => ({
  title: value.title ?? value.name,
  ...value,
}));
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatter>;

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/projects/collection' }),
  schema: ProjectFrontmatter,
});

export const collections = { projects };
