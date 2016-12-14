"use strict";

angular
	.module("reooz")
	.controller("NegotiationController", NegotiationController);

NegotiationController.$inject = ['$scope', '$window', '$state', '$stateParams','$ionicPopup','$ionicHistory' ,'$ajax', 'config', '$messages', 'DomainService'];

function NegotiationController($scope, $window, $state, $stateParams,$ionicPopup,$ionicHistory, $ajax, config, $messages, DomainService) {

	var vm = this;
	var url = config.base;
	var headers = {
	    'Authorization': 'Bearer ' + $window.localStorage['token']
	};
	vm.imgPerfil = 'img/icons/icone-meuperfil.png';
	vm.imgPadrao = 'css/images-css/image1.jpg';
	var personId = vm.personId = $window.localStorage['personId'];
    
	var x;
	vm.cash = 0;
   

	vm.owner = {};
	vm.proposer = {}


    vm.addOwner = addOwner;
    vm.addProposer = addProposer;
    vm.sendNegotiation = sendNegotiation;
    vm.addOwnerCash = addOwnerCash;
    vm.addProposerCash = addProposerCash;

    var model = {

        Status: 1, 

        OwnerPerson: {
            PersonId: '',
            Products: []
        },

        ProposerPerson: {
            PersonId: '',
            Products: []
        }
    };
     console.log( $stateParams);
     if ($stateParams.status) model.Status = $stateParams.status;

    if ($stateParams.ownerProducts && $stateParams.ownerId && $stateParams.proposerProducts && $stateParams.proposerId)
        loadItens($stateParams.ownerProducts, $stateParams.ownerId, $stateParams.proposerProducts, $stateParams.proposerId);

    function loadItens(ownerProducts, ownerId, proposerProducts, proposerId) {
        ownerProducts = ownerProducts.split(',');
        proposerProducts = proposerProducts.split(',');
        
        var indice ='';
	   
	    $ajax.get(url + "/api/Account/GetRoozerProfile?personId=" + ownerId, null, headers).then(function (res) {	        
	        vm.owner = res;
	        
	        angular.forEach(ownerProducts, function (value) {
	            indice = vm.owner.products.findIndex(function (x) {return x.productId==value });
                console.log(indice);
	                if (indice > -1) {
	                    vm.owner.products[indice].selected = true;
	                    model.OwnerPerson.Products.push({ ProductId: value, Cash: null });
	                    if (ownerProducts.length == 1) swapItems(vm.owner.products, indice, 0);
	                }
	            })
	       
	        model.OwnerPerson.PersonId = ownerId;	        
	       
	    });

	    $ajax.get(url + "/api/Account/GetRoozerProfile?personId=" + proposerId, null, headers).then(function (res) {
	       model.ProposerPerson.PersonId = proposerId;
	      vm.proposer = res;
            console.log(res);
	       if (proposerProducts) {
	           angular.forEach(proposerProducts, function (value) {
	               indice = vm.proposer.products.findIndex(function (x) { return x.productId == value });
	               if(indice > -1){
	                   vm.proposer.products[indice].selected = true;
	                   model.ProposerPerson.Products.push({ ProductId: value, Cash: null });
	                   if (ownerProducts.length == 1) swapItems(vm.proposer.products, indice, 0);
                   }
	               
	           })

	       }
	        

	       
	    });
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
	function checkIndex(val) {
	    return val.productId == this;
	}
	function addOwner(item) {    
	   // var indice = getIndice(model.OwnerPerson.Products, 'ProductId', item.productId);
	    var indice = model.OwnerPerson.Products.findIndex(function (x) { return x.ProductId == item.productId });
	    if ( indice >-1) {
	        item.selected = false;
	        model.OwnerPerson.Products.splice(indice, 1);
	    } else {
	        item.selected = true;
	        model.OwnerPerson.Products.push({ ProductId: item.productId, Cash: null })
	    }
	    console.log(model);
	}
	function addProposer(item) {
        console.log(item);
       // var indice = getIndice(model.ProposerPerson.Products, 'ProductId', item.productId);
        var indice = model.ProposerPerson.Products.findIndex(function (x) { return x.ProductId == item.productId });
	    if (indice > -1) {
	        item.selected = false;
	        model.ProposerPerson.Products.splice(indice, 1);
	    } else {
	        item.selected = true;	       
	        model.ProposerPerson.Products.push({ ProductId: item.productId, Cash: null })
	    }
	    console.log(model);
	}
	function addOwnerCash() {
	    var myPopup = $ionicPopup.show({
	        template: '<input type="text" ng-model="negotiationVm.cash" ui-number-mask>',
	        title: 'Valor que deseja solicitar: R$',
	        //subTitle: 'Please use normal things',
	        scope: $scope,
	        buttons: [
              { text: 'Cancelar' },
              {
                  text: '<b>Concluir</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                      if (!vm.cash) {
                          //don't allow the user to close unless he enters wifi password
                          e.preventDefault();
                      } else {
                          var index = model.OwnerPerson.Products.findIndex(function (x) {return x.ProductId==null });
                          if (index > -1) model.OwnerPerson.Products[index].Cash = vm.cash;
                          else model.OwnerPerson.Products.push({ ProductId: null, Cash: vm.cash });
                          vm.owner.hasCash = 'R$ '+vm.cash;
                          vm.cash = 0;
                      }
                  }
              }
	        ]
	    });
	}
	function addProposerCash() {
	    var myPopup = $ionicPopup.show({
	        template: '<input type="text" ng-model="negotiationVm.cash" ui-number-mask>',
	        title: 'Valor que deseja oferecer: R$',
	        //subTitle: 'Please use normal things',
	        scope: $scope,
	        buttons: [
              { text: 'Cancelar' },
              {
                  text: '<b>Concluir</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                      if (!vm.cash) {
                          //don't allow the user to close unless he enters wifi password
                          e.preventDefault();
                      } else {
                          var index = model.ProposerPerson.Products.findIndex(function (x) { return x.ProductId == null });
                          if (index > -1) model.ProposerPerson.Products[index].Cash = vm.cash;
                          else model.ProposerPerson.Products.push({ ProductId: null, Cash: vm.cash });
                          vm.proposer.hasCash = 'R$ ' + vm.cash;
                          vm.cash = 0;
                          console.log(vm.proposer);
                      }
                  }
              }
	        ]
	    });
	}
	function getIndice(array, attr, value) {
	   /* for (var i = 0; i < array.length; i += 1) {
	        if (array[i][attr] === value) {
	            return i;
	        }
	    }
	    return -1;*/
        var i = array.findIndex(function(val){return val.attr ==value})

       
	}
	function sendNegotiation() {
	    $ajax.post(url + "/api/Negotiation/SendNewOffer", model, headers).then(function (res) {
	        if (res.returnCode == 1000) {
	            $messages.alert('Negociação', 'Proposta enviada com sucesso!');
	            $state.go('app.main.feed');
	        }
	    });
	}
	function swapItems (sArr,a, b) {
	    sArr[a] = sArr.splice(b, 1, sArr[a])[0];
	    return sArr;
	}

	
}
