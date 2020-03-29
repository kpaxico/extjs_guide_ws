/**
 * Phone profile
 * @author Ritesh Patel
 * @email ritesh.patel@sencha.com
 */
Ext.define('ModernThemingApp.profile.Phone', {
	extend: 'Ext.app.Profile',
	
	// phone views
	views: {
		main: 'ModernThemingApp.view.phone.main.Main',
		dashboard : 'ModernThemingApp.view.phone.main.Dashboard',
		sidebar : 'ModernThemingApp.view.phone.main.Sidebar',
		events : 'ModernThemingApp.view.phone.main.Events',
		attendees : 'ModernThemingApp.view.phone.main.Attendees'
	},

	/**
	 * @method
	 * Check if phone profile is active
	 */
	isActive: function () {
		return Ext.platformTags.phone;
	}
});