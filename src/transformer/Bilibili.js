export const isTarget = urlStr => {
    const { host, pathname } = new URL(urlStr);
    return (
        (host === `b23.tv` ||
            [
                `bilibili.tv`,
                `www.bilibili.tv`,
                `bilibili.com`,
                `www.bilibili.com`
            ].includes(host)) &&
        pathname.includes(`av`)
    );
};

export const getPlayerSrc = urlStr => {
    const url = new URL(urlStr);
    const page = Number.parseInt(url.searchParams.get(`p`));
    const videoId = Number.parseInt(url.pathname.split(`/av`).pop());
    if (Number.isNaN(videoId)) {
        return null;
    }
    const playerUrl = new URL(
        `https://player.bilibili.com/player.html?aid=${videoId}`
    );
    if (!Number.isNaN(page)) {
        playerUrl.searchParams.append(`page`, page);
    }
    return playerUrl.toString();
};

export const getHtml = urlStr => {
    const src = getPlayerSrc(urlStr);
    if (src == null) {
        return null;
    }
    return `<iframe src="${src}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>`;
};
