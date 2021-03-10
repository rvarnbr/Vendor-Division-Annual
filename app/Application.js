/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('MyApp.Application', {
    extend: 'Ext.app.Application',

    name: 'template',

    requires: [
        'MyApp.view.main.Main'//this is in the clasic folder/src
    ],
    // stores:['reportStore'],
    //Note: On launch creates the main view, aka Main.js
    launch: function () {
        Ext.create('MyApp.view.main.Main', {
            renderTo: 'FakeViewport'
        });
    }
});
