const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const createConfig = (options, isDebugging) => {
  return {
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'core-file-agent.css',
      }),
    ],
    watch: options.watch === true,
    watchOptions:
      options.watch === true
        ? {
            ignored: ['**/*.js', '**/*.d.ts', 'node_modules/**'],
          }
        : {},
    mode: options.mode,
    devtool: options.devtool || 'source-map',
    entry: './src/index.ts',
    output: {
      path: options.output || path.resolve(__dirname, 'dist'),
      filename: 'core-file-agent' + (options.mode === 'production' ? '.min' : '') + '.js',
      library: 'core-file-agent',
      libraryTarget: 'umd',
      globalObject: "typeof self !== 'undefined' ? self : this",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          },
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !!isDebugging,
              },
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
  };
};

module.exports = (env, argv) => {
  const isDebugging = env === 'development';

  const configs = [];

  if (!isDebugging) {
    configs.push(
      createConfig(
        {
          mode: 'production',
        },
        isDebugging,
      ),
    );
  }
  configs.push(
    createConfig(
      {
        mode: 'development',
        watch: true,
      },
      isDebugging,
    ),
  );

  return configs;
};
