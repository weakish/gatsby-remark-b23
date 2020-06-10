const presets = [
    [
        '@babel/preset-env',
        {
            targets: {
                node: 'current'
            }
        }
    ]
];

const ignore = ['./src/__tests__'];
module.exports = api => {
    const isTest = api.env('test');
    if (isTest) {
        return {
            presets
        };
    }
    return {
        presets,
        ignore
    };
};
