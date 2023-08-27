//Блокируем прокрутку при клике на гамбургер
$("#menu__toggle").on("change", function (event) {
  if (this.checked) {
    $("body").addClass("no-scroll-mobile");
  } else {
    $("body").removeClass("no-scroll-mobile");
  }
});
