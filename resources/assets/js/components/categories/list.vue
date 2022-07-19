<template>

	<div>

        <page-header
            :headerTitle="$t( 'categories' )"
            :displayToolBarButton="true"
            routeName="newCategory"
            buttonIconClass="fa fa-plus">
        </page-header>
		<p class="text-muted">{{ $t( 'categories_order' ) }} Click the <i class="fa fa-pencil"></i> icon to edit.</p>

		<div class="nestable-categories-list nested-expandable col-sm-12">
			<generic-loader v-if="!categoriesListArray" :message="$t( 'categories_loading' )"></generic-loader>
			<vue-nestable
				v-else
				:value="categoriesListArray"
				@input="reviseHierarchy"
				@change="saveCategories"
			>
				<vue-nestable-handle
				class="nestable-category-item"
				slot-scope="{ item }"
				:item="item">
					<div class="row">
						<div class="col col-1">
							<a href="javascript:;" class="btn btn-sm text-muted" style="cursor:move">
								<i class="fa fa-bars"></i>
							</a>
						</div>
						<div class="col">
							<strong>{{item.name}}</strong>
						</div>
						<div class="col col-6" v-html="item.description"></div>
						<div class="col col-2">
							<a
								href="javascript:;"
								@click="toggleExpand"
								class="btn btn-default btn-sm float-right"
								v-if="item.children && item.children.length"
							>
								<i class="fa fa-caret-down fa-2x"></i>
							</a>

							<a class="btn btn-link btn-sm float-right" @click="$bvToast.show( 'confirm-delete-' + item.id )">
								<i class="fa fa-trash"></i>
							</a>

							<b-toast :id="`confirm-delete-${item.id}`" class="confirm-toast" :title="`Delete Category ${item.name}`" static no-auto-hide>
								<p class="alert alert-danger">
								Are you sure you want to delete the category <em>{{item.name}}</em>?  Deleting a category will detach all products and children.
								Child categories will be re-assigned without a parent.
								</p>
								<hr/>
								<p class="text-right">
									<a class="btn btn-success btn-sm" @click="$bvToast.hide( 'confirm-delete-' + item.id )">No, Cancel</a>
									<a class="btn btn-danger btn-sm" @click="deleteCategory( item.id );$bvToast.hide( 'confirm-delete-' + item.id )">Yes, Delete Category</a>
								</p>
							</b-toast>

							<router-link
							:to="{ name: 'categoryForm', params: { id: item.id } }"
							class="btn btn-default btn-sm float-right">
								<i class="fa fa-pencil"></i>
							</router-link>
						</div>
					</div>

				</vue-nestable-handle>
			</vue-nestable>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import moment from "moment";
import TableRow from "./table-row";
export default {

	components: {
		TableRow
	},

    data() {
    	return {
			filterParams : {
				isActive : 1,
				sortOrder : 'displayOrder ASC',
				isNull : 'FK_parent',
				// four levels deep by default
				includes : "children.children.children.children.children"
			},
			variations: 0

    	}
    },

    mounted() {
    	this.fetchCategories();
    },
    computed: {
    	...mapGetters([
			"categoriesListArray"
		]),
		topLevelIds(){
			return this.categoriesListArray.map( cat => cat.id );
		}
    },
    methods: {

    	...mapActions([
			"getCategories",
			"saveCategory",
			"deleteCategory"
		]),
		...mapMutations([
			"setCategories"
		]),
		toggleExpand( e ){
			var $btn = $( e.currentTarget );
			var $item = $btn.closest( '.nestable-item' );
			$( '.nestable-list', $item ).slideToggle();
			$( 'i', $btn ).toggleClass( 'fa-caret-down' ).toggleClass( 'fa-caret-up' );
		},
		reviseHierarchy( topLevels ){
			this.$set( this, "variations", this.variations + 1 );
			if( this.variations <= 1 ) return;
			var self = this;
			// the arguments provided are the newly adjusted levels, from the top down.
			topLevels.forEach( ( cat, index ) => {
				let parentId = "";
				let displayOrder = index + 1;
				if( cat.FK_parent !== parentId || cat.displayOrder !== displayOrder  ){
					cat.FK_parent = parentId;
					cat.displayOrder = displayOrder;
				}
				self.reviseChildHierarcies( cat );
			} );
			this.$store.commit( "setCategories", this.$options.filters.normalize( topLevels ) );
		},
		saveCategories( value, options ){
			var self = this;
			let topLevels = options.items;
			topLevels.forEach( ( cat, index ) =>{
				let displayOrder = index + 1;
				self.saveCategory(
					{
						"id" : cat.id,
						"displayOrder" : displayOrder,
						"FK_parent" : ""

					}
				);
				if( cat.children.length ){
					cat.children.forEach( ( child, j ) => {
						let displayOrder = j + 1;
						self.saveCategory(
							{
								"id" : child.id,
								"displayOrder" : displayOrder,
								"FK_parent" : cat.id

							}
						);
						if( child.children.length ){
							child.children.forEach( ( tertiary, k ) => {
								let displayOrder = k + 1;
								self.saveCategory(
									{
										"id" : tertiary.id,
										"displayOrder" : displayOrder,
										"FK_parent" : child.id

									}
								);
							} );
						}
					} );
				}
			} );
		},
		reviseChildHierarcies( parent ){
			var self = this;
			parent.children.forEach( ( cat, index ) => {
				let parentId = parent.id;
				let displayOrder = index + 1;

				if( cat.FK_parent !== parentId || cat.displayOrder !== displayOrder  ){
					cat.FK_parent = parentId;
					cat.displayOrder = displayOrder;
				}
				self.reviseChildHierarcies( cat )
			} );
		},
    	fetchCategories(){
			this.$set( this, "variations", 0 );
			this.getCategories( this.filterParams );

    	}

    },

}
</script>