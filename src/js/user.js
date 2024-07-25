// ---- user.js
"use strict";

// *  подключаю модули
import { updateDisplay } from "./admin.js";
const {
  saveDataToFileToJsonText,
  loadDataFromFileJsonText,
  loadDataFromFile,
} = require("./data"); // подключаю модули
//*--- импортирую модули из общего файла ollModule.js
const {
  arrProduct,
  Product,
  updateMonitor,
  convertToProduct,
  compareNum,
  updateMainWindowPicBlock,
} = require("../src/js/ollModule.js");
//*--- импортирую модули из файла obj.js // convertToObj require("./obj.js");
import {
  convertToObj,
  arrAray,
  updateObjInBlockText,
  ItemObject,
  createItem,
  clearInputs,
  printItemWrapper,
} from "./obj.js";

//*- тут буду загружать данные из файла дата джесон через виндовс онлоад
// Ваш window.onload должен выглядеть примерно так
window.onload = function () {
  // Перерисовываем страницу

  // Сначала загружаем данные из файла
  const loadedData = loadDataFromFile();
  // console.log("Загруженные данные:", loadedData);

  // Если данные загружены успешно, добавляем их в массив arrProduct
  if (loadedData.length > 0) {
    const serviceProducts = convertToProduct(loadedData);
    arrProduct.push(...serviceProducts);
    console.log("Данные добавлены в arrProduct:", arrProduct);

    // Пример вызова updateMainWindowPicBlock для каждого продукта
    serviceProducts.forEach((product) => {
      updateMainWindowPicBlock(product);
    });
  } else {
    console.warn("Нет данных для загрузки или некорректный формат данных.");
  }

  updateDisplay();
};

//?---- создаю прототип для полкноекранного фото продукта в блоке main-window__box  для файла  ЮЗЕР ШТМЛ
Product.prototype.printWindow = function () {
  const mainWindowBox = document.querySelector(".main-window__box");
  const img = document.createElement("div");
  img.classList.add("picture");
  mainWindowBox.appendChild(img);
  img.innerHTML = `
    <div class="pic">
        <img id="photo-${this.uniqId}" src="${this.photo}" alt="photo">
          <div class="info">
              <span>${this.id}</span>
              <p>${this.name} </p>
          </div>
    </div>
  `;
  clearNextPrev(); // очищаю кнопки прев и некст
};

//! ------------------------------------------------------------------------------

//! -----------------------------------------

//*-------- переменная для хранения айди для сортировки продуктов по ай ди ---------------------------------------------------
let enteredId = "";
//*---- показываю чек из терминала при клике на кнопку РОЗДРУКУВАТИ ЧЕК
(function () {
  const checkBtn = document.querySelector(".check__btn");
  const itemCheckList = document.getElementById("itemCheckList");
  if (itemCheckList) {
    checkBtn.addEventListener("click", function () {
      itemCheckList.classList.toggle("list-vizible");
    });
  } else {
    console.log("такой кнопки нет на странице");
  }
})();

//todo-------- Функция для поиска и отображения продукта */
function displayProductById(id) {
  const product = arrProduct.find((p) => p.id === id);
  if (product) {
    clearMainWindowBox();
    product.printWindow();
    updateProductPrice(product.price); // Обновляем цену продукта
    updateProductDiscont(product.discont); // Обновляем скидку на продукт
    //---

    getNameProduct(product.name);
    getPriceCheck(product.price);
    getDiscontCheck(product.discont);
    enteredId = ""; // Сбрасываем введенный ID после успешного поиска
  } else {
    //setDefaultState();
    const mainWindows = document.querySelector(".main-window__box");
    mainWindows.innerHTML = "";
    console.warn(`Продукт с ID ${id} не найден`);
  }
}
//*---------- фунакция для очистки блока main-window__box
function clearMainWindowBox() {
  const mainWindowBox = document.querySelector(".main-window__box");
  mainWindowBox.innerHTML = "";
}
//*---------------------------------------------------------------------------------------------------------------------------

// todo -- Функция для обновления цены продукта
function updateProductPrice(price) {
  const productPriceDiv = document.getElementById("product-price");
  productPriceDiv.textContent = `${price}`;
}
// todo -- Функция для обновления скидок продукта
function updateProductDiscont(discont) {
  const productDiscontDiv = document.getElementById("discont-price");
  productDiscontDiv.textContent = `${discont}`;
}

