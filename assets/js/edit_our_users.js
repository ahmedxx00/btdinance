import * as common from "./common.js";
$(document).ready(function () {
  $("#nav-item-edit_our_users").css({
    "background-color": "black",
  });

  // =========== Add a jQuery extension for only dealing with text nodes ===========
  jQuery.fn.textNodes = function () {
    return this.contents().filter(function () {
      return this.nodeType === Node.TEXT_NODE && this.nodeValue.trim() !== "";
    });
  };
  // ===============================================================================


  
  /*
  $(".upgrade_him_btn").click(function (e) {
    // there are many so use this for specific

    let user_name = $(this).parent('.btns').siblings(".user_name").html().toString().trim();
    let vip_needed = $(this).parent('.btns').siblings(".vip_needed").html().toString().trim();
    let transaction_doc_id = $(this).parent('.btns').siblings(".id").html().toString().trim();

    let upgrade_vip = () => {
      $.ajax({
        type: "PUT",
        url: "/transaction_ids/set_done_and_upgrade_user",
        data: {
          user_name: user_name,
          vip_needed: vip_needed,
          transaction_doc_id: transaction_doc_id,
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

    common.manipulateAjax(upgrade_vip);
  });

  $(".neglect_him_btn").click(function (e) {
    // there are many so use this for specific

    let transaction_doc_id = $(this).parent('.btns').siblings(".id").html().toString().trim();

    let neglect_vip_and_delete_transaction_doc = () => {
      $.ajax({
        type: "DELETE",
        url: "/transaction_ids/deleteIt",
        data: {
          transaction_doc_id: transaction_doc_id,
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

    common.manipulateAjax(neglect_vip_and_delete_transaction_doc);
  });
*/

});
