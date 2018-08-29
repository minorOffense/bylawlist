CKEDITOR.plugins.add( 'bylawlist', {
    onLoad: function() {
      CKEDITOR.addCss(
        'ol.bylawlist,ol.bylawlist>li,ol.bylawlist>li ol>li,ol.bylawlist>li ol>li ol>li, ol.bylawlist>li ol>li ol>li ol>li{list-style-type:none;list-style-position:inside}ol.bylawlist{padding-left:1.5em}ol.bylawlist>li{counter-increment:first}ol.bylawlist>li:before{content:"(" counter(first,decimal) ") "}ol.bylawlist>li ol>li{counter-increment:second}ol.bylawlist>li ol>li:before{content:"(" counter(second,lower-alpha) ") "}ol.bylawlist>li ol>li ol>li{counter-increment:third}ol.bylawlist>li ol>li ol>li:before{content:"(" counter(third,lower-roman) ") "}ol.bylawlist>li ol>li ol>li ol>li{counter-increment:fourth}ol.bylawlist>li ol>li ol>li ol>li:before{content: counter(fourth, decimal) }'
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
            toolbar: 'insert'g
        });
        var format = {'element': 'Bylawlist'};
        var style = new CKEDITOR.style(format);
        editor.attachStyleStateChange( style, function( state ) {
   	      !editor.readOnly && editor.getCommand( 'insertBylawlist' ).setState( state );
        } );
    }
});
