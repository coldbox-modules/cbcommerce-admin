component {

    this.name           = "cbcommerce-admin";
    this.title          = "cbCommerce Public UI";
    this.description    = "cbCommerce is the eCommerce Platform for the ContentBox Modular CMS";
    this.version        = "@build.version@+@build.number@";
    this.author         = "Jon Clausen <jclausen@ortussolutions.com>";
    this.webUrl         = "https://github.com/jclausen/cbCommerce";
    this.cfmapping      = "cbcAdmin";
    this.modelNamespace	= "cbcAdmin";
    this.viewParentLookup = true;
    this.layoutParentLookup = true;
	this.entryPoint = "store/admin";
    this.dependencies   = [
        "cbi18n"
    ];

	/**
	 * Configure Module
	 */
    function configure() {

        settings = {
			"baseAPIHref" : getSystemSetting( "CBCOMMERCE_ENTRYPOINT", "/cbc/api/v1" )
		};

		cbi18n={
			defaultLocale = "en_US",
			// Extra resource bundles to load
			resourceBundles = {
				"cbCommerce" : "/cbcAdmin/includes/i18n/cbCommerce",
				"cbCommerceAdmin" : "/cbcAdmin/includes/i18n/cbCommerceAdmin",
				"cbCommerceOrders" : "/cbcAdmin/includes/i18n/cbCommerceOrders"
			}
		}

        // Custom Declared Interceptors
		interceptors = [
			{
					class="cbcAdmin.interceptors.GlobalData",
					name="CBCGlobalDataInterceptor"
			}
        ];

    }

    function onLoad() {
		// @TODO: Move to ContentBox module
		var isContentBoxContext = controller.getModuleService().isModuleRegistered( "contentbox" );
		if( isContentBoxContext ){
			// Add our menu item
			var menuService = controller.getWireBox().getInstance( "AdminMenuService@cb" );

			menuService.addSubMenu(
				topMenu=menuService.MODULES,
				name="cbCommerce",
				label="Store Admin",
				href=menuService.buildModuleLink( 'store', 'admin' )
			);

		}

	}

}