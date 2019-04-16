/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'UniversalApp.Application',

    name: 'UniversalApp',

    requires: [
        // This will automatically load all classes in the UniversalApp namespace
        // so that application classes do not need to require each other.
        'UniversalApp.*'
    ],

    // The name of the initial view to create.
    mainView: 'UniversalApp.view.main.Main'
});
