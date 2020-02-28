import { isTarget, getHtml, getPlayerSrc } from '../transformer/Bilibili';
import { cache, getMdAST, getMdfromAST } from './utils';
import plugin from '..';

describe(`url validation`, () => {
    test(`non-Bilibili url`, () => {
        expect(isTarget(`https://www.not-a-bilibili-url.com`)).toBe(false);
    });

    test(`non-Bilibili url end with bilibili.com`, () => {
        expect(isTarget(`https://www.this-is-bilibli.com`)).toBe(false);
    });

    test(`non-Bilibili url end with bilibili.tv`, () => {
        expect(isTarget(`https://www.this-is-bilibli.tv`)).toBe(false);
    });

    test(`non-Bilibili url end with b23.tv`, () => {
        expect(isTarget(`https://www.this-is-b23.tv`)).toBe(false);
    });

    test(`non-Bilibili url having a valid video id`, () => {
        expect(isTarget(`https://www.this-is-b23.tv/video/av53851218`)).toBe(
            false
        );
    });

    test(`short url`, () => {
        expect(isTarget(`https://b23.tv/av53851218`)).toBe(true);
    });

    test(`http short url`, () => {
        expect(isTarget(`https://b23.tv/av53851218`)).toBe(true);
    });

    test(`full url`, () => {
        expect(isTarget(`https://bilibili.tv/video/av53851218`)).toBe(true);
    });
});

/** get playerSrc */
describe(`playerSrc validation`, () => {
    test(`short url`, () => {
        expect(getPlayerSrc(`https://b23.tv/av53851218`)).toBe(
            `https://player.bilibili.com/player.html?aid=53851218`
        );
    });

    test(`http short url`, () => {
        expect(getPlayerSrc(`http://b23.tv/av53851218`)).toBe(
            `https://player.bilibili.com/player.html?aid=53851218`
        );
    });

    test(`short url with page number`, () => {
        expect(getPlayerSrc(`https://b23.tv/av15463995?p=2`)).toBe(
            `https://player.bilibili.com/player.html?aid=15463995&page=2`
        );
    });

    test(`full url`, () => {
        expect(getPlayerSrc(`https://bilibili.com/video/av15463995`)).toBe(
            `https://player.bilibili.com/player.html?aid=15463995`
        );
    });

    test(`http full url`, () => {
        expect(getPlayerSrc(`https://bilibili.com/video/av15463995`)).toBe(
            `https://player.bilibili.com/player.html?aid=15463995`
        );
    });

    test(`full url with page number`, () => {
        expect(getPlayerSrc(`https://bilibili.com/video/av15463995?p=2`)).toBe(
            `https://player.bilibili.com/player.html?aid=15463995&page=2`
        );
    });

    test(`full url with www domain`, () => {
        expect(getPlayerSrc(`https://www.bilibili.com/video/av15463995`)).toBe(
            `https://player.bilibili.com/player.html?aid=15463995`
        );
    });

    test(`invalid page number`, () => {
        expect(
            getPlayerSrc(`https://www.bilibili.com/video/av15463995?p=xxx`)
        ).toBe(`https://player.bilibili.com/player.html?aid=15463995`);
    });

    test(`invalid videoId`, () => {
        expect(getPlayerSrc(`https://www.bilibili.com/video/avxxxxx`)).toBe(
            null
        );
    });
});

describe(`PlayerIframe validation`, () => {
    test(`get correct iframe`, async () => {
        const html = getHtml(`https://b23.tv/av15463995?p=2`);
        expect(html).toMatchInlineSnapshot(
            `"<iframe src=\\"https://player.bilibili.com/player.html?aid=15463995&page=2\\" scrolling=\\"no\\" border=\\"0\\" frameborder=\\"no\\" framespacing=\\"0\\" allowfullscreen=\\"true\\"> </iframe>"`
        );
    });
    test(`get null when video id is invalid`, async () => {
        const html = getHtml(`https://b23.tv/avxxxx`);
        expect(html).toBe(null);
    });
});

test(`Plugin validation without prefix`, async () => {
    const mdAST = getMdAST(`Bilibili`);
    const processedAST = await plugin({ cache, markdownAST: mdAST });
    expect(getMdfromAST(processedAST)).toMatchInlineSnapshot(`
"<https://www.not-a-bilibili-url.com>

<https://www.this-is-bilibli.com>

<https://www.this-is-bilibli.tv>

<https://www.this-is-b23.tv>

<https://www.this-is-b23.tv/video/av53851218>

<iframe src=\\"https://player.bilibili.com/player.html?aid=53851218\\" scrolling=\\"no\\" border=\\"0\\" frameborder=\\"no\\" framespacing=\\"0\\" allowfullscreen=\\"true\\"> </iframe>

<iframe src=\\"https://player.bilibili.com/player.html?aid=53851218\\" scrolling=\\"no\\" border=\\"0\\" frameborder=\\"no\\" framespacing=\\"0\\" allowfullscreen=\\"true\\"> </iframe>

<iframe src=\\"https://player.bilibili.com/player.html?aid=15463995&page=2\\" scrolling=\\"no\\" border=\\"0\\" frameborder=\\"no\\" framespacing=\\"0\\" allowfullscreen=\\"true\\"> </iframe>

\`embed https://b23.tv/av53851218\`
"
`);
});

test(`Plugin validation with prefix embed`, async () => {
    const mdAST = getMdAST(`Bilibili`);
    const processedAST = await plugin(
        { cache, markdownAST: mdAST },
        { prefix: `embed` }
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

<iframe src=\\"https://player.bilibili.com/player.html?aid=53851218\\" scrolling=\\"no\\" border=\\"0\\" frameborder=\\"no\\" framespacing=\\"0\\" allowfullscreen=\\"true\\"> </iframe>
"
`);
});
