const path = require('path');

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    outputStyle: 'compressed',
  },
  images:{
    domains: [],
  },
  webpack(config, options) {
    // Add worker-loader rule to handle .worker.js files
    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      options: {
        publicPath: '/_next/',
        inline: 'fallback',
      },
    });

    // Add file-loader rule to handle .mp3 and .wav files
    config.module.rules.push({
      test: /\.(mp3|wav)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/sound',
          outputPath: 'static/sound',
          name: '[name].[ext]',
          esModule: false,
        },
      },
    });

    return config;
  },
};
