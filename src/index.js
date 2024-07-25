// const { app, BrowserWindow } = require("electron");
// const path = require("path");
// const fs = require("fs");

// let mainWindow;

// // Загрузка данных из файла при запуске приложения
// function loadDataFromFile() {
//   try {
//     if (fs.existsSync("data.json")) {
//       const data = fs.readFileSync("data.json", "utf8");
//       return JSON.parse(data);
//     } else {
//       return { arrPersonInfo: [] };
//     }
//   } catch (err) {
//     console.error("Error loading data from file:", err);
//     return { arrPersonInfo: [] };
//   }
// }

// // Создание основного окна
// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1100,
//     height: 500,
//     icon: path.join(__dirname, "icon.png"),
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   });

//   mainWindow.setMenuBarVisibility(false);
//   mainWindow.setTitle("Торгівельна марка");
//   // mainWindow.webContents.openDevTools();
//   mainWindow.loadFile(path.join(__dirname, "../src/index.html"));
// }

// app.whenReady().then(() => {
//   loadDataFromFile();
//   createWindow();
// });

// app.on("window-all-closed", () => app.quit()); //! полностью выходит из программы когда все окна закрыт

//* -----------------
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

// Загрузка данных из файла при запуске приложения
function loadDataFromFile() {
  try {
    if (fs.existsSync("data.json")) {
      const data = fs.readFileSync("data.json", "utf8");
      return JSON.parse(data);
    } else {
      return { arrPersonInfo: [] };
    }
  } catch (err) {
    console.error("Error loading data from file:", err);
    return { arrPersonInfo: [] };
  }
}

// Создание основного окна
function createWindow() {
  const width = 1100;
  const height = 500;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    minWidth: width,
    minHeight: height,
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.setTitle("Торгівельна марка");
  //mainWindow.webContents.openDevTools();
  mainWindow.loadFile(path.join(__dirname, "../src/index.html"));
}

app.whenReady().then(() => {
  loadDataFromFile();
  createWindow();
});

app.on("window-all-closed", () => app.quit()); //! полностью выходит из программы когда все окна закрыты
