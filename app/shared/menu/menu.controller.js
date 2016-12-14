"use strict";

angular
	.module("reooz")
	.controller("MenuCtrl", MenuCtrl);

MenuCtrl.$inject = ['$scope', '$window', '$state', '$location', '$rootScope', '$ionicHistory', '$ionicSideMenuDelegate', '$ionicTabsDelegate', '$ionicModal', '$ajax', 'config','$notify'];


function MenuCtrl($scope, $window, $state, $location, $rootScope, $ionicHistory, $ionicSideMenuDelegate, $ionicTabsDelegate, $ionicModal, $ajax, config, $notify) {
    var vm = this;
    var url = config.base;
    var headers = {
        'Authorization': 'Bearer ' + $window.localStorage['token']
    };
   
    vm.class = "main";
    vm.navGo = function(route,tab){
        console.log(route);
        $ionicHistory.nextViewOptions({		  
            disableBack: true
        });
        $state.go(route);
        if(tab>=0)$ionicTabsDelegate.select(tab);
    }
    vm.goBack = function() {
        $ionicHistory.goBack(-1);
    }
    vm.badgeCount = 0;
	
    vm.logout = logout;
    vm.menuOpen = menuOpen;

    $scope.$on("$ionicView.beforeEnter", function(event, data){
        // handle event
        $rootScope.headerClass = vm.headerClass = $state.current.class;
        console.log($state.current.class + vm.headerClass)
        if(!$window.localStorage['logado'] == true) $state.go('login');	  
    });


    setTimeout(function () {	    
	    var count = 0;
	    $ajax.get(url + "/api/Notification/List?personId=" + $window.localStorage['personId'], null, headers).then(function (res) {
	        angular.forEach(res.notifications, function (item) {
	            if (!item.visualized) count++;
	        });
	        vm.badgeCount = count;
	        $notify.setBadge(count);	        
	    });
	},1*1000);

	
	function logout(){
		console.log('sair');
		$window.localStorage.clear();
		$state.go('login');
		
	}
	function menuOpen(){
		$ionicSideMenuDelegate.toggleRight();
		$ionicSideMenuDelegate.canDragContent(!$ionicSideMenuDelegate.isOpen())
	}
	vm.showModal = function(templateUrl) {
		$ionicModal.fromTemplateUrl(templateUrl, {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			vm.modal = modal;
			vm.modal.show();
		});
	}
 
	// Close the modal
	vm.closeModal = function() {
		vm.modal.hide();
		vm.modal.remove()
	};
	
	
};

   
