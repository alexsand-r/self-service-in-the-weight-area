//! ---- создаю объект продукта
function createObj() {
  let id = document.getElementById("popup-id").value.trim();
  const name = document.getElementById("popup-name").value.trim();
  let discontNum = document.getElementById("popup-discont").value.trim();
  let priceNum = document.getElementById("popup-price").value.trim();
  const photoInput = document.getElementById("photo-input");
  const photoFile = photoInput.files[0]; // делаю захват фото

  const numberRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;

  // if (id === "") {
  //   showTexeWarn("Поле 'ID' повинно бути заповнене");
  //   return;
  // } else {
  //   id = id.replace(/,/, ".");
  //   if (!numberRegex.test(id)) {
  //     showTexeWarn("Поле 'ID' повинно містити коректне число");
  //     return;
  //   }
  // }
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
    // showTexeWarn("Поле 'Ціна' повинно містити коректне число");
    // return;
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

  let photoPath = `img/zastavka1.png`; // Путь к заставке по умолчанию
  if (photoFile) {
    photoPath = `img/${photoFile.name}`;
  }
  const product = new Product(id, name, discont, price, photoPath);

  arrProduct.push(product);
  // product.printPicta();

  closePopup();
  updateDisplay();
  updateMonitor();
  saveDataToFile(arrProduct);
  deletePhotoFromInput();
}
//*----  функцию saveImage для сохранения изображения в папку img
function saveImage(file) {
  try {
    const reader = new FileReader();
    reader.onload = function (event) {
      const imageData = new Buffer.from(
        event.target.result.split(",")[1],
        "base64"
      ); // Преобразование Data URL в Buffer
      fs.writeFile("src/img/" + file.name, imageData, (err) => {
        if (err) {
          console.error("Ошибка сохранения изображения:", err);
        } else {
          console.log("Изображение сохранено:", file.name);
        }
      });
    };
    reader.readAsDataURL(file);
  } catch (err) {
    console.error("Ошибка при чтении файла:", err);
  }
}
