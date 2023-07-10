const path = require('path');

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    outputStyle: 'compressed',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.mp3$/,
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
