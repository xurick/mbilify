// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(function () {

    $("#url_input").change(function () {
        var x = $("#url_input").val();
        //alert(x);
        var y = x.substring(11, x.length - 4);
        //alert(y);
        var z = escape("assets/") + y + ".jpg";
        //alert(z);
        $("#websitethumbnail").attr("src", z);
    }
    );
    $("#action").click(function () {
        var x = $("#url_input").val();
        //alert(x);
        var y = x.substring(11, x.length - 4);
        //alert(y);
        var z = escape("assets/") + y + ".jpg";
        //var z = y + ".jpg";

        //alert(z);
        $("#websitethumbnail").attr("src", z);
    }
    );
});
