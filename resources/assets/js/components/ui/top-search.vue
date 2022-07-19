<template>

	<nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">

		<router-link
			to="/"
			class="navbar-brand col-md-3 col-lg-2 mr-0"><img :src="`${moduleRoot}/includes/static/cbcommerce-logo.png`" style="max-height:25px" alt="CBCommerce Admin"/></router-link>

		<input
			v-if="authUser"
			class="form-control form-control-dark w-100"
			type="text"
			placeholder="Search"
			aria-label="Search" />

		<ul class="navbar-nav px-3">
			<li v-if="authUser" class="nav-item text-nowrap">
				<a class="nav-link" href="##">Sign out</a>
			</li>
		</ul>
	</nav>

</template>

<script>
import { mapState } from "vuex";
export default {
	name    : "TopSearch",
	computed : {
		...mapState({
			moduleRoot : state => state.globalData.moduleRoot,
			authUser : state => state.globalData.authUser
		})
	}
};
</script>