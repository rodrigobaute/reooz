"use strict";

angular
	.module("reooz")
	.controller("ProfileController", ProfileController);

ProfileController.$inject = ['$scope', '$window', '$state', '$ionicModal', '$ajax', 'config', '$messages', 'DomainService', '$cordovaCamera', '$cordovaImagePicker', '$cordovaActionSheet', '$cordovaFileTransfer'];

function ProfileController($scope, $window, $state, $ionicModal, $ajax, config, $messages, DomainService, $cordovaCamera, $cordovaImagePicker, $cordovaActionSheet, $cordovaFileTransfer) {

	var vm = this;
	var url = config.base;
	

	vm.loadItens = loadItens;
	vm.picture = picture;
	vm.imgPicker = imgPicker;
	vm.imgChoose = imgChoose;
	vm.setImage = setImage;
	vm.cadastroSubmit = cadastroSubmit;
    


	

	
	
	
	var page=0;
	var pageSize =8;
	var totalPages=10;
	
	var headers = {
	    'Authorization': 'Bearer ' + $window.localStorage['token']
	};


	vm.cropper = {};
	vm.cropper.sourceImage = null;
	vm.cropper.croppedImage = null;
	vm.bounds = {};
	vm.bounds.left = 0;
	vm.bounds.right = 0;
	vm.bounds.top = 0;
	vm.bounds.bottom = 0;
	
	vm.perfil=[];
	

	loadItens();
	function loadItens(){
		page++;

       if(page<=totalPages){
			  
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
               
               vm.updateCidades(vm.model.stateId);
               if (vm.model.picture == null){                   
                   vm.model.picture= {
                       uploadedImageId: '',
                       url: value,
                       alterado:true
                   }
			}
				console.log(vm.model);
			});
			
		}

	}	
	function imgChoose(indice) {


	    var imgpicker = {
	        title: 'Escolher fotos',
	        buttonLabels: ['Tirar Foto', 'Galeria'],
	        addCancelButtonWithLabel: 'Cancel',
	        androidEnableCancelButton: true, // default false
	        winphoneEnableCancelButton: true // default false        	    
	    };

	    $cordovaActionSheet.show(imgpicker)
		.then(function (index) {
		    if (index == 1) picture(indice);
		    else if (index == 2) imgPicker(indice);
		});


	}
	function picture(index) {
	    var options = {
	        quality: 70,
	        destinationType: Camera.DestinationType.FILE_URI,
	        sourceType: Camera.PictureSourceType.CAMERA,
	        allowEdit: true,
	        targetWidth: 300,
	        targetHeight: 300,
	        encodingType: Camera.EncodingType.JPEG,
	        popoverOptions: CameraPopoverOptions,
	        saveToPhotoAlbum: true,
	        correctOrientation: true
	    };
	    $cordovaCamera.getPicture(options).then(function (imageData) {
	        var image = document.getElementById('profilePic');
	        vm.model.picture.url = imageData;
	        vm.model.picture.alterado = true;
	        console.log(imageData);

	    }, function (err) {
	        // error
	    });
	}
	function imgPicker(index) {
	    var picker = {
	        maximumImagesCount: 1,
	        width: 300,
	        height: 300,
	        quality: 70
	    };
	    $cordovaImagePicker.getPictures(picker)
	    .then(function (res) {
	        console.log(res);
	        //vm.model.pictures = [];
           

	      angular.forEach(res, function (value) {
	          vm.tempPicture = value;
	          vm.showModal('app/components/profile/crop-image.html');	          

	        });
	        //vm.model.Pictures = res;
	    }, function (error) {
	        // error getting photos
	    });
	}
	function removeImg(index) {
	    console.log(index);
	    $messages.confirm('Excluir foto', 'Deseja realmente excluir essa imagem?', onYes);
	    function onYes() {
	        vm.model.picture=null;
	    }

	}
	function getFileContentAsBase64(path, callback) {
	    window.resolveLocalFileSystemURL(path, gotFile, fail);

	    function fail(e) {
	        alert('Cannot found requested file');
	    }

	    function gotFile(fileEntry) {
	        fileEntry.file(function (file) {
	            var reader = new FileReader();
	            reader.onloadend = function (e) {
	                var content = this.result;
	                callback(content);
	            };
	            // The most important point, use the readAsDatURL Method from the file plugin
	            //reader.readAsDataURL(file);
	            reader.readAsDataURL(file);
	        });
	    }
	}
	function setImage(img) {
	    vm.model.picture.url = img;
	    vm.model.picture.alterado = true;
	    vm.closeModal();
	}
	function cadastroSubmit() {
	  console.log(JSON.stringify(vm.model));
	    $ajax.post(url + "/api/Account/UpdateMyAccount", vm.model, headers).then(function (res) {	       
	        console.log(JSON.stringify(res));
	        $messages.alert(res.returnCode, res.returnMessage)
	        $state.go('app.main.feed');
	    });
	    if(vm.model.picture.alterado == true){
            console.log(vm.model.picture.content);
            var server = url + '/api/FileUpload/User/?personId='+$window.localStorage['personId'];
            var filePath = vm.model.picture.url;
            var options={};
            $cordovaFileTransfer.upload(server, filePath, options)
            .then(function(result) {
                // Success!
                $window.localStorage['personPic'] = result.images.url;
                console.log(result);
            }, function(err) {
                // Error
                console.log(err);
            }, function (progress) {
                console.log(progress);
                // constant progress updates
            });
	    }
	   
	}
	vm.showModal = function (templateUrl) {
	    $ionicModal.fromTemplateUrl(templateUrl, {
	        scope: $scope,
	        animation: 'slide-in-up'
	    }).then(function (modal) {
	        vm.modal = modal;
	        vm.modal.show();
	    });
	}

    // Close the modal
	vm.closeModal = function () {
	    vm.modal.hide();
	    vm.modal.remove()
	};
	DomainService.getDomain('STATE', 1).then(function (res) {
	    vm.estados = res;
	})
	vm.updateCidades = function (indice){
	    vm.cidades =[{id:0,text:'Carregando...'}];
	    DomainService.getDomain('CITY', indice).then(function (res) {
	        vm.cidades = res;
	    })
	}
	
	

}