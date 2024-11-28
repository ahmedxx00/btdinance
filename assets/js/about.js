$(document).ready(function () {
  // ==== Get the styles (properties and values) for the root ====

  const RS = getComputedStyle(document.querySelector(":root"));

  //---------- nav-item-home bg -------
  $("#nav-item-about").css({
    "background-color": RS.getPropertyValue("--MAIN-BLACK"),
    color: RS.getPropertyValue("--WHITE"),
  });
  //-------------------------------

  $(".tab-link").click(function (e) {
    $(".tab-link").each(function (index, element) {
      $(element).removeClass("active");
    });

    $(".tab-body").each(function (index, element) {
      $(element).removeClass("active");
      $(element).removeClass("active-content");
    });

    $(this).addClass("active");
    $($(this).attr("href")).addClass("active");

    setTimeout(() => {
      $($(this).attr("href")).addClass("active-content");
    }, 50);
  });
});
