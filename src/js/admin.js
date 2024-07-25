"use strict";
// *  подключаю модули

const path = require("path");
const fs = require("fs");
const os = require("os"); // для получения временного каталога для сохранения фото

const {
  saveDataToFile,
  loadDataFromFile,
  saveImage,
  saveDataToFileToJsonText,
  loadDataFromFileJsonText,
} = require("./data"); // подключаю модули
//*--- импортирую модули из общего файла ollModule.js //
const {
  arrProduct,
  updateMonitor,
  Product,
  convertToProduct,
  compareNum,
  //arrText,
} = require("../src/js/ollModule.js");
// //*--- импортирую модули из файла obj.js // convertToObj require("./obj.js");
import {
  convertToObj,
  arrAray,
  updateObjInBlockText,
  ItemObject,
  createItem,
  clearInputs,
  printItemWrapper,
} from "./obj.js";

// console.log(arrProduct);

//* Загрузка данных из файла при загрузке страницы
window.onload = function () {
  // Перерисовываем страницу

  // Сначала загружаем данные из файла
  const loadedData = loadDataFromFile();
  // console.log("Загруженные данные:", loadedData);

  // Если данные загружены успешно, добавляем их в массив arrProduct
  if (loadedData.length > 0) {
    const serviceProducts = convertToProduct(loadedData);
    arrProduct.push(...serviceProducts);
  } else {
    console.warn("Нет данных для загрузки или некорректный формат данных.");
  }

  updateDisplay();
};
//* Обработчик событий для удаления елементов из массива
document.addEventListener("click", function (event) {
  if (event.target && event.target.id.startsWith("deleteButton-")) {
    const id = event.target.id.split("-")[1];
    deleteObj(id);
  } else if (event.target && event.target.id.startsWith("editButton-")) {
    const id = event.target.id.split("-")[1];
    editObject(id);
  }
});

