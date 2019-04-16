/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'ClassicApp.Application',

    name: 'ClassicApp',

    requires: [
        // This will automatically load all classes in the ClassicApp namespace
        // so that application classes do not need to require each other.
        'ClassicApp.*'
    ],

    // The name of the initial view to create.
    mainView: 'ClassicApp.view.main.Main'
});
