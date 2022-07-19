/**
* The base interceptor test case will use the 'interceptor' annotation as the instantiation path to the interceptor
* and then create it, prepare it for mocking, and then place it in the variables scope as 'interceptor'. It is your
* responsibility to update the interceptor annotation instantiation path.
*/
component extends="coldbox.system.testing.BaseInterceptorTest" interceptor="cbcommerce-admin.interceptors.GlobalData"{

	/*********************************** LIFE CYCLE Methods ***********************************/
this.loadColdbox = true;
this.unloadColdbox = false;

	function beforeAll(){
		super.beforeAll();

		// interceptor configuration properties, if any
		configProperties = {};
		// init and configure interceptor
		super.setup();

		if( !application.cbController.getModuleService().isModuleRegistered( "cbcommerce-admin" ) ){
			application.cbController.getModuleService().registerAndActivateModule( "cbcommerce-admin" );
		}
		// we are now ready to test this interceptor
		getWirebox().autoWire( interceptor );
		interceptor.setController( application.cbController );
		interceptor.$( "getWirebox", application.wirebox )
					.$( "getfwLocale", "en_US" );
	}

	function afterAll(){
		// do your own stuff here
		super.afterAll();
	}

	/*********************************** BDD SUITES ***********************************/

	function run(){

		describe( "cbAdmin.interceptors.GlobalData", function(){

			it( "should configure correctly", function(){
				interceptor.configure();
			});

			it( "tests preProcess", function(){
				var event = getMockRequestContext();
				event.$( "getModuleRoot", '/modules/cbcommerce-admin' );
				var prc = event.getPrivateCollection();
				var rc = event.getCollection();
				interceptor.preProcess( event=event, interceptData={}, rc=rc, prc=prc );

				expect( prc ).toHaveKey( "assetBag" ).toHaveKey( "globalData" );
			} )


		});

	}

}
