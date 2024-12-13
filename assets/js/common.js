/*######### Global Variables ############*/

export const INPUT_RULES = {
  name_email_maxLength: 100,
  key_maxLength: 50,
  pass_minLength: 8,
  pass_maxLength: 50,
};
export const LOCAL_STORAGE_CONSTANTS = {
  otp_email: "otp_email",
};

export const REDIRECT_TYPE = {
  href: "href",
  replace: "replace",
};

/*#########  Tiker ############*/

export const TikerStuff = () => {
  var btc = $(".btc");
  var btc_perc = $(".btc_perc");
  var ltc = $(".ltc");
  var ltc_perc = $(".ltc_perc");
  var doge = $(".doge");
  var doge_perc = $(".doge_perc");
  var xrp = $(".xrp");
  var xrp_perc = $(".xrp_perc");
  var bnb = $(".bnb");
  var bnb_perc = $(".bnb_perc");
  var eth = $(".eth");
  var eth_perc = $(".eth_perc");
  var sol = $(".sol");
  var sol_perc = $(".sol_perc");
  var usdc = $(".usdc");
  var usdc_perc = $(".usdc_perc");
  var trx = $(".trx");
  var trx_perc = $(".trx_perc");

  const host = location.origin.replace(/^https?/, "wss");
  const ws = new ReconnectingWebSocket(host);
  ws.onmessage = (message) => {
    let msg = JSON.parse(message.data);
    let s = msg.s;
    let c = msg.c;

    switch (s) {
      case "BTCUSDT":
        manipulateColor(btc, btc_perc, c);
        break;
      case "ETHUSDT":
        manipulateColor(eth, eth_perc, c);
        break;
      case "BNBUSDT":
        manipulateColor(bnb, bnb_perc, c);
        break;
      case "SOLUSDT":
        manipulateColor(sol, sol_perc, c);
        break;
      case "XRPUSDT":
        manipulateColor(xrp, xrp_perc, c);
        break;
      case "LTCUSDT":
        manipulateColor(ltc, ltc_perc, c);
        break;
      case "DOGEUSDT":
        manipulateColor(doge, doge_perc, c);
        break;
      case "TRXUSDT":
        manipulateColor(trx, trx_perc, c);
        break;
      case "USDCUSDT":
        manipulateColor(usdc, usdc_perc, c);
        break;
      default:
    }
  };

  function manipulateColor(val, perc, prc) {
    if ($(val).html() === "0000.00") {
      $(val).html(prc);
    } else {
      var diff = parseFloat(prc) - parseFloat($(val).html());
      var percent = ((diff / parseFloat(prc)) * 100)
        .toString()
        .match(/^-?\d+(?:\.\d{0,3})?/)[0];

      if (diff > 0) {
        $(val).html(prc);
        $(val)
          .addClass("green")
          .one("animationend", function (e) {
            $(this).removeClass("green");
          });

        $(perc)
          .html("+ " + percent + " %")
          .css({
            color: "#12976b",
          });
      } else if (diff < 0) {
        $(val).html(prc);
        $(val)
          .addClass("red")
          .one("animationend", function (e) {
            $(this).removeClass("red");
          });

        $(perc)
          .html(percent + " %")
          .css({
            color: "#ff4e4e",
          });
      }
    }
  }
};

/*======================  Spinner modal  =========================*/

export function manipulateAjax(ajaxFunction) {
  $(
    `<div class='loader'><div class='spin_wrap'><div class='spinner'><div class='rect1'></div><div class='rect2'></div><div class='rect3'></div><div class='rect4'></div><div class='rect5'></div></div></div></div>`
  )
    .hide()
    .appendTo("body")
    .fadeIn(500, function () {
      setTimeout(() => {
        ajaxFunction();
      }, 2000);
    });
}

export function showCustomLogoutDialog($dialog_to_show) {
  $("<div class='loader'><div class='spin_wrap'></div></div>")
    .hide()
    .appendTo("body")
    .fadeIn(500, function () {
      $dialog_to_show.hide().appendTo(".spin_wrap").show(500);
      $(".loader").on("click", function (e) {
        if (e.target !== e.currentTarget) return;
        $(".loader").fadeOut(500, function () {
          $(this).remove();
        });
      });

      $(".cancel_logout_btn").click(function (e) {
        $(".loader").fadeOut(500, function () {
          $(this).remove();
        });
      });

      $(".cnf_logout_btn").click(function (e) {
        $(".loader").fadeOut(500, function () {
          $(this).remove();

          window.location.href = "/logout";
        });
      });
    });
}

