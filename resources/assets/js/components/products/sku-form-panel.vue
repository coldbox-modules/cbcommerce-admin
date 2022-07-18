<template>

	<b-container class="mt-2">

		<b-row>

			<b-col cols="11" class="mt-2">

			    <h2>{{ sideBarTitle }}</h2>

			</b-col>

			<b-col cols="1" class="mt-2">
				<span class="pull-right">
					<i
						class="fa fa-close closePanelIcon"
						@click="closePanel()"></i>
				</span>
			</b-col>

		    <b-col class="mt-3">

				<b-card class="mb-1">

			    	<b-row>

			    		<b-col>

							<b-form-group
								:label="$t( 'product_model' )"
								label-for="modelNumber">
								<b-form-input
									type="text"
									id="modelNumber"
									:required=true
									v-model.trim="form.modelNumber"></b-form-input>
							</b-form-group>

							<b-form-group
								:label="$t( 'condition' )"
								label-for="condition">
									<v-select
										v-model="form.condition"
										label="name"
										:options="parentConditions"
									></v-select>
							</b-form-group>

							<b-form-group
								:label="$t( 'sub_condition' )"
								label-for="condition">
									<v-select
										v-model="form.subCondition"
										label="name"
										:options="childConditions"
									></v-select>
							</b-form-group>

							<b-form-group
								:label="$t( 'condition_description' )"
								label-for="conditionDescription">
								<html-editor
									height="200"
									:model.sync="form.conditionDescription"></html-editor>
							</b-form-group>


							<b-card no-body class="mb-1" v-if="data.sku.media">

								<b-card-header header-tags="header" class="p-1" role="tab">
									<b-btn block href="#" v-b-toggle.skuImages>{{ $t( 'images' ) }}</b-btn>
								</b-card-header>
								<b-collapse id="skuImages" accordion="product-accordion" role="tabpanel">
									<b-card-body>
										<gallery-list-sortable
											:eventPrefix="eventPrefix"
											:endpoint="`${baseAPIHref}/skus/${data.sku.id}/media`"
											:images="data.sku.media"></gallery-list-sortable>

									</b-card-body>
								</b-collapse>

							</b-card>

							<b-form-group
								:label="$t( 'cost' )"
								label-for="cost">
								<b-input-group size="lg" prepend="$">
									<b-form-input
										type="number"
										id="cost"
										:required="true"
										v-model.trim="form.cost"></b-form-input>
								</b-input-group>
							</b-form-group>

							<b-form-group
								:label="$t( 'product_msrp' )"
								label-for="MSRP">
								<b-input-group size="lg" prepend="$">
									<b-form-input
										type="number"
										id="MSRP"
										:required="true"
										v-model.trim="form.MSRP"></b-form-input>
								</b-input-group>
							</b-form-group>

							<b-form-group
								:label="$t( 'product_minimum_retail' )"
								label-for="miniumumPrice">
								<b-input-group size="lg" prepend="$">
									<b-form-input
										type="number"
										id="minimumPrice"
										:required="true"
										v-model.trim="form.miniumumPrice"></b-form-input>
								</b-input-group>
							</b-form-group>

							<b-form-group
								:label="$t( 'product_minimum_advertised' )"
								label-for="MAP">
								<b-input-group size="lg" prepend="$">
									<b-form-input
										type="number"
										id="MAP"
										:required="true"
										v-model.trim="form.MAP"></b-form-input>
								</b-input-group>
							</b-form-group>

							<b-form-group
								:label="$t( 'product_selling' )"
								label-for="basePrice">
								<b-input-group size="lg" prepend="$">
									<b-form-input
										type="number"
										id="basePrice"
										v-model.trim="form.basePrice"></b-form-input>
								</b-input-group>
							</b-form-group>

							<b-form-group :label="$t( 'product_sku_active' )">
								 <b-form-radio-group
									v-model="form.isActive"
									:options="booleanOptions"
									name="isActive"
								></b-form-radio-group>
							</b-form-group>
							<template v-if="allowConsignment">
								<b-form-group :label="$t( 'product_consignment' )">
									<b-form-radio-group
										v-model="form.isConsigned"
										:options="booleanOptions"
										name="isConsigned"
									></b-form-radio-group>
								</b-form-group>

								<b-form-group v-if="form.isConsigned">
									<legend>{{ $t( 'product_consignor' ) }}</legend>
									<h5>Select an existing customer</h5>
									<v-select
										:label="$t( 'full_name' )"
										v-model="form.consignor"
										:filterable="false"
										:options="consignorsListArray"
										@search="onSearchconsignors"
										:onChange="setconsignor"
									></v-select>
									<p v-if="!form.consignor || !form.consignor.id"><em>or</em></p>
									<h5 v-if="!form.consignor || !form.consignor.id">Create a New Customer</h5>
									<consignor-form v-if="!form.consignor || !form.consignor.id" :consignor="form.consignor"></consignor-form>
								</b-form-group>
							</template>

							<b-form-group v-if="allowVirtual" :label="$t( 'product_virtual_downloadable' )">
								 <b-form-radio-group
									v-model="form.isVirtual"
									:options="booleanOptions"
									name="isVirtual"
								></b-form-radio-group>

							</b-form-group>

							<template v-if="form.isVirtual">
								<b-form-group
								label="Virtual Product Download URL"
								label-for="location">
									<b-form-input
										type="text"
										id="location"
										:required="form.isVirtual"
										v-model.trim="form.virtualSKU.location"></b-form-input>
									<p class="text-muted text-sm"><em>This download location will never be exposed publicly but it required for virtual products</em></p>
								</b-form-group>
							</template>

							<b-form-group v-if="!form.isVirtual" :label="$t( 'product_pick_up' )">
								 <b-form-radio-group
									v-model="form.pickUpInStore"
									:options="booleanOptions"
									name="pickUpInStore"
								></b-form-radio-group>
							</b-form-group>

							<b-form-group v-if="!form.isVirtual" :label="$t( 'product_show_price' )">
								 <b-form-radio-group
									v-model="form.showPricing"
									:options="booleanOptions"
									name="showPricing"
								></b-form-radio-group>
							</b-form-group>

							<b-form-group v-if="!form.isVirtual" :label="$t( 'product_allow_backorder' )">
								 <b-form-radio-group
									v-model="form.allowBackorder"
									:options="booleanOptions"
									name="allowBackorder"
								></b-form-radio-group>
							</b-form-group>

							<b-form-group
								:label="$t( 'product_discontinue_on' )"
								label-for="discontinueOn">
								<b-input-group>
									<b-input-group-prepend>
										<b-input-group-text>
											<i class="fa fa-calendar"></i>
										</b-input-group-text>
									</b-input-group-prepend>
									<datepicker
										:value="form.discontinueOn"
										name="discontinueOn"
										input-class="form-control"></datepicker>
								</b-input-group>
							</b-form-group>

							<hr />

							<b-form-group
								v-if="!form.isVirtual"
								:label="$t( 'product_packaged_weight' )"
								label-for="packagedWeight">
								<b-form-input
									type="text"
									id="packagedWeight"
									:required=true
									v-model.trim="form.packagedWeight"></b-form-input>
							</b-form-group>

							<b-form-group
								v-if="!form.isVirtual"
								:label="$t( 'product_packaging_width' )"
								label-for="packagingX">
								<b-form-input
									type="text"
									id="packagingX"
									:required=true
									v-model.trim="form.packagingX"></b-form-input>
							</b-form-group>

							<b-form-group
								v-if="!form.isVirtual"
								:label="$t( 'product_packaging_height' )"
								label-for="packagingY">
								<b-form-input
									type="text"
									id="packagingY"
									:required=true
									v-model.trim="form.packagingY"></b-form-input>
							</b-form-group>

							<b-form-group
								v-if="!form.isVirtual"
								:label="$t( 'product_packaging_depth' )"
								label-for="packagingZ">
								<b-form-input
									type="text"
									id="packagingZ"
									:required=true
									v-model.trim="form.packagingZ"></b-form-input>
							</b-form-group>

							<button
								id="saveDetails"
								class="btn btn-success"
								@click="saveDetails">
								{{ $t( 'product_save_sku' ) }}
							</button>

						</b-col>

					</b-row>

				</b-card>

			</b-col>

		</b-row>

    </b-container>

