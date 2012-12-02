// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function () {
    var count = 1;
    $('#primary').find('img, a, ul').each(function () {
        $(this).attr("id", "drag" + count);
        $(this).attr("draggable", "true");
        $(this).attr("ondragstart", "drag(event)");
        count++;
    });

    var height = 0;
    $('#primary').children().each(function () {
        $(this).css("position", "absolute");
        $(this).css("top", height);
        $(this).css("left", 15);
        var increment = parsePixels($(this).css("height"));
        height += increment + 10;
    });
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
    ev.dataTransfer.setData("X", ev.clientX);
    ev.dataTransfer.setData("Y", ev.clientY);
}

function drop(ev) {
    var data = ev.dataTransfer.getData("Text");
    var originX = ev.dataTransfer.getData("X");
    var destX = ev.clientX;
    var originY = ev.dataTransfer.getData("Y");
    var destY = ev.clientY;

    var offsetX = originX - destX;
    var offsetY = originY - destY;

    var item = $('#' + data);
    var itemLeft = parsePixels(item.css("left"));
    var itemTop = parsePixels(item.css("top"));
    var itemWidth = parsePixels(item.css("width"));
    var itemHeight = parsePixels(item.css("height"));

    var newX = itemLeft - offsetX;
    var newY = itemTop - offsetY;

    var containerWidth = parsePixels($('#primary').css('width'));
    var containerHeight = parsePixels($('#primary').css('height'));

    if (newX + itemWidth > containerWidth || newX < 0 || newY + itemHeight > containerHeight || newY < 0) {
        alert("Must drag item within the box");
    } else {
        item.css("left", newX);
        item.css("top", newY);
    }

    ev.preventDefault();
}

function parsePixels(str) {
    var numStr = str.split("px");
    return parseInt(numStr);
}

$(function () {

    $("#url_input").change(function () {
        var x = $("#url_input").val();
        //alert(x);
        var y = x.substring(11, x.length - 4);
        //alert(y);
        var z = escape("assets/") + y + ".jpg";
        //alert(z);
        $("#websitethumbnail").attr("src", z);
        $("#mobilethumbnail").attr("src", z);
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
