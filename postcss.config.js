module.exports = {
  ident: 'postcss',
  plugins: [
    require('autoprefixer'),
    require('postcss-preset-env')({ browsers: 'last 2 versions' }),
    require('postcss-pxtorem')({
      rootValue: 10,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
    }),
  ],
}
