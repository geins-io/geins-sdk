import commonjs from '@rollup/plugin-commonjs';
import graphql from '@rollup/plugin-graphql';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'auto',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
    },
  ],
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    typescript(),
    graphql(),
    terser(),
  ],
  external: ['@apollo/client', 'cookie-universal', '@cacheable/node-cache', 'broadcast-channel'],
  treeshake: true,
};
