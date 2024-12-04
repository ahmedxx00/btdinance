import * as common from "./common.js";
let TRANSLATIONS = {};

$(document).ready(async function () {
  /*====================== fetch translations ========================*/

  let cookieLocale = await getCookie("i18next");
  let locale = cookieLocale ? cookieLocale : "en";
  TRANSLATIONS = await fetchTranslationsFor(locale); //{}

  /*==============================================*/
  /*====================== password toggle show/hide ========================*/

  $(".password-toggle-icon").on("click", function () {
    var siblingInput = $(this).siblings("input");
    if (siblingInput.attr("type") == "password") {
      siblingInput.attr("type", "text");
      $(this).removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
      siblingInput.attr("type", "password");
      $(this).removeClass("fa-eye-slash").addClass("fa-eye");
    }
  });
  /*===========================================*/

  /*=========================== inputs rules ===============================*/

  $("input[name = name]")
    .attr({
      maxlength: common.INPUT_RULES.name_email_maxLength,
      required: true,
      spellcheck: false,
    })
    .on("keyup paste input", function () {
      $(this).val($(this).val().replace(/\s+/g, ""));
    });

  $("input[name = password]")
    .attr({
      minlength: common.INPUT_RULES.pass_minLength,
      pattern: ".{8,}",
      maxlength: common.INPUT_RULES.pass_maxLength,
      required: true,
      spellcheck: false,
    })
    .on("keyup paste input", function () {
      $(this).val($(this).val().replace(/\s+/g, ""));
    });

  /*===========================================*/

  /*======================= manipulate label float top ======================*/

  $(".input-group input")
    .on("focus", function () {
      $(this).siblings("label").addClass("focusIn");
    })
    .on("focusout", function () {
      if (!$(this).val()) {
        $(this).siblings("label").removeClass("focusIn");
      }
    });
  /*===========================================*/

  /*&%&%&%&%&%&%&%&%&%&&%&%&% submit the forms &%&%&&%&%&%&%&%&%&%&%&%&%&%&%*/

  $("#login-form").submit(function (e) {
    e.preventDefault();
    let self = $(this);

    let admin_login_func = () => {
      $.ajax({
        type: "POST",
        dataType: "json",
        url: "/auth/admin-login",
        data: self.serialize(),
        timeout: 5000,
        success: function (response) {
          if (response.success) {
            common.showSpinnerData(
              TRANSLATIONS.adm_lg.wlcm,
              TRANSLATIONS.adm_lg.lg_succ,
              "black",
              "green",
              false,
              false,
              true,
              response.redirectUrl,
              common.REDIRECT_TYPE.replace
            );
          } else {
            if (response.msg == "error") {
              common.showSpinnerData(
                TRANSLATIONS.sn_wr,
                TRANSLATIONS.op_sr,
                "black",
                "red",
                true,
                false,
                false,
                null,
                null
              );
            } else {
              common.showSpinnerData(
                TRANSLATIONS.wrn,
                response.msg,
                "black",
                "red",
                true,
                false,
                false,
                null,
                null
              );
            }
          }
        },
        error: function (xhr, status, error) {
          console.log(xhr.responseText);

          common.showSpinnerData(
            TRANSLATIONS.sn_wr,
            TRANSLATIONS.op_sr,
            "black",
            "red",
            true,
            false,
            false,
            null,
            null
          );
        },
      });
    };

    common.manipulateAjax(admin_login_func);
  });

  /*&%&%&%&%&%&%&%&%&%&&%&%&&%&%&%&%&%&%&%&%&%&%&%&%&%*/
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