//*---- получаю название товара в чек
function getNameProduct(name) {
  const checkName = document.getElementById("check-product");
  checkName.textContent = `${name}`;
}
//*---- получаю цену в чек -------------
function getPriceCheck(price) {
  const checkPrice = document.getElementById("check-price");
  checkPrice.textContent = `${price}`;
}
//*---- получаю скидки в чек
function getDiscontCheck(discont) {
  const checkDiscont = document.getElementById("check-discont");
  checkDiscont.textContent = `${discont}`;
}
//*- функция для добавления кнопок прев и некст
function clearNextPrev() {
  const btns = document.querySelector(".prev-next");
  btns.classList.add("prev-next-none");
}
//*- функция для удаления кнопок прев и некст
function removeNextPrev() {
  const btns = document.querySelector(".prev-next");
  btns.classList.remove("prev-next-none");
}
//*------ расчет стоимости по весу и цене продукта
function getTotalPrice() {
  const massa = parseFloat(document.getElementById("product-weight").value); // Получаем вес, парсим строку в число
  const productPriceDiv = document.getElementById("product-price");
  const price = parseFloat(productPriceDiv.textContent); // Получаем цену, парсим строку в число
  let suma = massa * 0.001 * price; // Вычисляем общую стоимость
  const discontDiv = document.getElementById("discont-price");
  const discont = parseFloat(discontDiv.textContent);

  if (!isNaN(discont) && discont > 0) {
    suma = suma * (1 - discont / 100); // Применяем скидку
  } else {
    // console.log("тут без скидки");
  }
  const rezult = document.getElementById("total-price"); // это цена в блоке где монитор
  rezult.innerText = suma.toFixed(2); // Обновляем элемент с общей стоимостью
  const rezultCheck = document.getElementById("check-total"); // это цена выходит на чек
  rezultCheck.innerText = suma.toFixed(2); // Обновляем элемент с общей стоимостью
}

// Вызывать getTotalPrice() при изменении содержимого поля ввода
document
  .getElementById("product-weight")
  .addEventListener("input", getTotalPrice);
//*--------------------------------------------------------------
//*---------- очистка при клике на кнопку делл (dell) очищаю цену скидку и большой манитор
(function () {
  const clearMainDisplay = document.getElementById("del-btn");

  // const mainWindowCalc = document.querySelector(".main-window__calc");
  if (clearMainDisplay) {
    clearMainDisplay.addEventListener("click", function () {
      const productPriceDiv = (document.getElementById(
        "product-price"
      ).innerText = ""); // очищаю цену на блоке возле монитора
      const discontDiv = (document.getElementById("discont-price").innerText =
        ""); // очищаю скидки возле монитора
      const rezult = (document.getElementById("total-price").innerText = ""); // очищаю общую цену возле монитора
      const massa = parseFloat(
        (document.getElementById("product-weight").value = "")
      ); // очищаю вес продукта
      const checkName = (document.getElementById("check-product").innerText =
        ""); // очищаю название на чеке
      const checkPrice = (document.getElementById("check-price").innerText =
        ""); // очищаю цену на чеке
      const checkDiscont = (document.getElementById("check-discont").innerText =
        ""); // очищаю скидки на чеке
      const rezultCheck = (document.getElementById("check-total").innerText =
        ""); // очищаю тотал цену на чеке
      enteredId = "";
      updateMonitor();
      // прячу чек при клике на делл
      hideCheckListFromTheUser();
      removeNextPrev();

      console.log("я кликнул на DELL");
    });
  } else {
    console.log("нет такой кнопки на странице");
  }
})();

//* прячу чек при клике на делл
function hideCheckListFromTheUser() {
  const itemCheckList = document.getElementById("itemCheckList");
  itemCheckList.classList.remove("list-vizible");
}
//*----------для работы с кнопками 1 - 9

(function () {
  const blockNumber = document.querySelector(".main-window__calc");
  blockNumber.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-btn")) {
      enteredId += event.target.value;
      displayProductById(enteredId);
    }
  });
})();
console.log("страница юзер в консоли");
//*-----------------------
