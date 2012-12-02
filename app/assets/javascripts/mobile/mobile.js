var defaultBgColor = 'white';

$(document).delegate('.ui-page', 'pageinit', function () {

  // setting background for the entire page
  var bgcolor = $('.mdContent').css('background-color');
  if(bgcolor != 'transparent') {
    $(this).css('background', bgcolor); //'this' refers to '.ui-page'
  }
  else {
    $(this).css('background', defaultBgColor);
  }
  
  $.mobile.defaultPageTransition = "slide";

  $('img').error(function() {
    this.style.display = 'none';
  });

});

//$(document).ready(function () {
    //edit_page();
//});

function edit_page() {
    var count = 1;
    var height = 10;
    $('#primary').children().each(function () {
        $(this).attr("id", "drag" + count);
        $(this).attr("draggable", "true");
        $(this).attr("ondragstart", "drag(event)");
        count++;

        $(this).css("position", "absolute");
        $(this).css("top", height);
        $(this).css("left", 50);
        var increment = parsePixels($(this).css("height")) + 10;
        height += increment;
    });

    $('#primary').css("height", height);
}

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
