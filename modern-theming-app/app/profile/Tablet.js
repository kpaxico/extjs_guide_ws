/**
 * Tablet profile
 * @author Ritesh Patel
 * @email ritesh.patel@sencha.com
 */
Ext.define('ModernThemingApp.profile.Tablet', {
	extend: 'Ext.app.Profile',

	// tablet views
	views: {
		main: 'ModernThemingApp.view.main.Main',
		dashboard : 'ModernThemingApp.view.main.Dashboard',
		sidebar : 'ModernThemingApp.view.main.Sidebar',
		events : 'ModernThemingApp.view.main.Events',
		attendees : 'ModernThemingApp.view.main.Attendees'
	},

	/**
	 * @method
	 * Check if tablet profile is active
	 */
	isActive: function () {
		return !Ext.platformTags.phone;
	}
});