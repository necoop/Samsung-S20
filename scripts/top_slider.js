//Определяем мобильный или стационарный браузер
let userAgentMobile;
// Получение строки User Agent
var userAgent = navigator.userAgent;

// Проверка наличия некоторых ключевых слов, характерных для мобильных устройств
if (
  userAgent.match(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  )
) {
  userAgentMobile = true;
} else {
  userAgentMobile = false;
}

//Предзагрузка изображений
const imageUrls = [];
$(".phone__slide img").each(function (index, element) {
  imageUrls[index] = $(element).attr("src");
});
function preloadImages(imageUrls, callback) {
  let loadedImages = 0;
  const totalImages = imageUrls.length;

  function imageLoaded() {
    loadedImages++;
    if (loadedImages === totalImages) {
      callback();
    }
  }

  for (const imageUrl of imageUrls) {
    const img = new Image();
    img.onload = imageLoaded;
    img.src = imageUrl;
  }
}

// Запускаем предварительную загрузку
// preloadImages(imageUrls, function () {
// Все изображения загружены, можно продолжать выполнение кода
//   console.log("Изображения загружены!");
// });

preloadImages(imageUrls, topSlider);

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
phoneSlide.each(function (index, element) {
  $(element).css("transform", "translateX(0px)");
});
// phoneSlide.css("transition", `ease 0.4s all`);

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

function setMainSliderHeight(activeSlideNumber) {
  mainSlider.css(
    "height",
    `${
      parseInt($(phoneSlide).eq(activeSlideNumber).css("height")) +
      parseInt($(phoneSlide).eq(activeSlideNumber).css("margin-bottom"))
    }px`
  );
}

let horizenScroll = true;

function topSlider() {
  const cloneNumber = 6 / phoneSlide.length;
  if (cloneNumber > 1) {
    for (let i = 0; i < cloneNumber - 1; i++) {
      for (let j = 0; j < phoneSlide.length; j++) {
        let newElement = phoneSlide.eq(j).clone();
        if (newElement.hasClass("active")) {
          newElement.removeClass("active");
        }
        mainSlider.append(newElement);
      }
    }
  }
  phoneSlide = $(".phone__slide");

  let clickStartX;
  let touchStartX = 0;
  let touchStartY = 0;
  let mouseDown = false;
  let touchDown = false;
  let mouseShiftX = 0;
  let touchShiftX = 0;
  let startTranslateX = [];
  let activeSlideNumber = 0;

  //Блокировка прокрутки слайдера
  let touchBlock = false;

  //Запускаем расстановку и сохраняем координаты каждого слайда
  slideUp();

  setMainSliderHeight(activeSlideNumber);

  $(window).on("resize", function () {
    setMainSliderHeight(activeSlideNumber);
  });

  //Реагируем на тач
  mainSlider.on("touchstart", function (event) {
    if (!touchBlock) {
      touchStart(event.touches[0].screenX, event.touches[0].screenY);
    }
  });

  //Реагируем на клик
  mainSlider.on("mousedown", function (event) {
    if (!touchBlock) {
      // Сохраняем начальную точку сдвига
      touchStart(event.screenX, event.screenY);
    }
  });

  function touchStart(pointX, pointY) {
    // Сохраняем начальную точку сдвига
    touchStartX = pointX;
    touchStartY = pointY;
    touchDown = true;
    phoneSlide.css("transition", "none");
    mainSlider.addClass("grabbing");
  }

  //Движение по тачу
  document.body.addEventListener("touchmove", function (event) {
    if (touchDown) {
      if (userAgentMobile) {
        //Проверяем осуществляется ли прокрутка слайдера по горизонтали или вертикали
        let deltaX = Math.abs(event.touches[0].screenX - touchStartX);
        let deltaY = Math.abs(event.touches[0].screenY - touchStartY);
        if (
          deltaX > deltaY &&
          !$("body").hasClass(
            "no-scroll-mobile" && !event.target === $("#menu__box")
          )
        ) {
          $("body").addClass("no-scroll-mobile");
        }
        if (deltaX < deltaY) {
          horizenScroll = false;
        }
      }
      touchMove(event.touches[0].screenX);
    }
  });

  //Движение по курсору
  $(document).on("mousemove", function (event) {
    touchMove(event.screenX);
  });

  function touchMove(screenX) {
    if (!touchDown || !horizenScroll) {
      return;
    }
    touchBlock = true;
    // Вычисление сдвига слайдера от начальной точки
    touchShiftX = screenX - touchStartX;

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

  //Обработка окончания касания
  $(document).on("touchend", function () {
    horizenScroll = true;
    touchEnd();
  });

  //Обработка окончания клика
  $(document).on("mouseup", function () {
    touchEnd();
  });

  function touchEnd(event) {
    mainSlider.removeClass("grabbing");
    startTranslateX.recTranslateXCoord(phoneSlide);
    touchDown = false;

    //Определяем направление движения слайдера
    const risk = 0.1;
    if (getTranslateX(phoneSlide.eq(activeSlideNumber)) < risk * -585) {
      activeSlideNumber = (activeSlideNumber + 1) % phoneSlide.length;
    } else if (getTranslateX(phoneSlide.eq(activeSlideNumber)) > risk * 585) {
      activeSlideNumber =
        (activeSlideNumber + phoneSlide.length - 1) % phoneSlide.length;
    }
    slideUp();
    if ($("body").hasClass("no-scroll-mobile") && !$('#menu__toggle')[0].checked) {
      $("body").removeClass("no-scroll-mobile");
    }
  }

  //Перемотка
  function slideUp() {
    startTranslateX.recTranslateXCoord(phoneSlide);
    phoneSlide.css("transition", `ease 0.4s all`);
    for (let i = 0; i < phoneSlide.length; i++) {
      let stepCoord =
        ((i + phoneSlide.length - activeSlideNumber + 2) % phoneSlide.length) -
        2;
      phoneSlide.eq(i).css("transform", `translateX(${stepCoord * 585}px)`);
      if (stepCoord === phoneSlide.length - 3 || stepCoord === -2) {
        if (!phoneSlide.eq(i).hasClass("no-visibility")) {
          phoneSlide.eq(i).addClass("no-visibility");
        }
      } else {
        if (phoneSlide.eq(i).hasClass("no-visibility")) {
          phoneSlide.eq(i).removeClass("no-visibility");
        }
      }
      if (stepCoord === 0) {
        phoneSlide.eq(i).addClass("active");
      } else {
        if (phoneSlide.eq(i).hasClass("active")) {
          phoneSlide.eq(i).removeClass("active");
        }
      }
      if (stepCoord === 1 || stepCoord === 2) {
        phoneSlide.eq(i).addClass("blur");
      } else {
        if (phoneSlide.eq(i).hasClass("blur")) {
          phoneSlide.eq(i).removeClass("blur");
        }
      }
    }
    phoneSlide.eq(phoneSlide.length - 1).one("transitionend", function () {
      startTranslateX.recTranslateXCoord(phoneSlide);
      phoneSlide.css("transition", "none");
      horizenScroll = true;
      touchBlock = false;
    });
  }
}
