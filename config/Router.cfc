component{
	function configure(){
            route( "(.*?)" )
                .toHandler( "Main" )
				.toAction( "index" );
	}
}