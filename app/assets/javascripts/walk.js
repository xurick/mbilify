var mb = (function(my, $) {

  var SMALL_IMG_WIDTH = 50;
  var SMALL_IMG_HEIGHT = 50;
  var cssToKeep = ['width','font','color','list-style','display','background'];
  var attribsToIgnore = {
    'align':/left|right/, //removing left/right aligning attributes
    'onload':null, //ridding any onload JSs, e.g. dreamweaver's MM_preloadImages
    'onmouseout':null,
    'onmouseover':null,
  };
  var sliderNamePat = /slider|slideshow|rotator/i;

  function walk(node) {

    // make a shallow copy of orig node
    var cloned;
    var nodeName = node.nodeName.toLowerCase();

    // should we ignore this node?
    if(mb.util.isIgnorable(node)) return null;

    // does this DIV house a slider?
    if(sliderNamePat.test(node.className) || sliderNamePat.test(node.id))
      return mb.util.extractSliderImg(node);

    // disregard fixed positioning elements
    if($(node).css('position')=='fixed') {
      return null;
    }

    // only allow FB iframe
    //if(nodeName=='iframe') {
    //if($(node).attr('src').indexOf('facebook.com')==-1)
    //return null;
    //}

    if(nodeName == 'body')
      cloned = $('<div />', { class:'body' }).get(0);
    else
      cloned = node.cloneNode(false);

    if(node.nodeType == 1) { 

      // prune attributes
      $.each(attribsToIgnore, function(attr, regex) {
        var origVal = cloned.getAttribute(attr);
        if(origVal) {
          if(regex && regex.test(origVal)) cloned.removeAttribute(attr);
          else if(!regex) cloned.removeAttribute(attr);
        }
      });

      // if <img>, then either center it or keep orig props
      if( (nodeName=='img') 
          || (nodeName=='input'&& $(node).attr('type')=='image') ) {

        mb.util.convertRelativeUrlToAbsolute(cloned);

        // if image w h ratio is out of wack, don't use it
        if( (node.width / node.height > 20) ||
            (node.height / node.width > 20) )
          return null;

        if(node.width < SMALL_IMG_WIDTH && node.height < SMALL_IMG_HEIGHT) {
          $(cloned).addClass('smallImg');
        }
        else {
          $(cloned).removeAttr('width');
          $(cloned).removeAttr('height');
        }
      }

      // deal with CSS properties
      else {

        // float: unset 'float' if it is specified through inline styles
        // note: for smaller element, we still want to keep 'float'
        if($(cloned).css('float') != 'none') {
          if($(cloned).width() > 100) // only applies to bigger element
            $(cloned).css('float', 'none');
        }

        // color: inherit
        var colorVal = $(node).css('color');
        if(colorVal != $(node.parentNode).css('color')) {
          $(cloned).css('color', colorVal);
        }

        // font: inherit
        var fontVal = $(node).css('font');
        if(fontVal != $(node.parentNode).css('font')) {
          $(cloned).css('font', fontVal);
        }

        // bg images
        if(nodeName == 'body') {
          var bgImageVal = $(node).css('background-image');
          if( (bgImageVal!='none' && bgImageVal!='') || bgColorVal!='rgba(0, 0, 0, 0)') {
            if(bgImageVal!='none' && bgImageVal!='') {
              // if image w h ratio is out of wack, don't use it
              var imageUrl = mb.util.extractUrl(bgImageVal);
              var size = mb.util.getImageSize(imageUrl);
              if( !size ||
                  (size.width / size.height > 50) ||
                  (size.height / size.width > 50) )
                $(cloned).css('background-image', 'none');
            }

            $(cloned).css('background-image', $(node).css('background-image'));
            $(cloned).css('background-repeat', $(node).css('background-repeat'));
          }
        }

        // background-color: no inherit
        var bgColorVal = $(node).css('background-color');
        if( (bgColorVal != 'rgba(0, 0, 0, 0)') 
            //&& (nodeName != 'body') 
          ) {
          $(cloned).css('background-color', $(node).css('background-color'));
        }

        // display: no inherit
        //var displayVal = $(node).css('display');
        //if(displayVal != 'inline') {
        //$(cloned).css('display', displayVal);
        //}

        // width: no inherit
        if(nodeName != 'body') {
          var widthVal = $(node).width();
          // 87.5% of 320
          if(widthVal>300 || nodeName=='input') {
            $(cloned).removeAttr('width','');
            $(cloned).removeAttr('height','');
            $(cloned).css('width','300px');
            $(cloned).css('height','auto');
          } else {
            $(cloned).css('width', widthVal);
          }
        }
      }

    } 
    else if(node.nodeType == 3) {
      if(node.nodeValue.indexOf('_____') != -1) {
        cloned = document.createElement('hr');
      }
    }

    node = node.firstChild;

    // special treatment for <cufon>
    if ( node && (node.nodeType == 1) && (node.nodeName.toLowerCase() == 'cufon') ) {
      var str = $(node).text() + $(node).siblings().text();
      cloned.appendChild(document.createTextNode(str));
      return cloned
    }

    while(node) {
      var clonedChild = walk(node);
      if (clonedChild) cloned.appendChild(clonedChild);
      node = node.nextSibling;
    }
    // extra check here to prune the node if it's an empty node
    if(cloned.nodeType==1 && mb.util.isEmptyNode(cloned)) 
      return null
    else return cloned

  }

  my.mobilize = function(dtBody) {

    var mobilePage = {};

    var logo = mb.util.findLogo(dtBody);
    var $clonedLogo;

    if(logo) {
      $(logo).addClass('ignore'); // do not process already extracted logos

      $clonedLogo = $(logo).clone();
      mb.util.convertRelativeUrlToAbsolute($clonedLogo.get(0));
      var size;

      if($clonedLogo.is('img')) {
        size = mb.util.getImageSize(logo.src);
      }

      if( (size && (size.width<10 || size.height<10)) || !$clonedLogo.is('img')) {
        $clonedLogo = $('<img />', {
          src:mb.util.extractUrl($(logo).css('background-image'))
        });
      }

      $clonedLogo.attr('id','logo').wrap("<div class='logoWrapper' />");
      $clonedLogo.removeAttr('width').removeAttr('height');

      var color = mb.util.findBgColor(logo);
      if(color != '')
        $clonedLogo.parent().css('background-color', color);
    }

    mobilePage.logo = $clonedLogo.parent()[0].outerHTML;

    var navMenu = mb.util.findNav(dtBody);

    mobilePage.menu = navMenu;

    var content = walk(dtBody);

    // convert table into divs
    $(content).find('table').each(mb.util.table2div);

    // hiding all sub-level <ul> used for hovers
    // temp solution - what's the menu story?
    $(content).find('li>ul').css('display','none');

    $(content).addClass('mdContent');

    // turn relative path into absolute ones
    $('img').each(function() { this.src = this.src; });

    mobilePage.content = content.outerHTML;

    return mobilePage;
  }


  return my;
}(mb || {}, jQuery));
