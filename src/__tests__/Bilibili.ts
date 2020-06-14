import { isTarget, getHTML, getPlayerSrc } from '../transformer/Bilibili';
import { cache, getMdAST, getMdfromAST } from './utils';
import plugin from '..';
import { MarkdownNode } from '../typings';

describe('url aid', () => {
    test('non-Bilibili url', () => {
        expect(isTarget('https://www.not-a-bilibili-url.com')).toBe(false);
    });

    test('non-Bilibili url end with bilibili.com', () => {
        expect(isTarget('https://www.this-is-bilibli.com')).toBe(false);
    });

    test('non-Bilibili url end with bilibili.tv', () => {
        expect(isTarget('https://www.this-is-bilibli.tv')).toBe(false);
    });

    test('non-Bilibili url end with b23.tv', () => {
        expect(isTarget('https://www.this-is-b23.tv')).toBe(false);
    });

    test('non-Bilibili url having a valid video id', () => {
        expect(isTarget('https://www.this-is-b23.tv/video/av53851218')).toBe(
            false
        );
    });

    test('short url', () => {
        expect(isTarget('https://b23.tv/av53851218')).toBe(true);
    });

    test('http short url', () => {
        expect(isTarget('https://b23.tv/av53851218')).toBe(true);
    });

    test('full url', () => {
        expect(isTarget('https://bilibili.tv/video/av53851218')).toBe(true);
    });
});

describe('url bvid ', () => {
    test('full url with bvid', () => {
        expect(isTarget('https://bilibili.com/video/BV1YV411r7ns')).toBe(true);
    });
    test('short url with bvid', () => {
        expect(isTarget('https://b23.tv/BV1YV411r7ns')).toBe(true);
    });
    test('http short url with bvid', () => {
        expect(isTarget('https://bilibili.tv/video/BV1YV411r7ns')).toBe(true);
    });
});

describe('playerSrc bvid', () => {
    test('full url bvid', () => {
        expect(getPlayerSrc('https://bilibili.com/video/BV1YV411r7ns')).toBe(
            'https://player.bilibili.com/player.html?bvid=BV1YV411r7ns'
        );
    });
    test('short url bvid', () => {
        expect(getPlayerSrc('https://b23.tv/BV1YV411r7ns')).toBe(
            'https://player.bilibili.com/player.html?bvid=BV1YV411r7ns'
        );
    });
    test('http short url with empty bvid', () => {
        expect(getPlayerSrc('https://bilibili.tv/video/BV')).toBeNull();
    });

    test('short url with page number', () => {
        expect(getPlayerSrc('https://b23.tv/BV1YV411r7ns?p=2')).toBe(
            'https://player.bilibili.com/player.html?bvid=BV1YV411r7ns&page=2'
        );
    });
});

/** get playerSrc */
describe('playerSrc validation aid', () => {
    test('short url', () => {
        expect(getPlayerSrc('https://b23.tv/av53851218')).toBe(
            'https://player.bilibili.com/player.html?aid=53851218'
        );
    });

    test('http short url', () => {
        expect(getPlayerSrc('http://b23.tv/av53851218')).toBe(
            'https://player.bilibili.com/player.html?aid=53851218'
        );
    });

    test('short url with page number', () => {
        expect(getPlayerSrc('https://b23.tv/av15463995?p=2')).toBe(
            'https://player.bilibili.com/player.html?aid=15463995&page=2'
        );
    });

    test('full url', () => {
        expect(getPlayerSrc('https://bilibili.com/video/av15463995')).toBe(
            'https://player.bilibili.com/player.html?aid=15463995'
        );
    });

    test('http full url', () => {
        expect(getPlayerSrc('https://bilibili.com/video/av15463995')).toBe(
            'https://player.bilibili.com/player.html?aid=15463995'
        );
    });

    test('full url with page number', () => {
        expect(getPlayerSrc('https://bilibili.com/video/av15463995?p=2')).toBe(
            'https://player.bilibili.com/player.html?aid=15463995&page=2'
        );
    });

    test('full url with www domain', () => {
        expect(getPlayerSrc('https://www.bilibili.com/video/av15463995')).toBe(
            'https://player.bilibili.com/player.html?aid=15463995'
        );
    });

    test('invalid page number', () => {
        expect(
            getPlayerSrc('https://www.bilibili.com/video/av15463995?p=xxx')
        ).toBe('https://player.bilibili.com/player.html?aid=15463995');
    });

    test('invalid videoId', () => {
        expect(getPlayerSrc('https://www.bilibili.com/video/avxxxxx')).toBe(
            null
        );
    });

    test('http short url with empty aid', () => {
        expect(getPlayerSrc('https://bilibili.tv/video/av')).toBeNull();
    });
});

