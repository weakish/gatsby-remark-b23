import visit from 'unist-util-visit';
import { transformers } from './transformer';

const getUrl = url => {
    try {
        return new URL(url).toString();
    } catch (err) {
        return null;
    }
};

const transform = (cache, urlStr, node, transformations) => {
    transformers
        .filter(({ isTarget }) => isTarget(urlStr))
        .forEach(({ getHtml }) => {
            transformations.push(async () => {
                let html = await cache.get(urlStr);
                if (!html) {
                    html = await getHtml(urlStr);
                    await cache.set(urlStr, html);
                }
                node.type = `html`;
                node.value = html;
                node.children = undefined;
            });
        });
    return;
};

export default async (
    { cache, markdownAST },
    pluginOptions = { prefix: null }
) => {
    const { prefix } = pluginOptions;
    const transformations = [];
    if (!prefix) {
        visit(markdownAST, `paragraph`, paragraphNode => {
            if (paragraphNode.children.length !== 1) {
                return;
            }
            const [node] = paragraphNode.children;
            const isValid =
                node.type === `link` &&
                node.title === null &&
                node.children.length === 1 &&
                node.children[0].value === node.url;
            if (!isValid) {
                return;
            }
            const { url } = node;
            const urlStr = getUrl(url);
            if (!urlStr) {
                return;
            }
            transform(cache, urlStr, node, transformations);
        });
    } else {
        visit(markdownAST, `inlineCode`, node => {
            const url = node.value.split(prefix).pop();
            if (url) {
                let urlStr = getUrl(url);
                transform(cache, urlStr, node, transformations);
            }
        });
    }
    await Promise.all(transformations.map(tf => tf()));
    return markdownAST;
};