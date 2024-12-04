import * as common from "./common.js";
let TRANSLATIONS = {};
$(document).ready(async function () {
  /*====================== fetch translations ========================*/

  let cookieLocale = await getCookie("i18next");
  let locale = cookieLocale ? cookieLocale : "en";
  TRANSLATIONS = await fetchTranslationsFor(locale); //{}

  /*==============================================*/
  /*######### Global Variables ############*/

  var isSignupNameAvailable = false;

  /*########################################*/
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

  /*======================= form toggle active ==============================*/

  $(".login-btm-link-a , .signup-btm-link-a").on("click", function () {
    $(".forms-wrapper").toggleClass("active");
  });
  /*===========================================*/

  /*=========================== inputs rules ===============================*/

  $("input[name = name_email],input[name = name]").attr({
    maxlength: common.INPUT_RULES.name_email_maxLength,
    required: true,
    spellcheck: false,
  });

  $("input[name = password]").attr({
    minlength: common.INPUT_RULES.pass_minLength,
    pattern: ".{8,}",
    maxlength: common.INPUT_RULES.pass_maxLength,
    required: true,
    spellcheck: false,
  });

  $("input[name = key]").attr({
    maxlength: common.INPUT_RULES.key_maxLength,
    required: true,
    spellcheck: false,
  });
  $("input[name = accept_terms]").attr({
    required: true,
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

  /*======== check signup name availability AJAX & remove white space =======*/

  var snp_nameInput = $("#signup-form input[name = name]");
  var av_not_av = snp_nameInput.siblings(".l-n");
  av_not_av.hide();
  var timer;

  snp_nameInput.on("keyup paste input", function () {
    // --- no white space ----
    $(this).val($(this).val().replace(/\s+/g, ""));
    //------------------------
    av_not_av.hide();

    if (timer) clearTimeout(timer);

    if ($(this).val()) {
      timer = setTimeout(function () {
        // --- send ajax to express server

        $.ajax({
          type: "POST",
          dataType: "json",
          data: {
            name: snp_nameInput.val().replace(/\s+/g, ""),
          },
          url: "/auth/check_signup_name_availability",
          success: function (response) {
            if (response.success) {
              av_not_av.html(response.msg).css("color", "#36ac00").show(); // green
              isSignupNameAvailable = true;
            } else {
              av_not_av.html(response.msg).css("color", "#f10000").show(); // red
              isSignupNameAvailable = false;
            }
          },
        });

        //---------------------------------
      }, 2000);
    } else {
      // empty input
      isSignupNameAvailable = false;
    }
  });
  /*===========================================*/

  /*============signup [ password & key ] remove white space =================*/

  var snp_passwordInput = $("#signup-form input[name = password]");
  var snp_keyInput = $("#signup-form input[name = key]");
  snp_passwordInput.on("keyup paste input", function () {
    $(this).val($(this).val().replace(/\s+/g, ""));
  });
  snp_keyInput.on("keyup paste input", function () {
    $(this).val($(this).val().replace(/\s+/g, ""));
  });
  /*===========================================*/

  /*============login [ name_email & password ] remove white space ===========*/

  var lng_nameEmailInput = $("#login-form input[name = name_email]");
  var lgn_passwordInput = $("#login-form input[name = password]");
  lng_nameEmailInput.on("keyup paste input", function () {
    $(this).val($(this).val().replace(/\s+/g, ""));
  });
  lgn_passwordInput.on("keyup paste input", function () {
    $(this).val($(this).val().replace(/\s+/g, ""));
  });
  /*===========================================*/

  /*&%&%&%&%&%&%&%&%&%&&%&%&% submit the forms &%&%&&%&%&%&%&%&%&%&%&%&%&%&%*/

  $("#login-form").submit(function (e) {
    e.preventDefault();
    let self = $(this);

    let login_func = () => {
      $.ajax({
        type: "POST",
        dataType: "json",
        url: "/auth/login",
        data: self.serialize(),
        timeout: 5000,
        success: function (response) {
          if (response.success) {
            common.showSpinnerData(
              TRANSLATIONS.auth.wlcm_bt,
              TRANSLATIONS.auth.wl_redi,
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

    common.manipulateAjax(login_func);
  });

  $("#signup-form").submit(function (e) {
    e.preventDefault();

    let self = $(this);

    let signup_func = () => {
      $.ajax({
        type: "POST",
        dataType: "json",
        url: "/auth/signup",
        data: self.serialize(),
        timeout: 5000,
        success: function (response) {
          if (response.success) {
            $("input:not([type = 'checkbox'])").val("");
            common.showSpinnerData(
              TRANSLATIONS.auth.reg_succ,
              TRANSLATIONS.auth.y_cn_lng,
              "black",
              "green",
              false,
              true,
              false,
              null,
              null
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

    if (isSignupNameAvailable) {
      common.manipulateAjax(signup_func);
    }
  });

  /*&%&%&%&%&%&%&%&%&%&&%&%&&%&%&%&%&%&%&%&%&%&%&%&%&%*/

  // alert(window.location.href);
  // alert(window.location.hash);
  // alert(window.location.pathname);
  // alert(window.location.host);
  // alert(window.location.hostname);
  // alert(window.location.port);
  // alert(window.location.origin);
  // alert(window.location.toString());
  // alert(window.location.protocol);

  // =================================================================
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
