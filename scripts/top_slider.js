//Функция возврата значения TranslateX в пикселях
function getTranslateX(transformValue) {
  if (transformValue && transformValue !== "none") {
    // Разбиваем матрицу на компоненты
    let matrix = transformValue
      .css("transform")
      .match(/^matrix\(([^\)]+)\)$/)[1]
      .split(", ");

    // Возвращаем значение по индексу 4 (translateX)
    return parseInt(matrix[4]);
  }
  return 0; // Возвращаем 0, если свойство transform отсутствует
}

// Метод сдвига по оси X на заданное значение в пикселях
$.fn.moveByTranslateX = function (distance) {
  return this.each(function () {
    let transformX = getTranslateX($(this));
    let newTransformX = transformX + distance;
    $(this).css("transform", `translateX(${newTransformX}px)`);
  });
};

const mainSlider = $(".main__slider");
const phoneSlide = $(".phone__slide");
let clickStartX;
let mouseDown = false;
let mouseShiftX = 0;
let currentPoint;
let prevPoint = 0;
let startTranslateX = [];

// Первоначальная расстановка элементов
phoneSlide.each(function (index, element) {
  $(element).css("transform", `translateX(${index * 585}px)`);
});

mainSlider.on("mousedown", function (event) {
  clickStartX = event.clientX;
  mouseDown = true;
  phoneSlide.each(function (index, element) {
    startTranslateX[index] = getTranslateX($(element));
  });
});

$(document).on("mousemove", function (event) {
  if (mouseDown) {
    mouseShiftX = event.clientX - clickStartX;
    phoneSlide.each(function (index, element) {
    phoneSlide.eq(index).moveByTranslateX(mouseShiftX - prevPoint);
    });
    // phoneSlide.moveByTranslateX(mouseShiftX - prevPoint + clickStartX);
    prevPoint = mouseShiftX;
  }
});

$(document).on("mouseup", function (event) {
  mouseDown = false;
});
