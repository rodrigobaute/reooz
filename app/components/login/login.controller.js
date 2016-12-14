"use strict";

angular
	.module("reooz")
	.controller("LoginController", LoginController);

LoginController.$inject= ['$scope','$state','$injector','$ajax','config','$ionicModal','$messages','DomainService','$db','Token','$window','$cordovaFacebook','$notify'];

function LoginController($scope,$state,$injector,$ajax,config,$ionicModal,$messages,DomainService,$db,Token,$window,$cordovaFacebook,$notify){

	var vm = this;
	var url = config.base;
	var dbName = 'reooz.config';
    if($window.localStorage['logado']){
        $state.go('app.main.feed');
    }
    
	
	

	var userConfig = {};
	var video = document.createElement('video');
	var canvas = document.createElement('canvas');	

	var $validationProvider = $injector.get('$validation');


	/*Metodos*/
	vm.login = login;
	vm.loginFacebook = loginFacebook;
	vm.passRecover = passRecover;
	vm.passRecoverModal = passRecoverModal;
	vm.cadastroSubmit = cadastroSubmit
	vm.cadastroModal = cadastroModal;
	vm.createByFacebook = createByFacebook;
	vm.validateUser = validateUser;


	vm.estados=[];
	vm.cidades = [];
	vm.subList = [];
	vm.byFace = false;
	

	

	vm.cadastro = { 
	        personId: '',
	        firstName: '',
	        lastName: '',
	        userName: '',
	        phoneNumber: '',
	        countryId: '',
	        stateId: '',
	        cityId: '',
	        email: '',
	        password: '',
	        bioLink: '',
	        facebookId: '',

	        preferences: [{ personId: null, categoryId: null, subCategoryId: null, typeId: null }
                          ],

	        picture: {}
        }
	


	function login(user,pass){
		
	    var data = { "Email": user, "Password": pass };
       
	    $ajax.post(url + "/api/Account/Login", data).then(function (res) {
            console.log(res);
			if (!firebase.auth().currentUser) {	
					firebase.auth().signInWithEmailAndPassword(user, pass).catch(function(error) {				
						firebase.auth().createUserWithEmailAndPassword(user, pass).catch(function(error) {						 
						  var errorCode = error.code;
						  var errorMessage = error.message;
						  console.log(errorCode, errorMessage);

						}).then(function(user){
						    user.getToken().then(function(data) {
						        //console.log(data)
						        $window.localStorage['firebaseToken'] = data;
						    });
						})
					});
			}
			firebase.auth().onAuthStateChanged(function (user) {
			    if (user) {
			        user.getToken().then(function (data) {
			            $window.localStorage['firebaseToken'] = data;
			        });
			    }
			});
            var userData={};
			userData._id ="config";
			userData.email = res.email;
			userData.personId = res.personId;
			



			Token.getToken(user,pass).then(function(res){
				userData.Token = res;
				$window.localStorage['token'] = userData.Token;
				$window.localStorage['logado'] = true;
				$window.localStorage['personId'] = userData.personId;
				console.log(userData);
				var headers = {
				    'Authorization': 'Bearer ' + $window.localStorage['token']
				};
				$ajax.get(url + "/api/Account/GetMyAccount/?personId=" + userData.personId, null, headers).then(function (result) {
				    $window.localStorage['personPic'] = result.picture.url;
				});
				if(vm.modal)vm.closeModal();
				$state.go('app.main.feed');
			});

		}).catch(function(err){
			console.log(err)
		})
	}

	function loginFacebook(){
		console.log('face');	
	    $cordovaFacebook.login(["public_profile"])
	    .then(function(res) {
	    	
	    	var faceUser = res.authResponse;
	    	$window.localStorage['facebookID'] = faceUser.userID;
	    	console.log(faceUser);
	    	$ajax.get(url + "/api/Account/SignUpFacebook?facebookId="+faceUser.userID).then(function(res){
	    		console.log(res);
	    		var userData = res;
	    		if (res.isNewUser==true) {
           	        vm.createByFacebook();
	    		    console.log('new user');

                }
                else {
                   
                    login(res.email,res.password)
                }
            });

	    }, function (error) {
	      // error
	      console.log(error);
	    });
      
	}
	function createByFacebook() {
	    vm.byFace = true;
		$cordovaFacebook.api("me?fields=first_name,last_name,email,picture", ["email"])
	    .then(function(res) {
	        
	        vm.cadastro = {
	            personId: '',
	            firstName: res.first_name,
	            lastName: res.last_name,
	            userName: '',
	            phoneNumber: '',
	            countryId: '1',
	            stateId: '1',
	            cityId: '1',
	            email: res.email,
	            password: '',
	            bioLink: '',
	            facebookId: res.id,
	            preferences: [{ personId: null, categoryId: null, subCategoryId: null, typeId: null }],
	            picture:{ url: res.picture.data.url } 
	        };
	        //console.log('cadastro');
	        //console.log(vm.cadastro);
	    	cadastroModal();
		    /*$ajax.post(url + "/api/Account/CreateMyAccount", obj).then(function(res){
				console.log(res);
				if(res.returnCode=='1000'){					
				    login(res.email, res.password);
				}
				else $messages.alert(res.returnCode,res.returnMessage);
			});*/
	      // success
	    }, function (error) {
	        // error
	        $messages.alert('', error);
	    });

        
    }

	function passRecover(){
		console.log(vm.user)		
		$ajax.get(url + "/api/Account/ForgotMyPassword?email="+vm.user).then(function(res){
			console.log(res);
			$messages.alert('',res.returnMessage);
			if(res.returnCode=='1000')vm.closeModal();
		}).catch(function(err){
			console.log(err);
		})
	}
	function passRecoverModal(){
		vm.showModal('app/components/login/password-recover.html');
	}

	function cadastroSubmit(form){
		
		if(vm.cadastro.password.length){
			if(vm.cadastro.password != vm.cadastro.passwordConfirm){
				$messages.alert('Aviso','As senhas digitadas nao conferem');
			}else{
				$validationProvider.validate(form)
				.success(function(){
					//vm.cadastro.mySelectState = vm.estadoSelect.id;
					//vm.cadastro.mySelectCity = vm.cidadeSelect.id;

					$ajax.post(url + "/api/Account/CreateMyAccount", vm.cadastro).then(function(res){
						console.log(res);
						if(res.returnCode=='1000'){
							vm.closeModal();
							vm.login(vm.cadastro.email,res.password)
						}
						else $messages.alert('Erro','Não foi possível realizar o cadastro1');
					})
				})
	            .error(function(err){
	            	console.log(err);
	            	$messages.alert('Aviso','Preencha corretamente os campos');
	            });			
							
			}
		}else{
			$messages.alert('Aviso','Preencha corretamente os campos');
		}
		

	}
	function cadastroModal(){
		vm.showModal('app/components/login/cadastro.html');
	}

	/*videoBg();
	function videoBg() {	 
        video.src = 'img/bg-video.mp4';
        video.loop = true;
        video.muted = true;
        video.addEventListener('playing', paintVideo);
        video.play();
        
       
        angular.element(canvas).addClass('bg-vid');
        var el = document.getElementById('bg-vid');
        el.appendChild(canvas);
	}
	function paintVideo() {
	   
	    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
	   
	    if (!video.paused)
	        requestAnimationFrame(paintVideo);
	}*/

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
	function validateUser() {
	    var strUser = vm.cadastro.userName;
	   // strUser = strUser.replace(/[^a-z]/gi, '');
	    if (strUser.length > 5) {
	        $ajax.get(url + "/api/Account/ExistUsername?username=" + vm.cadastro.UserName).then(function (res) {
	            console.log(res);
	           
	        });
	    }
	}
	DomainService.getDomain('STATE', 1).then(function (res) {
	    vm.estados = res;
	})
	vm.updateCidades = function (indice) {
	    vm.cidades = [{ id: '', text: 'Carregando' }];
	    DomainService.getDomain('CITY', indice).then(function (res) {
	        vm.cidades = res;
	    })
	}
	DomainService.getDomain('CAT', 1).then(function (res) {
	    vm.categorias = res;
	})
	vm.updateSub = function (indice, listId) {
	    vm.subList[listId] = [{ id: '', text: 'Carregando' }];
	    DomainService.getDomain('SUB_CAT', indice).then(function (res) {
	        if (res[0] != '') vm.subList[listId] = res;
	        //else vm.subList.splice(listId, 1);
	        console.log(res.length);
	        console.log(indice +' - '+ listId);
	    })
	}
	vm.addInput = function () {
	    console.log("new input");
	    vm.cadastro.preferences.push({
	        personId: null, categoryId: null, subCategoryId: null, typeId: null
	    });
	    console.log(vm.cadastro.preferences);
	}

	vm.removeInput = function (index) {
	    vm.cadastro.preferences.splice(index, 1);
	    vm.subList(index, 1);
	}
	window.addEventListener('native.keyboardshow', keyboardShowHandler);

	function keyboardShowHandler(e) {
	    console.log('Keyboard height is: ' + e.keyboardHeight);
	    vm.keyboardX = e.keyboardHeight - 50;
	    $scope.$apply();
	}
	window.addEventListener('native.keyboardhide', keyboardHideHandler);

	function keyboardHideHandler(e) {
	    console.log('Keyboard height is: ' + e.keyboardHeight);
	    vm.keyboardX = 0;
	    $scope.$apply();
	}

}
