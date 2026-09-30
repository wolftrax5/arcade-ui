import fs from 'node:fs';
import { transform } from 'lightningcss';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: false,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  // injectStyle is enabled. The function form injects CSS and still
  // exports CSS Module class maps that boolean `true` would drop.
  injectStyle: async (css, filePath) => {
    if (!filePath.endsWith('.module.css')) {
      return `import styleInject from '#style-inject';styleInject(${css});`;
    }

    const source = await fs.promises.readFile(filePath);
    const { code, exports } = transform({
      filename: filePath,
      code: source,
      cssModules: {
        pattern: 'arcade_[local]_[hash]',
      },
    });

    const classMap: Record<string, string> = {};
    for (const [localName, exported] of Object.entries(exports ?? {})) {
      classMap[localName] = exported.name;
    }

    return `import styleInject from '#style-inject';
styleInject(${JSON.stringify(code.toString())});
export default ${JSON.stringify(classMap)};`;
  },
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.js',
    };
  },
});
