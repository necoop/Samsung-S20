let phoneSlide = $(".phone__slide");
let startPointsCoord = [];
let animationNumber = 0;
stopAnimation = true;

// Размещение элементов слайдера
$(".phone__slide").each(function (index, element) {
  $(element).css("transform", `translateX(${index * 585}px)`);
});

function getTransform(element) {
  return getTranslateXValue(element.css("transform"));
}

// Функция возврата значения transform
function getTranslateXValue(transformValue) {
  if (transformValue && transformValue !== "none") {
    // Разбиваем матрицу на компоненты
    let matrix = transformValue.match(/^matrix\(([^\)]+)\)$/)[1].split(", ");

    // Возвращаем значение по индексу 4 (translateX)
    return parseInt(matrix[4]);
  }
  return 0; // Возвращаем 0, если свойство transform отсутствует
}

// Метод сдвига по оси X на заданное значение в пикселях
$.fn.elementTransformMoveX = function (distance) {
  return this.each(function () {
    let transformX = getTransform($(this));
    let newTransformX = transformX + distance;
    $(this).css("transform", `translateX(${newTransformX}px)`);
  });
};

// Устанавливаем возможность первой прокрутки слайдера
let canExecute = true;
let canClick = true;
let fromTouch = false;

// Обрабатываем щелчок по слайдеру и проверяем возможность его запуска
let mainSlider = $(".main__slider");
// mainSlider.on("wheel", function (event) {
//   event.preventDefault();
//   if (event.originalEvent.deltaY < 0) {
//     sliderToLeft();
//   } else {
//     floatRight();
//   }
// });
calcSliderHeight();
const sliderLength = $(".phone__slide").length;

// mainSlider.on("click", sliderToLeft);

// $(document).on("keydown", function (event) {
//   if (event.which === 39) {
//     sliderToLeft();
//   }
// });
// $(document).on("keydown", function (event) {
//   if (event.which === 37) {
//     floatRight();
//   }
// });

// function sliderToLeft() {
//   if (canExecute && canClick) {
//     canExecute = false;
//     $(".phone__slide").eq(0).fadeOut(300, "swing", floatLeft);
//     setTimeout(function () {
//       canExecute = true;
//     }, 600); // Задержка в 0.6 секунды
//   }
// }

// function floatLeft() {
//   if (!fromTouch) {
//     $(".phone__slide").eq(1).addClass("active");
//     $(".phone__slide").eq(0).removeClass("active");
//     $(".phone__slide").eq(2).addClass("blur");
//     if ($(".phone__slide").eq(1).hasClass("blur")) {
//       $(".phone__slide").eq(1).removeClass("blur");
//     }
//     $(".phone__slide").css("transform", "translateX(-585px)");
//     mainSlider.append($(".phone__slide").eq(0));
//     $(".phone__slide")
//       .eq(sliderLength - 1)
//       .css({
//         display: "block",
//         left: $(".phone__slide").length * 585 + "px",
//       });
//     $(".phone__slide").each(function (index, element) {
//       $(element).css("left", parseInt($(element).css("left")) - 585 + "px");
//       $(element).css("transform", "translateX(0)");
//     });
//   }
// }

// function floatRight() {
//   if (canExecute) {
//     canExecute = false;
//     $(".phone__slide")
//       .eq($(".phone__slide").length - 1)
//       .addClass("active");
//     $(".phone__slide").eq(0).removeClass("active");
//     $(".phone__slide").eq(0).addClass("blur");
//     $(".phone__slide").eq(1).removeClass("blur");
//     $(".phone__slide").css("transform", "translateX(+585px)");
//     $(".phone__slide").each(function (index, element) {
//       $(element).css("left", parseInt($(element).css("left")) + 585 + "px");
//       $(element).css("transform", "translateX(0)");
//     });
//     let newSlide = $(".phone__slide")
//       .eq(sliderLength - 1)
//       .remove();
//     newSlide.css({
//       left: 0,
//       display: "none",
//     });
//     mainSlider.prepend(newSlide);
//     setTimeout(function () {
//       $(".phone__slide").eq(0).fadeIn(300, "swing");
//     }, 300);
//     setTimeout(function () {
//       canExecute = true;
//     }, 600);
//   }
// }
$(window).resize(function () {
  calcSliderHeight();
});

