("use strict");

const { loadDataFromFileJsonText } = require("./data"); // подключаю модули
//* -----  массив для хранения моих объектов
const arrAray = [];
console.log(arrAray);
// *--- для загрузки объекта текст "тренировка" из файла дате текс джесон при перегрузке потом удаилить
window.onload = function () {
  // Сначала загружаем данные из файла
  const loadData = loadDataFromFileJsonText(); //--- прописана в файле дата.дж
  //console.log("Загруженные данные:", loadedData);

  // Если данные загружены успешно, добавляем их в массив arrAray
  if (loadData.length > 0) {
    const anyObj = convertToObj(loadData);
    arrAray.push(...anyObj);
  } else {
    console.warn("Нет данных для загрузки или некорректный формат данных.");
  }
  updateObjInBlockText(); // функция обновления блока-текст создана в этом же файле
};
//* -- создаю класс объекта
class ItemObject {
  static count = 0; // Статическая переменная для уникальных идентификаторов
  constructor(name, age) {
    this.uniqId = ItemObject.count++; // Добавляем уникальный идентификатор
    this.name = name;
    this.age = age;
  }
  // Добавляем метод fromData для создания экземпляра itemObject из объекта (это нужно чтобы получать обратно данные из файла дата джесон)
  static fromData(obj) {
    return new ItemObject(obj.name, obj.age);
  }
}
//*--- функция для преобразования загруженных данных в экземпляры класса itemObject
function convertToObj(data) {
  return data.map((item) => ItemObject.fromData(item));
}
//*----- создаю прототип класса
ItemObject.prototype.printItem = function () {
  const blockText = document.getElementById("block-text");
  if (blockText) {
    const item = document.createElement("div");
    blockText.appendChild(item);
    item.innerHTML = `
        <p>${this.name}</p>
        <p>${this.age}</p>
    `;
  } else {
    console.log("block-text --- не найден на странице");
  }
};
// Обёртка для метода printItem потому что напрямую експортировать прототип нельзя, добавляем функцию обертку
function printItemWrapper(item) {
  item.printItem();
}
//* ----- создаю объект
function createItem() {
  // Предполагаем, что есть поля ввода с id name-input и age-input
  const name = document.getElementById("name-input").value;
  const age = document.getElementById("age-input").value;
  const itemObj = new ItemObject(name, age);

  arrAray.push(itemObj);
  itemObj.printItem();
}
//* ---- очищаю инпуты
function clearInputs() {
  const name = (document.getElementById("name-input").value = "");
  const age = (document.getElementById("age-input").value = "");
}

//*--------функция для обновления отображения элементов в блоке block-text:
function updateObjInBlockText() {
  const itemBody = document.getElementById("block-text");
  console.log(itemBody);

  if (itemBody) {
    //itemBody.innerHTML = ""; // Очистить текущее содержимое
    arrAray.forEach((el) => el.printItem()); // тут применяю прототип отрисовки на странице
    console.log("делаю проверку - тут обновляю дисплей");
  } else {
    console.log("Элемент block-text не найден.");
  }
}

//* ----- слушатель IPC для добавления элемента на страницу пользователя

export {
  convertToObj,
  arrAray,
  updateObjInBlockText,
  ItemObject,
  createItem,
  clearInputs,
  printItemWrapper,
};
