import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import generatePackageJson from 'rollup-plugin-generate-package-json';

// Create a fresh TS plugin instance per bundle to avoid caching issues across configs
const ts = () =>
  typescript({
    tsconfig: './tsconfig.json',
    useTsconfigDeclarationDir: true,
    clean: true,
    // Ensure declarations are emitted to dist/types for main bundle
    tsconfigOverride: {
      compilerOptions: {
        declaration: true,
        declarationDir: './dist/types',
      },
    },
  });

const basePlugins = [
  peerDepsExternal(),
  resolve(),
  replace({
    __IS_DEV__: process.env.NODE_ENV === 'development',
  }),
  commonjs(),
  ts(),
  terser(),
];

const subfolderPlugins = (folderName) => [
  peerDepsExternal(),
  resolve(),
  replace({
    __IS_DEV__: process.env.NODE_ENV === 'development',
  }),
  commonjs(),
  // Emit declarations specifically into dist/types/<folderName>
  typescript({
    tsconfig: './tsconfig.json',
    useTsconfigDeclarationDir: false,
    clean: true,
    tsconfigOverride: {
      compilerOptions: {
        declaration: true,
        declarationDir: `./dist/types/${folderName}`,
      },
    },
  }),
  terser(),
  generatePackageJson({
    baseContents: {
      name: `${pkg.name}/${folderName}`,
      private: true,
      main: '../index.js',
      module: './index.es.js', // Adjust to match the output file
      types: `../types/${folderName}/index.d.ts`, // Point to correct types file
    },
  }),
];

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
    ...{
      external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.devDependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        'react',
        'react-dom',
      ],
      preserveSymlinks: true,
      plugins: basePlugins,
    },
  },
  // Separate bundle for react-query related part
  {
    input: 'src/react-query/index.ts',
    output: [
      {
        file: 'dist/react-query/index.es.js',
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      'react',
      'react-dom',
      // 'librechat-data-provider', // Marking main part as external
    ],
    preserveSymlinks: true,
    plugins: subfolderPlugins('react-query'),
  },
];
