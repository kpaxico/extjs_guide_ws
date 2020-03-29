/**
 * Attendees store
 * @author Ritesh Patel
 * @email ritesh.patel@sencha.com
 */
Ext.define('ModernThemingApp.store.Attendee', {
    extend : 'Ext.data.Store',
    autoLoad : true,
    model : 'ModernThemingApp.model.Attendee',
    storeId : 'Attendee',
    sorters : [
        {
            property : 'name',
            direction : 'ASC'
        }
    ]
});