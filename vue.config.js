const {defineConfig} = require("@vue/cli-service")
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {port: 8080, open: true, hot: true,},
  pwa: {
    name: "AstroProjekt",
    themeColor: "#0d245b",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    workboxPluginMode: "GenerateSW",

    iconPaths: {
      faviconSVG: null,
    }
  },
  // also check, if it will be run on github pages
  publicPath: process.env.NODE_ENV === 'production' && process.env.iAmOnGithubPages === 'true'
      ? '/astroProject/'
      : '/test/'
})
