import visit from 'unist-util-visit';
import transformers from './transformer';
import {
    StringOrUndefined,
    MarkdownNode,
    GatsbyCache,
    Transformations
} from './typings';

const getUrl = (url: StringOrUndefined): StringOrUndefined => {
    try {
        return new URL(url as string).toString();
    } catch (err) {
        return undefined;
    }
};

const transform = (
    cache: GatsbyCache,
    urlStr: string,
    node: MarkdownNode,
    transformations: Transformations
) => {
    transformers
        .filter(({ isTarget }) => isTarget(urlStr))
        .forEach(({ getHTML }) => {
            transformations.push(async () => {
                let html: StringOrUndefined = await cache.get(urlStr);
                if (!html) {
                    html = await getHTML(urlStr);
                    await cache.set(urlStr, html);
                }
                node.type = 'html';
                node.value = html;
                node.children = [];
            });
        });
    return;
};

export default async (
    { cache, markdownAST }: { cache: GatsbyCache; markdownAST: MarkdownNode },
    pluginOptions: { prefix: string | null } = { prefix: null }
) => {
    const prefix = pluginOptions.prefix;
    const transformations: Array<() => void> = [];
    if (!prefix) {
        // use prefix
        visit(markdownAST, 'paragraph', (paragraphNode: MarkdownNode) => {
            if (paragraphNode.children.length !== 1) {
                return;
            }
            const [
                node
            ]: MarkdownNode[] = paragraphNode.children as MarkdownNode[];
            const isValid: boolean =
                node.type === 'link' &&
                node.title === null &&
                node.children.length === 1 &&
                node.children[0].value === node.url;
            if (!isValid) {
                return;
            }
            const { url }: { url?: string } = node as MarkdownNode;
            const urlStr = getUrl(url);
            if (!urlStr) {
                return;
            }
            transform(cache, urlStr, node, transformations);
        });
    } else {
        // use inline code
        visit(markdownAST, 'inlineCode', (node: MarkdownNode) => {
            if (!node.value) {
                return;
            }
            const tokens: Array<string> = node.value.split(prefix);
            if (tokens.length !== 2) {
                return;
            }
            const urlStr = getUrl(tokens.pop());
            if (!urlStr) {
                return;
            }
            transform(cache, urlStr, node, transformations);
        });
    }
    await Promise.all(transformations.map(tf => tf()));
    return markdownAST;
};
