import * as common from "./common.js";
let TRANSLATIONS = {};

$(document).ready(async function () {
  /*====================== fetch translations ========================*/

  let cookieLocale = await getCookie("i18next");
  let locale = cookieLocale ? cookieLocale : "en";
  TRANSLATIONS = await fetchTranslationsFor(locale); //{}

  /*==============================================*/
  /*=========================== inputs rules ===============================*/

  $("input[name = email]")
    .attr({
      maxlength: 100,
      required: true,
      spellcheck: false,
    })
    .on("keyup paste input", function () {
      $(this).val($(this).val().replace(/\s+/g, ""));
    });
  /*===========================================*/

  $("#send_email").submit(function (e) {
    e.preventDefault();
    let self = $(this);

    let email = self.children("input[name = email]").val().toString().trim();

    let send_otp = () => {
      $.ajax({
        type: "POST",
        dataType: "json",
        url: "/otp",
        data: self.serialize(),
        timeout: 5000,
        success: function (response) {
          if (response.success) {
            localStorage.setItem(
              common.LOCAL_STORAGE_CONSTANTS.otp_email,
              response.email
            );
            common.showSpinnerData(
              TRANSLATIONS.frg_pass.otp_snt,
              `<b>${response.email}</b>`,
              "black",
              "green",
              false,
              false,
              true,
              response.redirectUrl,
              common.REDIRECT_TYPE.href
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
    if (validateEmail(email)) {
      common.manipulateAjax(send_otp);
    } else {
      showSweetAlert(TRANSLATIONS.frg_pass.inv_em);
    }
  });
});

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

function showSweetAlert(title) {
  Swal.fire({
    title: title,
    // text: '',
    icon: "error",
    confirmButtonText: TRANSLATIONS.ok,
    width: "250px",
    background: "#800000",
    color: "#ffffff",
    iconColor: "#000000",
    timer: 10000,
    allowEscapeKey: true,
    confirmButtonColor: "#000000",
  });
}

async function getCookie(name) {
  return (document.cookie.match(
    "(?:^|;)\\s*" + name.trim() + "\\s*=\\s*([^;]*?)\\s*(?:;|$)"
  ) || [])[1];
}

async function fetchTranslationsFor(locale) {
  const response = await fetch(`/static-files-lang/${locale}.json`);
  return await response.json();
}
