const { defineConfig } = require("@vue/cli-service");

function getPublicPath() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.iAmOnGithubPages === "true"
  ) {
    return "/astroProject/";
  }
  if (process.env.customPrefix !== undefined) {
    // security checks
    function checkPrefix(prefix, front = true, end = true) {
      if (!front && !end) {
        return prefix;
      }
      if (front && prefix.startsWith("/")) {
        prefix = prefix.substring(1);
      } else {
        front = false;
      }
      if (end && prefix.endsWith("/")) {
        prefix = prefix.substring(0, prefix.length - 1);
      } else {
        end = false;
      }
      return checkPrefix(prefix, front, end);
    }
    return "/" + checkPrefix(process.env.customPrefix) + "/";
  }
  return "/";
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: true,
  devServer: { port: 8080, open: true, hot: true },
  pwa: {
    name: "AstroProjekt",
    themeColor: "#0d245b",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    workboxPluginMode: "GenerateSW",

    iconPaths: {
      faviconSVG: null,
    },
  },
  publicPath: getPublicPath(),
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(glb|gltf)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "assets/models/",
              },
            },
          ],
        },
      ],
    },
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.domx4q.astro",
        productName: "AstroProjekt",
        win: {
          icon: "./public/img/icons/favicon-256x256.png",
        },
        linux: {
          icon: "./public/img/icons/favicon-256x256.png",
          // don't publish on snap store
          publish: ["github"],
        },
        extraResources: [
          {
            from: "./public/img/icons/favicon-256x256.png",
            to: "./public/img/icons/favicon-256x256.png",
            filter: ["**/*"],
          },
        ],
        publish: {
          provider: "github",
          releaseType: "release",
        }
      },
    },
  },
});
