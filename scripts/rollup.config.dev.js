import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import { fileURLToPath } from 'url';

import baseConfig from './rollup.config.base.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
const { name } = pkg;

export default {
  ...baseConfig,
  output: [
    {
      file: `lib/${name}.js`,
      format: 'umd',
      name: 'SearchBarAddon',
      sourcemap: true,
    },
  ],
  plugins: [
    ...baseConfig.plugins,
    serve({
      open: true,
      verbose: false,
      contentBase: ['pages', 'lib'],
      host: 'localhost',
      port: 3000,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow any origin
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }),
    livereload('lib'),
  ],
};
