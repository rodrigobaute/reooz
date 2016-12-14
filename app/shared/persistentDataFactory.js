angular.module('reooz')

.factory('PersistentData', function () {

	return {
		setItem: function(key, value) {
			// console.log('set item called with key == ' + key +' and value == '+value);
			window.localStorage.setItem( key, value);
		},
		getItem: function(key) {
			return window.localStorage.getItem( key );
		},
		clearProfile: function(){
			window.localStorage.removeItem('accessToken');
			window.localStorage.removeItem('userID');
			window.localStorage.removeItem('email');
			window.localStorage.removeItem('password');
			window.localStorage.removeItem('first_name');
			window.localStorage.removeItem('last_name');
			window.localStorage.removeItem('friends');
			window.localStorage.removeItem('gender');
			window.localStorage.removeItem('name');
			window.localStorage.removeItem("access_token");
			window.localStorage.removeItem('mySelectState');
			window.localStorage.removeItem('mySelectState');
			window.localStorage.removeItem("personId");
			window.localStorage.removeItem('celNumber');
			window.localStorage.removeItem('bioLink');


		},
		setList: function(key, list) {

			productList = window.localStorage.getItem( key );

			if(productList === null){

				productList = list;

			}else{

				productList = JSON.parse( productList )
				productList = productList.concat(list);

			}
			
			window.localStorage.setItem( key ,JSON.stringify( productList ));
		},

		clearProductList: function() {
			return window.localStorage.removeItem(  'productList' );
		},
		clearLocalStorage: function() {
			return window.localStorage.clear();
		}
	}
})
