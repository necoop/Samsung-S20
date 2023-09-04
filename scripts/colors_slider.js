const colors = $(".colors li");
colors.eq(0).addClass("active");
let activeSlide = 2;

//Задаём активный цвет
let activeColor = 0;

//Список координат занимаемых слайдами
const coordList = [
  -570, -380, -190, 0, 190, 380, 750, 940, 1130, 1320, 1510, 1700, 1890, 2080,
  2270, 2460, 2650, 2840,
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
      `<li><img src="./img/view/color1_${i + 1}.png" alt="Фото телефона цвет ${
        activeColor + 1
      } вид ${i + 1}" draggable="false"></li>`
    );
  }
}
let caruselItem = $(".carusel li");
caruselItem.eq(activeSlide).addClass("active");
for (let i = 0; i < caruselItem.length; i++) {
  caruselItem
    .eq(i)
    .css(
      "transform",
      `translateX(${coordList[(i + 5 - activeSlide) % caruselItem.length]}px)`
    );
}

caruselItem.on('click', function(event){
  console.log(caruselItem.index(event.target.closest('.carusel li')))
})