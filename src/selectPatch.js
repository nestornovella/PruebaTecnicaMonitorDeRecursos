const { dialog } = require("electron");

async function showSelectDirectoryDialog() {
  const options = {
    title: "Seleccionar carpeta raíz",
    properties: ["openDirectory"],
  };
  const path = await dialog.showOpenDialog(options);

  if (!path.canceled && path.filePaths.length > 0) {
    const selectedDirectory = path.filePaths[0];
    return selectedDirectory;
  }
}

module.exports = {
  showSelectDirectoryDialog,
};
