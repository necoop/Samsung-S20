function slideUp() {
  caruselItem.css('transition', '.3s ease all');
  for (let i = 0; i < caruselItem.length; i++) {
    let currentCoord = coordList[((3 - activeSlide) + i + caruselItem.length) % caruselItem.length];
    caruselItem
      .eq(i)
      .css(
        "transform",
        `translateX(${currentCoord}px)`
      );
    //Ставим класс active
    if (currentCoord === 380) {
      caruselItem.eq(i).addClass('active');
    } else {
      caruselItem.eq(i).removeClass('active');
    }
    //Устанавливаем невидимость
    if (currentCoord === 2460 || currentCoord === 2650 || currentCoord === -760 || currentCoord === -570) {
      if (caruselItem.eq(i).css('visibility') != 'hidden') {
        caruselItem.eq(i).css('visibility', 'hidden');
      }
    } else if (caruselItem.eq(i).css('visibility') === 'hidden') {
      caruselItem.eq(i).css('visibility', 'visible');
    }
  }
  caruselItem.on('transitionend', function () {
    caruselItem.css('transition', 'none');
  })
}

const colors = $(".colors li");
colors.eq(0).addClass("active");
let activeSlide = 3;

//Задаём активный цвет
let activeColor = 0;

//Список координат занимаемых слайдами
const coordList = [
  0, 190, 380, 750, 940, 1130, 1320, 1510, 1700, 1890, 2080,
  2270, 2460, 2650, -760, -570, -380, -190
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
for (let j = 0; j < 3; j++) {
  for (let i = 0; i < 6; i++) {
    $(".carusel").append(
      `<li><img src="./img/view/color1_${i + 1}.png" alt="Фото телефона цвет ${activeColor + 1
      } вид ${i + 1}" draggable="false"></li>`
    );
  }
}
let caruselItem = $(".carusel li");
slideUp();

caruselItem.on('click', function (event) {
  let deltaActiveSlide = 0;
  if (getTranslateX($(this)) === 0) deltaActiveSlide = -2;
  if (getTranslateX($(this)) === 190) deltaActiveSlide = -1;
  if (getTranslateX($(this)) === 750) deltaActiveSlide = 1;
  if (getTranslateX($(this)) === 940) deltaActiveSlide = 2;
  activeSlide = (activeSlide + deltaActiveSlide + caruselItem.length) % caruselItem.length;
  slideUp();
})
