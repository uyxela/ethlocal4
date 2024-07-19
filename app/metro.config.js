// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(
  {
    ...config,
    transformer: {
      ...config.transformer,
      babelTransformerPath: require.resolve(
        "react-native-svg-transformer/expo"
      ),
    },
    resolver: {
      ...config.resolver,
      assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
      sourceExts: [...config.resolver.sourceExts, "svg"],
    },
  },
  { input: "./global.css" }
);
