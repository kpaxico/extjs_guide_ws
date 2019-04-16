/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'ModernApp.Application',

    name: 'ModernApp',

    requires: [
        // This will automatically load all classes in the ModernApp namespace
        // so that application classes do not need to require each other.
        'ModernApp.*'
    ],

    // The name of the initial view to create.
    mainView: 'ModernApp.view.main.Main'
});
