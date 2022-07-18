import defaultAPI from "./create";
import authentication from "./authentication";
import products from "./products";
import orders from "./orders";
import categories from "./categories";
import customers from "./customers";
import wishlists from "./wishlists";
import cart from "./cart";
import checkout from "./checkout";
import util from './util';

export const finalAPI = (apiInstance = defaultAPI) => ({
	get: {
		...products( apiInstance ).get,
		...orders( apiInstance ).get,
		...categories( apiInstance ).get,
		...customers( apiInstance ).get,
		...wishlists( apiInstance ).get,
		...cart( apiInstance ).get,
		...authentication( apiInstance ).get,
		...checkout( apiInstance ).get,
		...util( apiInstance ).get
	},
	post:{
		...products( apiInstance ).post,
		...categories( apiInstance ).post,
		...customers( apiInstance ).post,
		...wishlists( apiInstance ).post,
		...authentication( apiInstance ).post,
		...checkout( apiInstance ).post,
		...cart( apiInstance ).post,
		...util( apiInstance ).post
	},
	put:{
		...products( apiInstance ).put,
		...wishlists( apiInstance ).put,
		...cart( apiInstance ).put,
		...categories( apiInstance ).put
	},
	delete: {
		...products( apiInstance ).delete,
		...wishlists( apiInstance ).delete,
		...cart( apiInstance ).delete,
		...authentication( apiInstance ).delete,
		...categories( apiInstance ).delete
	},
	patch : {
		...products( apiInstance ).patch,
		...categories( apiInstance ).patch
	}
});

export default finalAPI;