//*----- создаю прототип класса
Product.prototype.print = function () {
  const itemProduct = document.querySelector(".main-item__container");
  const item = document.createElement("div");
  // Экранирование кавычек для безопасного включения в HTML
  const encodedName = this.name.replace(/"/g, "&quot;");
  //item.setAttribute("id", `product-${this.uniqId}`); // Устанавливаем уникаль
  itemProduct.appendChild(item);
  item.innerHTML = `
       <div class="main-item__body" id="item-${this.uniqId}">
                <div class="main-item__picture">
                    <div class="main-item__pic">
                      <img id="photo-${this.uniqId}" src="${this.photo}" alt="photo">
                    </div>
                </div>
                <div class="main-item__info">
                    <div class="main-item__content">
                        <div class="main-item__block">
                            <div class="main-item__info">
                                <label for="item-id" class="main-item__label">ID продукта</label>
                                <input id="item-id" required autocomplete="off" type="text" name="item-id" placeholder=""
                                    class="main-item__input" value="${this.id}" readonly>
                            </div>
                            <div class="main-item__info">
                                <label for="item-name" class="main-item__label">Назва</label>
                                <input id="item-name" required autocomplete="off" type="text" name="item-name" placeholder=""
                                    class="main-item__input" value="${encodedName}">
                            </div>
                        </div>
                        <div class="main-item__block">
                            <div class="main-item__info">
                                <label for="item-discont" class="main-item__label">Знижки %</label>
                                <input id="item-discont" required autocomplete="off" type="text" name="item-discont" placeholder=""
                                    class="main-item__input" value="${this.discont}">
                            </div>
                            <div class="main-item__info">
                                <label for="item-price" class="main-item__label">Ціна грн/кг</label>
                                <input id="item-price" required autocomplete="off" type="text" name="item-price" placeholder=""
                                    class="main-item__input" value="${this.price}">
                            </div>
                        </div>
                    </div>
                    <div class="btn-row">
                        <button class="btn green" type="button"  id="editObject-${this.uniqId}">редагувати</button>
                         <button class="btn red" type="button" id="deleteButton-${this.uniqId}">видалити</button>
                    </div>
                </div>
        </div>
    `;
};

//*-----
//! ---- создаю объект продукта

async function createObj() {
  let id = document.getElementById("popup-id").value.trim();
  const name = document.getElementById("popup-name").value.trim();
  let discontNum = document.getElementById("popup-discont").value.trim();
  let priceNum = document.getElementById("popup-price").value.trim();
  const photoInput = document.getElementById("photo-input");
  const photoFile = photoInput.files[0]; // делаю захват фото

  const numberRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;

  if (id < 10) {
    id = "0" + id;
  }

  if (discontNum === "") {
    discontNum = 0;
  } else {
    discontNum = discontNum.replace(/,/, ".");
    if (!numberRegex.test(discontNum)) {
      showTexeWarn("Поле 'Знижки' повинно містити коректне число");
      return;
    }
  }
  let discont = parseFloat(discontNum);

  if (priceNum === "") {
    priceNum = 0;
  } else {
    priceNum = priceNum.replace(/,/, ".");
    if (!numberRegex.test(priceNum)) {
      showTexeWarn("Поле 'Ціна' повинно містити коректне число");
      return;
    }
  }

  if (id == "" || name == "" || priceNum == "") {
    showTexeWarn("Поле 'ID продукта', 'Назва', 'Ціна' повинні бути заповнені");
    return;
  }
  let price = parseFloat(priceNum).toFixed(2);

  try {
    let photoPath = await saveImage(photoFile); // Получаем путь к изображению асинхронно

    const product = new Product(id, name, discont, price, photoPath);
    console.log("Создан продукт:", product);

    arrProduct.push(product);
    console.log("Продукт добавлен в массив.");

    // Обновляем HTML элемент с изображением
    const imgElement = document.getElementById("uploaded-image");
    imgElement.src = photoPath;

    closePopup();
    updateDisplay();
    updateMonitor();
    saveDataToFile(arrProduct);
    deletePhotoFromInput();
  } catch (err) {
    console.error("Ошибка при сохранении изображения:", err);
    showTexeWarn("Ошибка при сохранении изображения.");
  }
}

//* Обновляем путь для сохранения изображений в папку, доступную в режиме сборки (без этого кода не подтягивалась фото на продакшене)

//*----------  открыаю попоп через прослушиватель на кнопку ДОДАТИ ПРОДУКТ
document.addEventListener("DOMContentLoaded", () => {
  const addProductButton = document.getElementById("addProductButton");
  if (addProductButton) {
    addProductButton.addEventListener("click", function () {
      openPopup("add");
      //ipcRenderer.send("message-from-admin", "текст");
      //printPicta.call(new Product()); // Вызов метода printPicta
      // printWindow.call(new Product()); // Вызов метода printWindow
    });
  } else {
    console.log("кнопки на странице нет");
  }
});

//*---- Добавляем обработчик события input для поля ID чтобы удалить 0 если начнут вводить с нуля -------------------------
document.addEventListener("DOMContentLoaded", () => {
  const popupIdInput = document.getElementById("popup-id");
  if (popupIdInput) {
    popupIdInput.addEventListener("input", function (event) {
      // Удаляем ведущие нули
      let value = event.target.value;
      if (value.startsWith("0")) {
        event.target.value = value.replace(/^0+/, "");
      }
    });
  } else {
    console.log("Элемента с id 'popup-id' нет на странице");
  }
});

//*--- редактирование объекта: получаем данные из объекта в попап ----- onclick="editObject('${this.uniqId}')"
//* -- клик на кнопку РЕДАГУВАТИ -- ДЕЛАЮ ЧЕРЕЗ ПРОСЛУШИВАТЕЛЬ-- через делегирование события первая часть кода

document.addEventListener("DOMContentLoaded", function () {
  // Контейнер, в который будут добавляться динамические элементы
  const container = document.querySelector(".main-item__container");
  if (container) {
    // Делегирование события на контейнер
    container.addEventListener("click", function (event) {
      // Проверка, что клик был на кнопке "редактировать"
      if (event.target && event.target.id.startsWith("editObject-")) {
        const id = event.target.id.split("-")[1];
        editObject(id); // Ваш код для обработки события на кнопке
        // console.log("Я кликнул на кнопку редактировать с ID:", id);
      } else if (event.target && event.target.id.startsWith("deleteButton-")) {
        const id = event.target.id.split("-")[1];
        deleteObj(id); // Ваш код для обработки события на кнопке удаления
        //console.log("Я кликнул на кнопку удалить с ID:", id);
      } else {
        console.log("якась фигня");
      }
    });
  } else {
    console.log("елемент .main-item__container не найден на странице ");
  }
});

//*--- редактирование - записываю данные из попапа обратно в объект ----  onclick="updateDataObj('${this.uniqId}')"
//*-- кнопка ЗБЕРЕГТИ  єто уже вторая часть кода

document.addEventListener("DOMContentLoaded", function () {
  // Контейнер, в который будут добавляться динамические элементы в попапе
  const popupContainer = document.getElementById("btn-content");
  if (popupContainer) {
    // Делегирование события на контейнер
    popupContainer.addEventListener("click", function (event) {
      // Проверка, что клик был на кнопке "зберегти"
      if (event.target && event.target.id.startsWith("update-data-obj-")) {
        const idParts = event.target.id.split("-");
        if (idParts.length === 4) {
          const id = idParts[3];
          console.log("ID, полученный в event listener:", id); // Лог для проверки
          updateDataObj(id); // Ваш код для обработки события на кнопке
          console.log("Я кликнул на кнопку зберегти с ID:", id);
        } else {
          console.log("Некорректный формат ID кнопки");
        }
      } else {
        console.log("ничо не получилось");
      }
    });
  } else {
    console.log("блок btn-content не найден на странице");
  }
});

//*---- розширяє зону кліку при завантаженні  фото
(function () {
  // Найдите элемент с классом popup__picture
  const popupPictureElement = document.querySelector(".popup__picture");

  if (popupPictureElement) {
    // Если элемент найден, добавьте обработчик события
    popupPictureElement.addEventListener("click", function () {
      const photoInput = document.getElementById("photo-input");
      if (photoInput) {
        photoInput.click();
      } else {
        console.warn("Элемент с id 'photo-input' не найден");
      }
    });
  } else {
    // Если элемент не найден, выведите предупреждение в консоль
    console.warn("Элемент с классом 'popup__picture' не найден");
  }
})();

//*---- показать текст предупреждения ошибки
function showTexeWarn(message) {
  stopScroll(); // удаляю скрол на страничке
  openPopupWarn();
  const popupContainer = document.querySelector(".popup-warn__container");
  const itemAllert = document.createElement("div");
  popupContainer.appendChild(itemAllert);
  itemAllert.innerHTML = `
       <div class="popup-warn__body">
          <div class="popup-warn__elem">
              <h2>Увага!</h2>
              <p>${message}</p>
              <button id="close-popup-warn">Ok</button>
          </div>


      </div>
  `;
}
//*-------------- открываю попап ошибка
function openPopupWarn() {
  stopScroll();
  const popupWarn = document.getElementById("popup-warn");
  popupWarn.classList.remove("popup-none");
  console.log("открыл попап ошибку");
}
//*------------------ закрыть попап ошибку
(function () {
  const popupWarn = document.getElementById("popup-warn");
  const popupWarnContainer = document.querySelector(".popup-warn__container");
  if (popupWarnContainer) {
    popupWarn.addEventListener("click", function () {
      closePopupWarn();
    });
  } else {
    console.log(
      "нет на странице елемента попап ошибка --- popup-warn__container"
    );
  }
})();

//*--------
// (function () {
//   const closePopupWarn = document.getElementById("close-popup-warn");
//   const popupContainer = document.querySelector(".popup-warn__container");
//   if (popupContainer) {
//     closePopupWarn.addEventListener("click", function () {
//       addScroll();
//       const popupWarn = document.getElementById("popup-warn");
//       popupWarn.classList.add("popup-none");
//     });
//   } else {
//     console.log("popup-warn__container -- этого блока нет на странице");
//   }
// })();
function closePopupWarn() {
  addScroll();
  const popupWarn = document.getElementById("popup-warn");
  popupWarn.classList.add("popup-none");
}

//*-- добавляю объект в массив через кнопку (ДОДАТИ СКАСУВАТИ) через прослушиватель события
//*-- нужно сделать через делегирование
document.addEventListener("DOMContentLoaded", function () {
  // Контейнер, в который будут добавляться динамические элементы
  const container = document.getElementById("btn-content");
  if (container) {
    // Делегирование события на контейнер
    container.addEventListener("click", function (event) {
      if (event.target && event.target.id === "btn-add") {
        // Обработка события для кнопки "додати"
        createObj(); // Вызов функции createObj
        console.log("Я кликнул на кнопку додати");
      } else if (event.target && event.target.id === "btn-cancel-add") {
        // Обработка события для кнопки "скасувати" при добавлении
        closePopup();
        console.log("Я кликнул на кнопку скасувати при добавлении");
      } else if (event.target && event.target.id === "btn-cancel-edit") {
        // Обработка события для кнопки "скасувати" при редактировании
        closePopup();
        console.log("Я кликнул на кнопку скасувати при редактировании");
      }
    });
  } else {
    console.log("блок btn-content на странице не найден");
  }
});
//*-------------------- делаю фильтрацию по названию и по ай ди
function filterProduct(query) {
  const lowerCaseQuery = query.toLowerCase();
  const filteredElement = arrProduct.filter(
    (elem) =>
      elem.name.toLowerCase().includes(lowerCaseQuery) ||
      elem.id.toString().includes(lowerCaseQuery)
  );
  console.log("Отфильтрованные элементы:", filteredElement); // Добавить логирование
  return filteredElement;
}

// Обработчик события ввода для поля поиска
(function () {
  // Найдите элемент с классом search-input
  const searchInputElement = document.querySelector(".search-input");

  if (searchInputElement) {
    // Если элемент найден, добавьте обработчик события input
    searchInputElement.addEventListener("input", function () {
      const query = this.value;
      console.log("это квери - " + query);
      const filteredElement = filterProduct(query);
      console.log("Отфильтрованные элементы:", filteredElement);
      updateDisplayAfterFilter(filteredElement); // обновляю страницу админа с выводом отфильтрованых продуктов
    });
  } else {
    // Если элемент не найден, выведите предупреждение в консоль
    console.warn("Элемент с классом 'search-input' не найден");
  }
})();

// Обновленная функция для отображения элементов на странице только для фильтра
function updateDisplayAfterFilter(filteredElements) {
  const itemBody = document.getElementById("item-body");
  itemBody.innerHTML = ""; // Очистить текущее содержимое

  if (filteredElements.length === 0) {
    itemBody.classList.add("yps");
    itemBody.innerHTML = "<p>Упс! Такого товару не знайдено (((((.</p>";
    return;
  }

  filteredElements.forEach((el) => el.print()); // тут применяю прототип отрисовки на странице
}
//**--------------------- загружаю фото показывает фото при загрузке с компьютера -------------------------------------- */

(function () {
  const photoInput = document.getElementById("photo-input");
  if (photoInput) {
    photoInput.addEventListener("change", function () {
      const photoFile = photoInput.files[0]; // Получаем файл изображения
      if (photoFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
          document.getElementById("uploaded-image").src = e.target.result;
        };
        reader.readAsDataURL(photoFile);
      }
    });
  } else {
    console.log("на странице нет - photoInput");
  }
})();

