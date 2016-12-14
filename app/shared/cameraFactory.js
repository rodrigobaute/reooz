angular.module('reooz')

.factory('CameraService', ['$q', '$compile','$ionicPlatform', function ($compile, $q, $ionicPlatform) {

  var init_defer;
        /**
         * Service object
         * @type object
         */
         var service = {
          takePic: takePic,
          openGallery: openFilePicker,
          initCamera: initCamera,
        };


        /**
         * @ngdoc method
         * @name initPaymentUI
         * @methodOf app.PaypalService
         * @description
         * Inits the payapl ui with certain envs. 
         *
         * 
         * @returns {object} Promise paypal ui init done
         */
         function initCamera() {

          init_defer = $q.defer();


          return init_defer.promise;

        }


        function takePic(takeImgId, cameraDirection){

          // var defer = $q.defer();
                    $ionicPlatform.ready().then(function () {

          var imgId = takeImgId;
          var selection = Number(cameraDirection);

          var srcType = Camera.PictureSourceType.CAMERA;
          var options = setOptions(srcType, Number(cameraDirection));

          navigator.camera.getPicture(function cameraSuccess(imageUri) {

            var elem = document.getElementById(imgId);

            // var image = new Image();
            // image.src = imageUri;

            // image.onload = function() {
            //   var srcWidth = image.width;
            //   var srcHeight = image.height;
            //   var ratio = Math.min(150 / srcWidth, 150 / srcHeight);
            //   image.width = srcWidth*ratio;
            //   image.height = srcHeight*ratio;

            //   elem.src =  image.src;

            //   return;
            // }

            elem.src = imageUri;

            return;


          }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");
            return false;
          }, options);
          
                    });
          return;

        }



        function setOptions(srcType, cameraDirection) {
          var options = {
            quality: 90,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true,
            cameraDirection:Number(cameraDirection)
          }
          return options;
        }


        function openFilePicker(imgId) {

          var imgId = takeImgId;
          var selection = 1;
          var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
          var options = setOptions(srcType);

          navigator.camera.getPicture(function cameraSuccess(imageUri) {

            return imageUri;

          }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");
            return false;
          }, options);
          return;
        }

        return service;

      }])