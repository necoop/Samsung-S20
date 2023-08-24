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

// Метод для присвоения значений translateX массиву startTranslateX
Array.prototype.recTranslateXCoord = function (slide) {
  for (let i = 0; i < slide.length; i++) {
    this[i] = getTranslateX(slide.eq(i));
  }
};

// Первоначальная расстановка элементов
const mainSlider = $(".main__slider");
let phoneSlide = $(".phone__slide");

const cloneNumber = 6 / $(".phone__slide").length;
if (cloneNumber > 1) {
  for (let i = 0; i < cloneNumber - 1; i++) {
    for (let j = 0; j < phoneSlide.length; j++) {
      let newElement = $(".phone__slide").eq(j).clone();
      if (newElement.hasClass("active")) {
        newElement.removeClass("active");
      }
      mainSlider.append(newElement);
    }
  }
}
phoneSlide = $(".phone__slide");
for (let i = 0; i < phoneSlide.length - 2; i++) {
  phoneSlide.eq(i).css("transform", `translateX(${i * 585}px)`);
}
for (let i = phoneSlide.length - 2; i < phoneSlide.length; i++) {
  phoneSlide
    .eq(i)
    .css("transform", `translateX(${(i - phoneSlide.length) * 585}px)`);
}

let clickStartX;
let touchStartX = 0;
let mouseDown = false;
let touchDown = false;
let mouseShiftX = 0;
let touchShiftX = 0;
let startTranslateX = [];
let activeSlideNumber = 0;

startTranslateX.recTranslateXCoord(phoneSlide);

// Первоначальная расстановка элементов
// phoneSlide.each(function (index, element) {
//   $(element).css("transform", `translateX(${index * 585}px)`);
// });

// for (let i = 0; i < phoneSlide.length - 1; i++) {
//   phoneSlide.eq(i).css("transform", `translateX(${i * 585}px)`);
// }
// phoneSlide.eq(phoneSlide.length).css("transform", `translatex(0)`);

mainSlider.on("touchstart", function (event) {
  touchDown = true;

  // Сохраняем начальную точку сдвига
  touchStartX = event.touches[0].screenX;

  phoneSlide.css("transition", "none");
});

$(document).on("touchmove", function (event) {
  if (touchDown) {
    // Вычисление сдвига слайдера от начальной точки
    touchShiftX = event.touches[0].screenX - touchStartX;

    // Ограничение максимального сдвига слайда вручную
    if (touchShiftX > 585 * 0.75) {
      touchShiftX = 585 * 0.75;
    } else if (touchShiftX < -585 * 0.75) {
      touchShiftX = -585 * 0.75;
    }

    // Перемещение слайдов
    phoneSlide.each(function (index, element) {
      $(element).css(
        "transform",
        `translateX(${touchShiftX + startTranslateX[index]}px)`
      );
    });
  }
});

$(document).on("touchend", function (event) {
  startTranslateX.recTranslateXCoord(phoneSlide);
  touchDown = false;

  //Определяем направление движения слайдера
  const risk = 0.5;
  if (getTranslateX(phoneSlide.eq(activeSlideNumber)) < risk * -585) {
    activeSlideNumber = (activeSlideNumber + 1) % phoneSlide.length;
  } else if (getTranslateX(phoneSlide.eq(activeSlideNumber)) > risk * 585) {
    activeSlideNumber = (activeSlideNumber + phoneSlide.length - 1) % phoneSlide.length
  }

  //Вычисляем и устанавливаем время перемотки
  let timeToScroll = (Math.abs(getTranslateX(phoneSlide.eq(0))) / 585 % 1) * 0.6;
  phoneSlide.css("transition", `ease ${timeToScroll}s all`);

  //Перемотка
  for (let i = 0; i < phoneSlide.length; i++) {
    let stepCoord = (i + phoneSlide.length - activeSlideNumber + 2) % phoneSlide.length - 2;
    phoneSlide
      .eq(i)
      .css("transform", `translateX(${stepCoord * 585}px)`);
    if ((stepCoord === phoneSlide.length - 3) || (stepCoord === -2)) {
      if (!phoneSlide.eq(i).hasClass('no-visibility')) {
        phoneSlide.eq(i).addClass('no-visibility');
      }
    } else {
      if (phoneSlide.eq(i).hasClass('no-visibility')) {
        phoneSlide.eq(i).removeClass('no-visibility');
      }
    }
  }
  phoneSlide.eq(phoneSlide.length - 1).one('transitionend', function () {
    startTranslateX.recTranslateXCoord(phoneSlide);
  })
});