//*------- функция удаляет первоначально фото из попапа загрузки чтобы не было дубляжа
function deletePhotoFromInput() {
  const photoInput = document.getElementById("photo-input");
  photoInput.value = "";
  document.getElementById("uploaded-image").src = "img/photo-icon.png"; // возвращаем иконку по умолчанию
}
//*--------------
//* Функция handleFileSelect предназначена для обработки события выбора файла пользователем (например, при загрузке файла через <input type="file">).
function handleFileSelect(event) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    saveImage(file);
  }
}
// Добавление прослушивателя события change для элемента input
(function () {
  const photoInput = document.getElementById("photo-input");
  if (photoInput) {
    photoInput.addEventListener("change", function (event) {
      handleFileSelect(event); // Передача события
    });
  }
})();

//*-------------+++++++++++++++++++++++++++++++
//*-------------+++++++++++++++++++++++++++++++
// Определение массива продуктов
//const arrProduct = [];

//*--- удалить объект из массива --  --  onclick="deleteObj('${this.uniqId}')"
function deleteObj(id) {
  // Найти индекс объекта в массиве

  const elementIndex = arrProduct.findIndex(
    (elem) => String(elem.uniqId) === String(id)
  );
  console.log("удаляю этот объект " + elementIndex);
  if (elementIndex !== -1) {
    // Удалить объект из массива
    arrProduct.splice(elementIndex, 1);
    // Удалить HTML элемент из DOM
    const item = document.getElementById(`item-${id}`);
    console.log("удаляю этот объект " + item);
    if (item) {
      item.remove(); // Удалить со страницы
    }
    // Сохранить обновленный массив в data.json
    saveDataToFile(arrProduct);
  }
  updateDisplay(); // обновляю страницу админа с выводом объектов
  updateMonitor(); // обновляю после удаления объектов монитор покупателя
}

