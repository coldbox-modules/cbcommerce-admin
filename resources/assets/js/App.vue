<template>
	<div id="app">

		<slideout-panel></slideout-panel>

		<top-search></top-search>

		<b-container fluid>

			<b-row>

				<sidebar v-if="authUser"></sidebar>

				<main role="main" class="col-lg-9 ml-sm-auto col-xl-10 px-4">

					<router-view></router-view>

				</main>

			</b-row>

		</b-container>

</div>

</template>

<script>
import TopSearch from "@cbcAdmin/components/ui/top-search";
import Sidebar from "@cbcAdmin/components/ui/sidebar";
import { mapState, mapGetters } from "vuex";
export default {
	name    : "app",
	components: {
		TopSearch,
		Sidebar
	},
	computed: {
		...mapGetters([ "apiInstance" ] ),
		...mapState({
			authUser(state){ return state.globalData.authUser }
		})
	},
	created(){
		this.apiInstance.get.settings()
				.then( XHR => this.$store.commit( "updateGlobalData", { key: "settings", value : XHR.data } ) )
				.catch( err => {
					console.error( err );
				} );
	},
	methods : {},
	watch   : {}
};
</script>