</template>

<script>
import Datepicker from 'vuejs-datepicker';
import htmlEditor from '@cbcAdmin/components/ui/html-editor';
import galleryListSortable from '@cbcAdmin/components/images/gallery-list-sortable';
import consignorForm from "@cbcAdmin/components/customers/consignor-form";
import vSelect from 'vue-select';
import { Form } from '@cbcAdmin/classes/form';
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import api from "@cbcAdmin/api/index";

export default {

	components: {
		Datepicker,
		htmlEditor,
		galleryListSortable,
		vSelect,
		consignorForm
	},

	props: {
		data: {
			type    : Object,
			required: true
		}
	},

	computed : {
		...mapGetters([ "currentProduct" ] ),
		sideBarTitle() {
			return ( this.data.method === 'edit' ) ? this.$t( 'product_sku_edit' ) : this.$t( 'product_sku_add' );
		},
		...mapState({
			baseAPIHref : state => state.globalData.baseAPIHref,
			allowConsignment : state => state.globalData.settings.features.consignment,
			allowVirtual : state => state.globalData.settings.features.virtualProducts,
			parentConditions(state){
				return this.$options.filters
					.denormalize( state.globalData.productConditions )
					.filter( condition => !condition.FK_parent );
			},
			childConditions( state ){
				return this.$options.filters
									.denormalize( state.globalData.productConditions )
									.filter( condition => condition.FK_parent );
}		}),
		consignorsListArray(){
			return this.$options.filters.denormalize( this.consignors );
		}
	},

	data() {
		return {
			form: new Form(),
			blankForm: {
				isActive : true,
				isConsigned : false,
				isVirtual : false,
				pickUpInStore : false,
				showPricing: true,
				allowBackorder : false
			},
			eventPrefix : "activeSKU_",
			consignors : { results : [], resultsMap : {} },
			booleanOptions : [
				{ text: this.$t( 'Yes' ), value: true },
				{ text: this.$t( 'No' ), value: false }
			]
		};
	},

	methods: {
		...mapActions([
			"saveSKU",
			"deleteSKUImage",
			"updateSKUImage",
			"updateSKUImageField"

		]),
		...mapMutations([
			"insertSKUImage"
		]),
		onSearchconsignors( search, loading ){
			var self = this;
			loading( true );
			api().get.customers.list( { search : search, role: "consignor" } )
						.then( XHR => {
							var results = XHR.data;
							results.results.forEach( resultId => {
								let result = results.resultsMap[ resultId ];
								result.displayName = result.lastName + ', ' + result.firstName;
							} )
							Object.assign( self.consignors, results );
							loading( false );
						} )
						.catch( err => console.log( err ) )
		},
		closePanel() {
			this.$emit( 'closePanel', {
				skuDetails: this.form
			} );
		},

		saveDetails() {
			var self = this;
			this.$set( this.form, "FK_product", this.currentProduct.id );
			this.$set( this.form, "includes", "condition,subCondition,consignor" );
			this.saveSKU( this.form ).then(
				result => {
					self.closePanel()
				}
			);
		},

		setconsignor : function (val) {
			if( !val ) val = {};
			this.$set( this.form, "consignor", val );
		}
	},

	mounted() {
		var self = this;
		EventBus.$on( this.eventPrefix + "saveImageDetails", function( imageData ){
			self.updateSKUImage( imageData );
		} );
		EventBus.$on( this.eventPrefix + "deleteMediaItem", function( imageData ){
			self.deleteSKUImage( imageData );
		} );
		EventBus.$on( this.eventPrefix + "mediaUploadSuccess", function( imageData ){
			self.insertSKUImage( imageData );
		});
		EventBus.$on( this.eventPrefix + "onMediaSort", event => {
			event.items.forEach( eventItem => {
				self.updateSKUImageField( { href: eventItem.item.href, field: "displayOrder", value : eventItem.sort } );
			})
		});
		console.log( this.data );
		this.$set( this, "form", new Form( this.data.sku && this.data.sku.id ? this.data.sku : { ...this.blankForm } ) );
	},
	beforeDestroy(){
		EventBus.$off( this.eventPrefix + "saveImageDetails", this.listener );
		EventBus.$off( this.eventPrefix + "deleteMediaItem", this.listener );
		EventBus.$off( this.eventPrefix + "onMediaUploadSuccess", this.listener );
		EventBus.$off( this.eventPrefix + "onMediaSort", this.listener );
	}

}
</script>
<style>
i.closePanelIcon {
	cursor: pointer;
	font-size: 24px;
}
</style>