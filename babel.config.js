const presets = [
    [
        '@babel/preset-env',
        {
            targets: {
                node: 'current'
            }
        }
    ],
    '@babel/preset-typescript',
    'minify'
];

const ignore = ['./src/__tests__', './src/typings'];
module.exports = {
    presets,
    ignore
};
