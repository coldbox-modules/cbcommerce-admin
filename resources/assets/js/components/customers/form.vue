<template>

	<div v-if="!this.isLoading">

		<page-header
			v-if="currentCustomer && currentCustomer.id"
			:headerTitle="$t( 'customer' ) + `: ${ fullName }`"></page-header>
		<page-header
			v-else
			:headerTitle="$t( 'customer_add' )"></page-header>

		<dismissable-alert v-if="isSent && !isSending"
			:alertText="$t( 'customer_updated' )"
			alertType="success">
		</dismissable-alert>

		<b-form @submit="handleSubmit" action="javascript:;">

			<b-tabs>

				<b-tab v-if="currentCustomer && currentCustomer.id" :title="$t( 'customer_overview' )">

					<b-row>

						<b-col cols="6">

							<b-table
								class="mt-5"
								stacked
								caption-top
								:items="overviewData">
								<template slot="table-caption">{{ $t( 'personal_information' ) }}</template>
								<template slot="cell(createdTime)" slot-scope="data">
									{{ data.item.createdTime | dateToText }}
								</template>
							</b-table>

						</b-col>


						<b-col cols="6">

						</b-col>

					</b-row>

				</b-tab>

				<b-tab :title="$t( 'account_information' )">
					<account-info-fields :form="form"></account-info-fields>
				</b-tab>

				<b-tab :title="$t( 'billing_addresses' )">

					<b-col cols="12" class="mt-5">
    					<span
    						class="pull-right">
    						<a
    							class="btn btn-success addressFormBtn"
    							@click="showAddressFormPanel( 'Billing' )">
    							<i class="fa fa-plus"></i>
    						</a>
    					</span>
    				</b-col>

					<address-list
						:addresses="billingAddresses"
						type="Billing"></address-list>

				</b-tab>

				<b-tab :title="$t( 'shipping_addresses' )">

					<b-col cols="12" class="mt-5">
    					<span
    						class="pull-right">
    						<a
    							class="btn btn-success addressFormBtn"
    							@click="showAddressFormPanel( 'Shipping' )">
    							<i class="fa fa-plus"></i>
    						</a>
    					</span>
    				</b-col>

					<address-list
						:addresses="shippingAddresses"
						type="Shipping"></address-list>

				</b-tab>

			</b-tabs>

		    <hr />

		    <button type="submit" class="btn btn-secondary btn-lg">{{ $t( 'save' ) }}</button>

		    <back-button link="/customers" :text="$t( 'customers_back' )"></back-button>

		</b-form>

	</div>

</template>
<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import { Form } from '@cbcAdmin/classes/form';
import AccountInfoFields from './account-information-fields';
import AddressList from '@cbcAdmin/components/address/address-list';
import addressSidebar from '@cbcAdmin/components/address/address-sidebar';
export default {
	name: "CustomerForm",

	components: {
		AccountInfoFields,
		AddressList,
		addressSidebar
	},

    data() {
        return {
			isLoading        : false,
			form             : new Form(),
			url              : '', /* The URL to post the submission to */
			moment           : moment,
			errors           : [],
			isSending        : false,
			isSent           : false,
			billingAddresses : [],
			shippingAddresses: [],
			overviewData     : []
        }
    },

	computed: {

		...mapGetters([
			"currentCustomer",
			"currentCustomerID",
			"productsList",
			"productsListArray"
		]),

		fullName(){
			return this.form.firstName + " " + this.form.lastName;
		}

	},

	mounted() {

		if( !this.currentCustomerID && this.$route.params.id ){
			this.isLoading = true;
			return Promise.all([
				this.getListOfCustomers().then(() => {
					this.setCurrentCustomer( this.$route.params.id );
					this.fetchCustomerData();
					this.isLoading = false;
				})
			]);
		} else {
			if( !this.isLoading ){
				this.fetchCustomerData();
			}

		}
	},

	methods: {

		...mapActions([
			"getListOfCustomers",
			"setCurrentCustomer",
			"clearCurrentCustomer",
			"getListOfProducts",
			"saveCustomer"
		]),

		setFormData() {
			this.$set(
				this,
				"form",
				new Form({
					...this.currentCustomer
				})
			)
		},

		fetchCustomerData() {
			this.setFormData();
			this.fetchBillingAddresses();
			this.fetchShippingAddresses();
			this.generateOverviewData();
		},

		fetchBillingAddresses() {
			var billingAddresses = this.$options.filters.denormalize( this.form.billingAddresses );
			if( billingAddresses.length ){
				this.billingAddresses = billingAddresses;
			}
		},

		fetchShippingAddresses() {
			var shippingAddresses = this.$options.filters.denormalize( this.form.shippingAddresses );
			if( shippingAddresses.length ){
				this.shippingAddresses = shippingAddresses;
			}
		},

		generateOverviewData() {
			var self      = this;
			var pbObject  = {};
			const keyList = [ 'createdTime' ];
			keyList.forEach( ( key ) => {
				pbObject[ key ] = self.form[ key ]
			} )
			this.overviewData.push( pbObject );
		},

		showAddressFormPanel( addressType ) {
			var thisAddress = this.address;
			this.$showPanel( {
				component: addressSidebar,
				width    : '1020px',
				cssClass : 'slideout-panel-overall',
				props    : {
					data: {
						address: thisAddress,
						method : 'add',
						type   : addressType
					},
				}
			} );
	    },

		handleSubmit: function(){
			this.isSending         = true;
			this.submitContent();
    	},

    	submitContent: function(){

			var self = this;

			this.form.autoLogin = false;
			this.form.addresses = [
				...this.shippingAddresses.map( address => { address.designation = "shipping"; return address; } ),
				...this.billingAddresses.map( address => { address.designation = "biling"; return address; } )
			];

			this.saveCustomer( this.form );
			self.isSent    = true;
			self.isSending = false;

    	}

	}
}
</script>
<style>
a.addressFormBtn {
	cursor: pointer;
}
a.addressFormBtn i.fa {
	color: #fff;
}
</style>