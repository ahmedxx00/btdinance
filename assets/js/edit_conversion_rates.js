import * as common from "./common.js";
$(document).ready(function () {
  $("#nav-item-edit_conversion_rates").css({
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

  $(".edit_rate_btn").click(function (e) {
    let cur_type = $(this).siblings(".cur_type").html().toString().trim();
    let new_rate = $(this)
      .siblings("input[name = edit_rate]")
      .val()
      .toString()
      .trim();

    if (new_rate.length) {
      let edit_rate = () => {
        $.ajax({
          type: "POST",
          url: "/conversion_rates/add_or_update",
          data: {
            cur_type: cur_type,
            rate: new_rate,
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

      common.manipulateAjax(edit_rate);
    } else {
      showSweetAlert(
        `Enter new <span style='color : black'>${cur_type}</span> rate`
      );
    }
  });

  $(".remove_btn").click(function (e) {
    let cur_type = $(this).siblings(".cur_type").html().toString().trim();

    let remove_rate = () => {
      $.ajax({
        type: "DELETE",
        url: "/conversion_rates/remove_conv_rate",
        data: {
          cur_type: cur_type,
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

    common.manipulateAjax(remove_rate);
  });

  //=================== add new rate  ======================

  $(".add_new_rate_btn").click(function (e) {
    $(".new_rate_modal").modal({
      fadeDuration: 500,
    });
  });

  $("#cnf_add_conversion_rate").click(function (e) {
    let _this = $(e.target);

    let new_rate = _this
      .siblings("input[name = conversion_rate]")
      .val()
      .toString()
      .trim();
    let cur_type;

    if (_this.siblings("input[type = radio]:checked").length) {
      cur_type = _this
        .siblings("input[type = radio]:checked")
        .val()
        .toString()
        .trim();
    }

    if (cur_type) {
      if (new_rate) {
        let add_new_conv_rate = () => {
          $.ajax({
            type: "POST",
            url: "/conversion_rates/add_or_update",
            data: {
              cur_type: cur_type,
              rate: new_rate,
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

        common.manipulateAjax(add_new_conv_rate);
      } else {
        showSweetAlert("Enter conversion rate");
      }
    } else {
      showSweetAlert("select currency");
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
