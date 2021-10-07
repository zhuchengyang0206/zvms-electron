module.exports = {
  transpileDependencies: [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "productName": "zvms",
        "nsis": {
          "oneClick": false,
          "allowToChangeInstallationDirectory": true,
          "createDesktopShortcut": true,
          "createStartMenuShortcut": true
        },
        "win": {
          "icon": "./public/logo_256x256.png",
          "target": [{
            "target": "nsis",
            "arch": ["ia32", "x64"]
          }]
        }
      },
    }
  }
}