var mb = (function(my, $) {

  $(function() {
    $('#action').click(function() {
      var anchor = document.createElement('a');
      var url = $('#url_input').val();
      anchor.href = url;
      $(this).toggleClass('loading disabled');
      // get markup from arbitrary domains, side-stepping same-orig
      // restriction by using jsonp
      $.ajax({
        data: { 
                get: 'markup',
        url: url 
              },
        dataType: 'json',
      }).done(renderMarkup(anchor));
    });
  });

  function renderMarkup(anchor) {
    return function(markup) {
      window.location = 'main/dashboard';
    }}

  return my;

}(mb || {}, jQuery));
