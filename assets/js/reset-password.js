import * as common from "./common.js";

$(document).ready(function () {
  /*====================== password toggle show/hide ========================*/

  $(".password-toggle-icon").on("click", function () {
    var siblingInput = $(this).siblings("input");
    if (siblingInput.attr("type") == "password") {
      siblingInput.attr("type", "text");
      $(this).removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
      siblingInput.attr("type", "password");
      $(this).removeClass("fa-eye-slash").addClass("fa-eye");
    }
  });
  /*===========================================*/

  /*======================= manipulate label float top ======================*/

  $(".input-group input")
    .on("focus", function () {
      $(this).siblings("label").addClass("focusIn");
    })
    .on("focusout", function () {
      if (!$(this).val()) {
        $(this).siblings("label").removeClass("focusIn");
      }
    });
  /*===========================================*/

  /*===================== inputs rules == remove white space ==============================*/

  $(".pin-div input")
    .attr({
      required: true,
      type: "text",
      maxlength: 1,
      spellcheck: false,
    })
    .on("keyup paste input", function () {
      $(this).val($(this).val().replace(/\s+/g, ""));
    });

  $("input.pass")
    .attr({
      minlength: common.INPUT_RULES.pass_minLength,
      pattern: ".{8,}",
      maxlength: common.INPUT_RULES.pass_maxLength,
      required: true,
      spellcheck: false,
    })
    .on("keyup paste input", function () {
      $(this).val($(this).val().replace(/\s+/g, ""));
    });
  /*===========================================*/

  /*===================== validate pins ==============================*/

  const pin_div = $(".pin-div");
  pin_div.children().each(function (index, element) {
    $(element).on("keyup paste input", (event) => {
      if ($(element).val()) {
        if (index != pin_div.children().length - 1) {
          pin_div
            .children()
            .eq(index + 1)
            .focus();
        }
      }

      // ---- Backspace 8 || Delete 46 ------
      if (event.keyCode == 8 || event.keyCode == 46) {
        if (index > 0) {
          pin_div
            .children()
            .eq(index - 1)
            .focus();
        }
      }
      //--------------------------------
    });
  });
  /*===========================================*/

  $("#reset-form").submit(function (e) {
    e.preventDefault();

    let otp_email = localStorage.getItem(
        common.LOCAL_STORAGE_CONSTANTS.otp_email
      ),
      otp = [...pin_div.children()]
        .map((input) => $(input).val())
        .join("")
        .toString(),
      newPassword = $(".pass").val();

    if (otp_email && otp && newPassword) {
      let sent_data = { otp_email, otp, newPassword };

      let reset_password = () => {
        $.ajax({
          type: "POST",
          dataType: "json",
          url: "/otp/reset-password",
          data: sent_data,
          timeout: 5000,
          success: function (response) {
            if (response.success) {
              localStorage.removeItem(common.LOCAL_STORAGE_CONSTANTS.otp_email);

              common.showSpinnerData(
                "Password Changed",
                "Login with new password",
                "black",
                "green",
                false,
                false,
                true,
                response.redirectUrl,
                common.REDIRECT_TYPE.replace
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

      common.manipulateAjax(reset_password);
    }
  });

  //   const userCode = [...pin_div.children()]
  //         .map((input) => $(input).val())
  //         .join("")
  //         .toString();
});
