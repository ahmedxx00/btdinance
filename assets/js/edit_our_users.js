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
  //=================== edit our user email ======================

  $(".edit_email").click(function (e) {
    let old_email = $(this)
      .parent(".email")
      .textNodes()
      .text()
      .toString()
      .trim();
    let new_email = $(this)
      .siblings("input[name = email]")
      .val()
      .toString()
      .trim();
    let user_id = $(this)
      .parent(".email")
      .siblings(".id")
      .html()
      .toString()
      .trim();

    if (old_email === new_email) {
      //-------------- close jquery-modal -------------------
      $.modal.close();
      //------------------------------------------------------
    } else {
      let edit_email = () => {
        $.ajax({
          type: "PUT",
          url: "/our_users/editemail",
          data: {
            user_id: user_id,
            email: new_email,
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

      common.manipulateAjax(edit_email);
    }
  });
  //=================== edit our user vip ======================

  $(".edit_vip").click(function (e) {
    let new_vip = $(this).siblings("input[name = vip]").val().toString().trim();
    let user_id = $(this)
      .parent(".vip")
      .siblings(".id")
      .html()
      .toString()
      .trim();

    if (new_vip.length) {
      let edit_vip = () => {
        $.ajax({
          type: "PUT",
          url: "/our_users/editvip",
          data: {
            user_id: user_id,
            vip: new_vip,
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

      common.manipulateAjax(edit_vip);
    } else {
      showSweetAlert("Enter vip number");
    }
  });
  //=================== edit a wallet available ======================

  $(".edit_av_btn").click(function (e) {
    let cur_type = $(this).siblings(".cur_type").html().toString().trim();
    let new_av = $(this)
      .siblings("input[name = edit_av]")
      .val()
      .toString()
      .trim();
    let user_id = $(this)
      .parent(".wallet")
      .parent(".wallets")
      .siblings(".id")
      .html()
      .toString()
      .trim();

    if (new_av.length) {
      let edit_av = () => {
        $.ajax({
          type: "PUT",
          url: "/our_users/edit_wallet_available",
          data: {
            user_id: user_id,
            cur_type: cur_type,
            amount: new_av,
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

      common.manipulateAjax(edit_av);
    } else {
      showSweetAlert("Enter Amount");
    }
  });
  //=================== remove a  wallet ======================

  $(".remove_btn").click(function (e) {
    let user_id = $(this)
      .parent(".wallet")
      .parent(".wallets")
      .siblings(".id")
      .html()
      .toString()
      .trim();
    let wallet_id = $(this).siblings(".wallet_id").html().toString().trim();

    let remove_wallet = () => {
      $.ajax({
        type: "DELETE",
        url: "/our_users/remove_wallet",
        data: {
          user_id: user_id,
          wallet_id: wallet_id,
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

    common.manipulateAjax(remove_wallet);
  });
  //=================== show our user pass ======================

  $(".show_password").click(function (e) {
    let user_id = $(this)
      .parent(".below_btns")
      .siblings(".id")
      .html()
      .toString()
      .trim();

    let plain_pass = () => {
      $.ajax({
        type: "GET",
        url: "/our_users/plain_pass",
        data: {
          user_id: user_id,
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

    common.manipulateAjax(plain_pass);
  });
  //=================== show our user key ======================

  $(".show_key").click(function (e) {
    let user_id = $(this)
      .parent(".below_btns")
      .siblings(".id")
      .html()
      .toString()
      .trim();

    let plain_key = () => {
      $.ajax({
        type: "GET",
        url: "/our_users/plain_key",
        data: {
          user_id: user_id,
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

    common.manipulateAjax(plain_key);
  });

  //=================== add wallet ======================
  $(".add_wallet").click(function (e) {
    let user_id = $(this)
      .parent(".below_btns")
      .siblings(".id")
      .html()
      .toString()
      .trim();
    let user_name = $(this)
      .parent(".below_btns")
      .siblings(".name")
      .textNodes()
      .text()
      .toString()
      .trim();
    $("#cur_types").children(".user_id").html(user_id);
    $("#cur_types").children(".user_name").html(user_name);
    $("#cur_types").modal({
      fadeDuration: 500,
    });
  });

  $("#cnf_add_wallet").click(function (e) {
    let _this = $(e.target);

    let user_id = _this.siblings(".user_id").html().toString().trim();
    let user_name = _this.siblings(".user_name").html().toString().trim();
    let cur_type;

    if (_this.siblings("input[type = radio]:checked").length) {
      cur_type = _this
        .siblings("input[type = radio]:checked")
        .val()
        .toString()
        .trim();
    }

    if (cur_type) {
      let add_wallet = () => {
        $.ajax({
          type: "POST",
          url: "/our_users/add_wallet",
          data: {
            user_id: user_id,
            user_name: user_name,
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

      common.manipulateAjax(add_wallet);
    } else {
      showSweetAlert("select currency");
    }
  });
  //=================== add whole new our user ======================

  $(".add_new_our_user_btn").click(function (e) {
    $(".new_our_user_modal").modal({
      fadeDuration: 500,
    });
  });

  $("#cnf_new_user_btn").click(function (e) {
    let _this = $(e.target);

    let name = _this.siblings("input[name = 'name']").val().toString().trim();
    let email = _this.siblings("input[name = 'email']").val().toString().trim();
    let vip = _this.siblings("input[name = 'vip']").val().toString().trim();
    let password = _this
      .siblings("input[name = 'password']")
      .val()
      .toString()
      .trim();
    let key = _this.siblings("input[name = 'key']").val().toString().trim();

    if (name && vip && password && key) {
      let add_new_user = () => {
        $.ajax({
          type: "POST",
          url: "/our_users/add_new_our_user",
          data: {
            name: name,
            email: email,
            vip: vip,
            password: password,
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

      common.manipulateAjax(add_new_user);
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
