const CracoLessPlugin = require("craco-less")
const CracoAlias = require("craco-alias")

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#40a9ff" },
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: CracoAlias,
      options: {
        source: "jsconfig",
      },
    },
  ],
  webpack: {
    configure: (webpackConfig) => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) =>
          constructor && constructor.name === "ModuleScopePlugin"
      )

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1)
      return webpackConfig
    },
  },
}
