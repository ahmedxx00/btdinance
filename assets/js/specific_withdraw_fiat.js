import * as common from "../js/common.js";
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
  $("#nav-item-withdraw").css({
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
    $("input[name = amount]").val($(".cur_amount").html().toString().trim());
  });
  // --------------------------------------

  /*============ recipient address & amount remove white space ===========*/

  let $iban_Input = $("input[name = iban]");
  let $swift_Input = $("input[name = swift]");
  let $amountInput = $("input[name = amount]");
  let $keyInput = $("input[name = key]");

  $iban_Input.on("keyup paste input", function () {
    $(this).val($(this).val().replace(/\s+/g, ""));
  });
  $swift_Input.on("keyup paste input", function () {
    $(this).val($(this).val().replace(/\s+/g, ""));
  });

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

  $("#withdraw_btn").click(function (e) {
    let cur_type = $(".am_wr").children(".symbol").html().toString().trim();
    let iban = $("input[name = iban]").val().toString().trim();
    let swift = $("input[name = swift]").val().toString().trim();
    let amount = $("input[name = amount]").val().toString().trim();
    let key = $("input[name = key]").val().toString().trim();
    let cur_amount = $(".cur_amount").html().toString().trim();

    if (iban.length) {
      if (swift.length) {
        if (amount.length) {
          if (amount.startsWith(".") || amount.split(".").length - 1 > 1) {
            showSweetAlert(TRANSLATIONS.wrng_amnt);
          } else {
            if (parseFloat(amount) <= parseFloat(cur_amount)) {
              if (key.length) {
                // go ajax [ cur_type , iban , swift , amount , key]

                let $to_show = $(`
                  <div id="confirm_withdraw" style="display: none;">
                    <h4>${TRANSLATIONS.spc_with_fiat.cnf_with}</h4>
                    <span class="cur_type" style="display:none">${cur_type}</span>
                    <span class="key" style="display:none">${key}</span>
                    <span class="iban"><span class="pre_span">${
                      TRANSLATIONS.spc_with_fiat.ibn
                    }</span>${iban}</span>
                    <span class="swift"><span class="pre_span">${
                      TRANSLATIONS.spc_with_fiat.swft_c
                    }</span>${swift}</span>
                    <span class="total"><span class="pre_span">${
                      TRANSLATIONS.spc_with_fiat.tot_am
                    }</span>${(
                  parseFloat(amount).toFixed(10) * 1
                ).toString()}<span class="post_span"> ${cur_type}</span></span>
                    <span class="bank_fee"><span class="pre_span">${
                      TRANSLATIONS.spc_with_fiat.bnk_f
                    }</span>Bank estimate</span>
                    <button id="confirm_withdraw_btn">${
                      TRANSLATIONS.spc_with_fiat.cnf
                    }</button>
                  </div>
                  `);

                $to_show.modal({
                  fadeDuration: 500,
                });
              } else {
                showSweetAlert(TRANSLATIONS.spc_with_fiat.ent_sec_k);
              }
            } else {
              showSweetAlert(TRANSLATIONS.spc_with_fiat.am_nt_av);
            }
          }
        } else {
          showSweetAlert(TRANSLATIONS.spc_with_fiat.pls_ent_am);
        }
      } else {
        showSweetAlert(TRANSLATIONS.spc_with_fiat.ent_swf_cod);
      }
    } else {
      showSweetAlert(TRANSLATIONS.spc_with_fiat.ent_ibn_nm);
    }
  });

  // #confirm_withdraw modal is shown in jquery modal
  $(document).on("click", "#confirm_withdraw_btn", function (e) {
    let _this = $(e.target);

    let cur_type = _this.siblings(".cur_type").html(),
      key = _this.siblings(".key").html(),
      iban = _this.siblings(".iban").textNodes().text(),
      swift = _this.siblings(".swift").textNodes().text(),
      total = _this.siblings(".total").textNodes().text();

    let withdraw_fiat_currency = () => {
      $.ajax({
        type: "POST",
        url: "/withdraw/fiat_currency",
        data: {
          cur_type: cur_type,
          key: key,
          iban: iban,
          swift: swift,
          total: total,
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
              if (response.hint && response.hint == "vip") {
                common.showSpinnerDataUpgradeVip(
                  TRANSLATIONS.wrn,
                  response.msg,
                  "black",
                  "red",
                  TRANSLATIONS.spc_with_fiat.btn_upg,
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

    common.manipulateAjax(withdraw_fiat_currency);
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

async function getCookie(name) {
  return (document.cookie.match(
    "(?:^|;)\\s*" + name.trim() + "\\s*=\\s*([^;]*?)\\s*(?:;|$)"
  ) || [])[1];
}

async function fetchTranslationsFor(locale) {
  const response = await fetch(`/static-files-lang/${locale}.json`);
  return await response.json();
}
