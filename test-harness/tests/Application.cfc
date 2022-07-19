/**
********************************************************************************
Copyright 2005-2007 ColdBox Framework by Luis Majano and Ortus Solutions, Corp
www.ortussolutions.com
********************************************************************************
*/
component{

	// APPLICATION CFC PROPERTIES
	this.name 				= "CbCommerce-Admin-TestingSuite" & hash(getCurrentTemplatePath());
	this.sessionManagement 	= true;
	this.sessionTimeout 	= createTimeSpan( 0, 0, 15, 0 );
	this.applicationTimeout = createTimeSpan( 0, 0, 15, 0 );
	this.setClientCookies 	= true;

	// Add Environment Access
	system = createObject( "java", "java.lang.System" );
	systemEnv = system.getenv();


	// Create testing mapping
	this.mappings[ "/tests" ] = getDirectoryFromPath( getCurrentTemplatePath() );

	// The application root
	rootPath = REReplaceNoCase( this.mappings[ "/tests" ], "tests(\\|/)", "" );
	this.mappings[ "/root" ]   = rootPath;

	this.mappings[ '/config' ]           = rootPath & "config";
	this.mappings[ "/coldbox" ]          = rootPath & "coldbox";
	this.mappings[ "/testbox" ]          = rootPath & "testbox";

	// UPDATE THE NAME OF THE MODULE IN TESTING BELOW
	request.MODULE_NAME = "cbcommerce-admin";

	// The module root path
	moduleRootPath = REReplaceNoCase( this.mappings[ "/root" ], "#request.module_name#(\\|/)test-harness(\\|/)", "" );
	this.mappings[ "/moduleroot" ] = moduleRootPath & "modules";
	this.mappings[ "/#request.MODULE_NAME#" ] = this.mappings[ "/moduleroot" ] & "/#request.MODULE_NAME#";
	this.mappings[ "cbcAdmin" ] = this.mappings[ "/#request.MODULE_NAME#" ];

	function onRequestStart(){
		// applicationStop();
		// abort;
	}

    public void function onRequestEnd() {
    	// Cleanup Frameworks in each request.
        structdelete( application, "cbController" );
        structdelete( application, "wirebox" );
        return;
	}

}