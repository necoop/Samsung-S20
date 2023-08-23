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
}

const mainSlider = $(".main__slider");
const phoneSlide = $(".phone__slide");
let clickStartX;
let touchStartX = 0;
let mouseDown = false;
let touchDown = false;
let mouseShiftX = 0;
let touchShiftX = 0;
let startTranslateX = [];
let activeSlide = $('.phone__slide.active');
let activeSlideNumber = 0;

// Первоначальная расстановка элементов
phoneSlide.each(function (index, element) {
  $(element).css("transform", `translateX(${index * 585}px)`);
});

mainSlider.on("touchstart", function (event) {
  touchDown = true;

  // Сохраняем начальную точку сдвига
  touchStartX = event.touches[0].screenX;

  startTranslateX.recTranslateXCoord(phoneSlide);

  phoneSlide.css('transition', 'none');
});

$(document).on("touchmove", function (event) {
  if (touchDown) {
    // Вычисление сдвига слайдера от начальной точки
    touchShiftX = event.touches[0].screenX - touchStartX;

    // Ограничение максимального сдвига слайда вручную
    if (touchShiftX > 585 * .75) {
      touchShiftX = 585 * .75;
    } else if (touchShiftX < -585 * .75) {
      touchShiftX = -585 * .75;
    }

    // Перемещение слайдов
    phoneSlide.each(function (index, element) {
      $(element).css('transform', `translateX(${touchShiftX + startTranslateX[index]}px)`);
    });
  }
});

$(document).on("touchend", function (event) {
  startTranslateX.recTranslateXCoord(phoneSlide);
  touchDown = false;

  // Определяем координаты активного слайда
  let activeSlideTransformX;
  activeSlideTransformX = getTranslateX($('.phone__slide.active'));

  //Определяем направление движения слайдера
  let direction;
  const risk = 0.25;
  if (activeSlideTransformX < risk * -585) {
    direction = 'onLeft';
  } else if (activeSlideTransformX > risk * 585) {
    direction = 'onRight';
  } else {
    direction = 'onPrevious';
  }

  //Вычисляем время перемотки
  let timeToScroll = (585 - Math.abs(activeSlideTransformX)) / 585 * 0.3;
  phoneSlide.css('transition', `ease ${timeToScroll}s all`);

  if (direction === 'onLeft') {
    console.log(activeSlideNumber)
    phoneSlide.each(function (index, element) {
      $(element).moveByTranslateX((index - (activeSlideNumber + 1)) * 585 - startTranslateX[index]);
    })
    phoneSlide.eq(activeSlideNumber).removeClass('active');
    phoneSlide.eq(activeSlideNumber).addClass('no-transition');
    phoneSlide.eq(activeSlideNumber).css('transform', `translateX(${Math.abs((index - activeSlideNumber)%phoneSlide.length)*585}px)`);
    activeSlideNumber = (activeSlideNumber + 1) % phoneSlide.length;
    phoneSlide.eq(activeSlideNumber).addClass('active');
  }

});
