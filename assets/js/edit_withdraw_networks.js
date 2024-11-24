import * as common from "./common.js";

$(document).ready(function () {
  
  $("#nav-item-edit_withdraw_networks").css({
    "background-color": "black",
  });

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

  let $add_net_form = $("#add_network_form");
  let $edit_net_form = $("#edit_network_form");
  let $network = $(".network");
  let $remove_network = $(".remove_network");
  // be care there are many of this $add_net_btn with same class
  // so to be specific when dealing with him we use $(this)  to be more specific
  let $add_net_btn = $(".add_network_btn");

  $add_net_form.on($.modal.CLOSE, function (event, modal) {
    $(this).children("input").val("");
  });
  $edit_net_form.on($.modal.CLOSE, function (event, modal) {
    $(this).children("input").val("");
  });

  /*=============== add network ==================== */

  $add_net_btn.on("click", function (e) {
    let cur_type = $(this).siblings(".hidden_cur_type").html();
    $add_net_form.children("input[name = cur_type]").val(cur_type);

    $add_net_form.modal({
      fadeDuration: 500,
    });
  });

  $add_net_form.on("submit", function (e) {
    e.preventDefault();

    let self = $(this);
    let $parent_to_be_appended_to = $(
      `.content.${$add_net_form.children("input[name = cur_type]").val()}`
    );

    let add_withdraw_net = () => {
      $.ajax({
        type: "POST",
        url: "/networks/add_withdraw_network",
        data: self.serialize(),
        dataType: "json",
        timeout: 5000,
        success: function (response) {
          //-------------- close jquery-modal -------------------
          $.modal.close();
          //------------------------------------------------------

          if (response.success) {
            let $newly_added = $(response.data);
            $newly_added
              .hide()
              .appendTo($parent_to_be_appended_to)
              .show(() => {
                common.showSpinnerData(
                  "Done",
                  "added successfully",
                  "black",
                  "green",
                  true,
                  false,
                  false,
                  null,
                  null
                );
              });
            //+++++++++++++ register events ++++++++++++++++
            $newly_added.click(function (e) {
              networkClickEvent(e);
            });
            $newly_added.children(".remove_network").click(function (e) {
              removeNetworkClickEvent(e);
            });
            //+++++++++++++++++++++++++++++++++++++++++++++++
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

    common.manipulateAjax(add_withdraw_net);
  });
  /*================================================== */
  /*=============== edit network ==================== */
  $network.on("click", async function (e) {
    networkClickEvent(e);
  });

  $edit_net_form.on("submit", function (e) {
    e.preventDefault();

    let self = $(this);
    let id = $(this).children("input[name = 'id']").val();

    let $element_to_be_replaced = $(
      `.content.${$edit_net_form.children("input[name = cur_type]").val()}`
    )
      .find(`span.hidden_network_id:contains(${id})`)
      .parent(".network");

    let edit_withdraw_net = () => {
      $.ajax({
        type: "PUT",
        url: "/networks/edit_withdraw_network",
        data: self.serialize(),
        dataType: "json",
        timeout: 5000,
        success: function (response) {
          //-------------- close jquery-modal -------------------
          $.modal.close();
          //------------------------------------------------------

          if (response.success) {
            let $updated_one = $(response.data);
            $element_to_be_replaced.hide().replaceWith($updated_one).show();

            common.showSpinnerData(
              "Done",
              "added successfully",
              "black",
              "green",
              true,
              false,
              false,
              null,
              null
            );

            //+++++++++++++ register events ++++++++++++++++
            $updated_one.click(function (e) {
              networkClickEvent(e);
            });
            $updated_one.children(".remove_network").click(function (e) {
              removeNetworkClickEvent(e);
            });
            //+++++++++++++++++++++++++++++++++++++++++++++++
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

    common.manipulateAjax(edit_withdraw_net);
  });
  /*=============== remove network ==================== */

  $remove_network.on("click", async function (e) {
    removeNetworkClickEvent(e);
  });

  /*================================================== */
  /*====================== [ excludeSpanText ] ======================= */

  async function excludeSpanText(elem) {
    return $(elem).clone().children("span").remove().end().text().trim();
  }
  /*======================== [ clickEvents ] ========================== */
  async function networkClickEvent(e) {
    let _this = e.target;

    let id = $(_this).children(".hidden_network_id").html().trim(),
      cur_type = $(_this).siblings(".hidden_cur_type").html().trim(),
      name = await excludeSpanText($(_this).children(".name")),
      fee = await excludeSpanText($(_this).children(".fee")),
      minimum_withdrawal = await excludeSpanText(
        $(_this).children(".minimum_withdrawal")
      ),
      arrival_time = await excludeSpanText($(_this).children(".arrival_time"));

    $edit_net_form.children("input[name = id]").val(id);
    $edit_net_form.children("input[name = cur_type]").val(cur_type);
    $edit_net_form.children("input[name = name]").val(name);
    $edit_net_form.children("input[name = fee]").val(fee);
    $edit_net_form
      .children("input[name = minimum_withdrawal]")
      .val(minimum_withdrawal);

    if ($(_this).has(".arrival_time")) {
      $edit_net_form.children("input[name = arrival_time]").val(arrival_time);
    }

    $edit_net_form.modal({
      fadeDuration: 500,
    });
  }

  async function removeNetworkClickEvent(e) {
    e.stopPropagation();
    let _this = e.target;

    let name = await excludeSpanText($(_this).siblings(".name"));
    let id = $(_this).siblings(".hidden_network_id").html();
    let cur_type = $(_this)
      .parent(".network")
      .siblings(".hidden_cur_type")
      .html();
    let $network_to_delete = $(_this).parent(".network");

    let delete_withdraw_net = () => {
      $.ajax({
        type: "DELETE",
        url: "/networks/delete_withdraw_network",
        data: { cur_type: cur_type, id: id },
        dataType: "json",
        timeout: 5000,
        success: function (response) {
          if (response.success) {
            $network_to_delete.hide().remove();
          } else {
            window.alert(`Error while deleting… ${response.msg}`);
          }
        },
        error: function (xhr, status, error) {
          console.log(xhr.responseText);
          window.alert(`Error while deleting… ${xhr.responseText}`);
        },
      });
    };

    if (window.confirm(`Are you sure? you want to delete : ${name}`)) {
      delete_withdraw_net();
    }
  }
  /*================================================== */

  /*======================== [ copyEvents ] ========================== */
  /* 
  $.fn.copyEvents = function (to, filter) {
    var to = to.jquery ? to : jQuery(to);
    var filter = filter ? filter.split(" ") : null;
    var events =
      this[0].events ||
      jQuery.data(this[0], "events") ||
      jQuery._data(this[0], "events");

    return this.each(function () {
      if (!to.length || !events) {
        return;
      }

      $.each(events, function (eventType, eventArray) {
        $.each(eventArray, function (index, event) {
          var eventToBind =
            event.namespace.length > 0
              ? event.type + "." + event.namespace
              : event.type;
          if (filter && $.inArray(eventToBind, filter) == -1) {
            return true;
          }
          to.bind(eventToBind, event.data, event.handler);
        });
      });
    });
  };
 
  //------ [usage of copy events] --------------
  // Add some events to a element
  $("#element").click(function () {});
  $("#element").dblclick(function () {});
  $("#element").change(function () {});

  // Default usage, copy *all* events from one element to another
  $("#element").copyEvents("#another-element");

  // ... or you can copy only specific event types
  $("#element").copyEvents("#another-element", "change click");
  */
  /*================================================== */
});
