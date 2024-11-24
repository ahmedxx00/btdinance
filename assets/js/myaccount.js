import * as common from "../js/common.js";
$(document).ready(function () {
  // =========== Add a jQuery extension for only dealing with text nodes ===========
  jQuery.fn.textNodes = function () {
    return this.contents().filter(function () {
      return this.nodeType === Node.TEXT_NODE && this.nodeValue.trim() !== "";
    });
  };
  // ===============================================================================

  $("#edit_email_btn").click(function (e) {
    let email = $(this).siblings(".email").textNodes().text().toString().trim();

    let $to_show = $(`
        <div id="edit_email_modal" style="display: none;">
          <h4>Edit Email</h4>
            <input type="text" name="email" placeholder="email">
            <input type="text" name="key" placeholder="your key">
          <button id="cnf_edit_email_btn">Confirm</button>
        </div>
        `);

    $to_show.children("input[name='email']").val(email);

    $to_show.modal({
      fadeDuration: 500,
    });

    // ================== remove white space ==============================
    $to_show
      .children("input[name='email']")
      .on("keyup paste input", function () {
        $(this).val($(this).val().replace(/\s+/g, ""));
      });
    $to_show
      .children("input[name='key']")
      .on("keyup paste input", function () {
        $(this).val($(this).val().replace(/\s+/g, ""));
      });
    // =====================================================================
  });

  // #edit_email modal is shown in jquery modal
  $(document).on("click", "#cnf_edit_email_btn", function (e) {
    let _this = $(e.target);

    let old_email = $("#edit_email_btn")
      .siblings(".email")
      .textNodes()
      .text()
      .toString()
      .trim();
    let new_email = _this
      .siblings("input[name='email']")
      .val()
      .toString()
      .trim();

    let key = _this.siblings("input[name='key']").val().toString().trim();

    if (old_email === new_email) {
      //-------------- close jquery-modal -------------------
      $.modal.close();
      //------------------------------------------------------
    } else {
      if (
        new_email.length == 0 ||
        (new_email.length > 0 && validateEmail(new_email))
      ) {
        if (key.length > 0) {
          let editemail = () => {
            $.ajax({
              type: "PUT",
              url: "/myaccount/editemail",
              data: {
                email: new_email,
                key: key,
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

          common.manipulateAjax(editemail);
        } else {
          showSweetAlert("Enter Key");
        }
      } else {
        showSweetAlert("Invalid Email");
      }
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
