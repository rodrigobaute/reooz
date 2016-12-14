// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('reooz', ['ionic', 'ngCordova', 'ngAnimate', 'validation', 'validation.rule', 'masonry', 'firebase', 'ui.utils.masks', 'ngImgCrop', 'ionic-toast', 'ionic-cache-src', 'ion-select-autocomplete', 'mentio', 'ngMeta'])

.run(function($ionicPlatform,$notify,$window,ngMeta) {
	 ngMeta.init();
  $ionicPlatform.ready(function() {
                         console.log('ready');
						
   if (window.cordova) {
                       
    console.log('window.cordova is available');
  } else {
    console.log('window.cordova NOT available');
  }
   //
   if (!localStorage.getItem("itemFav")) localStorage.setItem("itemFav",[]);

   console.log('UUID: '+window.device.uuid);
                       if($window.localStorage['token'])$notify.Init();
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
        StatusBar.hide();
        ionic.Platform.fullScreen();
    }
    //$ionicPlatform.isFullScreen = true;
  });
})
.config(function ($sceDelegateProvider,$httpProvider,$ionicConfigProvider,$cordovaFacebookProvider,$compileProvider,ngMetaProvider) {
   $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    '**'
    ]);
  //$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|http?|ftp|mailto|file|tel):|data:image\//);
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
  $httpProvider.defaults.useXDomain = true; 
  
  $ionicConfigProvider.tabs.position('bottom'); 
  $ionicConfigProvider.backButton.text('');

  var appID ='1750226725223026';  
  var version ='v2.6';
  
  //$cordovaFacebookProvider.setAppID(appID, version);
  $cordovaFacebookProvider.setAppID(appID, version); 

  /*$ionicCloudProvider.init({
    "core": {
      "app_id": "9dcf09df"
    }
  });*/
  

  var config = {
      apiKey: "AIzaSyBHzYJ1L3zF8njAzN92ShV5Pktb57KGe1E",
      authDomain: "reooz-ffdff.firebaseapp.com",
      databaseURL: "https://reooz-ffdff.firebaseio.com",
      storageBucket: "reooz-ffdff.appspot.com",
      messagingSenderId: "523897182216"
    };
  firebase.initializeApp(config);

  
  
  $httpProvider.interceptors.push('httpLoad');
  console.log($httpProvider)
 
    
});
/*.config(function($httpProvider) {
     delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.defaults.headers.common["Accept"] = "application/json";
  $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
  $httpProvider.defaults.headers.common["Content-Type"] = "application/javascript";
})*/
