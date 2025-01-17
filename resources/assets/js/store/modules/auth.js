import get from "lodash/get";
import api from "@cbcAdmin/api/index";
import Vue from "vue";

const initialState = {};
const actions = {
    authenticate: ( context, { email, password } ) => {
        return new Promise( (resolve, reject) => {
            api().post.authentication.login( { email, password } )
						.then( XHR => {
							context.commit( 'setAuthUser', { rootState: context.rootState, authUser : XHR.data } );
							resolve( XHR.data );
						} )
						.catch( err => {
                            console.error(err);
							reject( "Error: The user could not be authenticated" );
						});
		} );
    },
    logout: ( context ) => {
    	new Promise( (resolve, reject) => {
	        api().delete.authentication.logout()
                .then( XHR => {
                    context.commit( 'setAuthUser', { rootState: context.rootState, authUser : null } );
                    window.location.reload();
                    resolve( XHR.data );
                } )
                .catch( err => {
                    console.error( err );
					reject( "Error: An error occurred when attempting to log out the user" );
                } )
	    } );
    }
};
const mutations = {
    setAuthUser( state, { rootState, authUser } ) {
        Vue.set(rootState.globalData, "authUser", authUser );
    }
};

export default {
    state: initialState,
    actions,
    mutations
}