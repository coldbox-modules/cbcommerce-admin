import createLogger from "vuex/dist/logger";
import auth from "@cbcAdmin/store/modules/auth";
import categories from "@cbcAdmin/store/modules/categories";
import customers from "@cbcAdmin/store/modules/customers";
import orders from "@cbcAdmin/store/modules/orders";
import products from "@cbcAdmin/store/modules/products";
import createFilters from "@cbcAdmin/filters/index";
import api from "@cbcAdmin/api/index";
import Vue from "vue";

createFilters(Vue);

export const createStore = (Vue, Vuex) => {
	Vue.use(Vuex);
	const state = {
		filters : Vue.options.filters,
		globalData: window.cbcGlobalData || {}
	};
	const mutations = {
		updateState( state, payload ) {
            state[ payload.key] =  payload.value ;
        },
        updateGlobalData ( state, payload ) {
            if( payload.key && ( typeof payload.value === "undefined" || ! ( "value" in payload ) ) ){
                if( state.globalData[ payload.key ] ) {
                    delete state.globalData[ payload.key ];
                }
            } else  {
                state.globalData[ payload.key] =  payload.value ;
            }
        },
        updateNestedState( state, payload ) {
            var path = "state." & payload.path;
            var nesting = eval( path );
            nesting[ payload.key] =  payload.value ;
        },
        removeFromState( state, payload ) {
            delete state[ payload.key  ];
        }
	};
	const getters = {
		apiInstance : () => api()
	};
	const debug =
    process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test";

	return new Vuex.Store({
		state,
		mutations,
		getters,
		modules: {
			auth,
			customers,
			categories,
			orders,
			products
		},
		plugins: debug ? [createLogger()] : []
	});
};

export default createStore;