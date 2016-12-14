"use strict";

angular
	.module("reooz")
	.controller("FeedSelfController", FeedSelfController);

FeedSelfController.$inject= ['$rootScope','$scope','$window','$injector','$state','$ionicModal','$ionicPopup','$ajax','config','$messages','DomainService','$cordovaCamera','$cordovaImagePicker','$cordovaActionSheet','modal','PaypalService','$cordovaFileTransfer'];

function FeedSelfController($rootScope, $scope, $window, $injector, $state, $ionicModal, $ionicPopup, $ajax, config, $messages, DomainService, $cordovaCamera, $cordovaImagePicker, $cordovaActionSheet, modal, PaypalService, $cordovaFileTransfer) {

	var vm = this;
	var url = config.base;
	var personID = $window.localStorage['personId'];
	var $validationProvider = $injector.get('$validation');
	var headers = {
	    'Authorization': 'Bearer ' + $window.localStorage['token']
	};

	/*metodos*/
	vm.loadItens = loadItens;
	vm.cadastroModal = cadastroModal;
	vm.picture = picture;
	vm.imgPicker = imgPicker;
	vm.imgChoose = imgChoose;
	vm.updateSub = updateSub;
	vm.closeModal = closeModal;
	vm.showModal = showModal;
	vm.cadastroSubmit = cadastroSubmit;
	vm.removeImg = removeImg;
	vm.removeProduct = removeProduct;
	vm.redirect = redirect;
	vm.sponsorPopUp = sponsorPopUp;

	vm.modal = modal;
	
	var page=0;
	var pageSize =16;
	var totalPages=10;

	


	vm.moreDataCanBeLoaded = true;	
	vm.noFeed = false;
	
	vm.itens = [];
	vm.categoria = {};
	vm.sub = {};
	vm.imgPadrao = 'css/images-css/image1.jpg';
	vm.iconCam = 'img/icons/cam.png';
	//vm.edit = false;
    
    vm.model = {
    productId: '',
    personId: personID,
    title: '',
    description: '',
    estimatedPrice: '',
    isForSell: true,
    isForSellExchange: true,
    isForRent: false,
    countryId: 1,
    stateId: 1,
    cityId: 1,
        
    category:
        {
        categoryId: null,
        subCategoryId: null,
        typeId: null
        },
        
    pictures: [
               { picture:
                {uploadedImageId: ''}
               },
               { picture:
               {uploadedImageId: ''}
               },
               { picture:
               {uploadedImageId: ''}
               },
               ]
    }
    
    if ($rootScope.$param){
        vm.model = $rootScope.$param;
        vm.edit = true;
    }
	
	

	loadItens();
	function loadItens(){
	    $ajax.get(url + "/api/Account/GetRoozerProfile?personId=" + personID, null, headers).then(function (res) {
	        vm.reoozr = res;
	        DomainService.getDomain('STATE', 1).then(function (res) {
	            var indexState = res.findIndex(function (x) { return x.id == vm.reoozr.user.stateId; });
	            console.log(indexState);
	            indexState != -1?vm.reoozr.user.estado = res[indexState]:null;
	            DomainService.getDomain('CITY', vm.reoozr.user.stateId).then(function (val) {
	                var indexCity = val.findIndex(function(x){return x.id==vm.reoozr.user.cityId;});

	                indexCity!= -1?vm.reoozr.user.cidade = val[indexCity]:null;
	            })
	        })
	    });
	    $ajax.get(url + "/api/Product/List?personId=" + personID + '&title&category&subCategory&searchFriendsProducts=false&page=0&pageSize=900&orderBy=ProductId&orderDirection=DESC', null, headers).then(function (res) {
	        console.log(res);
	        
	        if (res.returnCode==1000){
	            if ($rootScope.$param) {
	                DomainService.getDomain('CAT', 1).then(function (res) {
	                    vm.cat = res;
	                    DomainService.getDomain('STATE', 1).then(function (res) {
	                        vm.estados = res;
	                        vm.updateCidades($rootScope.$param.stateId);
	                    })
				       
				        vm.updateSub($rootScope.$param.category.categoryId);
				         vm.model = {
				            productId: $rootScope.$param.productId,
				            personId: personID,
				            title: $rootScope.$param.title,
				            description: $rootScope.$param.description,
				            estimatedPrice: $rootScope.$param.estimatedPrice,
				            isForSell: $rootScope.$param.isForSell,
				            isForSellExchange: $rootScope.$param.isForSellExchange,
				            isForRent: $rootScope.$param.isForRent,
				            countryId: $rootScope.$param.countryId,
				            stateId: $rootScope.$param.stateId,
				            cityId: $rootScope.$param.cityId,
				            category:
				            {
				                categoryId: $rootScope.$param.category.categoryId,
				                subCategoryId: $rootScope.$param.category.subCategoryId,
				                typeId: $rootScope.$param.category.typeId
				            },

				            pictures: $rootScope.$param.pictures
				           
				         }
				       
				        })
				    vm.edit = true;
				} else {
				    vm.model = {
				        productId: '',
				        personId: personID,
				        title: '',
				        description: '',
				        estimatedPrice: '',
				        isForSell: true,
				        isForSellExchange: true,
				        isForRent: true,
				        countryId: 1,
				        stateId: 1,
				        cityId: 1,

				        category:
				        {
				            categoryId: null,
				            subCategoryId: null,
				           typeId: null
				        },
				        pictures: [
                          { picture:
                           {uploadedImageId: ''}
                          },
                          { picture:
                          {uploadedImageId: ''}
                          },
                          { picture:
                          {uploadedImageId: ''}
                          }
				                    ]
				       
				    }
				    vm.edit = false;

				}
				vm.itens = res.products;	
				if (res.products.length < 1) vm.noFeed = true;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				console.log(vm.model);
	        } else {
	            vm.noFeed = true;
	        }
		});
	}
	function cadastroModal(){
		modal.showModal('app/components/feedSelf/cadastro.html');
	}
	function imgChoose(indice){
		 var imgpicker = {
		    title: 'Escolher fotos',
		    buttonLabels: ['Tirar Foto', 'Galeria'],
		    addCancelButtonWithLabel: 'Cancelar',	
		    androidEnableCancelButton : true, // default false
        	winphoneEnableCancelButton : true // default false        	    
		  };

		$cordovaActionSheet.show(imgpicker)
		.then(function(index) {
		    if (index == 1) vm.picture(indice);
		    else if (index == 2) vm.imgPicker(indice);
		});		
	}
	function picture(index) {
	    var options = {
	        quality: 70,
	        targetWidth: 800,
	        targetHeight: 800,
	        destinationType: Camera.DestinationType.DATA_URI,
	        sourceType: Camera.PictureSourceType.CAMERA,
	        allowEdit: false,
	        encodingType: Camera.EncodingType.JPEG,
	        popoverOptions: CameraPopoverOptions,
	        saveToPhotoAlbum: true,
	        correctOrientation: true
	    };
		$cordovaCamera.getPicture(options).then(function(imageData) {
		   
		    var tempP =
	      	    {
	      	        picture:{
	      	            uploadedImageId: '',
	      	            url: imageData,
	      	            alterado: true
	      	        }
                   
                }
                                               if (vm.model.pictures && vm.model.pictures[index] != null) tempP.picture.uploadedImageId = vm.model.pictures[index].picture.uploadedImageId
	      	if (index > 0 && vm.model.pictures[index - 1] == null) vm.model.pictures.push(tempP);
	      	else vm.model.pictures[index] = tempP;
	      	console.log(vm.model.pictures)
	      	
	    }, function(err) {
	      // error
	    });
	}
	function imgPicker(index) {
		var picker = {
		   maximumImagesCount: 1,
		   width: 800,
		   height: 800,
		   quality: 80
		};
		
		$cordovaImagePicker.getPictures(picker)
	    .then(function (res) {
	    	console.log(res);
	    	angular.forEach(res, function(value) {
	    	    	    	   
			  	/*getFileContentAsBase64(value,function(base64Image){			  	    			  	    
	    	       
				});*/
	    	    var tempP =
	      	    {
	      	        picture: {
	      	            uploadedImageId: '',
	      	            url: value,
                        alterado:true
	      	        }

	      	    }
	    	    if (vm.model.pictures && vm.model.pictures[index] != null) tempP.picture.uploadedImageId = vm.model.pictures[index].picture.uploadedImageId
	    	    if (index > 0 && vm.model.pictures[index - 1] == null) vm.model.pictures.push(tempP);
	    	    else vm.model.pictures[index] = tempP;


	    	    $scope.$apply();

				
			});	       
	    }, function(error) {
	      // error getting photos
	    });
	}

	function showModal(templateUrl) {
	    modal.showModal('app/components/feedSelf/cadastro.html', 'FeedSelfController', vm.currentItem);
	    if ($rootScope.$param) {
	        vm.model = $rootScope.$param;
	    }
	}
	// Close the modal
	function closeModal() {
		vm.modal.hide();
		vm.modal.remove()
	};
	DomainService.getDomain('STATE', 1).then(function (res) {
	    vm.estados = res;
	})
	vm.updateCidades = function (indice) {
	    vm.cidades = [{ id: '', text: 'Carregando' }];
	    DomainService.getDomain('CITY', indice).then(function (res) {
	        vm.cidades = res;
	    })
	}
	
	DomainService.getDomain('CAT',1).then(function(res){
		vm.cat = res;
		
	})
	function updateSub(indice){
		console.log('categoria');
		console.log(indice);
		DomainService.getDomain('SUB_CAT',indice).then(function(res){				
			vm.subCat = res;			
		})
	}	
	function cadastroSubmit(form) {

	    
	    
		
		$validationProvider.validate(form)
		.success(function(res){					
		    

			if (vm.edit == true) {
			    console.log('update:'+JSON.stringify(vm.model));			    	
                $ajax.post(url + "/api/Product/Update", vm.model, headers).then(function (res) {                   
			        if (res.returnCode == '1000') {
			           vm.sponsorPopUp();
			            vm.imgUpload(res);
                                                                                vm.modal.hideModal();
			        }
			        else $messages.alert('Produto editado com sucesso', '');
			    })
			} else {
			    console.log('new');
			    $ajax.post(url + "/api/Product/Add", vm.model, headers).then(function (res) {
			        console.log(res);
			        if (res.returnCode == '1000') {
vm.sponsorPopUp();
			            vm.imgUpload(res);
                                                                             vm.modal.hideModal();
			        }
			        else $messages.alert(res.returnCode, res.returnMessage);
			    })
			}			
			console.log('form ok');
			console.log(vm.model);
		})
        .error(function(err){
        	console.log(err);
        	$messages.alert('Aviso','Preencha corretamente os campos');
        });
	}
	function getFileContentAsBase64(path,callback){
	    window.resolveLocalFileSystemURL(path, gotFile, fail);	            
	    function fail(e) {
	          alert('Cannot found requested file');
	    }
	    function gotFile(fileEntry) {
	           fileEntry.file(function(file) {
	              var reader = new FileReader();
	              reader.onloadend = function(e) {
	                   var content = this.result;
	                   callback(content);
	              };
	              // The most important point, use the readAsDatURL Method from the file plugin
	              reader.readAsDataURL(file);
	           });
	    }
	}
	function removeImg(index) {
	    console.log(index);
	    $messages.confirm('Excluir foto', 'Deseja realmente excluir essa imagem?', onYes);
	    function onYes() {
	        vm.model.pictures.splice(index, 1);
	    }	    
	}
	function removeProduct(item) {
	    $messages.confirm('Excluir produto', 'Deseja realmente excluir esse produto?', onYes);
	    function onYes() {
	        $ajax.get(url + "/api/Product/Delete?productId=" + item.productId, null, headers).then(function (res) {	        
	            console.log(res);
	            vm.itens.splice(vm.itens.indexOf(item),1)
	        })
	    }	    
	}
	function redirect(url) {
	    window.location = url;
	}
	function sponsorPopUp() {
	    // An elaborate, custom popup
	    var myPopup = $ionicPopup.show({
	        template: '<select id="sponsor"><option value="10">10,00R$ por 10 dias</option><option value="20">20,00R$  por 20 dias</option><option value="30">30,00R$ por 30 dias</option></select>',
	        title: 'Vamos patrocinar o seu produto!?',
	        subTitle: 'Escolha um valor para patrocinar o seu produto e ele aparecera com destaque no nosso feed!',
	        scope: $scope,
	        buttons: [
            {
                text: 'Não quero patrocinar este produto.',
                type: 'button-positive',
                onTap: function (e) {


                }
            },
          {
              text: '<b>Quero patrocinar!</b>',
              type: 'button-positive',
              onTap: function (e) {

                  var yourSelect = document.getElementById("sponsor");
                  console.log(yourSelect.options[yourSelect.selectedIndex].value)
                  PaypalService.initPaymentUI().then(function () {
                      PaypalService.makePayment(Number(yourSelect.options[yourSelect.selectedIndex].value), "Patrocinio");
                  });

              }
          }
	        ]
	    });
	}
	vm.imgUpload = function(res){
	    console.log(vm.model.pictures.url);
	    var server = url + '/api/FileUpload/Product/?productId=' + res.productId;
	    // var filePath = vm.model.pictures;
	    console.log('val:' + JSON.stringify(vm.model.pictures));
	    var options = {};
	    angular.forEach(vm.model.pictures, function (value) {
            if(value.picture.alterado){
                var tempUrl = server + '&imageId=' + value.picture.uploadedImageId;
                $cordovaFileTransfer.upload(tempUrl, value.picture.url, options)
                .then(function (result) {
                    // Success!
                    
                    $state.reload();
                    
                    console.log(result);
                }, function (err) {
                    // Error
                    console.log(err);
                }, function (progress) {
                    console.log(progress);
                    // constant progress updates
                });
            }

	    });
	}
	
	

}
