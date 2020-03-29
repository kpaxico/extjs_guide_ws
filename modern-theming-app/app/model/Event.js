/**
 * Events model class
 * @author Ritesh Patel
 * @email ritesh.patel@sencha.com
 */
Ext.define('ModernThemingApp.model.Event', {
    extend : 'Ext.data.Model',
    fields : [
        {
            name : 'title'
        },
        {
            name : 'track'
        },
        {
            name : 'time'
        },
        {
            location : 'location'
        }
    ],
    proxy : {
        type : 'ajax',
        url : './resources/data/events.json',
        reader : 'json'
    }
});