//*-------------- сортировка по ID в массиве на странице админа
// function compareNum(num1, num2) {
//   if (num1.id > num2.id) {
//     return 1;
//   } else if (num1.id === num2.id) {
//     return 0;
//   } else {
//     return -1;
//   }
// }
//*--------функция для обновления отображения элементов на странице:
export function updateDisplay() {
  const itemBody = document.getElementById("item-body");

  if (itemBody) {
    itemBody.innerHTML = ""; // Очистить текущее содержимое
    arrProduct.sort(compareNum);

    arrProduct.forEach((el) => el.print()); // тут применяю прототип отрисовки на странице
    //console.log("делаю проверку - тут обновляю дисплей");
  } else {
    console.log("блок не доступен " + itemBody);
  }
}
//*--- редактирование объекта: получаем данные из объекта в попап ----- onclick="editObject('${this.uniqId}')"
//* -- клик на кнопку РЕДАГУВАТИ первая часть кода
function editObject(id) {
  const indexEdit = arrProduct.find((elem) => elem.uniqId == id);
  console.log("Это индекс который при кнопке РЕДАГУВАТИ " + indexEdit);
  if (indexEdit) {
    openPopup("edit", id); // открыть попап

    const popupId = document.getElementById("popup-id");
    const popupName = document.getElementById("popup-name");
    const popupDiscont = document.getElementById("popup-discont");
    const popupPrice = document.getElementById("popup-price");
    const photo = document.getElementById("uploaded-image");
    console.log("это фото - " + photo);

    popupId.value = indexEdit.id;
    popupName.value = indexEdit.name;
    popupDiscont.value = indexEdit.discont;
    popupPrice.value = parseFloat(indexEdit.price).toFixed(2); // Форматирование цены для отображения
    photo.src = indexEdit.photo; // Устанавливаем источник изображения
    //console.log(typeof popupPrice.value);
  } else {
    console.log("warn");
  }
}

