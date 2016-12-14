"use strict";

angular
	.module("reooz")
	.controller("ConfigurationController", ConfigurationController);

ConfigurationController.$inject = ['$scope', '$window', '$state', '$ionicModal', '$ajax', 'config', '$messages', 'DomainService', '$cordovaCamera', '$cordovaImagePicker', '$cordovaActionSheet', '$cordovaFileTransfer'];

function ConfigurationController($scope, $window, $state, $ionicModal, $ajax, config, $messages, DomainService, $cordovaCamera, $cordovaImagePicker, $cordovaActionSheet, $cordovaFileTransfer) {

	var vm = this;
	var url = config.base;
	

	vm.loadItens = loadItens;
	
	vm.cadastroSubmit = cadastroSubmit;
	//vm.validateUser = validateUser;
	
	var page=0;
	var pageSize =8;
	var totalPages=10;
	
	var headers = {
	    'Authorization': 'Bearer ' + $window.localStorage['token']
	};


	vm.perfil = [];
	vm.subList = [];
	vm.catName = [];
	vm.subName=[];
	

	loadItens();
	function loadItens(){
		
	    DomainService.getDomain('CAT', 1).then(function (res) {	 
	        vm.categorias = res;
           $ajax.get(url + "/api/Account/GetMyAccount/?personId=" + $window.localStorage['personId'], null, headers).then(function (res) {
               

               vm.model = {
                   personId: $window.localStorage['personId'],
                   firstName: res.firstName,
                   lastName: res.lastName,
                   userName: res.userName,
                   phoneNumber: res.phoneNumber,
                   countryId: res.countryId,
                   stateId: res.stateId,
                   cityId: res.cityId,
                   email: res.email,
                   bioLink: res.bioLink,
                   facebookId: res.facebookId,
                   preferences: res.preferences,
                   picture: res.picture
               }

               //vm.model = res;
               
              
               if (vm.model.preferences == null || vm.model.preferences.length<1) {
                   vm.model.preferences.push({
                       personId: null, categoryId: null, subCategoryId: null, typeId: null
                   });
               } else {
                   angular.forEach(vm.model.preferences, function (value, index) {
                      // console.log(vm.categorias.findIndex(function (x) { return x.id == value.categoryId }));
                       vm.catName[index] = vm.categorias[vm.categorias.findIndex(function (x) { return x.id == value.categoryId })].text;
                       if (value.subCategoryId) {
                           DomainService.getDomain('SUB_CAT',  value.categoryId ).then(function (res) {
                               if (res[0] != '') {
                                   vm.subName[index] = res[res.findIndex(function (x) { return x.id == value.subCategoryId })].text;
                                   vm.subList[index] = res;
                                   console.log(index+' - '+res[res.findIndex(function (x) { return x.id == value.subCategoryId })].text)
                                  
                               }
                              
                           })
                       }
                   })
                  // console.log(vm.catName)
               }
            })
                   
               
				//console.log(vm.model);
			});
	    
		

	}	
	
	function cadastroSubmit() {
	  console.log(JSON.stringify(vm.model));
	    $ajax.post(url + "/api/Account/UpdateMyAccount", vm.model, headers).then(function (res) {	       
	        console.log(JSON.stringify(res));
	        $messages.alert('Sucesso', 'As informações foram salvas');
            $state.go('app.main.feed');
	    });
	}
	
	vm.updateSub = function (indice, listId) {
	    vm.subList[listId] = [{ id: '', text: 'Carregando' }];
	    DomainService.getDomain('SUB_CAT', indice).then(function (res) {
	        if (res[0] != '') vm.subList[listId] = res;
	        //else vm.subList.splice(listId, 1);
	        console.log(res.length);
	        console.log(indice + ' - ' + listId);
	    })
	}
	vm.addInput = function () {
	    console.log("new input");
	    vm.model.preferences.push({
	        personId: null, categoryId: null, subCategoryId: null, typeId: null
	    });
	    console.log(vm.model.preferences);
	}

	vm.removeInput = function (index) {
	    vm.model.preferences.splice(index, 1);
	    vm.subList(index, 1);
	}
	
	

}