<template>

	<div class="col-lg-12 mb-2">

		<address-details-card
			:type="type"
			:displayEditAction=true
			:address="address"
			@showAddressFormPanel="showAddressFormPanel">
		</address-details-card>

	</div>

</template>
<script>
import addressDetailsCard from '@cbcAdmin/components/address/address-details-card';
import addressSidebar from '@cbcAdmin/components/address/address-sidebar';
export default {

	components: {
		addressDetailsCard,
		addressSidebar
	},
	props: [
		'address',
		'type'
	],
	data(){
		formPanel : null
	},
	methods: {

		showAddressFormPanel() {
			var thisAddress = this.address;
			var thisType    = this.type;
			this.formPanel = this.$showPanel( {
				component: addressSidebar,
				width    : '1020px',
				cssClass : 'slideout-panel-overall',
				props    : {
					data: {
						address: thisAddress,
						method : 'edit',
						type   : thisType
					},
				}
			} );
			this.formPanel.promise
				.then( result => {
					//result is whatever you're panel component passes to this.$emit("closePanel", {})
				});
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