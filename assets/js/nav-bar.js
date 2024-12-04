import * as common from "./common.js";
let TRANSLATIONS = {};

$(document).ready(async function () {
  /*====================== fetch translations ========================*/

  let cookieLocale = await getCookie("i18next");
  let locale = cookieLocale ? cookieLocale : "en";
  TRANSLATIONS = await fetchTranslationsFor(locale); //{}

  /*==============================================*/

  $(".sn").click(function (e) {
    e.stopPropagation();
    $(".nav-items").toggleClass("show");
  });

  //--------- close .nav-items on any click outside -------
  $(document).click(function (event) {
    if (!$(event.target).is(".sn") && !$(event.target).is(".nav-items")) {
      if ($(".nav-items").hasClass("show")) {
        $(".nav-items").removeClass("show");
      }
    }
  });
  //--------------------------------------------------------------

  $(".logout").click(function (e) {
    e.preventDefault();

    let $to_show = $(`
      <h3 class='cnf_logout_h'>${TRANSLATIONS.nv_br.lgt_tit}</h3>
      <div class='lgt_btns'>
        <button class='cnf_logout_btn'>${TRANSLATIONS.nv_br.lgt_lv}</button>
        <button class='cancel_logout_btn'>${TRANSLATIONS.no}</button>
      </div>
    `);
    common.showCustomLogoutDialog($to_show);
  });
});

async function getCookie(name) {
  return (document.cookie.match(
    "(?:^|;)\\s*" + name.trim() + "\\s*=\\s*([^;]*?)\\s*(?:;|$)"
  ) || [])[1];
}

async function fetchTranslationsFor(locale) {
  const response = await fetch(`/static-files-lang/${locale}.json`);
  return await response.json();
}
