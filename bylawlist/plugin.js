CKEDITOR.plugins.add( 'bylawlist', {
    icons: 'bylawlist', // Bylaw List icon
    init: function( editor ) {
        editor.addCommand( 'insertBylawlist', {
            exec: function( editor ) {
                var now = new Date();
                editor.insertHtml( 'The current date and time is: <em>' + now.toString() + '</em>' );
            }
        });
        editor.ui.addButton( 'Bylawlist', {
            label: 'Add Bylawlist',
            command: 'insertBylawlist',
            toolbar: 'insert'
        });
    }
});