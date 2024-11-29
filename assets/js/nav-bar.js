$(document).ready(function () {
  $(".sn").click(function (e) {
    e.stopPropagation()
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

  $('.logout').click(function (e) { 
    e.preventDefault();
    
    $to_show = $(/*html*/`
      
      
    `)
    // alert('hhhhh')
  });
});
