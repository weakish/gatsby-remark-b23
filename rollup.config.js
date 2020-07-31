import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

const extensions = ['.js', '.ts'];
export default {
    input: 'src/index.ts',
    // external modules that exclude from the bundle file
    external: ['unist-util-visit'],
    plugins: [
        resolve({ extensions }), // locate modules
        // typescript(), // Convert TS to JS
        babel({
            extensions,
            babelHelpers: 'bundled' // 'runtime' for building libraries with @babel/plugin-transform-runtime and @babel/runtime, 'bundled' for building application code
        })
    ],
    output: {
        file: 'dist/index.cjs.js',
        format: 'cjs'
    }
};
