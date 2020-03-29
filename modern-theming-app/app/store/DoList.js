/**
 * DoList store
 * @author Ritesh Patel
 * @email ritesh.patel@sencha.com
 */
Ext.define('ModernThemingApp.store.DoList', {
    extend : 'Ext.data.Store',
    autoLoad : true,
    model : 'ModernThemingApp.model.DoList',
    storeId : 'DoList',
    sorters : [
        {
            property : 'name',
            direction : 'ASC'
        }
    ]
});