//*-- редактирование объекта записываю данные из попапа в объект клик на кнопку ЗБЕРЕГТИ вторая часть кода
function updateDataObj(id) {
  let popupId = document.getElementById("popup-id").value;
  const popupName = document.getElementById("popup-name").value;
  const popupDiscont = document.getElementById("popup-discont").value;
  let popupPrice = document.getElementById("popup-price").value;
  const photoInput = document.getElementById("photo-input");
  const photoFile = photoInput.files[0]; // делаю захват фото

  if (popupId === "") {
    showTexeWarn("Поле 'ID' повинно бути заповнене");
    return;
  } else {
    popupId = popupId.replace(/,/, ".");
    const numberRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;
    if (!numberRegex.test(popupId)) {
      showTexeWarn("Поле 'ID' повинно містити коректне число");
      return;
    }
  }

  if (parseInt(popupId) < 10) {
    popupId = "0" + parseInt(popupId);
  }

  if (popupName == "" || popupPrice == "") {
    showTexeWarn("Поле 'ID продукта', 'Назва', 'Ціна' повинні бути заповнені");
    return;
  }

  const index = arrProduct.findIndex((elem) => elem.uniqId == id);
  if (index !== -1) {
    arrProduct[index].id = popupId;
    arrProduct[index].name = popupName;
    arrProduct[index].discont = popupDiscont;
    popupPrice = popupPrice.replace(",", ".");
    arrProduct[index].price = parseFloat(popupPrice).toFixed(2);

    if (photoFile) {
      const photoPath = `img/${photoFile.name}`;
      arrProduct[index].photo = photoPath;
    }

    saveDataToFile(arrProduct);

    updateDisplay();
    updateMonitor();
    closePopup();
  } else {
    console.log("Объект с таким ID не найден");
  }
}

