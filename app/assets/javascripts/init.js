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
      if(markup == '') {
        window.location = 'main/dashboard';
      }
      else {
        var pat = /<head(.*?)>/gi,
          match = pat.exec(markup);

        markup = markup.replace(pat, '<head ' +
            match[1] +
            '><base href=\'' +
            anchor.protocol +
            '//' +
            anchor.hostname +
            anchor.pathname + '\'  />');

        var desktopFrame = document.createElement('iframe');
        $(desktopFrame).addClass('preview hidden');
        $('.desktop .screen').append(desktopFrame);
        var desktopDoc = desktopFrame.contentWindow.document;
        desktopDoc.open();
        $(desktopFrame).load(function() {
          var mobilePage = mb.mobilize(desktopDoc.body);
          mobilePage.url = anchor.href;

          $.post('site/create', mobilePage, function() {
            desktopFrame.parentNode.removeChild(desktopFrame);
            window.location = 'main/dashboard';
          });
        });

        desktopDoc.write(markup);
        desktopDoc.close();
      }

    }
  }

return my;

}(mb || {}, jQuery));
