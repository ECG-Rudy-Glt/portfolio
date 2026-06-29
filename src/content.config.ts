import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(["perso", "ecole", "entreprise"]),
    summary: z.string(),
    period: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    tags: z.array(z.string()),
    links: z
      .object({
        repo: z.string().url().optional(),
        demo: z.string().url().optional(),
        sandbox: z.string().url().optional(),
      })
      .default({}),
    images: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    groupProject: z.boolean().default(false),
    contributors: z.array(z.string()).default([]),
    relevance: z.enum(["majeur", "pertinent", "secondaire"]).default("pertinent"),
    order: z.number().default(0),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    type: z.enum(["article", "linkedin"]).default("article"),
    externalUrl: z.string().url().optional(),
    cover: z.string().optional(),
  }),
});

export const collections = { projects, articles };
