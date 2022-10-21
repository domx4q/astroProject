const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    devServer: {port: 8080, open: true, hot: true, overlay: {warnings: true, errors: true},},
    pwa: {
        name: 'AstroProjekt',
        themeColor: '#0d245b',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        workboxPluginMode: 'GenerateSW',

        iconPaths: {
            faviconSVG: null,
        }
    }
})
