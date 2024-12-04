import * as common from "./common.js";
let TRANSLATIONS = {};

$(document).ready(async function () {
  /*====================== fetch translations ========================*/

  let cookieLocale = await getCookie("i18next");
  let locale = cookieLocale ? cookieLocale : "en";
  TRANSLATIONS = await fetchTranslationsFor(locale); //{}

  /*==============================================*/

  // =========== Add a jQuery extension for only dealing with text nodes ===========
  jQuery.fn.textNodes = function () {
    return this.contents().filter(function () {
      return this.nodeType === Node.TEXT_NODE && this.nodeValue.trim() !== "";
    });
  };
  // ===============================================================================

  /*============ transaction_id remove white space ===========*/

  let $transaction_id_input = $("input[name='transaction_id']");
  $transaction_id_input.on("keyup paste input", function (e) {
    $(this).val($(this).val().replace(/\s+/g, ""));
  });

  //---------------------------------------------

  /*===================== #transaction_id_btn ======================*/

  $("#transaction_id_btn").click(function (e) {
    let cur_type = $(".payment_wrap")
      .children(".amount")
      .children(".post_span")
      .html()
      .toString()
      .trim();

    let amount = $(".payment_wrap")
      .children(".amount")
      .textNodes()
      .text()
      .toString()
      .trim();
    let network_name = $(".payment_wrap")
      .children(".network_name")
      .textNodes()
      .text()
      .toString()
      .trim();
    let vip_needed = $(".payment_wrap")
      .children(".vip_type")
      .html()
      .toString()
      .trim();
    let transaction_id = $("input[name='transaction_id']")
      .val()
      .toString()
      .trim();

    if (transaction_id.length) {
      if (cur_type && amount && network_name && vip_needed) {
        let confirm_transaction = () => {
          $.ajax({
            type: "POST",
            url: "/upgrade/confirm_transaction",
            data: {
              cur_type: cur_type,
              amount: amount,
              network_name: network_name,
              vip_needed: vip_needed,
              transaction_id: transaction_id,
            },
            dataType: "json",
            timeout: 5000,
            success: function (response) {
              if (response.success) {
                common.showSpinnerDataLongTime(
                  TRANSLATIONS.spc_cnf_upg.snt_fr_rvw,
                  response.msg,
                  "black",
                  "black",
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
        common.manipulateAjax(confirm_transaction);
      }
    } else {
      showSweetAlert(TRANSLATIONS.spc_cnf_upg.ent_trns_id);
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

async function getCookie(name) {
  return (document.cookie.match(
    "(?:^|;)\\s*" + name.trim() + "\\s*=\\s*([^;]*?)\\s*(?:;|$)"
  ) || [])[1];
}

async function fetchTranslationsFor(locale) {
  const response = await fetch(`/static-files-lang/${locale}.json`);
  return await response.json();
}
