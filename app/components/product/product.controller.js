"use strict";

angular
	.module("reooz")
	.controller("ProductController", ProductController);

ProductController.$inject = ['$scope', '$window', '$state', '$stateParams', '$filter', '$ionicModal', '$ionicNavBarDelegate', '$ionicPopup', '$ajax', 'config', '$notify', '$cordovaSocialSharing', '$cordovaActionSheet', '$messages', 'modal','PaypalService','DomainService','ngMeta'];

function ProductController($scope, $window, $state, $stateParams, $filter, $ionicModal, $ionicNavBarDelegate, $ionicPopup, $ajax, config, $notify, $cordovaSocialSharing, $cordovaActionSheet, $messages, modal, PaypalService, DomainService,ngMeta) {

	var vm = this;
	var url = config.base;
	var headers = {
	    'Authorization': 'Bearer ' + $window.localStorage['token']
	};
	var arrFav = $window.localStorage['itemFav'];
	vm.personId = $window.localStorage['personId'];
	vm.personPic = $window.localStorage['personPic'];
	vm.comentario = comentario;
	vm.favorito = favorito;	
	vm.addFriend = addFriend;
	vm.addFriend = addFriend;
	vm.editProduct = editProduct;
	vm.denunciar = denunciar;
	vm.denunciaSubmit = denunciaSubmit;
	vm.share = share;
	
	
	vm.keyboardX = 0;
	vm.inputY = 0;
	vm.imgPerfil = 'img/icons/icone-meuperfil.png';
	vm.itemFav = false;

	vm.modal = modal;

	vm.currentItem;
	vm.self = false;
	vm.showComent = false;
	
	if($stateParams.id) loadItens($stateParams.id);

	function loadItens(index){		
		 
		$ajax.get(url + "/api/Product/Get?productId=" + index,null,headers).then(function(res){				
		    console.log(res);

		    if( localStorage.getItem("itemFav") && arrFav.indexOf(res.productId) > -1) vm.itemFav = true;
			if(res.pictures.length<1)res.pictures[0] = {picture:{content:"img/reooz-green.png"}}
			vm.currentItem = res;
			$ionicNavBarDelegate.align("left");
			if (vm.currentItem.personId == vm.personId) vm.self = true;
			ngMeta.setTag('og:image', vm.currentItem.pictures[0].picture.url);
			ngMeta.setTag('og:title', vm.currentItem.title);
			ngMeta.setTag('og:description', vm.currentItem.description);
		});
		$ajax.get(url + "/api/Friend/Search?personId=1&page=0&pageSize=99999&criteria=", null, headers).then(function (res) {
		    console.log(res);
		    if (res.returnCode == '1000') {
		        vm.reoozrs = res.searchResult;
		        angular.forEach(vm.reoozrs, function (value) {
		            value.label = value.userName.toLowerCase();
		            value.imageUrl = value.friendImage.url;
		        })
		        var fire = firebase.database().ref('comentarios/' + $stateParams.id);
		        // Attach an asynchronous callback to read the data at our posts reference
		        fire.on('value', function (data) {
		            vm.comentariosList = data.val();
		            //$filter('orderObjectBy')(vm.comentariosList, 'timestamp');
		            vm.comentariosList = orderBy(vm.comentariosList, 'timestamp');
		            console.log(vm.comentariosList);
		            if (!$scope.$$phase) {
		                //$digest or $apply
		                $scope.$apply();
		            }

		        });
		    }
		    // else $messages.alert(res.returnCode, res.returnMessage);
		});
	}	
	
	
	function comentario(){
	
	    if (vm.msg != '') {	       

	  	    var newPostKey = firebase.database().ref().child('comentarios').push().key;

	  	    var postData = {
	  	        author: vm.personId,
	  	        authorPicture:vm.personPic,
				    destination: $stateParams.id,				
				    message: vm.msg,
				    timestamp: moment().format('YYYY-MM-D-HH-mm-ss')
			    };
		

		    // Write the new post's data simultaneously in the posts list and the user's post list.
		    var updates = {};
		    updates['comentarios/'+$stateParams.id+'/'+ newPostKey] = postData;

		    firebase.database().ref().update(updates);	   

		    var obj = {
		        ProductId: vm.currentItem.productId,
		        PersonId: vm.personId,
		        Message: vm.msg
		    };
		    $ajax.post(url + "/api/Product/SendMessage", obj, headers).then(function (res) {
		       
		        // else $messages.alert(res.returnCode, res.returnMessage);
		    });
		    vm.msg = '';
	  	}
		vm.showComent = false;
	}
	window.addEventListener('native.keyboardshow', keyboardShowHandler);

	function keyboardShowHandler(e) {
	    console.log('Keyboard height is: ' + e.keyboardHeight);
	    vm.keyboardX = e.keyboardHeight;
	    $scope.$apply();
	}
	window.addEventListener('native.keyboardhide', keyboardHideHandler);

	function keyboardHideHandler(e) {
	    console.log('Keyboard height is: ' + e.keyboardHeight);
	    vm.keyboardX = 0;
	    $scope.$apply();
	}
	function favorito(){	    	    
	    var action = vm.itemFav == true ? "DeleteFavorite": "AddFavorite"; 
	    vm.itemFav = !vm.itemFav;
	    $ajax.get(url + "/api/Product/" + action + "?personId=" + vm.personId + "&productId=" + vm.currentItem.productId, null, headers).then(function (res) {
            SaveDataToLocalStorage('itemFav', vm.currentItem.productId);
           
            
            if (vm.itemFav) $messages.alert('', 'Produto adcionado aos favoritos');
            else $messages.alert('', 'Produto removido dos favoritos');
        });
	}
	
	function share(){
		/*$cordovaSocialSharing.share(vm.currentItem.title, vm.currentItem.pictures[0].picture.url) // Share via native share sheet
	    .then(function(result) {
	      // Success!
	    }, function(err) {
	      // An error occured. Show a message to the user
	    });*/
	    var options = {
	        message: vm.currentItem.title, // not supported on some apps (Facebook, Instagram)
	        //subject: vm.currentItem.title, // fi. for email
	        files: [vm.currentItem.pictures[0].picture.url], // an array of filenames either locally or remotely
	        //url: 'https://www.website.com/foo/#bar?a=b',
	        chooserTitle: 'Compartilhe' // Android only, you can override the default share sheet title
	    }

	    var onSuccess = function (result) {
	        console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
	        console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
	    }

	    var onError = function (msg) {
	        console.log("Sharing failed with message: " + msg);
	    }

	    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
	}
	function addFriend(){
		var headers ={
        'Authorization': 'Bearer ' + $window.localStorage['token']
        }; 
        var obj = {
            PersonId: vm.personId,
            FriendId: vm.currentItem.personId,
            Status: 1
        };
  
		$ajax.post(url + "/api/Friend/Add",obj,headers).then(function(res){	
			$messages.alert(res.returnCode,res.returnMessage);
			console.log(res);
		});
	}
	function editProduct(item){
	    modal.showModal('app/components/feedSelf/cadastro.html', 'FeedSelfController', vm.currentItem);
	}
	function denunciar() {
	    //$messages.alert('Produto Denunciado', 'Um administrador irá avaliar sua denuncia!');
	    vm.modal.showModal('app/components/product/complaint.html');
	}

	function orderBy(items, field, reverse) {
	    
	        var filtered = [];
	        angular.forEach(items, function (item) {
	            filtered.push(item);
	        });
	        filtered.sort(function (a, b) {	            
	            return (a[field] > b[field] ? 1 : -1);
	        });
	        if (reverse) filtered.reverse();
	        return filtered;
	    
	}
	function SaveDataToLocalStorage(key,data) {
	    var a = [];
	    // Parse the serialized data back into an aray of objects
	    if (localStorage.getItem(key).prop && localStorage.getItem(key).prop.constructor === Array) a = JSON.parse(localStorage.getItem(key));
	    // Push the new data (whether it be an object or anything else) onto the array
	    var indice = a.indexOf(key);
	    if (indice > -1) a.splice(indice, 1);
	    else a.push(data);	    
	    localStorage.setItem(key, JSON.stringify(a));
	}
	function denunciaSubmit() {
	    if (vm.denuncia && vm.denuncia.motivo != '') {
	        console.log(vm.denuncia);
	        $ajax.get(url + "/api/Complaint/Add?personId=" + vm.personId + "&productId=" + vm.currentItem.productId + "&complaintType=" + vm.denuncia.motivo, null, headers).then(function (res) {
	            if (res.returnCode == 1000) {
	                $messages.alert('Produto Denunciado', 'Um administrador irá avaliar sua denuncia!');
	                vm.modal.hideModal();
	            }
	        });
	        //Complaint/Add?personId=41&productId=11&complaintType=1
	    }
	}
	DomainService.getDomain('COMPLAINT_TYPE', 1).then(function (res) {
	    vm.complaintType = res;
        console.log('denuncia')
        console.log(res);
	});
	vm.setFocus = function (item) {
	    var elm = document.getElementById('mentioInput');
	    console.log(elm);
	    setTimeout(function () { elm.focus(); }, 300);
	    return '@'+item.label;
	}
	
}