describe('PlayerIframe validation', () => {
    test('get correct iframe', async () => {
        const html = getHTML('https://b23.tv/av15463995?p=2');
        expect(html).toMatchInlineSnapshot(
            '"<iframe width=\\"100%\\" height=\\"400\\" src=\\"https://player.bilibili.com/player.html?aid=15463995&page=2\\" scrolling=\\"no\\" border=\\"0\\" frameborder=\\"no\\" framespacing=\\"0\\" allowfullscreen=\\"true\\"> </iframe>"'
        );
    });
    test('get null when video aid is invalid', async () => {
        const html = getHTML('https://b23.tv/avxxxx');
        expect(html).toBeUndefined();
    });
    test('get null when video bvid is invalid', async () => {
        const html = getHTML('https://b23.tv/bv?:::::xxxx');
        expect(html).toBeUndefined();
    });
});

test('Plugin validation without prefix', async () => {
    const mdAST = getMdAST('Bilibili') as MarkdownNode;
    const processedAST = await plugin({ cache, markdownAST: mdAST });
    expect(getMdfromAST(processedAST)).toMatchInlineSnapshot(`
"<https://www.not-a-bilibili-url.com>

<https://www.this-is-bilibli.com>

<https://www.this-is-bilibli.tv>

<https://www.this-is-b23.tv>

<https://www.this-is-b23.tv/video/av53851218>

<iframe width=\\"100%\\" height=\\"400\\" src=\\"https://player.bilibili.com/player.html?aid=53851218\\" scrolling=\\"no\\" border=\\"0\\" frameborder=\\"no\\" framespacing=\\"0\\" allowfullscreen=\\"true\\"> </iframe>

<iframe width=\\"100%\\" height=\\"400\\" src=\\"https://player.bilibili.com/player.html?aid=53851218\\" scrolling=\\"no\\" border=\\"0\\" frameborder=\\"no\\" framespacing=\\"0\\" allowfullscreen=\\"true\\"> </iframe>

<iframe width=\\"100%\\" height=\\"400\\" src=\\"https://player.bilibili.com/player.html?aid=15463995&page=2\\" scrolling=\\"no\\" border=\\"0\\" frameborder=\\"no\\" framespacing=\\"0\\" allowfullscreen=\\"true\\"> </iframe>

<iframe width=\\"100%\\" height=\\"400\\" src=\\"https://player.bilibili.com/player.html?bvid=BV1YV411r7ns\\" scrolling=\\"no\\" border=\\"0\\" frameborder=\\"no\\" framespacing=\\"0\\" allowfullscreen=\\"true\\"> </iframe>

<https://.com>

A random paragraph with \`inline code\` and [empty link](<>) dot.

\`embed https://b23.tv/av53851218\`

\`embed https://bilibili.com/video/BV1YV411r7ns\`

\`embed\`

\`embed token1 token2\`

\`hello https://b23.tv\`
"
`);
});

test('Plugin validation with prefix embed', async () => {
    const mdAST = getMdAST('Bilibili') as MarkdownNode;
    const processedAST = await plugin(
        { cache, markdownAST: mdAST },
        { prefix: 'embed' }
    );
    expect(getMdfromAST(processedAST)).toMatchInlineSnapshot(`
"<https://www.not-a-bilibili-url.com>

<https://www.this-is-bilibli.com>

<https://www.this-is-bilibli.tv>

<https://www.this-is-b23.tv>

<https://www.this-is-b23.tv/video/av53851218>

<https://b23.tv/av53851218>

<https://bilibili.tv/video/av53851218>

<https://bilibili.com/video/av15463995?p=2>

<https://bilibili.com/video/BV1YV411r7ns>

<https://.com>

A random paragraph with \`inline code\` and [empty link](<>) dot.

<iframe width=\\"100%\\" height=\\"400\\" src=\\"https://player.bilibili.com/player.html?aid=53851218\\" scrolling=\\"no\\" border=\\"0\\" frameborder=\\"no\\" framespacing=\\"0\\" allowfullscreen=\\"true\\"> </iframe>

<iframe width=\\"100%\\" height=\\"400\\" src=\\"https://player.bilibili.com/player.html?bvid=BV1YV411r7ns\\" scrolling=\\"no\\" border=\\"0\\" frameborder=\\"no\\" framespacing=\\"0\\" allowfullscreen=\\"true\\"> </iframe>

\`embed\`

\`embed token1 token2\`

\`hello https://b23.tv\`
"
`);
});
