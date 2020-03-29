/**
 * Events store
 * @author Ritesh Patel
 * @email ritesh.patel@sencha.com
 */
Ext.define('ModernThemingApp.store.Event', {
    extend : 'Ext.data.Store',
    autoLoad : true,
    model : 'ModernThemingApp.model.Event',
    storeId : 'Event',
    sorters : [
        {
            property : 'title',
            direction : 'ASC'
        }
    ]
});