//*---------

//*-------- открываю попап --
function openPopup(action, id) {
  stopScroll();
  clearInput(); // очищаю поля ввода после открытия попапа
  clearPhotoFromPopup(); // очищаю фото с попапа
  const popup = document.getElementById("popup");
  popup.classList.remove("popup-none");
  const btnContent = document.getElementById("btn-content");
  btnContent.innerHTML = "";
  const btnRow = document.createElement("div");
  btnRow.classList.add("btn-row");
  btnContent.appendChild(btnRow);
  if (action === "add") {
    btnRow.innerHTML = `
     
          <button class="btn green" type="button" id="btn-add">додати</button>
        
          <button class="btn red" type="button"    id="btn-cancel-add">скасувати</button>
     
    `;
  } else if (action === "edit") {
    btnRow.innerHTML = `
    
          <button class="btn green" type="button" id="update-data-obj-${id}">зберегти</button>
          <button class="btn red" type="button"    id="btn-cancel-edit">скасувати</button>
     
    `;
  }
}
//*-------- стоп скролл --
function stopScroll() {
  const body = document.getElementById("body");
  body.classList.add("no-scroll");
}
//*----- очищаю поля ввода перед открытием попапа
function clearInput() {
  const idNum = (document.getElementById("popup-id").value = "");
  const name = (document.getElementById("popup-name").value = "");
  const discont = (document.getElementById("popup-discont").value = "");
  const price = (document.getElementById("popup-price").value = "");
}
//*-------- закрываю попап

function closePopup() {
  addScroll();
  const popup = document.getElementById("popup");
  popup.classList.add("popup-none");
  console.log("закрываю попап -");
}

//*-------- добавляю  скролл --
function addScroll() {
  const body = document.getElementById("body");
  body.classList.remove("no-scroll");
}
//*------- удаляю фото при отрытии попапа для редактирования
function clearPhotoFromPopup() {
  const photoInput = document.getElementById("photo-input");
  photoInput.value = "";
  document.getElementById("uploaded-image").src = "img/photo-icon.png"; // возвращаем иконку по умолчанию
}
//*- =====================================================
