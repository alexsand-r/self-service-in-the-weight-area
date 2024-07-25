const fs = require("fs");
const path = require("path");

//* --------  Эта функция будет сохранять данные из массивa arrProduct в файл data.json
function saveDataToFile(arrProduct) {
  try {
    // Преобразуем массив в JSON строку
    const data = JSON.stringify(arrProduct, null, 2);

    // Записываем данные в файл data.json
    fs.writeFileSync("data.json", data);

    console.log("Данные успешно сохранены в файл data.json");
  } catch (err) {
    console.error("Ошибка при сохранении данных в файл:", err);
  }
}

//* ------------  Эта функция будет загружать данные из файла data.json и возвращать их.
function loadDataFromFile() {
  try {
    // Проверяем существование файла
    if (fs.existsSync("data.json")) {
      // Если файл существует, загружаем его содержимое
      const data = fs.readFileSync("data.json", "utf8");
      // Проверяем, что файл не пустой
      if (data.trim() === "") {
        return []; // Если файл пуст, возвращаем пустой массив
      }
      return JSON.parse(data);
    } else {
      // Если файла нет, возвращаем пустые данные
      return [];
    }
  } catch (err) {
    console.error("Ошибка при загрузке данных из файла:", err);
    return [];
  }
}

//*----  функцию saveImage для сохранения изображения в папку img

function saveImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      const defaultImagePath = "img/zastavka1.png";
      console.log(
        "Файл не выбран. Используется изображение по умолчанию:",
        defaultImagePath
      );
      resolve(defaultImagePath);
    } else {
      const reader = new FileReader();
      reader.onload = function (event) {
        const imageData = Buffer.from(
          event.target.result.split(",")[1],
          "base64"
        );
        const imgDir = path.join(__dirname, "img"); // Исправленный путь к директории img

        if (!fs.existsSync(imgDir)) {
          fs.mkdirSync(imgDir, { recursive: true });
        }

        const destPath = path.join(imgDir, file.name);
        fs.writeFile(destPath, imageData, (err) => {
          if (err) {
            console.error("Ошибка сохранения изображения:", err);
            reject(err);
          } else {
            console.log("Изображение сохранено:", file.name);
            resolve(`img/${file.name}`);
          }
        });
      };
      reader.readAsDataURL(file);
    }
  });
}

// Функция для сохранения данных из массива arrText в файл data.json
function saveDataToFileToJsonText(arrAray) {
  try {
    // Преобразуем массив в JSON строку
    const data = JSON.stringify(arrAray, null, 2);

    // Записываем данные в файл data.json
    fs.writeFileSync("data-text.json", data);

    console.log("Данные успешно сохранены в файл data-text.json");
  } catch (err) {
    console.error("Ошибка при сохранении данных в файл:", err);
  }
}

// Функция для загрузки данных из файла data-text.json и их возврата
function loadDataFromFileJsonText() {
  try {
    // Проверяем существование файла
    if (fs.existsSync("data-text.json")) {
      // Если файл существует, загружаем его содержимое
      const data = fs.readFileSync("data-text.json", "utf8");
      // Проверяем, что файл не пустой
      if (data.trim() === "") {
        return []; // Если файл пуст, возвращаем пустой массив
      }
      return JSON.parse(data);
    } else {
      // Если файла нет, возвращаем пустые данные
      return [];
    }
    console.log("сработала функция loadDataFromFileJsonText");
  } catch (err) {
    console.error("Ошибка при загрузке данных из файла:", err);
    return [];
  }
}

//*------------ експорт модулей
module.exports = {
  saveDataToFile,
  loadDataFromFile,
  saveImage,
  saveDataToFileToJsonText, // сохраняет данные в файл дата-текст джесон
  loadDataFromFileJsonText, // загружает данные из файла дата-текс джесон
};
