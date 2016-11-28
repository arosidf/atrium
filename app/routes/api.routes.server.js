'use strict';

var userSecurity = require('../../app/services/user/user-security.service.server');

var setup_Initial = require('../../app/services/setup/initial.setup.service.server');

var client_Create = require('../../app/services/client/create.service.server');
var client_FindAll = require('../../app/services/client/find-all.service.server');
var client_FindExternalClient = require('../../app/services/client/find-external-client.service.server');
var client_FindInternalClient = require('../../app/services/client/find-internal-client.service.server');
var client_Update = require('../../app/services/client/update.service.server');

var placement_Retrieve = require('../../app/services/placement/retrieve.placement.service.server');
var placement_RetrieveByUserId = require('../../app/services/placement/retrieve-by-user-id.placement.service.server');
var placement_Create = require('../../app/services/placement/create.placement.service.server');

var timesheetTemplate_RetrieveYears = require('../../app/services/timesheet-template/retrieve-years-and-add-this-year-and-next-year-timesheet-template.service.server');
var timesheetTemplate_RetrieveById = require('../../app/services/timesheet-template/retrieve-by-id.service.server');
var timesheetTemplate_UpdateTimesheetTemplate = require('../../app/services/timesheet-template/update-timesheet-template.service.server');

var timesheet_RetrieveByMonth = require('../../app/services/timesheet/retrieve-by-month.service.server');
var timesheet_RetrieveByMonthByResource = require('../../app/services/timesheet/retrieve-by-month-by-resource.service.server');
var timesheet_Update = require('../../app/services/timesheet/update.timesheet.service.server');
var timesheet_RetrieveHtmlByResource = require('../../app/services/timesheet/retrieve-html-by-resource.service.server');
var timesheet_RetrievePdfByResource = require('../../app/services/timesheet/retrieve-pdf-by-resource.service.server');
var timesheet_RetrieveHtml = require('../../app/services/timesheet/retrieve-html.service.server');
var timesheet_RetrievePdf = require('../../app/services/timesheet/retrieve-pdf.service.server');

var user_signin = require('../../app/services/user/signin.service.server');
var user_signout = require('../../app/services/user/signout.service.server');
var user_changePassword = require('../../app/services/user/change-password.service.server');
var user_changePasswordForSpecifiedResource = require('../../app/services/user/change-password-for-specified-resource.service.server');
var user_me = require('../../app/services/user/me.service.server');
var user_findById = require('../../app/services/user/find-by-id.service.server');
var user_findAllResource = require('../../app/services/user/find-all-resource.service.server');
var user_findActiveResource = require('../../app/services/user/find-active-resource.service.server');
var user_createResourceUser = require('../../app/services/user/create-resource-user.service.server');
var user_updateResourceUser = require('../../app/services/user/update-resource-user.service.server');
var user_findResourceById = require('../../app/services/user/find-resource-by-id.service.server');

var performance_createPenilaianUserAndTimesheetCollection = require('../../app/services/performance/create-penilaian-user-and-timesheet-collection.service.server');
var performance_updatePenilaianUserAndTimesheetCollection = require('../../app/services/performance/update-penilaian-user-and-timesheet-collection.service.server');
var performance_Retrieve = require('../../app/services/performance/retrieve.performance.service.server');
var performance_RetrieveByResource = require('../../app/services/performance/retrieve-by-resource.performance.service.server');

var project_create = require('../../app/services/project/create.project.service.server');
var project_retrieve = require('../../app/services/project/retrieve.project.service.server');
var project_retrieveByResource = require('../../app/services/project/retrieve-by-resource.project.service.server');
var project_update = require('../../app/services/project/update.project.service.server');
var project_delete = require('../../app/services/project/delete.project.service.server');

