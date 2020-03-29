/**
 * Navigation store
 * @author Ritesh Patel
 * @email ritesh.patel@sencha.com
 */
Ext.define('ModernThemingApp.store.NavigationStore', {
	extend : 'Ext.data.TreeStore',
	storeId : 'NavigationStore',
	fields : [{
		name : 'text'
	}],
	root : {
		expanded : true,
		children : [
			{
				text : 'Dashboard',
				iconCls : 'x-fa fa-dashboard',
				xtype : 'dashboard',
				routeId : 'dashboard',
				leaf : true
			},
			{
				text : 'Speakers',
				iconCls : 'x-fa fa-users',
				xtype : 'speakers',
				leaf : true
			},
			{
				text : 'Events',
				iconCls : 'x-fa fa-bolt',
				expanded : true,
				children : [
					{ text : 'Morning', xtype : 'morning', leaf : true},
					{ text : 'Afternoon', xtype : 'afternoon', leaf : true},
					{ text : 'Evening', xtype : 'evening', leaf : true}
				]
			},
			{
				text : 'Attendees',
				iconCls : 'x-fa fa-user-plus',
				xtype : 'attendees',
				leaf : true
			}			
		]
	}
})