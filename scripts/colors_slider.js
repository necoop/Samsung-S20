let canSlide = true;
let slideCoord = [];
let deltaActiveSlide = 0;
let shiftX = 0;
let shiftY = 0;
const colors = $(".colors li");
colors.eq(0).addClass("active");
let activeSlide = 3;

function slideUp(activeSlide) {
  canSlide = false;
  caruselItem.css("transition", ".3s ease all");
  for (let i = 0; i < caruselItem.length; i++) {
    let currentCoord =
      coordList[
      (3 - activeSlide + i + caruselItem.length) % caruselItem.length
      ];
    caruselItem.eq(i).css("transform", `translateX(${currentCoord}px)`);
    //Ставим класс active
    if (currentCoord === 380) {
      caruselItem.eq(i).addClass("active");
    } else {
      caruselItem.eq(i).removeClass("active");
    }
    //Устанавливаем невидимость
    if (
      currentCoord < -950 || currentCoord > 2840
    ) {
      if (caruselItem.eq(i).css("visibility") != "hidden") {
        caruselItem.eq(i).css("visibility", "hidden");
      }
    } else if (caruselItem.eq(i).css("visibility") === "hidden") {
      caruselItem.eq(i).css("visibility", "visible");
    }
    slideCoord[i] = currentCoord;
  }
  caruselItem.eq(caruselItem.length - 1).one("transitionend", function () {
    caruselItem.css("transition", "none");
    canSlide = true;
  });
}

//Задаём активный цвет
let activeColor = 0;

//Список координат занимаемых слайдами
const coordList = [
  0, 190, 380, 750, 940, 1130, 1320, 1510, 1700, 1890, 2080, 2270, 2460, 2650,
  2840, 3030, 3220, 3410, 3600, 3790, -1900, -1710, -1520, -1330, -1140, -950,
  -760, -570, -380, -190,
];

//Выбираем активный цвет
colors.on("click", function () {
  colors.each(function (index, element) {
    if ($(element).hasClass("active")) {
      $(element).removeClass("active");
    }
  });
  if (!$(this).hasClass("active")) {
    $(this).addClass("active");
    activeColor = colors.index(this);
  }
});

//Первоначальная расстановка слайдов
for (let j = 0; j < 5; j++) {
  for (let i = 0; i < 6; i++) {
    $(".carusel").append(
      `<li><img src="./img/view/color1_${i + 1}.png" alt="Фото телефона цвет ${activeColor + 1
      } вид ${i + 1}" draggable="false"></li>`
    );
  }
}
let caruselItem = $(".carusel li");
slideUp(activeSlide);

//Обработка клика на слайдере
$(".carusel").on("click", function (event) {
  if (canSlide) {
    if (event.clientX - event.currentTarget.offsetLeft < 1130) deltaActiveSlide = 2;
    if (event.clientX - event.currentTarget.offsetLeft < 940) deltaActiveSlide = 1;
    if (event.clientX - event.currentTarget.offsetLeft < 750) deltaActiveSlide = 0;
    if (event.clientX - event.currentTarget.offsetLeft < 380) deltaActiveSlide = -1;
    if (event.clientX - event.currentTarget.offsetLeft < 190) deltaActiveSlide = -2;
    activeSlide =
      (activeSlide + deltaActiveSlide + caruselItem.length) % caruselItem.length;
    slideUp(activeSlide);
  }
});

//Обработка Drag&Drop
let draggin;
let startX;
let startY;

$(".carusel").on("mousedown", function (event) {
  draggin = true;
  startX = event.clientX;
  startY = event.clientY;
});

$('.carusel').on('touch', function (event) {
  draggin = true;
  startX = event.clientX;
  startY = event.clientY;
  console.log('Прикосновение')
})

$(document).on("mouseup", function () {
  draggin = false;
  $('.carusel').removeClass('grabbing');
  deltaActiveSlide = 0;
  if (shiftX > 80) deltaActiveSlide = -1;
  if (shiftX > 380) deltaActiveSlide = -2;
  if (shiftX > 580) deltaActiveSlide = -3;
  if (shiftX > 760) deltaActiveSlide = -4;
  if (shiftX > 960) deltaActiveSlide = -5;
  if (shiftX < -80) deltaActiveSlide = 1;
  if (shiftX < -380) deltaActiveSlide = 2;
  if (shiftX < -580) deltaActiveSlide = 3;
  if (shiftX < -760) deltaActiveSlide = 4;
  if (shiftX < -960) deltaActiveSlide = 5;
  activeSlide =
    (activeSlide + deltaActiveSlide + caruselItem.length) % caruselItem.length;
  if (shiftX) {
    slideUp(activeSlide);
  }
  shiftX = 0;
  shiftY = 0;
});

$(document).on("mousemove", function (event) {
  if (!draggin) return;
  $('.carusel').addClass('grabbing');
  shiftX = event.clientX - startX;
  shiftY = event.clientY - startY;
  if (shiftX > 1080) shiftX = 1080;
  if (shiftX < -1080) shiftX = -1080;
  caruselItem.each(function (index, element) {
    $(element).css(
      "transform",
      `translateX(${slideCoord[index] + shiftX}px)`
    );
  });
});
