angular.module('reooz')

.service('Token', function ($httpParamSerializerJQLike,$httpParamSerializer,$ajax,config) {
  return {
    getToken : function(user,pass) {
        console.log(user,pass);        
        var headers ={
            'Content-type':"application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin" : "*",
            //"Access-Control-Allow-Headers" : "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
           // "Access-Control-Allow-Methods" : "GET, PUT, POST"        
        };           
        //var param = {grant_type:'password', userName: user, password: pass };
        var param = 'grant_type=password&userName='+ user+'&password='+ pass ;        
        console.log($httpParamSerializerJQLike(param))            
        return $ajax.post(config.base + "/Token",param,headers).then(function(res){            
            return res.access_token;
        })  
    }
}

})