export function showSpinnerData(
  h2_text,
  p_text,
  h2_color,
  p_color,
  isClosable,
  willReload,
  willRedirect,
  redirectUrl,
  redirectType
) {
  $(".spinner").children().css("animation-play-state", "paused"); // pause spinner animation
  $(".spinner").animate({ height: 0 }, 500, function () {
    $(this).remove(); // remove the spinner only
    let icon = $(`<img src="/coin.png" alt="BTDinance"/>`);
    let h2 = $(`<h2 class = 'spinner_h2'>${h2_text}</h2>`);
    let p = $(`<p class = 'spinner_p'>${p_text}</p>`);
    h2.css({ color: h2_color });
    p.css({ color: p_color });
    icon.hide().appendTo(".spin_wrap").show(500);
    h2.hide().appendTo(".spin_wrap").show(500);
    p.hide().appendTo(".spin_wrap").show(500);
  });

  if (isClosable) {
    $(".loader").on("click", function (e) {
      if (e.target !== e.currentTarget) return;
      $(".loader").fadeOut(500, function () {
        $(this).remove();
      });
    });
  } else {
    setTimeout(function () {
      $(".loader").fadeOut(500, function () {
        $(this).remove();
      });
      setTimeout(function () {
        if (willReload) {
          window.location.reload();
        } else if (willRedirect) {
          switch (redirectType) {
            case REDIRECT_TYPE.href:
              window.location.href = redirectUrl;
              break;
            case REDIRECT_TYPE.replace:
              window.location.replace(redirectUrl);
              break;
          }
        } else {
          return; // do nothing
        }
      }, 500);
    }, 4000);
  }
}

export function showSpinnerDataDepositAddress(
  h2_text,
  p_text,
  h2_color,
  p_color,
  isClosable,
  willReload,
  willRedirect,
  redirectUrl,
  redirectType
) {
  $(".spinner").children().css("animation-play-state", "paused"); // pause spinner animation
  $(".spinner").animate({ height: 0 }, 500, function () {
    $(this).remove(); // remove the spinner only
    let icon = $(`<img src="/coin.png" alt="BTDinance"/>`);
    let h2 = $(`<h2 class = 'spinner_h2'>${h2_text}</h2>`);
    let p = $(
      `<p class = 'spinner_p deposit_address'>${p_text}<button id="copy_deposit_address_btn"><img src="/copy.png"/></button></p>`
    );
    h2.css({ color: h2_color });
    p.css({ color: p_color });
    icon.hide().appendTo(".spin_wrap").show(500);
    h2.hide().appendTo(".spin_wrap").show(500);
    p.hide().appendTo(".spin_wrap").show(500);
  });

  if (isClosable) {
    $(".loader").on("click", function (e) {
      if (e.target !== e.currentTarget) return;
      $(".loader").fadeOut(500, function () {
        $(this).remove();
      });
    });
  } else {
    setTimeout(function () {
      $(".loader").fadeOut(500, function () {
        $(this).remove();
      });
      setTimeout(function () {
        if (willReload) {
          window.location.reload();
        } else if (willRedirect) {
          switch (redirectType) {
            case REDIRECT_TYPE.href:
              window.location.href = redirectUrl;
              break;
            case REDIRECT_TYPE.replace:
              window.location.replace(redirectUrl);
              break;
          }
        } else {
          return; // do nothing
        }
      }, 500);
    }, 4000);
  }

  $(document).on("click", "#copy_deposit_address_btn", function (e) {
    e.preventDefault();
    navigator.clipboard
      .writeText($(".deposit_address").text().toString())
      .then(() => {
        $("#snackbar").addClass("show");

        setTimeout(() => {
          $("#snackbar").removeClass("show");
        }, 2000);
      });
  });
}

export function showSpinnerDataUpgradeVip(
  h2_text,
  p_text,
  h2_color,
  p_color,
  btn_upg,
  isClosable,
  willReload,
  willRedirect,
  redirectUrl,
  redirectType
) {
  $(".spinner").children().css("animation-play-state", "paused"); // pause spinner animation
  $(".spinner").animate({ height: 0 }, 500, function () {
    $(this).remove(); // remove the spinner only
    let icon = $(`<img src="/coin.png" alt="BTDinance"/>`);
    let h2 = $(`<h2 class = 'spinner_h2'>${h2_text}</h2>`);
    let p = $(`<p class = 'spinner_p'>${p_text}</p>`);
    let a = $(`<a href='/upgrade' class = 'spinner_a'>${btn_upg}</a>`);

    h2.css({ color: h2_color });
    p.css({ color: p_color });
    icon.hide().appendTo(".spin_wrap").show(500);
    h2.hide().appendTo(".spin_wrap").show(500);
    p.hide().appendTo(".spin_wrap").show(500);
    a.hide().appendTo(".spin_wrap").show(500);
  });

  if (isClosable) {
    $(".loader").on("click", function (e) {
      if (e.target !== e.currentTarget) return;
      $(".loader").fadeOut(500, function () {
        $(this).remove();
      });
    });
  } else {
    setTimeout(function () {
      $(".loader").fadeOut(500, function () {
        $(this).remove();
      });
      setTimeout(function () {
        if (willReload) {
          window.location.reload();
        } else if (willRedirect) {
          switch (redirectType) {
            case REDIRECT_TYPE.href:
              window.location.href = redirectUrl;
              break;
            case REDIRECT_TYPE.replace:
              window.location.replace(redirectUrl);
              break;
          }
        } else {
          return; // do nothing
        }
      }, 500);
    }, 4000);
  }
}

