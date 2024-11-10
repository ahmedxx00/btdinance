import * as common from "../js/common.js";

$(document).ready(function () {
  // ==== Get the styles (properties and values) for the root ====

  const RS = getComputedStyle(document.querySelector(":root"));

  //---------- nav-item-home bg -------
  $("#nav-item-withdraw").css({
    "background-color": RS.getPropertyValue("--MAIN-BLACK"),
    color: RS.getPropertyValue("--WHITE"),
  });
  //-------------------------------

  $(".network_dropdown_btn").click(function (e) {
    $(".options").toggleClass("open-menu");
    new SimpleBar($(".options")[0], { autoHide: false });
  });

  $(document).click(function (event) {
    if (!$(event.target).is(".network_dropdown_btn")) {
      if ($(".options").hasClass("open-menu")) {
        $(".options").removeClass("open-menu");
      }
    }
  });

  $(".option").click(async function (e) {
    await fillNetworkWithClickedOption(e.target);
    if (!$(".network_dropdown_btn").hasClass("one_selected")) {
      $(".network_dropdown_btn").addClass("one_selected");
    }
  });

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

  let $recip_add_Input = $("input[name = recipient_address]");
  let $amountInput = $("input[name = amount]");
  let $keyInput = $("input[name = key]");
  $recip_add_Input.on("keyup paste input", function () {
    $(this).val($(this).val().replace(/\s+/g, ""));
  });
  $amountInput.on("keyup paste input", function (e) {
    $(this).val($(this).val().replace(/\s+/g, ""));
  });
  $keyInput.on("keyup paste input", function (e) {
    $(this).val($(this).val().replace(/\s+/g, ""));
  });

  //-------- only numbers in amount field -------
  $amountInput.keypress(function (e) {
    return "0123456789.".indexOf(String.fromCharCode(e.which)) >= 0;
  });
  //---------------------------------------------

  /*===========================================*/
  /*===================== #withdraw_btn ======================*/

  $("#withdraw_btn").click(function (e) {
    let cur_type = $(".am_wr").children(".symbol").html().toString().trim();
    let recipient_address = $("input[name = recipient_address]")
      .val()
      .toString()
      .trim();
    let amount = $("input[name = amount]").val().toString().trim();
    let key = $("input[name = key]").val().toString().trim();
    let cur_amount = $(".cur_amount").html().toString().trim();
    let $network_dropdown_btn = $(".network_dropdown_btn");
    let network_name = $network_dropdown_btn
      .children(".upper")
      .children(".network_name")
      .html()
      .toString()
      .trim();
    let fee = $network_dropdown_btn
      .children(".network_data")
      .children(".fee")
      .textNodes()
      .text()
      .toString()
      .trim();

    if (recipient_address.length) {
      if (amount.length) {
        if (amount.startsWith(".") || amount.split(".").length - 1 > 1) {
          showSweetAlert("Wrong Amount");
        } else {
          if (parseFloat(amount) <= parseFloat(cur_amount)) {
            if ($network_dropdown_btn.hasClass("one_selected")) {
              if (key.length) {
                // go ajax [ cur_type , recipient_address , amount , network_name , key]

                if ((amount - fee).toFixed(10) * 1 > 0) {
                  let $to_show = $(`
                  <div id="confirm_withdraw" style="display: none;">
                    <h4>Confirm Withdraw</h4>
                    <span class="cur_type" style="display:none">${cur_type}</span>
                    <span class="recipient_address" style="display:none">${recipient_address}</span>
                    <span class="key" style="display:none">${key}</span>
                    <span class="total"><span class="pre_span">Total Amount : </span>${amount}<span class="post_span"> ${cur_type}</span></span>
                    <span class="network_name"><span class="pre_span">Network Name : </span>${network_name}</span>
                    <span class="network_fee"><span class="pre_span">Fee : </span>${fee}<span class="post_span"> ${cur_type}</span></span>
                    <span class="received"><span class="pre_span">Amount Received : </span>${
                      (amount - fee).toFixed(10) * 1
                    }<span class="post_span"> ${cur_type}</span></span>
                    <button id="confirm_withdraw_btn">Confirm</button>
                  </div>
                  `);

                  $to_show.modal({
                    fadeDuration: 500,
                  });
                } else {
                  showSweetAlert(
                    "This Network Fees exceeds <br> <span style='color:black; font-weight:bold;'>Try another network</span>"
                  );
                }
              } else {
                showSweetAlert("Enter secret key");
              }
            } else {
              showSweetAlert("No network selected");
            }
          } else {
            showSweetAlert("Amount is not available");
          }
        }
      } else {
        showSweetAlert("Please enter amount");
      }
    } else {
      showSweetAlert("Enter recipient address");
    }
  });

  // #confirm_withdraw modal is shown in jquery modal
  $(document).on('click','#confirm_withdraw_btn',function (e) {
    let _this = $(e.target);

    let cur_type = _this.siblings(".cur_type").html(),
      recipient_address = _this.siblings(".recipient_address").html(),
      key = _this.siblings(".key").html(),
      network_name = _this.siblings(".network_name").textNodes().text(),
      network_fee = _this.siblings(".network_fee").textNodes().text(),
      total = _this.siblings(".total").textNodes().text(),
      received = _this.siblings(".received").textNodes().text();

    let withdraw_currency = () => {
      $.ajax({
        type: "POST",
        url: "/withdraw/currency",
        data: {
          cur_type: cur_type,
          recipient_address: recipient_address,
          key: key,
          network_name: network_name,
          network_fee: network_fee,
          total: total,
          received: received,
        },
        dataType: "json",
        timeout: 5000,
        success: function (response) {
          //-------------- close jquery-modal -------------------
          $.modal.close();
          //------------------------------------------------------

          if (response.success) {
            common.showSpinnerData(
              "Done",
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
          //-------------- close jquery-modal -------------------
          $.modal.close();
          //------------------------------------------------------
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

    console.log('clicked')
    common.manipulateAjax(withdraw_currency);
  });


});

async function fillNetworkWithClickedOption(optionClicked) {
  // ----- li option elements -------
  let $op_name = $(optionClicked).children(".network_name");
  let $op_fee = $(optionClicked).children(".network_data").children(".fee");

  let $op_minimum_withdrawal = $(optionClicked)
    .children(".network_data")
    .children(".minimum_withdrawal");

  let $op_arrival_time = $(optionClicked)
    .children(".network_data")
    .children(".arrival_time");

  // ----- network_dropdown_btn to be filled -------

  let $btn_name = $(".network_dropdown_btn")
    .children(".upper")
    .children(".network_name");
  let $btn_fee = $(".network_dropdown_btn")
    .children(".network_data")
    .children(".fee");
  let $btn_minimum_withdrawal = $(".network_dropdown_btn")
    .children(".network_data")
    .children(".minimum_withdrawal");
  let $btn_arrival_time = $(".network_dropdown_btn")
    .children(".network_data")
    .children(".arrival_time");

  // -- option has arrival_time ---
  if ($op_arrival_time.length) {
    $btn_arrival_time.show();
  } else {
    $btn_arrival_time.hide();
  }
  //--------------------------------
  // ------------ .network_dropdown_btn elements ----------

  $btn_name.textNodes().replaceWith($op_name.html());
  $btn_fee.textNodes().replaceWith($op_fee.textNodes().text());
  $btn_minimum_withdrawal
    .textNodes()
    .replaceWith($op_minimum_withdrawal.textNodes().text());

  if ($btn_arrival_time.textNodes().length) {
    $btn_arrival_time
      .textNodes()
      .replaceWith($op_arrival_time.textNodes().text());
  } else {
    let $textNode = $(
      document.createTextNode($op_arrival_time.textNodes().text())
    );
    $textNode.insertAfter($btn_arrival_time.children(".pre_span"));
  }

  // -----------------------------------------------------------
}

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
