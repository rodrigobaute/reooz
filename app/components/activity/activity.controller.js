"use strict";

angular
	.module("reooz")
	.controller("ActivityController", ActivityController);

ActivityController.$inject = ['$scope', '$window', '$state', '$ajax', 'config', '$messages', 'DomainService','$ionicScrollDelegate','$rootScope','$notify'];

function ActivityController($scope, $window, $state, $ajax, config, $messages, DomainService, $ionicScrollDelegate, $rootScope, $notify) {

	var vm = this;
	var url = config.base;
	

	vm.loadItens = loadItens;
	
	
	var page=0;
	var pageSize =8;
	var totalPages = 10;
	var headers = {
	    'Authorization': 'Bearer ' + $window.localStorage['token']
	};
	
	vm.options = {
	    effect: 'slide',
	    pagination: false,
	    onSlideChangeStart: function (swiper) {
	        console.log(swiper.activeIndex);
	        vm.currentIndex = swiper.activeIndex;
	        if (!$scope.$$phase) {
	            //$digest or $apply
	            $scope.$apply();
	        }
	    },
	    onInit: function (swiper) {
	        vm.sliderF = swiper;
	        swiper.hashnav = false;
	    }
	};
	vm.slideTO = slideTO;
	vm.perfil=[];
	vm.currentIndex = 0;
	vm.imgPadrao = 'img/icons/icone-meuperfil.png';

	

	loadItens();
	function loadItens(){
		page++;
		var read = [];
       if(page<=totalPages){
			 
			$ajax.get(url + "/api/Notification/List?personId=" + $window.localStorage['personId']+'&page=0&pagesize=90', null, headers).then(function (res) {
			    vm.notifications = res.notifications;
			    console.log(res);
			    angular.forEach(res.notifications, function (item) {
			        if (!item.visualized) read.push(item.notificationId);
			    });
			    console.log(read);
			    $ajax.post(url + "/api/Notification/Update", read, headers).then(function (res) {			        
			        console.log(res);	
			        $notify.setBadge(0);
			        $scope.$apply();
			    });

			});
			
		}

	}
	function slideTO(index) {
	    console.log(index);
	    vm.currentIndex = index;
	    vm.sliderF.slideTo(vm.currentIndex);
	    $ionicScrollDelegate.scrollTop();
	}
	
	
	

}