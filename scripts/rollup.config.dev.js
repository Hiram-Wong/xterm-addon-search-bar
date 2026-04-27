import serve from 'rollup-plugin-serve';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import baseConfig from './rollup.config.base.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
const { name, global } = pkg;

export default {
  ...baseConfig,
  output: [
    {
      file: `lib/${name}.js`,
      format: 'umd',
      name: global,
      sourcemap: true,
    },
  ],
  plugins: [
    ...baseConfig.plugins,
    serve({
      port: 5432,
      host: '0.0.0.0',
      contentBase: ['pages', '.'],
      verbose: true,
    }),
  ],
};
