export const isTarget = (urlStr: string) => {
    urlStr = urlStr.toLowerCase();
    const { host, pathname } = new URL(urlStr);
    return (
        (host === 'b23.tv' ||
            [
                'bilibili.tv',
                'www.bilibili.tv',
                'bilibili.com',
                'www.bilibili.com'
            ].includes(host)) &&
        (pathname.includes('av') || pathname.includes('bv'))
    );
};

export const getPlayerSrc = (urlStr: string): string | null => {
    const url: URL = new URL(urlStr);
    let page: string | null = url.searchParams.get('p');
    if (page && !/^[0-9]+$/.test(page)) {
        page = null;
    }
    let aid: string | undefined;
    if (/(av|Av)[0-9]+/.test(url.pathname)) {
        const group = url.pathname.match(/\/(av|AV)([0-9]+)/);
        if (!group) {
            aid = undefined;
        } else {
            aid = group[2];
        }
    }
    let bvid: string | undefined;
    if (/(BV|bv)[0-9A-Za-z]+/.test(url.pathname)) {
        const group = url.pathname.match(/\/(BV|bv)([0-9A-Za-z]+)/);
        if (!group) {
            bvid = undefined;
        } else {
            bvid = 'BV' + group[2];
        }
    }
    const playerUrl = new URL('https://player.bilibili.com/player.html');
    // bvid first
    if (bvid) {
        playerUrl.searchParams.append('bvid', bvid);
        if (page) {
            playerUrl.searchParams.append('page', page as string);
        }
        return playerUrl.toString();
    }
    if (aid) {
        playerUrl.searchParams.append('aid', aid);
        if (page) {
            playerUrl.searchParams.append('page', page as string);
        }
        return playerUrl.toString();
    }
    return null;
};

export const getHTML = (urlStr: string) => {
    const src = getPlayerSrc(urlStr);
    if (!src) {
        return undefined;
    }
    return `<iframe width="100%" height="400" src="${src}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>`;
};
