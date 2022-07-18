<template>

	<div>

		<b-form-group
			class="mt-5"
			:label="$t( 'first_name' )"
			label-for="firstName">
			<b-form-input
	        	required="required"
	        	class="form-control"
	        	id="firstName"
	        	v-model="form.firstName" />
		</b-form-group>

		<b-form-group
			:label="$t( 'last_name' )"
			label-for="lastName">
			<b-form-input
	        	required="required"
	        	class="form-control"
	        	id="lastName"
	        	v-model="form.lastName" />
		</b-form-group>

		<b-form-group
			:label="$t( 'Email' )"
			label-for="email">
			<b-form-input
				type="email"
	        	required="required"
	        	class="form-control"
	        	id="email"
	        	v-model="form.email" />
		</b-form-group>

	</div>

</template>
<script>
export default {
	name: "AccountInformationFields",
	props: {
		form : {
			type : Object,
			required : true
		}
	}

}
</script>