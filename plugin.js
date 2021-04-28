( function(CKEDITOR) {
  CKEDITOR.plugins.add( 'bylawlist', {
    onLoad: function() {
      CKEDITOR.addCss(
        'ol.bylawlist{list-style-type:none;list-style-position:inside;padding-left:1.5em}ol.bylawlist li{counter-increment:bylawlist-counter !important}ol.bylawlist li:first-child{counter-reset:bylawlist-counter}ol.bylawlist>li:before{content:"(" counter(bylawlist-counter,decimal) ") " !important}ol.bylawlist>li>ol{list-style-type:inherit}ol.bylawlist>li>ol>li:before{content:"(" counter(bylawlist-counter,lower-alpha) ") "}ol.bylawlist>li>ol>li>ol{list-style-type:inherit}ol.bylawlist>li>ol>li>ol>li:before{content:"(" counter(bylawlist-counter,lower-roman) ") "}ol.bylawlist>li>ol>li>ol>li>ol{list-style-type:inherit}ol.bylawlist>li>ol>li>ol>li>ol>li:before{content:"(" counter(bylawlist-counter,decimal) ") "}ol.bylawlist>li ol>li:before{content:"(" counter(bylawlist-counter,lower-alpha) ") " !important}ol.bylawlist>li ol>li ol>li:before{content:"(" counter(bylawlist-counter,lower-roman) ") " !important}ol.bylawlist>li ol>li ol>li ol>li:before{content:counter(bylawlist-counter,decimal) ". " !important}'
      );
    },
    icons: 'bylawlist', // Bylaw List icon
    init: function( editor ) {
        editor.addCommand( 'insertBylawlist', {
          allowedContent: {
            'ol': {
              attributes: ['class', 'start'],
              classes: 'bylawlist'
            },
          },
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
      editor.ui.addButton( 'bylawlist', {
          label: 'Add Bylawlist',
          command: 'insertBylawlist'
      });
      var format = {'element': 'Bylawlist'};
      var style = new CKEDITOR.style(format);
      editor.attachStyleStateChange( style, function( state ) {
        !editor.readOnly && editor.getCommand( 'insertBylawlist' ).setState( state );
      });

      editor.on('contentDom', () => {
        /**
         * Updates all list item starting points based on list start value.
         *
         * @param {object} list - the list object.
         */
        function updateList(list) {
          // If the object passed in it not an ordered list, do not continue.
          if (list.localName !== 'ol') return null

          const start = list.getAttribute('start') > 1 ? list.getAttribute('start') : 1;
          const listItems = list.querySelectorAll(':scope > li');

          listItems.forEach((item) => {
            item.style.counterReset = listItems[0] === item ? `bylawlist-counter ${start - 1}` : '';
          });
        }

        /**
         * Runs the updateList function on all bylawlists and child lists.
         *
         * This is to ensure all lists are updated even if some mutations aren't caught.
         */
        function updateAllLists() {
          // Get all bylaw lists.
          const bylawLists = editor.document.find('ol.bylawlist').$;

          // Update all bylaw lists.
          bylawLists.forEach((bylawList) => {
            if (typeof bylawList !== 'undefined' && bylawList) {
              updateList(bylawList);

              // Get all child lists.
              const sublists = bylawList.querySelectorAll('ol');

              // Update all child lists.
              sublists.forEach((list) => {
                updateList(list);
              })
            }
          });
        }

        // Run updateList on all lists with start values.
        editor.document.find('ol[start]').$.forEach((list) => {
          updateList(list);
        })

        // Set up MutationObserver.
        const observerTarget = editor.document.find('html').$[0];
        const observerConfig = {
          attributes: true,
          subtree: true,
          childList: true
        };
        const observerCallback = (mutationsList, observer) => {
          mutationsList.forEach((mutation) => {
              // Update lists that add/remove nodes.
              if (mutation.target.localName === 'ol' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                updateAllLists();
              }

              // Update list items that move postions.
              if (mutation.target.localName === 'li' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                updateAllLists();
              }

              // Update lists that change start value.
              if (mutation.attributeName === 'start') {
                updateAllLists();
              }
          });
        };
        const observer = new MutationObserver(observerCallback);

        observer.observe(observerTarget, observerConfig);
      });
    }
  });
} )();
