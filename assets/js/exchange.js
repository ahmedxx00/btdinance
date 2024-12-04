import * as common from "./common.js";
let TRANSLATIONS = {};
$(document).ready(async function () {
  /*====================== fetch translations ========================*/

  let cookieLocale = await getCookie("i18next");
  let locale = cookieLocale ? cookieLocale : "en";
  TRANSLATIONS = await fetchTranslationsFor(locale); //{}

  /*==============================================*/
  // ==== Get the styles (properties and values) for the root ====

  const RS = getComputedStyle(document.querySelector(":root"));

  //---------- nav-item-home bg -------
  $("#nav-item-exchange").css({
    "background-color": RS.getPropertyValue("--MAIN-BLACK"),
    color: RS.getPropertyValue("--WHITE"),
  });
  //-------------------------------

  // =========== Add a jQuery extension for only dealing with text nodes ===========
  jQuery.fn.textNodes = function () {
    return this.contents().filter(function () {
      return this.nodeType === Node.TEXT_NODE && this.nodeValue.trim() !== "";
    });
  };
  // ===============================================================================

  // ------------ MAX on click ------------

  $(".max").click(function (e) {
    $(this)
      .siblings("input[name = amount]")
      .val($(this).siblings(".cur_amount").html().toString().trim());
    $(this).siblings("input[name = amount]").trigger("input");
  });
  // --------------------------------------

  /*============ amount & key remove white space ===========*/

  let $amountInput = $("input[name = amount]");
  let $keyInput = $("input[name = key]");
  $amountInput.on("keyup paste input", function (e) {
    //-------- remove white space && only numbers in amount field && replace any leading zeros -------
    $(this).val(
      $(this)
        .val()
        .replace(/\s+/g, "")
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*?)\..*/g, "$1")
        .replace(/^0[^.]/, "0")
    );

    if ($(this).val().length <= 0 || !validAmount($(this).val())) {
      $(this)
        .parent(".am_wr")
        .siblings(".bb")
        .children("input[name = output]")
        .val("0");
    } else if ($(this).val().length > 0 && validAmount($(this).val())) {
      // output for exchange is toFixed(3)
      $(this)
        .parent(".am_wr")
        .siblings(".bb")
        .children("input[name = output]")
        .val(
          (
            (
              parseFloat(
                $(this)
                  .parent(".am_wr")
                  .siblings(".rate")
                  .html()
                  .toString()
                  .trim()
              ) * parseFloat($(this).val())
            ).toFixed(common.EXCHANGE_TO_FIXED) * 1
          ).toString()
        );
    }
  });
  $keyInput.on("keyup paste input", function (e) {
    $(this).val($(this).val().replace(/\s+/g, ""));
  });

  //---------------------------------------------

  // setInputFilter(document.getElementById("myTextBox"), function(value) {
  //   return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp.
  // }, "Only digits and '.' are allowed");
  /*===========================================*/
  $(".back-btn").click(function (e) {
    history.back();
  });
  /*===================== #withdraw_btn ======================*/

  $(".exchange_btn").click(function (e) {
    let cur_type = $(this)
      .parent(".bb")
      .siblings(".cur_type")
      .html()
      .toString()
      .trim();
    let fiat_cur_type = $(this)
      .parent(".bb")
      .siblings(".fiat_cur_type")
      .html()
      .toString()
      .trim();
    let amount = $(this)
      .parent(".bb")
      .siblings(".am_wr")
      .children("input[name = amount]")
      .val()
      .toString()
      .trim();
    let cur_max_amount = $(this)
      .parent(".bb")
      .siblings(".max_amount")
      .html()
      .toString()
      .trim();
    let fiat_amount = $(this)
      .siblings("input[name = output]")
      .val()
      .toString()
      .trim();
    let key = $(this).siblings("input[name = key]").val().toString().trim();

    if (amount.length) {
      if (amount.startsWith(".") || amount.split(".").length - 1 > 1) {
        showSweetAlert(TRANSLATIONS.wrng_amnt);
      } else {
        if (parseFloat(amount) <= parseFloat(cur_max_amount)) {
          if (key.length) {
            // go ajax [ cur_type , recipient_address , amount , network_name , key]

            //===============================================

            let exchange_currency = () => {
              $.ajax({
                type: "POST",
                url: "/exchange/currency",
                data: {
                  cur_type: cur_type,
                  fiat_cur_type: fiat_cur_type,
                  amount: amount,
                  fiat_amount: fiat_amount,
                  key: key,
                },
                dataType: "json",
                timeout: 5000,
                success: function (response) {
                  //-------------- close jquery-modal -------------------
                  $.modal.close();
                  //------------------------------------------------------

                  if (response.success) {
                    common.showSpinnerData(
                      TRANSLATIONS.dn,
                      response.msg,
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
                  //-------------- close jquery-modal -------------------
                  $.modal.close();
                  //------------------------------------------------------
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

            common.manipulateAjax(exchange_currency);
            //===============================================
          } else {
            showSweetAlert(TRANSLATIONS.ent_sec);
          }
        } else {
          showSweetAlert(TRANSLATIONS.am_ex);
        }
      }
    } else {
      showSweetAlert(TRANSLATIONS.ent_amt);
    }
  });
});

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

function validAmount(value) {
  // Allow digits && '.' only && only one leading zero before dot using a RegExp.
  return /^(?!0\d)\d+(?:\.\d+)?$/.test(value);
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
