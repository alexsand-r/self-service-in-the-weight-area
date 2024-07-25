"use strict";
//*----- функция слайдер
(function () {
  let currentIndex = 0;

  const box = document.querySelector(".main-window__box");
  const nextButton = document.getElementById("next");
  const prevButton = document.getElementById("prev");

  function updateSlider() {
    const pictures = document.querySelectorAll(".main-window__picture"); // Обновление NodeList
    pictures.forEach((picture, index) => {
      picture.style.transform = `translateX(-${currentIndex * 100}%)`;
    });
    updateButtons();
  }

  function updateButtons() {
    const pictures = document.querySelectorAll(".main-window__picture"); // Обновление NodeList
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === pictures.length - 1;
  }

  prevButton.addEventListener("click", () => {
    const pictures = document.querySelectorAll(".main-window__picture"); // Обновление NodeList
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
      // console.log("right");
    }
  });

  nextButton.addEventListener("click", () => {
    const pictures = document.querySelectorAll(".main-window__picture"); // Обновление NodeList
    if (currentIndex < pictures.length - 1) {
      currentIndex++;
      updateSlider();
      // console.log("left");
    }
  });

  window.addEventListener("resize", updateSlider);

  // Функция сброса слайдера и индексов кнопок
  function resetSlider() {
    currentIndex = 0;
    updateSlider();
  }

  // Здесь вы должны добавить обработчик события, которое вызывается при закрытии пиктограммы
  const closeIcon = document.getElementById("del-btn"); // Пример элемента закрытия пиктограммы
  closeIcon.addEventListener("click", () => {
    resetSlider();
  });

  // Инициализация состояния слайдера
  updateSlider();
})();

// (function () {
//   let currentIndex = 0;

//   const box = document.querySelector(".main-window__box");
//   const nextButton = document.getElementById("next");
//   const prevButton = document.getElementById("prev");

//   function updateSlider() {
//     const pictures = document.querySelectorAll(".main-window__picture"); // Обновление NodeList
//     pictures.forEach((picture, index) => {
//       picture.style.transform = `translateX(-${currentIndex * 100}%)`;
//     });
//   }

//   prevButton.addEventListener("click", () => {
//     const pictures = document.querySelectorAll(".main-window__picture"); // Обновление NodeList
//     if (currentIndex > 0) {
//       currentIndex--;
//       updateSlider();
//       console.log("right");
//     }
//   });
//   nextButton.addEventListener("click", () => {
//     const pictures = document.querySelectorAll(".main-window__picture"); // Обновление NodeList
//     if (currentIndex < pictures.length - 1) {
//       currentIndex++;
//       updateSlider();
//       console.log("left");
//     }
//   });

//   window.addEventListener("resize", updateSlider);
// })();
