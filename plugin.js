CKEDITOR.plugins.add( 'bylawlist', {
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
        } );
    }
});
