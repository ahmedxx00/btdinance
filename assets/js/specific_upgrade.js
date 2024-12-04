import * as common from "./common.js";
let TRANSLATIONS = {};

$(document).ready(async function () {
  /*====================== fetch translations ========================*/

  let cookieLocale = await getCookie("i18next");
  let locale = cookieLocale ? cookieLocale : "en";
  TRANSLATIONS = await fetchTranslationsFor(locale); //{}

  /*==============================================*/

  let $network_items = $(".networks").children(".network"); // many networks
  let $pay_btn = $(".pay"); // many btns

  /* ============================================= */

  $network_items.each(function (netIndex, element) {
    $(this).on("click", function () {
      $network_items.each(function (index, element) {
        $(this).removeClass("active");
      });
      $(this).addClass("active");
    });
  });

  /* ============================================= */

  $pay_btn.click(function (e) {
    let vip_type = $(".head_wrap")
      .children(".vip_type")
      .html()
      .toString()
      .trim();
    let cur_type = $(this).siblings(".cur_type").html().toString().trim();
    let $active_network = $(this)
      .siblings(".wallet_container")
      .children(".networks")
      .children(".active");
    let price = $(this).siblings(".price").html().toString().trim();

    if ($active_network.length > 0) {
      let network_name = $active_network.html().toString().trim();

      // send request [vip_type , cur_type , network_name , price ]
      let payVip = () => {
        $.ajax({
          type: "POST",
          url: "/upgrade/payvip",
          data: {
            vip_type: vip_type,
            cur_type: cur_type,
            network_name: network_name,
            price: price,
          },
          dataType: "json",
          timeout: 5000,
          success: function (response) {
            if (response.success) {
              window.location.href = response.redirectUrl;
              // common.showSpinnerDataVipPay(
              //   "Pay To Address",
              //   response.msg,
              //   "black",
              //   "green",
              //   price,
              //   cur_type,
              //   network_name,
              // );
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

      common.manipulateAjax(payVip);
    } else {
      showSweetAlert(`${TRANSLATIONS.spc_upg.sel_net_for} ${cur_type}`);
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
