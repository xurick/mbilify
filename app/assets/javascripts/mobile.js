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
});
