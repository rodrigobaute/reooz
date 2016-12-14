 angular.module('reooz.factories')

.factory('FacebookFactory', function ($http, $rootScope, $stateParams, PersistentData) {

  return {

    getPicture : function() {
        return $http.get("https://graph.facebook.com/v2.6/me/picture?height=500&width=500&redirect&access_token="+PersistentData.getItem("facebookToken"))
    },    
    getUserInfo : function() {
        return $http.get("https://graph.facebook.com/v2.6/me", {params: {access_token: PersistentData.getItem("facebookToken"), fields: "name, first_name, last_name,gender,location,picture,friends,email", format: "json" }});
    }
    
}

})