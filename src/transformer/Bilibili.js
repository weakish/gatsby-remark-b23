export const isTarget = urlStr => {
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

export const getPlayerSrc = urlStr => {
    const url = new URL(urlStr);
    const page = Number.parseInt(url.searchParams.get('p'));
    let aid;
    if (/(av|Av)[0-9]/.test(url.pathname)) {
        aid = /(av|AV)[0-9].*/
            .exec(url.pathname)[0]
            .split('av')
            .pop();
    }
    let bvid;
    if (/(BV|bv)[0-9A-Za-z].*(\/|$)/.test(url.pathname)) {
        bvid = /(BV|bv)[0-9A-Za-z].*(\/|$)/.exec(url.pathname)[0];
    }
    let playerUrl = new URL('https://player.bilibili.com/player.html');
    // bvid first
    if (bvid) {
        playerUrl.searchParams.append('bvid', bvid);
        if (!Number.isNaN(page)) {
            playerUrl.searchParams.append('page', page);
        }
        return playerUrl.toString();
    }
    if (aid) {
        playerUrl.searchParams.append('aid', aid);
        if (!Number.isNaN(page)) {
            playerUrl.searchParams.append('page', page);
        }
        return playerUrl.toString();
    }
    return null;
};

export const getHtml = urlStr => {
    const src = getPlayerSrc(urlStr);
    if (src == null) {
        return null;
    }
    return `<iframe width="100%" height="400" src="${src}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>`;
};
