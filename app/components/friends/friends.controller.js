"use strict";

angular
	.module("reooz")
	.controller("FriendsController", FriendsController);

FriendsController.$inject= ['$scope','$window','$state','$ajax','config','$messages','DomainService','$cordovaFacebook','$ionicScrollDelegate'];

function FriendsController($scope,$window,$state,$ajax,config,$messages,DomainService,$cordovaFacebook,$ionicScrollDelegate){

	var vm = this;
	var url = config.base;
	var headers = {
	    'Authorization': 'Bearer ' + $window.localStorage['token'],
	    'Content-type': 'application/json'
	};
	var personId = $window.localStorage['personId'];
	

	vm.loadItens = loadItens;
	vm.slideTO = slideTO;
	vm.acceptFriend = acceptFriend;
	vm.refuseFriend = refuseFriend;
	vm.excludeFriend = excludeFriend;
	vm.buscarAmigo = buscarAmigo;
	vm.addFriend = addFriend;
	
	
	vm.currentIndex=0;

	vm.options = {	
	    effect: 'flip',
		pagination: false,		
		onSlideChangeStart: function(swiper){			
		    vm.currentIndex = swiper.activeIndex;
		    if (!$scope.$$phase) {
		        //$digest or $apply
		        $scope.$apply();
		    }
		},
		onInit: function(swiper){	
			vm.sliderF = swiper;
			swiper.hashnav = false;
		}
	};
	



	
	vm.itens=[];
	vm.imgPadrao ='img/icons/icone-meuperfil.png';
	console.log($window.localStorage['personId']);
	loadItens();
	function loadItens(){	
		 
        
		$ajax.get(url + "/api/Friend/ListMyFriends?personId=" + personId+ "&status=3",null,headers).then(function(res){				
			console.log(res);
			if (res.returnCode == '1000') {
			    vm.friends = res.friendsResult;
			    vm.semAmigos = false;
			}
			else vm.semAmigos = res.returnMessage;
		});
		$ajax.get(url + "/api/Friend/ListWaitingConfirmFriends?personId=" + personId, null, headers).then(function (res) {
			console.log(res);
			if(res.returnCode == '1000'){
			    vm.requests = res.friendsResult;
			    vm.semSolicitacoes = false;
            }
			else vm.semSolicitacoes= res.returnMessage;
		});
		$ajax.get(url + "/api/Friend/Search?personId=" + personId + "&page=0&pageSize=9999&criteria=", null, headers).then(function (res) {
		    console.log(res);
		    if (res.returnCode == '1000') {
		        vm.friendsSuggest = res.searchResult;
		    }
		    // else $messages.alert(res.returnCode, res.returnMessage);
		});
		vm.amigoUsername = '';
			
	}

	function slideTO(index){
		console.log(index);
		vm.currentIndex = index;
		vm.sliderF.slideTo(vm.currentIndex);
        $ionicScrollDelegate.scrollTop();
	}
	function acceptFriend(item) {
	    $ajax.get(url + "/api/Friend/RespondFriendshipRequest?friendshipId=" + item.friendshipId + "&status=3", null, headers).then(function (res) {
	        console.log(res);
	        if (res.returnCode == '1000') {
	            var index = vm.requests.indexOf(item);
	            vm.requests.splice(index,1);
	            loadItens();
	        }
	        else $messages.alert(res.returnCode, res.returnMessage);
	    });
	   
	}
	function refuseFriend(item) {
	    $ajax.get(url + "/api/Friend/RespondFriendshipRequest?friendshipId=" + item.friendshipId + "&status=2", null, headers).then(function (res) {
	        console.log(res);
	        if (res.returnCode == '1000') {
	            var index = vm.friends.indexOf(item);
	            vm.friends.splice(index, 1);
	            loadItens();
	        }
	        else $messages.alert(res.returnCode, res.returnMessage);
	    });

	}
	function excludeFriend(item) {

	    var obj = {
	        PersonId: personId,
	        FriendId: item.personId,
	        Status: null
	    };


	    $ajax.post(url + "/api/Friend/Exclude", obj, headers).then(function (res) {
	        console.log(res);
	        if (res.returnCode == '1000') {
	            var index = vm.requests.indexOf(item);
	            vm.requests.splice(index, 1);
	            loadItens();
	        }
	        else $messages.alert(res.returnCode, res.returnMessage);
	    });

	}
	function buscarAmigo() {
	    
	        $ajax.get(url + "/api/Friend/Search?personId=" + $window.localStorage['personId']+"&page=0&pageSize=99999" + "&criteria="+vm.amigoUsername, null, headers).then(function (res) {
	            console.log(res);
	            if (res.returnCode == '1000') {
	                vm.friendsSuggest = res.searchResult;
	            }
	           // else $messages.alert(res.returnCode, res.returnMessage);
	        });
	    
	}
	function addFriend(index) {
	    var obj = {
	        PersonId: $window.localStorage['personId'],
	        FriendId: index,
	        Status: 1
	    };

	    $ajax.post(url + "/api/Friend/Add", obj, headers).then(function (res) {
	        $messages.alert(res.returnCode, res.returnMessage);
	        console.log(res);
	        loadItens();
	        
	    });
	}
	DomainService.getDomain('STATE', 1).then(function (res) {
	    vm.estados = res;
	})
	vm.updateCidades = function (indice) {
	    DomainService.getDomain('CITY', indice).then(function (res) {
	        vm.cidades = res;
	    })
	}
	
	

}
