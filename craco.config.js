const webpack = require('webpack')
const path = require('path')
const {whenDev, whenProd} = require('craco')
// const ENV = require('react-scripts/config/env')
// const {sentryWebpackPlugin} = require('@sentry/webpack-plugin')
// const WebpackBar = require('webpackbar')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// const {raw: env} = ENV() || {}
// const {REACT_APP_ENV, NODE_ENV} = env || {}

module.exports = {
  target: 'node',
  eslint: whenDev(() => ({
    enable: true,
    mode: 'file',
  })),
  typescript: whenDev(() => ({
    enableTypeChecking: true,
  })),
  webpack: {
    alias: {
      '@api': path.resolve(__dirname, 'src/_api'),
      '@auth': path.resolve(__dirname, 'src/pages/auth'),
      '@helpers': path.resolve(__dirname, 'src/_helpers'),
      '@hooks': path.resolve(__dirname, 'src/_hooks'),
      '@components': path.resolve(__dirname, 'src/_components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@metronic': path.resolve(__dirname, 'src/_metronic'),
      '@redux': path.resolve(__dirname, 'src/_redux'),
    },
    // devtool: whenProd(() => false),
    plugins: {
      add: [
        // new WebpackBar({profile: true}),
        // new BundleAnalyzerPlugin(),
        // new webpack.SourceMapDevToolPlugin({}),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process',
        }),
        // ...(REACT_APP_ENV === 'live' && NODE_ENV === 'production'
        //   ? [
        //       sentryWebpackPlugin({
        //         org: 'assetdataio',
        //         project: 'assetdata-io-fe',
        //         authToken: '14a77ebd7a9643969946e7695a151ad24571bd699a2f4cc5b5b335fb596d0281',
        //         telemetry: false,
        //         release: {
        //           name: 'v2.0.0',
        //           deploy: {
        //             env: 'production',
        //           },
        //           cleanArtifacts: true,
        //           // build artifacts
        //           uploadLegacySourcemaps: {
        //             paths: ['./build/static/js'],
        //             urlPrefix: '~/static/js',
        //             stripCommonPrefix: true,
        //             ignore: ['node_modules', 'cypress'],
        //           },
        //         },
        //       }),
        //     ]
        //   : []),
      ],
    },
    performance: {
      hints: 'warning',
      maxEntrypointSize: 50000, // in bytes, default 250k
      maxAssetSize: 100000, // in bytes
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
        },
        {
          test: /\.tsx?$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
      ],
    },

    configure: {
      resolve: {
        fallback: {
          path: require.resolve('path-browserify'),
          stream: require.resolve('stream-browserify'),
          crypto: require.resolve('crypto-browserify'),
          buffer: require.resolve('buffer'),
        },
      },
      ignoreWarnings: [/Failed to parse source map/],
      optimization: whenProd(() => ({
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 1,
          maxSize: 100000,
          minChunks: 1,
          minRemainingSize: 0,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 30000,
          cacheGroups: {
            defaultVendors: {
              name: 'assetd',
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
              // name(module, chunks, cacheGroupKey) {
              //   const moduleFileName = module
              //     .identifier()
              //     .split('/')
              //     .reduceRight((item) => item)
              //   return `assetdata-${moduleFileName}`
              // },
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      })),
    },
  },
}
