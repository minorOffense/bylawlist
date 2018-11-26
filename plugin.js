CKEDITOR.plugins.add( 'bylawlist', {
  onLoad: function() {
    CKEDITOR.addCss(
      'ol.bylawlist{list-style-type:none;list-style-position:inside;padding-left:1.5em}ol.bylawlist li{counter-increment:bylawlist-counter !important}ol.bylawlist li:first-child{counter-reset:bylawlist-counter}ol.bylawlist>li:before{content:"(" counter(bylawlist-counter,decimal) ") " !important}ol.bylawlist>li>ol{list-style-type:inherit}ol.bylawlist>li>ol>li:before{content:"(" counter(bylawlist-counter,lower-alpha) ") "}ol.bylawlist>li>ol>li>ol{list-style-type:inherit}ol.bylawlist>li>ol>li>ol>li:before{content:"(" counter(bylawlist-counter,lower-roman) ") "}ol.bylawlist>li>ol>li>ol>li>ol{list-style-type:inherit}ol.bylawlist>li>ol>li>ol>li>ol>li:before{content:"(" counter(bylawlist-counter,decimal) ") "}ol.bylawlist>li ol>li:before{content:"(" counter(bylawlist-counter,lower-alpha) ") " !important}ol.bylawlist>li ol>li ol>li:before{content:"(" counter(bylawlist-counter,lower-roman) ") " !important}ol.bylawlist>li ol>li ol>li ol>li:before{content:counter(bylawlist-counter,decimal) ". " !important}'
    );
  },
  icons: 'bylawlist', // Bylaw List icon
  init: function( editor ) {
      editor.addCommand( 'insertBylawlist', {
          exec: function( editor ) {
            if ('li' == editor.getSelection().getStartElement().getName()) {
              if ('OL' == editor.getSelection().getStartElement().$.parentNode.nodeName) {
                var bylaw = editor.getSelection().getStartElement().$.parentNode;
                if(bylaw.className.indexOf("bylawlist") < 0){
                   bylaw.className += "bylawlist";
                }
                else {
                  bylaw.className = "";
                }
              }
            }
          }
     });
    editor.ui.addButton( 'Bylawlist', {
        label: 'Add Bylawlist',
        command: 'insertBylawlist',
        toolbar: 'insert'
    });
    var format = {'element': 'Bylawlist'};
    var style = new CKEDITOR.style(format);
    editor.attachStyleStateChange( style, function( state ) {
      !editor.readOnly && editor.getCommand( 'insertBylawlist' ).setState( state );
    });

    editor.on('contentDom', () => {
      /**
       * Updates all list starting points.
       *
       * @param {object} obj the list object.
       */
      function updateList(obj) {
        const start = jQuery(obj).attr('start') ? jQuery(obj).attr('start') - 1 : 0;

        jQuery(obj).find('li').css('counter-reset', '');
        jQuery(obj).find('li').first().css('counter-reset', `bylawlist-counter ${start}`);
      }

      const lists = editor.document.find('ol[start]');

      jQuery(lists).each((index, obj) => {
        jQuery(obj.$).each((index, element) => {
          updateList(element);
        });
      });

      const observerTarget = editor.document.find('html').$[0];
      const observerConfig = {
        attributes: true,
        subtree: true,
        childList: true
      };
      const observerCallback = (mutationsList, observer) => {
        mutationsList.forEach((mutation) => {
          if (mutation.target.localName === 'ol' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
            updateList(mutation.target);
          }

          if (mutation.attributeName == 'start') {
            updateList(mutation.target)
          }
        });
      };
      const observer = new MutationObserver(observerCallback);

      observer.observe(observerTarget, observerConfig);
    });
  }
});
