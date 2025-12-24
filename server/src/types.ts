import { z } from 'zod';

/**
 * Wish categories
 */
export const WishCategory = z.enum(['toy', 'experience', 'kindness', 'magic']);
export type WishCategory = z.infer<typeof WishCategory>;

/**
 * Wish priorities
 */
export const WishPriority = z.enum(['dream wish', 'hopeful wish', 'small wish']);
export type WishPriority = z.infer<typeof WishPriority>;

/**
 * Make a wish tool input schema (Zod)
 */
export const MakeAWishInputSchema = z.object({
  message: z.string().min(1, 'Wish cannot be empty'),
  category: WishCategory.optional().default('magic'),
  priority: WishPriority.optional().default('hopeful wish'),
});

export type MakeAWishInput = z.infer<typeof MakeAWishInputSchema>;

/**
 * Wish tool structured content output
 */
export interface WishToolOutput {
  wish: string;
  category: WishCategory;
  priority: WishPriority;
  timestamp: string;
  [key: string]: unknown;
}

// Legacy aliases for backward compatibility
export const EchoToolInputSchema = MakeAWishInputSchema;
export type EchoToolInput = MakeAWishInput;
export interface EchoToolOutput extends WishToolOutput {
  echoedMessage: string;
}

/**
 * Stored wish with metadata
 */
export interface StoredWish {
  id: string;
  wish: string;
  category: WishCategory;
  priority: WishPriority;
  timestamp: string;
  granted?: boolean;
  grantedAt?: string;
}

/**
 * Widget descriptor for tool metadata
 */
export interface WidgetDescriptor {
  id: string;
  title: string;
  uri: string;
}
