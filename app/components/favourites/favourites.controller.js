"use strict";

angular
	.module("reooz")
	.controller("FavouritesController", FavouritesController);

FavouritesController.$inject = ['$rootScope', '$scope', '$window', '$state', '$httpParamSerializerJQLike', '$ajax', 'config', '$messages', 'DomainService', '$ionicModal'];

function FavouritesController($rootScope, $scope, $window, $state, $httpParamSerializerJQLike, $ajax, config, $messages, DomainService, $ionicModal) {

	var vm = this;
	var url = config.base;
	

	vm.loadItens = loadItens;
	vm.updateSub = updateSub;
	vm.busca = busca;
	vm.external = external;
	vm.onDragDown = onDragDown;
	vm.hideSearch = hideSearch;
	
	
	var page=0;
	var pageSize =12;
	var totalPages=10;
	vm.moreDataCanBeLoaded = true;

	var timer;
	

	vm.options = {
	    effect: 'slide',
	    pagination: false,
	    onSlideChangeStart: function (swiper) {
	        vm.currentIndex = swiper.activeIndex
	    },
	    onInit: function (swiper) {
	        vm.sliderF = swiper;
	        swiper.hashnav = false;
	    }
	};


	
	vm.itens = [];
	vm.imgPerfil = 'img/icons/icone-meuperfil.png';
	vm.imgPadrao = 'css/images-css/image1.jpg';
	vm.filter = false;
	vm.titleSeach = "";
	vm.searchFriends = false;
	vm.category = '';
	vm.subCategory = '';
	vm.personId = $window.localStorage['personId'];
	vm.showSearch = false;

	var personId = $window.localStorage['personId'];

	var headers = {
	    'Authorization': 'Bearer ' + $window.localStorage['token']
	};

	loadItens(0,10);
	function loadItens() {
	   
	   
	    
	   
           
	    $ajax.get(url + "/api/Product/ListFavorite?personId=" + personId, null, headers).then(function (res) {
			    console.log(res);
               if (res.returnCode == 1000) {
                   if (!vm.filter) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                       vm.itens = vm.itens.concat(res.products);

                   } else {
                       console.log(res);
                       vm.itens = res.products;                       
                       page = 0;
                       vm.filter = false;

                   }
                   totalPages = res.totalPages;
               } else {
                   $messages.alert(res.returnCode, res.returnMessage);
                   vm.titleSeach = "";
                   vm.searchFriends = false;
                   vm.category = '';
                   vm.subCategory = '';
               }
               page++;
               if (page < totalPages) vm.moreDataCanBeLoaded = true;
               $rootScope.$broadcast('scroll.infiniteScrollComplete');
			});
           
			
      
       

	}
	
	vm.showModal = function (templateUrl) {
	    $ionicModal.fromTemplateUrl(templateUrl, {
	        scope: $scope,
	        animation: 'slide-in-up'
	    }).then(function (modal) {
	        vm.filter = true;
	        vm.modal = modal;
	        vm.modal.show();
	    });
	}

    // Close the modal
	vm.closeModal = function () {
	    vm.filter = false;
	    vm.modal.hide();
	    vm.modal.remove()
	};
	DomainService.getDomain('CAT', 1).then(function (res) {
	    vm.cat = res;

	})
	
	function updateSub(indice) {
	    console.log('categoria');
	    console.log(indice);
	    DomainService.getDomain('SUB_CAT', indice).then(function (res) {
	        vm.subCat = res;
	    })
	}
	function busca() {
	   
	    vm.filter = true;
	    vm.showSearch = false;
	        vm.loadItens();            
	   
	}
	function hideSearch() {
	    vm.titleSeach = '';
	    vm.showSearch = false;
	    vm.filter = true;
	    vm.loadItens();
	}
	function external(url) {
	    window.open(url, '_system');
	    console.log(url);
	}
	function onDragDown() {
	    console.log('drag down');
	}
	
	
	
	

}
