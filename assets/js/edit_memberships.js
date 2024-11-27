import * as common from "./common.js";
$(document).ready(function () {
  $("#nav-item-edit_memberships").css({
    "background-color": "black",
  });

  // =========== Add a jQuery extension for only dealing with text nodes ===========
  jQuery.fn.textNodes = function () {
    return this.contents().filter(function () {
      return this.nodeType === Node.TEXT_NODE && this.nodeValue.trim() !== "";
    });
  };
  // ===============================================================================

  //=================== edit fee ======================

  $(".edit_fee").click(function (e) {
    let new_fee = $(this).siblings("input[name = fee]").val().toString().trim();
    let mem_id = $(this)
      .parent(".fee")
      .siblings(".id")
      .html()
      .toString()
      .trim();

    if (new_fee.length) {
      let edit_fee = () => {
        $.ajax({
          type: "PUT",
          url: "/memberships/editfee",
          data: {
            mem_id: mem_id,
            fee: new_fee,
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
                true,
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

      common.manipulateAjax(edit_fee);
    } else {
      showSweetAlert("Enter fee");
    }
  });
  $(".edit_max_withdraw").click(function (e) {
    let max_withdraw = $(this)
      .siblings("input[name = max_withdraw]")
      .val()
      .toString()
      .trim();
    let mem_id = $(this)
      .parent(".max_withdraw")
      .siblings(".id")
      .html()
      .toString()
      .trim();

    if (max_withdraw.length) {
      let edit_max_withdraw = () => {
        $.ajax({
          type: "PUT",
          url: "/memberships/editmaxwithdraw",
          data: {
            mem_id: mem_id,
            max_withdraw: max_withdraw,
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
                true,
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

      common.manipulateAjax(edit_max_withdraw);
    } else {
      showSweetAlert("Enter max withdraw");
    }
  });
  $(".edit_max_deposit").click(function (e) {
    let max_deposit = $(this)
      .siblings("input[name = max_deposit]")
      .val()
      .toString()
      .trim();
    let mem_id = $(this)
      .parent(".max_deposit")
      .siblings(".id")
      .html()
      .toString()
      .trim();

    if (max_deposit.length) {
      let edit_max_deposit = () => {
        $.ajax({
          type: "PUT",
          url: "/memberships/editmaxdeposit",
          data: {
            mem_id: mem_id,
            max_deposit: max_deposit,
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
                true,
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

      common.manipulateAjax(edit_max_deposit);
    } else {
      showSweetAlert("Enter max deposit");
    }
  });
  $(".edit_max_receive").click(function (e) {
    let max_receive = $(this)
      .siblings("input[name = max_receive]")
      .val()
      .toString()
      .trim();
    let mem_id = $(this)
      .parent(".max_receive")
      .siblings(".id")
      .html()
      .toString()
      .trim();

    if (max_receive.length) {
      let edit_max_receive = () => {
        $.ajax({
          type: "PUT",
          url: "/memberships/editmaxreceive",
          data: {
            mem_id: mem_id,
            max_receive: max_receive,
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
                true,
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

      common.manipulateAjax(edit_max_receive);
    } else {
      showSweetAlert("Enter max receive");
    }
  });
  $(".edit_max_transfer").click(function (e) {
    let max_transfer = $(this)
      .siblings("input[name = max_transfer]")
      .val()
      .toString()
      .trim();
    let mem_id = $(this)
      .parent(".max_transfer")
      .siblings(".id")
      .html()
      .toString()
      .trim();

    if (max_transfer.length) {
      let edit_max_transfer = () => {
        $.ajax({
          type: "PUT",
          url: "/memberships/editmaxtransfer",
          data: {
            mem_id: mem_id,
            max_transfer: max_transfer,
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
                true,
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

      common.manipulateAjax(edit_max_transfer);
    } else {
      showSweetAlert("Enter max transfer");
    }
  });
  $(".remove_btn").click(function (e) {
    let mem_id = $(this).siblings(".id").html().toString().trim();

    let remove_membership = () => {
      $.ajax({
        type: "DELETE",
        url: "/memberships/remove_membership",
        data: {
          mem_id: mem_id,
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
              true,
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

    common.manipulateAjax(remove_membership);
  });

  //=================== add whole new membership ======================

  $(".add_new_membership_btn").click(function (e) {
    $(".new_membership_modal").modal({
      fadeDuration: 500,
    });
  });

  $("#cnf_new_membership_btn").click(function (e) {
    let _this = $(e.target);

    let number = _this
      .siblings("input[name = 'number']")
      .val()
      .toString()
      .trim();
    let fee = _this.siblings("input[name = 'fee']").val().toString().trim();
    let max_withdraw = _this
      .siblings("input[name = 'max_withdraw']")
      .val()
      .toString()
      .trim();
    let max_deposit = _this
      .siblings("input[name = 'max_deposit']")
      .val()
      .toString()
      .trim();
    let max_receive = _this
      .siblings("input[name = 'max_receive']")
      .val()
      .toString()
      .trim();
    let max_transfer = _this
      .siblings("input[name = 'max_transfer']")
      .val()
      .toString()
      .trim();

    if (
      number &&
      fee &&
      max_withdraw &&
      max_deposit &&
      max_receive &&
      max_transfer
    ) {
      let add_membership = () => {
        $.ajax({
          type: "POST",
          url: "/memberships/add_membership",
          data: {
            number: number,
            fee: fee,
            max_withdraw: max_withdraw,
            max_deposit: max_deposit,
            max_receive: max_receive,
            max_transfer: max_transfer,
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
                true,
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

      common.manipulateAjax(add_membership);
    } else {
      showSweetAlert("Empty fields");
    }
  });
  //=================================================================
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