// Расчёт высоты слайдера
function calcSliderHeight() {
  if ($(window).width() < 626) {
    let activeSlideHeight = $(".phone__slide.active .back").css("height");
    mainSlider.css("height", activeSlideHeight);
    let mainSliderMarginLeft =
      $(window).width() -
      parseInt($(".phone__slide.active").css("width")) +
      "px";
  } else {
    mainSlider.css("height", "625px");
  }
}

// Drag & drop слайдера
let startDraggin = false;
let startPoint;
// Величина смещения слайдера пользователем вручную
let dragginShift = 0;
// mainSlider.mousedown(function (event) {
//   startDraggin = true;
//   startPoint = event.clientX;
//   event.preventDefault();
//   $(document).mousemove(function (event) {
//     canClick = false;
//     if (startDraggin) {
//       dragginShift = event.clientX - startPoint;
//       if (parseInt(dragginShift) > 420) {
//         dragginShift = "420";
//       }
//       if (parseInt(dragginShift) < -585) {
//         dragginShift = "-585";
//       }
//       $(".phone__slide").css("transform", `translateX(${dragginShift}px)`);
//       $(document).mouseup(function () {
//         startDraggin = false;
//         canClick = true;
//         if (dragginShift < 20) {
//           sliderToLeft();
//         } else if (dragginShift > 20) {
//           floatRight();
//         }
//         $(".phone__slide").css("transform", 0);
//         $(".phone__slide").css("transition", "ease 0.3s all");
//       });
//     }
//   });
// });

let elementLeft = 0;
let finished = false;
mainSlider.on("touchstart", function (event) {
  startDraggin = true;
  startPoint = event.touches[0].clientX;
  event.preventDefault();
  if (stopAnimation) {
    for (let i = 0; i < sliderLength; i++) {
      startPointsCoord[i] = getTransform(phoneSlide.eq(i));
    }
  }
});

let prevPoint = 0;
let currentPoint = 0;
let shiftTotal = 0;
$(document).on("touchmove", function (event) {
  if (startDraggin) {
    stopAnimation = false;
    fromTouch = true;
    canClick = false;
    $(".phone__slide").css("transition", "none");
    dragginShift = event.touches[0].clientX - startPoint;
    if (parseInt(dragginShift) > 420) {
      dragginShift = 420;
    }
    if (parseInt(dragginShift) < -300) {
      dragginShift = -300;
    }
    currentPoint = dragginShift;
    shiftTotal = shiftTotal + (currentPoint - prevPoint);
    phoneSlide.elementTransformMoveX(currentPoint - prevPoint);
    prevPoint = currentPoint;
  }
});

$(document).on("touchend", function () {
  if (startDraggin) {
    currentPoint = 0;
    prevPoint = 0;
    canClick = true;

    // Оставшееся время для автоматического скролла
    let timeScroll = (dragginShift + 585) / (585 / 0.3);
    phoneSlide.css("transition", `ease ${timeScroll}s all`);

    phoneSlide.each(function (index, element) {

      // Перемещение слайдов влево
      if (!stopAnimation) {
        $(element).css('transform', `translateX(${startPointsCoord[index] - 585}px)`);
      }

      // Перемещение первого элемента в конец
      $(element).one("transitionend", function () {
        if (getTransform($(element)) + parseInt($(element).css("left")) < 0) {
          $(element).addClass("no-transition");
          $(element).elementTransformMoveX((phoneSlide.length) * 585);
          setTimeout(function () {
            $(element).removeClass("no-transition");
          }, 10);
        }
      });

      // Определяем окончание анимации (stopAnimation)
      phoneSlide.one('transitionend', function (event) {
        animationNumber++;
        if (animationNumber === phoneSlide.length) {
          animationNumber = 0;
          stopAnimation = true;
        }
      })
    });
  }
  fromTouch = false;
});