export function showSpinnerDataVipPay(
  h2_text,
  p_text,
  h2_color,
  p_color,
  amount,
  cur_type,
  network_name
) {
  $(".spinner").children().css("animation-play-state", "paused"); // pause spinner animation
  $(".spinner").animate({ height: 0 }, 500, function () {
    $(this).remove(); // remove the spinner only
    let $icon = $(`<img src="/coin.png" alt="BTDinance"/>`);
    let $spinner_h2 = $(`<h2 class = 'spinner_h2'>${h2_text}</h2>`);
    let $spinner_p = $(
      `<p class = 'spinner_p deposit_address'>${p_text}<button id="copy_deposit_address_btn"><img src="/copy.png"/></button></p>`
    );

    let $amount_div = $(
      `<div class='amount_div'><span class='pre_span'>Amount : </span><span class='amount'>${amount}</span><span class='post_span'>${cur_type}</span></div>`
    );
    let $net_name = $(
      `<span class='network_name'><span class='pre_span'>Network : </span>${network_name}</span>`
    );

    $spinner_h2.css({
      color: h2_color,
    });

    $spinner_p.css({
      color: p_color,
    });

    // all css to be in style css

    $icon.hide().appendTo(".spin_wrap").show(500);
    $spinner_h2.hide().appendTo(".spin_wrap").show(500);
    $spinner_p.hide().appendTo(".spin_wrap").show(500);
    $amount_div.hide().appendTo(".spin_wrap").show(500);
    $net_name.hide().appendTo(".spin_wrap").show(500);
  });

  $(".loader").on("click", function (e) {
    if (e.target !== e.currentTarget) return;
    $(".loader").fadeOut(500, function () {
      $(this).remove();
    });
  });

  $(document).on("click", "#copy_deposit_address_btn", function (e) {
    e.preventDefault();
    navigator.clipboard
      .writeText($(".deposit_address").text().toString())
      .then(() => {
        $("#snackbar").addClass("show");

        setTimeout(() => {
          $("#snackbar").removeClass("show");
        }, 2000);
      });
  });
}

export function showSpinnerDataLongTime(
  h2_text,
  p_text,
  h2_color,
  p_color,
  isClosable,
  willReload,
  willRedirect,
  redirectUrl,
  redirectType
) {
  $(".spinner").children().css("animation-play-state", "paused"); // pause spinner animation
  $(".spinner").animate({ height: 0 }, 500, function () {
    $(this).remove(); // remove the spinner only
    let icon = $(`<img src="/coin.png" alt="BTDinance"/>`);
    let h2 = $(`<h2 class = 'spinner_h2'>${h2_text}</h2>`);
    let p = $(`<p class = 'spinner_p'>${p_text}</p>`);
    h2.css({ color: h2_color });
    p.css({ color: p_color });
    icon.hide().appendTo(".spin_wrap").show(500);
    h2.hide().appendTo(".spin_wrap").show(500);
    p.hide().appendTo(".spin_wrap").show(500);
  });

  if (isClosable) {
    $(".loader").on("click", function (e) {
      if (e.target !== e.currentTarget) return;
      $(".loader").fadeOut(500, function () {
        $(this).remove();
      });
    });
  } else {
    setTimeout(function () {
      $(".loader").fadeOut(500, function () {
        $(this).remove();
      });
      setTimeout(function () {
        if (willReload) {
          window.location.reload();
        } else if (willRedirect) {
          switch (redirectType) {
            case REDIRECT_TYPE.href:
              window.location.href = redirectUrl;
              break;
            case REDIRECT_TYPE.replace:
              window.location.replace(redirectUrl);
              break;
          }
        } else {
          return; // do nothing
        }
      }, 500);
    }, 9000);
  }
}
export const EXCHANGE_TO_FIXED = 3;
/*===========================================*/
