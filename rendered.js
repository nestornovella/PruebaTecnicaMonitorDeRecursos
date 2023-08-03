//Html Elements
const $input = $("input");
const $button = $("start");
const $reset = $("reset");
const $main = $("main");
const $path = $("path");
const $promedioRam = $("promedioRam");
const $actualRam = $("actualRam");
const $maxValue = $("maxValue");
const $promedioCpu = $("promedioCpu");
const $actualCpu = $("actualCpu");
const $maxValueCpu = $("maxValueCpu");
const $promedioW = $("promedioW");

//system Information
//Ram
const $totalRam = $("totalRam");
const $usedRam = $("usedRam");
const $freeRam = $("freeRam");
//Cpu
const $brandCpu = $("brandCpu");
const $SpeedCpu = $("SpeedCpu");
const $vendorCpu = $("vendorCpu");
//System
const $manufacturerOs = $("manufacturerOs");
const $modelOs = $("modelOs");
const $versionOs = $("versionOs");

const $pathDir = $("pathDir");
let interval = true;
let int;

let arregloDeCpuV = [];
let arregloDeValores = [];
let selectedPath = "";
let appName = "";

//System Information Rendered
renderSysInfo();

$path.addEventListener("click", async () => {
  //Path event
  electronApi.pathSelect().then((path) => {
    selectedPath = path;
    $pathDir.innerText = `path: ${path}/`;
  });
});

$input.addEventListener("change", () => {
  if ($pathDir.innerText != "path: empty") {
    $pathDir.innerText += $input.value;
    appName = $input.value;
    $input.value = "";
  }
});

//Start Aplication
$button.addEventListener("click", async () => {
  $button.innerText = $button.innerText == "Start🤞" ? "Stop🖐" : "Start🤞";
  electronApi.systemInformation().then((response) => console.log(response));
  if (interval) {
    int = setInterval(async () => {
      const response = await getCurrentValues();
      console.log(arregloDeValores);
      saveValues(response, arregloDeValores);

      renderValues(response);
      const systemInfo = await electronApi.systemInformation();
      const cpuW = await electronApi.averageCpuV({
        cpu: response.cpu,
        cpuModel: systemInfo[0].brand,
      });
      const ramW = await electronApi.averageRamV({
        totalRam: systemInfo[1].total / Math.pow(2, 30),
        ramValue: response.memory,
      });
      console.log(arregloDeCpuV);
      saveValues(cpuW, arregloDeCpuV);
      saveValues(ramW, arregloDeCpuV);
    }, 1000);
    console.log(interval);
    interval = false;
  } else {
    clearInterval(int);
    interval = true;
  }
});

$reset.addEventListener("click", () => {
  resetApp();
});

//Theme change
electronApi.onUpdateTheme((event, theme) => {
  const root = document.documentElement;
  console.log(root);
  root.style.setProperty("--scheme", theme);
});

//FUNCTIONS
function $(elementHtml) {
  return document.getElementById(elementHtml);
}

function promedia(value, array) {
  let result = 0;
  if (value === "ram") {
    array.forEach((e) => (result += e.memory));
  }
  if (value === "cpu") {
    array.forEach((e) => (result += e.cpu));
  }
  if (value === "energy") {
    array.forEach((e) => (result += e));
  }

  return (result / array.length).toFixed(1);
}

function maxValue(value) {
  let result = 0;
  if (value === "ram") {
    arregloDeValores.forEach(
      (e) => (result = result < e.memory ? e.memory : result)
    );
  }
  if (value === "cpu") {
    arregloDeValores.forEach((e) => (result = result < e.cpu ? e.cpu : result));
  }
  return result;
}

function renderValues(response) {
  $promedioRam.innerText = promedia("ram", arregloDeValores) + " %";
  $actualRam.innerText = response.memory.toFixed(1) + " %";
  $maxValue.innerText = maxValue("ram").toFixed(1) + " %";
  $promedioCpu.innerText = promedia("cpu", arregloDeValores) + " %";
  $actualCpu.innerText = response.cpu.toFixed(1) + " %";
  $maxValueCpu.innerText = maxValue("cpu").toFixed(1) + " %";
  $promedioW.innerText = promedia("energy", arregloDeCpuV) + " W/min";
}

async function getCurrentValues() {
  const response = await electronApi.processIntervalInfo({
    pathDir: selectedPath,
    dirName: appName,
  });
  return response;
}

async function renderSysInfo() {
  const system = await electronApi.systemInformation();
  //ram
  $totalRam.innerText = system[1].total / Math.pow(2, 30);
  $usedRam.innerText = (system[1].used / Math.pow(2, 30)).toFixed(2);
  $freeRam.innerText = (system[1].free / Math.pow(2, 30)).toFixed(2);
  //Cpu
  $brandCpu.innerText = system[0].brand;
  $SpeedCpu.innerText = system[0].speedMax;
  $vendorCpu.innerText = system[0].vendor;
  //System
  $manufacturerOs.innerText = system[2].manufacturer;
  $modelOs.innerText = system[2].model;
  $versionOs.innerText = system[2].version;
}

function saveValues(value, array) {
  if (array.length >= 120) {
    array.shift();
  }
  if (!Array.isArray(value)) {
    array.push(value);
  }
}

function resetApp() {
  $promedioRam.innerText = "0.0 %";
  $actualRam.innerText = "0.0 %";
  $maxValue.innerText = "0.0 %";
  $promedioCpu.innerText = "0.0 %";
  $actualCpu.innerText = "0.0 %";
  $maxValueCpu.innerText = "0.0 %";
  $promedioW.innerText = "0.0 W/min";
  $pathDir.innerText = "path: select the root path...";
  arregloDeCpuV = [];
  arregloDeValores = [];
  selectedPath = "";
  appName = "";
}
