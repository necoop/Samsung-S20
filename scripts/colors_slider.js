const colors = $(".colors li");
colors.eq(0).addClass("active");
let activeSlide = 2;

//Задаём активный цвет
let activeColor = 0;

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
for (let j = 0; j < 2; j++) {
  for (let i = 0; i < 6; i++) {
    $(".carusel").append(
      `<li><img src="./img/view/color1_${i + 1}.png" alt="Фото телефона цвет ${
        activeColor + 1
      } вид ${i + 1}" draggable="false"></li>`
    );
  }
}
let caruselItem = $(".carusel li");
caruselItem.eq(activeSlide).addClass('active');
console.log(caruselItem);
