import * as common from "./common.js";
$(document).ready(function () {
  
  $(".sn").click(function (e) {
    e.stopPropagation();
    $(".nav-items").toggleClass("show");
  });

  //--------- close .nav-items on any click outside -------
  $(document).click(function (event) {
    if (!$(event.target).is(".sn") && !$(event.target).is(".nav-items")) {
      if ($(".nav-items").hasClass("show")) {
        $(".nav-items").removeClass("show");
      }
    }
  });
  //--------------------------------------------------------------

  $(".logout").click(function (e) {
    e.preventDefault();

    let $to_show = $(`
      <h3 class='cnf_logout_h'>are you sure you want to leave ?</h3>
      <div class='lgt_btns'>
        <button class='cnf_logout_btn'>leave</button>
        <button class='cancel_logout_btn'>no</button>
      </div>
    `);
    common.showCustomLogoutDialog($to_show);
  });

});
