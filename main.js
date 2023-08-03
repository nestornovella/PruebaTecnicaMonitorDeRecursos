const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const { setMainMenu } = require("./src/menu");
const { getProcesses, getSystemInformation } = require("./src/process");
const { showSelectDirectoryDialog } = require("./src/selectPatch");
const { averageCpuVoltage, averageRamVoltage } = require("./energy");

const config = {
  width: 800,
  height: 900,
  webPreferences: {
    preload: path.join(__dirname, "src", "preload.js"),
   
  },
};
const createWindows = () => {
  const mainWindow = new BrowserWindow(config);
  mainWindow.loadFile("index.html");
  setMainMenu(mainWindow);
};

ipcMain.handle("dataSended", (event, imputObject) => getProcesses(imputObject));
ipcMain.handle("averageCpuV", (event, cpuObject) =>
  averageCpuVoltage(cpuObject)
);
ipcMain.handle("avangeRamV", (event, ramObject) =>
  averageRamVoltage(ramObject)
);
ipcMain.handle("pathSended", () => showSelectDirectoryDialog());
ipcMain.handle("systemInfo", () => getSystemInformation());

app.whenReady().then(() => {
  ipcMain.handle("darkMode", () => "");
  createWindows();
});

if (process.platform !== "darwin") {
  app.on("window-all-closed", () => {
    app.quit();
  });
}
