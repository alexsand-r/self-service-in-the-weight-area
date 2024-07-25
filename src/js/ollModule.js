"use strict";
//---- ollModule.js;
//*- массив для хранения продуктов буду импортировать в админ дж
const arrProduct = [];
const arrText = [];
//todo------ функция для обновления объектов на мониторе покупателя при добавлении объектов в массив или при удалении объекта из массива при редактивровании объекта, если какое то действие было то arrProduct.forEach((el) => el.printPicta()); // пробегает по массиву и перерисовывает блок ".main-window__box"
function updateMonitor() {
  const mainWindowPicture = document.querySelector(".main-window__box");
  console.log(mainWindowPicture); // Логирование элемента

  if (mainWindowPicture) {
    mainWindowPicture.innerHTML = "";
    arrProduct.sort(compareNum);

    arrProduct.forEach((el) => updateMainWindowPicBlock(el)); // Используем функцию напрямую
  } else {
    console.error("Element .main-window__box not found.");
  }
}

//*--- создаю класс
class Product {
  static count = 0; // Статическая переменная для уникальных идентификаторов
  constructor(id, name, discont, price, photo) {
    this.uniqId = Product.count++; // Добавляем уникальный идентификатор
    this.id = id;
    this.name = name;
    this.discont = discont;
    this.price = price;
    this.photo = photo;
  }
  // Добавляем метод fromObject для создания экземпляра Product из объекта (это нужно чтобы получать обратно данные из файла дата джесон)
  static fromObject(obj) {
    return new Product(obj.id, obj.name, obj.discont, obj.price, obj.photo);
  }
}
//*--- функция для преобразования загруженных данных в экземпляры класса Product
function convertToProduct(data) {
  return data.map((item) => Product.fromObject(item));
}
//*-------------- сортировка по ID в массиве на странице админа
function compareNum(num1, num2) {
  if (num1.id > num2.id) {
    return 1;
  } else if (num1.id === num2.id) {
    return 0;
  } else {
    return -1;
  }
}

//*----- функция которая будет обновлять блок main-window__pic при загрузке данных из массива arrProduct делаю ее такой же как и прототип Product.prototype.printPicta -- думаю они одинаковые по
function updateMainWindowPicBlock(product) {
  const mainWindowBox = document.querySelector(".main-window__box");

  // Найти последний блок main-window__picture
  let mainWindowPicture = mainWindowBox.lastElementChild;

  // Если нет блоков main-window__picture или в последнем блоке уже 9 картинок, создаем новый блок
  if (!mainWindowPicture || mainWindowPicture.childElementCount >= 9) {
    mainWindowPicture = document.createElement("div");
    mainWindowPicture.classList.add("main-window__picture");
    mainWindowBox.appendChild(mainWindowPicture);
  }

  // Создаем div для новой картинки
  const pictograma = document.createElement("div");
  mainWindowBox.appendChild(pictograma);
  pictograma.classList.add("main-window__pic");
  pictograma.innerHTML = `
      
             <div class="main-item__picture">
               
                    <div class="main-item__pic">
                      <span>${product.id}</span>
                      <img id="photo-${product.uniqId}" src="${product.photo}" alt="photo">
                    </div>
              </div>
            
        
    `;

  // Добавляем новую картинку в последний блок main-window__picture
  mainWindowPicture.appendChild(pictograma);
  console.log("функция updateMainWindowPicBlock - вызвана");
}

// Экспорт функции для использования в других модулях
module.exports = {
  arrProduct,
  arrText,
  updateMonitor,
  Product,
  convertToProduct,
  compareNum,
  updateMainWindowPicBlock,
};
