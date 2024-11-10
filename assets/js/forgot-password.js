import * as common from "./common.js";

$(document).ready(function () {
  /*=========================== inputs rules ===============================*/

  $("input[name = email]")
    .attr({
      maxlength: 100,
      required: true,
      spellcheck: false,
    })
    .on("keyup paste input", function () {
      $(this).val($(this).val().replace(/\s+/g, ""));
    });
  /*===========================================*/

  $("#send_email").submit(function (e) {
    e.preventDefault();
    let self = $(this);

    let email = self.children('input[name = email]').val().toString().trim();

    let send_otp = () => {
      $.ajax({
        type: "POST",
        dataType: "json",
        url: "/otp",
        data: self.serialize(),
        timeout: 5000,
        success: function (response) {
          if (response.success) {
            
            localStorage.setItem(
              common.LOCAL_STORAGE_CONSTANTS.otp_email,
              response.email
            );

            common.showSpinnerData(
              "OTP sent to email ",
              `<b>${response.email}</b>`,
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
    if (validateEmail(email)) {

      common.manipulateAjax(send_otp);
    }else{
      showSweetAlert('Invalid Email')
    }
  });
});


const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

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