const si = require("systeminformation");
const path = require("path");

async function getSystemInformation() {
  try {
    const resucessPromises = [
      si.cpu(),
      si.mem(),
      si.system(),
      si.cpuTemperature(),
    ];
    const resucess = await Promise.all(resucessPromises);
    return resucess;
  } catch (error) {
    console.log({ error });
  }
}

async function getProcesses(params) {
  if (!params.pathDir) {
    return [];
  }
  try {
    const response = await si.processes();
    const resucess = await getSystemInformation();

    const pathSelected = path.join(params.pathDir, params.dirName);
    const appProcesses = response.list.filter((process) =>
      process.path.toLowerCase().includes(pathSelected.toLowerCase())
    );

    const processList = appProcesses.map((process) => ({
      ...process,
      // memory: (8 / process.mem).toFixed(1) + ' Mb'
      // memory: (((8 * 1024) * process.mem) / 100).toFixed(1) + ' Mb'
      memory: process.mem,
    }));
    let memoryAndProcess = {
      memory: 0.0,
      cpu: 0,
    };

    processList.forEach((process) => {
      // memoryAndProcess.memory += parseFloat(process.memory.split(' ')[0])
      const cpuProcess = process.cpu / resucess[0].physicalCores;
      memoryAndProcess.memory += parseFloat(process.mem);
      memoryAndProcess.cpu += cpuProcess;
    });
    if (memoryAndProcess.cpu > 100) memoryAndProcess.cpu = 100;
    return memoryAndProcess;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getProcesses,
  getSystemInformation,
};
