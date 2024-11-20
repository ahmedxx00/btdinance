import * as common from "./common.js";

$(document).ready(function () {
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
              common.showSpinnerDataVipPay(
                "Pay To Address",
                response.msg,
                "black",
                "green",
                price,
                cur_type,
                network_name,
              );
            } else {
              if (response.msg == "error") {
                common.showSpinnerData(
                  "Something Went Wrong",
                  "oops sorry!",
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
                  "Warning",
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
              "Something Went Wrong",
              "oops sorry!",
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
      showSweetAlert(`Please Select ${cur_type} network`);
    }
  });
});

function showSweetAlert(title) {
  Swal.fire({
    title: title,
    // text: '',
    icon: "error",
    confirmButtonText: "OK",
    width: "250px",
    background: "#800000",
    color: "#ffffff",
    iconColor: "#000000",
    timer: 10000,
    allowEscapeKey: true,
    confirmButtonColor: "#000000",
  });
}
