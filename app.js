/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */

//Note: scopes the sencha css to not effect css outside the viewport
Ext.scopeCss = true;
Ext.application({
    extend: 'MyApp.Application',

    name: 'Vendor-Division-Annual',

    requires: [
        'BRC.Constants',
        'BRC.Utilities',
        // This will automatically load all classes in the ExampleProject namespace
        // so that application classes do not need to require each other.
        'MyApp.*'//'MyApp.*'
    ]

    //Note: We do not use the mainView code, instead our main.js uses a renderTo: 'FakeViewport',
    //The FakeViewport is an id in html that will be where the page is rendered.
    //mainView: 'ExampleProject.view.main.Main'
});


//Note: The 6 files that have changes to accommodate how we build and load ExtJs in .jsp files are as follows:
//6-5/workspace.json
//6-5/exampleproject/app.js
//6-5/exampleproject/app/Application.js
//6-5/exampleproject/classic/src/view/main/Main.js
//6-5/exampleproject/app.json
//6-5/exampleproject/index.html

//Note: Look for the "//Note:" comments. They will give some context for different changes.

//Note: The below terminal commands may be different depending on how you have sencha installed.
//Note: To create a new sencha app in the workspace navigate to your /6-5 folder, aka your sencha workspace, in the
//terminal and use "sencha -sdk ext generate app AppName appname"
//Note: To build an existing app navigate to your workspace and use "sencha -cwd appname app build"
//Note: You will need to build the exampleproject app in order to test it in your browser.