const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronApi", {
  onUpdateTheme: (callback) => ipcRenderer.on("update-theme", callback),
  processIntervalInfo: (inputValue) =>
    ipcRenderer.invoke("dataSended", inputValue),
  pathSelect: () => ipcRenderer.invoke("pathSended"),
  systemInformation: () => ipcRenderer.invoke("systemInfo"),
  averageCpuV: (objectCpu) => ipcRenderer.invoke("averageCpuV", objectCpu),
  averageRamV: (objectRam) => ipcRenderer.invoke("avangeRamV", objectRam),
});
