// unist types
import { Parent, Data } from 'unist';

export interface MarkdownNode extends Parent, Data {
    url?: string;
    value?: string;
}

export type MDTokenType = 'paragraph' | 'inlineCode';

// Gatsby Node Helpers types
// see https://www.gatsbyjs.org/docs/node-api-helpers/#cache
// types source file: https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/index.d.ts
export interface GatsbyCache {
    /**
     * Retrieve cached value
     * @param key Cache key
     * @returns Promise resolving to cached value
     * @example
     * const value = await cache.get(`unique-key`)
     */
    get(key: string): Promise<any>;

    /**
     * Cache value
     * @param key Cache key
     * @param value Value to be cached
     * @returns Promise resolving to cached value
     * @example
     * await cache.set(`unique-key`, value)
     */
    set(key: string, value: any): Promise<any>;
}

// transformers types
export interface Transformer {
    // basic
    isTarget: (url: string) => boolean;
    getHTML: (url: string) => string | undefined;
    // video player
    getPlayerSrc?: (url: string) => string | null;
}

export type Transformations = Array<() => void>;

// basic types
export type StringOrUndefined = string | undefined;
