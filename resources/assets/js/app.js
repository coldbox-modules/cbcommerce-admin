import Vue from "vue";
import { createApp } from 'vue';
import BootstrapVue from 'bootstrap-vue';
import PrettyCheckbox from 'pretty-checkbox-vue';
import VueTruncate from 'vue-truncate-filter';
import VTooltip from 'v-tooltip';
import Grid from 'vue-js-grid';
import VueCurrencyFilter from 'vue-currency-filter';
import VueCharts from 'vue-chartjs';
import VueNestable from "vue-nestable";
import VueI18n from "vue-i18n";
import VueJwtDecode from 'vue-jwt-decode';

// Module components
import PageHeader from '@cbcAdmin/components/ui/page-header';
import BackButton from '@cbcAdmin/components/ui/back-button';
import TablePagination from '@cbcAdmin/components/ui/table-pagination';
import DismissableAlert from '@cbcAdmin/components/ui/dismissable-alert';
import VueSlideoutPanel from 'vue2-slideout-panel';

import Vuex from 'vuex';
import Router from 'vue-router';

import { sync } from 'vuex-router-sync';

import createStore from "@cbcAdmin/store";
import createRouter from "@cbcAdmin/router";
import createFilters from "@cbcAdmin/filters/index";

import App from "@cbcAdmin/App.vue";
import api from "@cbcAdmin/api/index";

require( "jquery.tooltips" );

const storeInstance  = createStore( Vue, Vuex );
const routerInstance = createRouter( Vue, Router, storeInstance );

routerInstance.beforeEach((to, from, next) => {
	if( to.name == "login" ) return next();
	api().get.authentication.check().then( xhr => {
		if( !storeInstance.state.globalData.authUser ){
			api().get.authentication.token().then( xhr => {
				let authUser = Object.freeze( VueJwtDecode.decode( xhr.data[ "@token" ] ) );
				if( !authUser.scope.trim().length ){
					next({ name: 'login' });
				} else {
					Vue.set( storeInstance.state.globalData, "authUser", authUser );
					next();
				}
			} );
		} else {
			next();
		}
	}).catch( err => {
		storeInstance.state.globalData[ "@token" ] = null;
		next({ name: 'login' });
	} );
});

sync( storeInstance, routerInstance );

Vue.use(VueI18n);
Vue.use( VueTruncate );
Vue.use( VTooltip );
Vue.use( PrettyCheckbox );
Vue.use( BootstrapVue );
Vue.use( Grid );
Vue.use( VueCharts );
Vue.use( VueNestable );
Vue.use( VueSlideoutPanel );


Vue.component( 'page-header', PageHeader );
Vue.component( 'back-button', BackButton );
Vue.component( 'table-pagination', TablePagination );
Vue.component( 'dismissable-alert', DismissableAlert );
Vue.component( "generic-loader",  require( "@cbcAdmin/components/generic-loader" ).default );

// Create VueI18n instance with options
const messages = window.cbcGlobalData.i18n;
const i18n = new VueI18n({
    locale: window.cbcGlobalData.fwLocale, // set locale
    messages, // set locale messages
});

Vue.use(
	VueCurrencyFilter,
	{
		symbol            : '$',
		thousandsSeparator: ',',
		fractionCount     : 2,
		fractionSeparator : '.',
		symbolPosition    : 'front',
		symbolSpacing     : false
	}
);

// global event bus
window.EventBus = new Vue({});

new Vue( {
    i18n,
	store     : storeInstance,
	router    : routerInstance,
	filters   : createFilters( Vue ),
	components: { App }
} ).$mount( "#module-wrap" );
