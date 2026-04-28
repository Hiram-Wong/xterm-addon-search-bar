import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'inline',
    }),
    commonjs(),
    nodeResolve(),
    postcss({
      plugins: [autoprefixer()],
      extract: false,
      modules: false,
      autoModules: false,
      minimize: true,
      inject: true,
    }),
    typescript({
      exclude: 'node_modules/**',
      declarationDir: './typings',
    }),
  ],
};