module.exports = function(app) {
	// =================================================================== Param
	app.param('userId', user_findById.do);

	// =================================================================== Setup
	app.route('/api/setup/initial').get(setup_Initial.do);
	
	// ==================================================================== User
	app.route('/api/users/me').get(userSecurity.requiresLogin, user_me.do);
	app.route('/api/users/password').post(userSecurity.requiresLogin, user_changePassword.do);
	
	// ==================================================================== Auth
	app.route('/api/auth/signin').post(userSecurity.requiresNotLogged, user_signin.do);
	app.route('/api/auth/signout').get(userSecurity.requiresLogin, user_signout.do);

	// ================================================================== Client
	app.route('/api/client').get(userSecurity.requiresEroRole, client_FindAll.do);
	app.route('/api/client/internal').get(userSecurity.requiresEroRole, client_FindInternalClient.do);
	app.route('/api/client/external').get(userSecurity.requiresEroRole, client_FindExternalClient.do);
	app.route('/api/client').post(userSecurity.requiresEroRole, client_Create.do);
	app.route('/api/client/update').post(userSecurity.requiresEroRole, client_Update.do);

	// ================================================================ Resource
	app.route('/api/resource').get(userSecurity.requiresEroRole, user_findAllResource.do);
	app.route('/api/resource/active').get(userSecurity.requiresEroRole, user_findActiveResource.do);
	app.route('/api/resource').post(userSecurity.requiresEroRole, user_createResourceUser.do);
	app.route('/api/resource/update').post(userSecurity.requiresEroRole, user_updateResourceUser.do);
	app.route('/api/resource/change-password').post(userSecurity.requiresEroRole, user_changePasswordForSpecifiedResource.do);
	app.route('/api/resource/:resourceId').get(userSecurity.requiresEroRole, user_findResourceById.do);

	// =============================================================== Placement
	app.route('/api/placement').get(userSecurity.requiresResourceRole, placement_Retrieve.do);
	app.route('/api/placement/resource/:resourceId').get(userSecurity.requiresEroRole, placement_RetrieveByUserId.do);
	app.route('/api/placement').post(userSecurity.requiresEroRole, placement_Create.do);

	// ======================================================= TimesheetTemplate
	app.route('/api/timesheet-template/retrieve-years').get(userSecurity.requiresEroRole, timesheetTemplate_RetrieveYears.do);
	app.route('/api/timesheet-template').post(userSecurity.requiresEroRole, timesheetTemplate_UpdateTimesheetTemplate.do);
	app.route('/api/timesheet-template/:timesheetTemplateId').get(userSecurity.requiresEroRole, timesheetTemplate_RetrieveById.do);
	
	// =============================================================== Timesheet
	app.route('/api/timesheet/retrieve-by-month').get(userSecurity.requiresResourceRole, timesheet_RetrieveByMonth.do);
	app.route('/api/timesheet/update').post(userSecurity.requiresResourceRole, timesheet_Update.do);
	app.route('/api/timesheet/retrieve-html/:startDate/:endDate').get(userSecurity.requiresResourceRole, timesheet_RetrieveHtml.do);
	app.route('/api/timesheet/retrieve-pdf/:startDate/:endDate').get(userSecurity.requiresResourceRole, timesheet_RetrievePdf.do);
	
	app.route('/api/timesheet/:resourceId/retrieve-by-month').get(userSecurity.requiresEroRole, timesheet_RetrieveByMonthByResource.do);
	app.route('/api/timesheet/:resourceId/update').post(userSecurity.requiresEroRole, timesheet_Update.do);
	app.route('/api/timesheet/:resourceId/retrieve-html/:startDate/:endDate').get(timesheet_RetrieveHtmlByResource.do);
	app.route('/api/timesheet/:resourceId/retrieve-pdf/:startDate/:endDate').get(userSecurity.requiresEroRole, timesheet_RetrievePdfByResource.do);

	// ============================================================= Performance
	app.route('/api/performance/create-penilaian-user-and-timesheet-collection').post(userSecurity.requiresEroRole, performance_createPenilaianUserAndTimesheetCollection.do);
	app.route('/api/performance/update-penilaian-user-and-timesheet-collection').post(userSecurity.requiresEroRole, performance_updatePenilaianUserAndTimesheetCollection.do);
	app.route('/api/performance/retrieve').get(userSecurity.requiresResourceRole, performance_Retrieve.do);
	app.route('/api/performance/:resourceId/retrieve').get(userSecurity.requiresEroRole, performance_RetrieveByResource.do);

	// ================================================================= Project
	app.route('/api/project/create').post(userSecurity.requiresResourceRole, project_create.do);
	app.route('/api/project/retrieve').get(userSecurity.requiresResourceRole, project_retrieve.do);
	app.route('/api/project/update').post(userSecurity.requiresResourceRole, project_update.do);
	app.route('/api/project/:projectId/delete').post(userSecurity.requiresResourceRole, project_delete.do);
	app.route('/api/project/:resourceId/retrieve').get(userSecurity.requiresEroRole, project_retrieveByResource.do);
};
