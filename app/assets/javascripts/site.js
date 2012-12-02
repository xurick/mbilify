$(function() {
  $('a[id*="theme"]').click(function() {
    changeTheme(this.id.substr(5).toLowerCase());
  });
});

function changeTheme(theme) {
  var foo = $('.preview').contents().find('#home'); 

  //reset all the buttons, header/footer and page widgets
  var button = foo.find('.ui-btn');
  var headfoot = foo.find('.ui-header, .ui-footer');

  $.each(['a','b','c','d','e','f','g','h','i','j','k'], function() {
    button.removeClass('ui-btn-up-'+this, 'ui-btn-hover-'+this);
    headfoot.removeClass('ui-bar-'+this);
    foo.removeClass('ui-body-'+this);
  });

  button.addClass('ui-btn-up-' + theme).attr('data-theme', theme);
  headfoot.addClass('ui-bar-' + theme).attr('data-theme', theme);
  foo.addClass('ui-body-' + theme).attr('data-theme', theme);
}
