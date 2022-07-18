import Index from "@cbcAdmin/components/index";
import Dashboard from "@cbcAdmin/components/dashboard";
import Orders from "@cbcAdmin/components/orders/list";
import OrderView from "@cbcAdmin/components/orders/view";
import OrderForm from "@cbcAdmin/components/orders/form";
import Categories from "@cbcAdmin/components/categories/list";
import CategoryForm from "@cbcAdmin/components/categories/form";
import Products from "@cbcAdmin/components/products/list";
import ProductForm from "@cbcAdmin/components/products/form";
import Customers from "@cbcAdmin/components/customers/list";
import CustomerForm from "@cbcAdmin/components/customers/form";
import LoginForm from "@cbcAdmin/components/auth/login-form";

import StripeConfig from "@cbcAdmin/components/settings/stripe-config";

export const createRouter = ( Vue, Router ) => {
	Vue.use( Router );
	return new Router({
		mode: "history",
		base: "store/admin",
		routes: [
			{
				path: "/",
				component: Index,
				children: [
					{
						path : "/login",
						name : "login",
						component : LoginForm
					},
					{
						path: "",
						name: "dashboard",
						component: Dashboard
					},
					{
						path: "/orders",
						name: "orders",
						component: Orders
					},
					{
						path: "/orders/:id",
						component: OrderView,
						name: "orderView"
					},
					{
						path: "/orders/new",
						component: OrderForm,
						name: "newOrder"
					},
					{
						path: "/categories",
						name: "categories",
						component: Categories
					},
					{
						path: "/categories/:id",
						component: CategoryForm,
						name: "categoryForm"
					},
					{
						path: "/categories/new",
						component: CategoryForm,
						name: "newCategory"
					},
					{
						path: "/products",
						name: "products",
						component: Products
					},
					{
						path: "/products/:id",
						component: ProductForm,
						name: "productForm"
					},
					{
						path: "/products/new",
						component: ProductForm,
						name: "newProduct"
					},
					{
						path: "/customers",
						name: "customers",
						component: Customers
					},
					{
						path: "/customers/:id",
						component: CustomerForm,
						name: "customerForm"
					},
					{
						path: "/customers/new",
						component: CustomerForm,
						name: "newCustomer"
					},
					{
						path: "/settings/stripe",
						component: StripeConfig,
						name: "stripeConfig"
					},
					{
			            path: "*",
			            redirect: { name: "dashboard" }
			        }
				]
			}
		]
	});
};

export default createRouter;