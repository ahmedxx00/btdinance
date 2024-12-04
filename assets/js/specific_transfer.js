import * as common from "../js/common.js";
let TRANSLATIONS = {};

$(document).ready(async function () {
  /*====================== fetch translations ========================*/

  let cookieLocale = await getCookie("i18next");
  let locale = cookieLocale ? cookieLocale : "en";
  TRANSLATIONS = await fetchTranslationsFor(locale); //{}

  /*==============================================*/
  
  // ==== Get the styles (properties and values) for the root ====

  const RS = getComputedStyle(document.querySelector(":root"));

  //---------- nav-item-home bg -------
  $("#nav-item-transfer").css({
    "background-color": RS.getPropertyValue("--MAIN-BLACK"),
    color: RS.getPropertyValue("--WHITE"),
  });
  //-------------------------------

  /* ============================================= */

  $(".tab_btn").each(function (btnIndex, element) {
    $(this).on("click", function () {
      $(".tab_btn").each(function (index, element) {
        $(this).removeClass("active");
      });
      $(this).addClass("active");

      $(".content").each(function (index, element) {
        $(this).removeClass("active");
      });

      $(".content").eq(btnIndex).addClass("active");
    });
  });

  /* ============================================= */

  // ------------ MAX on click ------------

  $(".max").click(function (e) {
    $(this)
      .siblings("input[name = amount]")
      .val($(".cur_amount").html().toString().trim());
  });
  // --------------------------------------

  /*============ Name & Email & amount remove white space ===========*/

  let $name_Input = $("input[name = name]");
  let $email_Input = $("input[name = email]");
  let $amountInput = $("input[name = amount]");
  $name_Input.on("keyup paste input", function () {
    $(this).val($(this).val().replace(/\s+/g, ""));
  });
  $email_Input.on("keyup paste input", function (e) {
    $(this).val($(this).val().replace(/\s+/g, ""));
  });
  $amountInput.on("keyup paste input", function (e) {
    //-------- remove white space && only numbers in amount field && replace any leading zeros -------
    $(this).val(
      $(this)
        .val()
        .replace(/\s+/g, "")
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*?)\..*/g, "$1")
        .replace(/^0[^.]/, "0")
    );
  });

  /*===========================================*/
  $(".back-btn").click(function (e) {
    history.back();
  });
  /*===================== #transfer_btn ======================*/

  $(".transfer_btn").click(function (e) {
    let $_this = $(this);

    let cur_type = $_this
      .siblings(".amount_wrap")
      .children(".am_wr")
      .children(".symbol")
      .html()
      .toString()
      .trim();
    let name = $("input[name = name]").val().toString().trim();
    let email = $("input[name = email]").val().toString().trim();

    let amount = $_this
      .siblings(".amount_wrap")
      .children(".am_wr")
      .children("input[name = amount]")
      .val()
      .toString()
      .trim();
    let cur_amount = $(".cur_amount").html().toString().trim(); // max available

    if ($_this.parent().hasClass("Name")) {
      doSomething(cur_type, name, "name", amount, cur_amount);
    } else if ($_this.parent().hasClass("Email")) {
      doSomething(cur_type, email, "email", amount, cur_amount);
    }
  });
});

function doSomething(cur_type, nameOrEmail, hint, amount, cur_amount) {
  // hint could be name || email

  if (nameOrEmail.length) {
    if (amount.length) {
      if (amount.startsWith(".") || amount.split(".").length - 1 > 1) {
        showSweetAlert(TRANSLATIONS.wrng_amnt);
      } else {
        if (parseFloat(amount) <= parseFloat(cur_amount)) {
          // to eliminate any zeros on the left
          let am = (parseFloat(amount).toFixed(10) * 1).toString();

          if (hint === "name") {
            transfer(cur_type, hint, nameOrEmail, am);
          } else if (hint === "email") {
            if (validateEmail(nameOrEmail)) {
              transfer(cur_type, hint, nameOrEmail, am);
            } else {
              showSweetAlert(TRANSLATIONS.spc_trans.inv_em);
            }
          }
        } else {
          showSweetAlert(TRANSLATIONS.spc_trans.am_nt_av);
        }
      }
    } else {
      showSweetAlert(TRANSLATIONS.spc_trans.pls_ent_am);
    }
  } else {
    if (hint === "name") {
      showSweetAlert(TRANSLATIONS.spc_trans.ent_nm);
    } else {
      showSweetAlert(TRANSLATIONS.spc_trans.ent_em);
    }
  }
}

function transfer(cur_type, hint, nameOrEmail, amount) {
  let _url;
  if (hint === "name") {
    _url = "/transfer/toname";
  } else {
    _url = "/transfer/toemail";
  }

  let transfer_currency = () => {
    $.ajax({
      type: "POST",
      url: _url,
      data: {
        cur_type: cur_type,
        nameOrEmail: nameOrEmail,
        amount: amount,
      },
      dataType: "json",
      timeout: 5000,
      success: function (response) {
        if (response.success) {
          common.showSpinnerData(
            TRANSLATIONS.dn,
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
              TRANSLATIONS.sn_wr,
              TRANSLATIONS.op_sr,
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
              TRANSLATIONS.wrn,
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
          TRANSLATIONS.sn_wr,
          TRANSLATIONS.op_sr,
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

  common.manipulateAjax(transfer_currency);
}

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
    confirmButtonText: TRANSLATIONS.ok,
    width: "250px",
    background: "#800000",
    color: "#ffffff",
    iconColor: "#000000",
    timer: 10000,
    allowEscapeKey: true,
    confirmButtonColor: "#000000",
  });
}

async function getCookie(name) {
  return (document.cookie.match(
    "(?:^|;)\\s*" + name.trim() + "\\s*=\\s*([^;]*?)\\s*(?:;|$)"
  ) || [])[1];
}

async function fetchTranslationsFor(locale) {
  const response = await fetch(`/static-files-lang/${locale}.json`);
  return await response.json();
}
