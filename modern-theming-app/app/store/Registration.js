/**
 * Registration store
 * @author Ritesh Patel
 * @email ritesh.patel@sencha.com
 */
Ext.define('ModernThemingApp.store.Registration', {
    extend : 'Ext.data.Store',
    autoLoad : true,
    model : 'ModernThemingApp.model.Registration',
    storeId : 'Registration',
    sorters : [
        {
            property : 'name',
            direction : 'ASC'
        }
    ]
});