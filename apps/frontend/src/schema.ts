import { z } from 'zod';

export const BulletPointSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must not exceed 50 characters")
    .describe("Concise, descriptive title (3-6 words)"),
  content: z.string()
    .min(10, "Content must be at least 10 characters")
    .max(200, "Content must not exceed 200 characters")
    .describe("Brief content explanation (1-2 sentences maximum)")
});

export const BulletPointsResponseSchema = z.object({
  bulletPoints: z.array(BulletPointSchema)
    .length(4, "Must contain exactly 4 bullet points")
    .describe("Array of exactly 4 bullet points extracted from the paragraph")
});

// Type inference
export type BulletPoint = z.infer<typeof BulletPointSchema>;
export type BulletPointsResponse = z.infer<typeof BulletPointsResponseSchema>;

// Usage example:
// const result = BulletPointsResponseSchema.parse(jsonResponse);