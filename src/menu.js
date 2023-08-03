const { app, Menu } = require("electron");

const setMainMenu = (mainWindow) => {
  const template = [
    {
      label: "menuApp",
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "View",
          submenu: [
            { role: "reload" },
            { role: "forceReload" },
            { role: "toggleDevTools" },
            { type: "separator" },
            { role: "resetZoom" },
            { role: "zoomIn" },
            { role: "zoomOut" },
            { type: "separator" },
            { role: "togglefullscreen" },
          ],
        },
      ],
    },
    {
      label: "LightMode",
      submenu: [
        {
          label: "Dark",
          click: () => {
            mainWindow.webContents.send("update-theme", "dark");
          },
        },
        {
          label: "Light",
          click: () => {
            mainWindow.webContents.send("update-theme", "light");
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

module.exports = {
  setMainMenu,
};
