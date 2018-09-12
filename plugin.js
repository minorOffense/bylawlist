CKEDITOR.plugins.add('bylawlist', {
  onLoad: function () {
    CKEDITOR.addCss(
      'ol.bylawlist{list-style-type:none;list-style-position:inside;padding-left:1.5em}ol.bylawlist>li>ol,ol.bylawlist>li>ol>li>ol{list-style-type:inherit}ol.bylawlist li{counter-increment:bylawlist-counter}ol.bylawlist li:first-child{counter-reset:bylawlist-counter}ol.bylawlist>li:before{content:"(" counter(bylawlist-counter,decimal) ") "}ol.bylawlist>li>ol>li:before{content:"(" counter(bylawlist-counter,lower-alpha) ") "}ol.bylawlist>li>ol>li>ol>li:before{content:"(" counter(bylawlist-counter,lower-roman) ") "}ol.bylawlist>li>ol>li>ol>li>ol{list-style-type:decimal}ol.bylawlist>li>ol>li>ol>li>ol>li:before{content:none}'
    );
  },
  icons: 'bylawlist', // Bylaw List icon
  init: function (editor) {
    editor.addCommand('insertBylawlist', {
      exec: function (editor) {
        if ('li' == editor.getSelection().getStartElement().getName()) {
          if ('OL' == editor.getSelection().getStartElement().$.parentNode.nodeName) {
            var bylaw = editor.getSelection().getStartElement().$.parentNode;

            if (bylaw.className.indexOf("bylawlist") < 0) {
              bylaw.className += "bylawlist";
            } else {
              bylaw.className = "";
            }
          }
        }
      }
    });

    editor.ui.addButton('Bylawlist', {
      label: 'Add Bylawlist',
      command: 'insertBylawlist',
      toolbar: 'insert'
    });

    var format = {
      'element': 'Bylawlist'
    };

    var style = new CKEDITOR.style(format);

    editor.attachStyleStateChange(style, function (state) {
      !editor.readOnly && editor.getCommand('insertBylawlist').setState(state);
    });
    editor.on('contentDom', function () {
      /**
       * Updates all list starting points.
       *
       * @param {object} obj the list object.
       */
      function updateList(obj) {
        jQuery(obj).find('li').first().css('counter-reset', 'bylawlist-counter ' + (jQuery(obj).attr('start') - 1));
      }

      const target = editor.document.findOne('body').$;

      jQuery(target).find('ol[start]').each(function (index, obj) {
        updateList(obj);
      });

      const options = {
        attributeFilter: ['start'],
        subtree: true
      };

      const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          updateList(mutation.target);
        });
      });

      observer.observe(target, options);
    });
  }
});
