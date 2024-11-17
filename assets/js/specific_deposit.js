import * as common from "../js/common.js";

$(document).ready(function () {
  // ==== Get the styles (properties and values) for the root ====

  const RS = getComputedStyle(document.querySelector(":root"));

  //---------- nav-item-home bg -------
  $("#nav-item-deposit").css({
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

  /*============ key remove white space ===========*/

  let $keyInput = $("input[name = key]");
  $keyInput.on("keyup paste input", function (e) {
    $(this).val($(this).val().replace(/\s+/g, ""));
  });

  //---------------------------------------------
  /*===================== #deposit_btn ======================*/

  $("#deposit_btn").click(function (e) {
    let $network_dropdown_btn = $(".network_dropdown_btn");
    let key = $("input[name = key]").val().toString().trim();

    let cur_type = $(".currency_container")
      .children(".cur_type")
      .html()
      .toString()
      .trim();

    let network_name = $network_dropdown_btn
      .children(".upper")
      .children(".network_name")
      .html()
      .toString()
      .trim();

    if ($network_dropdown_btn.hasClass("one_selected")) {
      // go ajax [ cur_type , network_name]

      if (key.length) {
      if (cur_type && network_name) {
        let deposit_currency = () => {
          $.ajax({
            type: "POST",
            url: "/deposit/currency",
            data: {
              cur_type: cur_type,
              network_name: network_name,
              key : key
            },
            dataType: "json",
            timeout: 5000,
            success: function (response) {
              if (response.success) {
                common.showSpinnerDataDepositAddress(
                  "Your Deposit Address",
                  response.msg,
                  "black",
                  "green",
                  true,
                  false,
                  false,
                  null,
                  null
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
                  if (response.hint && response.hint == "vip") {
                    common.showSpinnerDataUpgradeVip(
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
                  }else{
                    
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

        common.manipulateAjax(deposit_currency);
      }
    }else{
      showSweetAlert("Enter secret key");
    }
    } else {
      showSweetAlert("No network selected");
    }
  });


});

async function fillNetworkWithClickedOption(optionClicked) {
  // ----- li option elements -------
  let $op_name = $(optionClicked).children(".network_name");
  let $op_block_confirmations = $(optionClicked)
    .children(".network_data")
    .children(".block_confirmations");

  let $op_minimum_deposit = $(optionClicked)
    .children(".network_data")
    .children(".minimum_deposit");

  let $op_est_arrival = $(optionClicked)
    .children(".network_data")
    .children(".est_arrival");

  // ----- network_dropdown_btn to be filled -------

  let $btn_name = $(".network_dropdown_btn")
    .children(".upper")
    .children(".network_name");

  let $btn_block_confirmations = $(".network_dropdown_btn")
    .children(".network_data")
    .children(".block_confirmations");

  let $btn_minimum_deposit = $(".network_dropdown_btn")
    .children(".network_data")
    .children(".minimum_deposit");

  let $btn_est_arrival = $(".network_dropdown_btn")
    .children(".network_data")
    .children(".est_arrival");

  // -- option has est_arrival ---
  if ($op_est_arrival.length) {
    $btn_est_arrival.show();
  } else {
    $btn_est_arrival.hide();
  }
  //--------------------------------
  // ------------ .network_dropdown_btn elements ----------

  $btn_name.textNodes().replaceWith($op_name.html());
  $btn_block_confirmations
    .textNodes()
    .replaceWith($op_block_confirmations.textNodes().text());
  $btn_minimum_deposit
    .textNodes()
    .replaceWith($op_minimum_deposit.textNodes().text());

  if ($btn_est_arrival.textNodes().length) {
    $btn_est_arrival
      .textNodes()
      .replaceWith($op_est_arrival.textNodes().text());
  } else {
    let $textNode = $(
      document.createTextNode($op_est_arrival.textNodes().text())
    );
    $textNode.insertAfter($btn_est_arrival.children(".pre_span"));
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
