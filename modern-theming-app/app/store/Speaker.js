/**
 * Speaker store
 * @author Ritesh Patel
 * @email ritesh.patel@sencha.com
 */
Ext.define('ModernThemingApp.store.Speaker', {
    extend : 'Ext.data.Store',
    autoLoad : true,
    model : 'ModernThemingApp.model.Speaker',
    storeId : 'Speaker',
    sorters : [
        {
            property : 'name',
            direction : 'ASC'
        }
    ]
});