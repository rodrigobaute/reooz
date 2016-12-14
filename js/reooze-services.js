angular.module("reooz")
.service('$messages', function ($ionicPopup, ionicToast) {
    this.alert = function (title,msg, callback) {
        ionicToast.show("<strong>"+title + "</strong> " + msg, 'top', false, 3500);
        /*var dialog = $ionicPopup.alert({

            title: $title,
            subTitle: $msg,
            preCloseCallback: $callback
        }).then(function () {
            if ($callback) $callback();
        })*/
    };

    this.info = function ($title, $msg, $callback) {
        var dialog = $ionicPopup.show({
            title: $title,
            subTitle: $msg
        }).then(function () {
            if ($callback) $callback();
        })
    };

    this.confirm = function (title, msg, callbackYes, callbackNo) {
        var dialog = $ionicPopup.confirm({
            title: title,
            subTitle: msg

        }).then(function (res) {
            if (res) {
                if (callbackYes) callbackYes();
            } else {
                if (callbackNo) callbackNo();
            }
        });
    };

    this.toast = function (title, msg) {
        ionicToast.show(title+" - "+msg, 'top', true, 2500);
    }

})
.service('$db', function ($messages, $rootScope, $q) {
    //serviço de gestão de banco de dados local	
    var service = {
        getAllDocs: getAllDocs,
        putAllDocs: putAllDocs,
        getOne: getOne,
        removeOne: removeOne,
        putOne: putOne,
        destroy: destroy
    };
    return service;

    /* Retorna todos os registros
	 * ('table', scope, mapa de variaveis, callback)
	 * ('table', callback)
	 * @return: Retorna a promise
	 */
    function getAllDocs(table, scope, vars, callback) {
        var db = new PouchDB(table);
        var regs = [];
        var defer;
        defer = $q.defer();
        var now = new Date()
        now.toJSON();

        if (typeof (scope) == 'function') callback = scope;

        return $q.when(
			db.allDocs(
				{
				    include_docs: true,
				    attachments: true
				}
			).then(
				function (results) {

				    if (results.total_rows > 0)
				        for (var i in results.rows)
				            regs.push(results.rows[i].doc);


				    if (vars) scope[vars] = regs
				    if (typeof (callback) == 'function') callback(regs);
				    defer.resolve(regs);
				    return defer.promise;
				}
			).catch(function (err) {
			    console.log(err);
			})
		);
    };


    /* Retorna um registro da tabela pelo id
	 * ('table', id, scope, mapa de variaveis, callback)
	 * ('table', id, callback)
	 * @return: Retorna a promise
	 */
    function getOne(table, id, scope, vars, callback) {
        var db = new PouchDB(table);
        var results = [];

        if (typeof (scope) == 'function') callback = scope;

        return $q.when(
			db.get(id).then(
				function (doc) {
				    if (vars) {
				        var keyScope = Object.keys(vars);
				        for (i in keyScope)
				            scope[keyScope[i]] = doc[vars[keyScope[i]]];
				    }

				    if (typeof (callback) == 'function') callback(doc);
				    return doc;
				}
			).catch(function (err) {
			    console.log(err);
			})
		);
    };

    /* Adiciona N registros de uma vez
	 * ('table', registros, callback)
	 * @return: null
	 */
    function putAllDocs(table, regs, callback) {
        var db = new PouchDB(table);
        return $q.when(
			db.bulkDocs(regs).then(
				function (results) {
				    if (callback) callback(results);
				    return results;
				}

			).catch(function (err) {
			    console.log(err);
			})
		);
    };

    //salva novo registro na tabela
    function putOne(table, values, callback) {
        var db = new PouchDB(table);

        return $q.when(
			db.get(values._id).catch(function (err) {// Verifica se ja existe registro com aquele id e atualiza
			    if (err.status === 404) { // not found!
			        db.put(values).then(
						function (results) {
						    if (callback) callback(results);
						}
					).catch(function (err) { console.log(err) })
			    }
			}).then(function (resp) {
			    //values._rev = resp._rev;
			    db.put(values);
			})

		);
    };
    //remove um registro da tabela pelo id e revisao
    function removeOne(table, id, rev, callback) {
        var db = new PouchDB(table);

        return $q.when(
			db.remove(id, rev).then(function (results) {
			    if (callback) callback(results);
			}).catch(function (err) {
			    console.log(err);
			})
		);
    };

    function destroy(table) {
        var db = new PouchDB(table);

        return $q.when(
			db.destroy().then(function (res) {
			    // database destroyed			  
			    return res;
			}).catch(function (err) {
			    console.log(err);
			    // error occurred
			})
		);
    }
})
.service('$ajax', function ($messages, $http, $q) {
    var service = {
        post: post,
        get: get
    };
    return service;

    function post(url, params, headers, scope, vars, callback) {
        var result = [];
        var status = '';
        var i;
        var req = {
            method: 'POST',
            url: url,
            data: params,
            headers: headers
        }

        if (typeof (scope) == 'function') callback = scope;

        return $http(req)
		.then(
			function (response) {

			    if (vars) {
			        var keyScope = Object.keys(vars);
			        for (i in keyScope) {
			            scope[keyScope[i]] = response.data.results[vars[keyScope[i]]];
			        }
			    }

			    return response.data;

			}, function errorCallback(err) {
			    console.log(err);
			    $messages.alert(err.data.returnCode, err.data.returnMessage);
			}
		);
    }

    function get(url, params, headers, scope, vars, callback) {
        var result = [];
        var status = '';
        var i;
        var req = {
            method: 'GET',
            url: url,
            data: params,
            headers: headers
        };

        if (typeof (params) == 'function') callback = params;
        if (typeof (scope) == 'function') callback = scope;

        return $http(req)
		.then(
			function (response) {

			    if (vars) {
			        var keyScope = Object.keys(vars);
			        for (i in keyScope) {
			            scope[keyScope[i]] = response.data[vars[keyScope[i]]];
			        }
			    }
			    if (typeof (callback) == 'function') callback(response.data);
			    return response.data;
			}, function errorCallback(err) {
			    console.log(err);
			    $messages.alert(err.data.returnCode, err.data.returnMessage);
			}
		);
    }


})
.service('$notify', function ($window, $rootScope, $state, $cordovaLocalNotification, $cordovaPushV5,$ajax, config,$log) {

    var service = {
        Init: Init,
        notify: notify,
        subscribe: subscribe,
        setBadge: setBadge
    };
    return service;

    function Init(database, route, tilt, msg) {
        var options = {
            android: {
                senderID: "523897182216"
            },
            ios: {
                senderID: "523897182216",
                alert: "true",
                badge: "true",
                sound: "true",
                gcmSandbox: "true",
                priority: "high",
         	
            },
            windows: {}
        };
        console.log('init notify');

        //service.notify('Parabens', 'Você receberá notificações sobre o interações com o produto!');

        $cordovaPushV5.initialize(options).then(function (push) {
            // start listening for new notifications
            $cordovaPushV5.onNotification();
            // start listening for errors
            $cordovaPushV5.onError();
            /*  push.on('notification', function (data) {
                      $rootScope.badgeCount++;
                      service.setBadge($rootScope.badgeCount);
                      service.notify(data.tilte, data.message, data.additionalData);
                      });*/
                                               
                                                
            console.log(push)
            // register to get registrationId
            $cordovaPushV5.register().then(function (registrationId) {
                //service.setBadge(0);
                // save `registrationId` somewhere;
                $window.localStorage['firebaseRID'] = registrationId;
                console.log(registrationId);
                var obj = {
                    PersonId: $window.localStorage['personId'],
                    DeviceId: window.device.uuid,
                    RegistrationId: registrationId
                };
                var headers = {
                    'Authorization': 'Bearer ' + $window.localStorage['token']
                };
                $ajax.post(config.base + "/api/Account/ProcessRegistrationId", obj, headers);

            })
        });

        // triggered every time notification received
        $rootScope.$on('$cordovaPushV5:notificationReceived', function (event, data) {
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
            console.log(event);
            console.log(data);
        
            $rootScope.badgeCount++;
            service.setBadge($rootScope.badgeCount);
            service.notify(data.tilte, data.message, data.additionalData);
        });
        $rootScope.$on('$cordovaPushV5:errorOcurred', function (event, e) {
            // e.message
            console.log(e);
        });
    }
    function notify(tilt, msg, param) {

        var now = new Date().getTime(),
        _10_seconds_from_now = new Date(now + 10 * 1000);

        cordova.plugins.notification.local.schedule({
            title: tilt,
            message: msg,
            // at: _10_seconds_from_now,
            sound: "file://assets/notify.mp3",
            icon: "icon.png",
            data: param
        });
        service.setBadge();


    }
    function setBadge(num) {
        console.log('badge');
        if (num) {
            $rootScope.badgeCount = num;
            $cordovaPushV5.setBadgeNumber(num);
           
        }
        else $cordovaPushV5.setBadgeNumber($cordovaPushV5.getBadgeNumber + 1);
                


    }
    function subscribe(topic) {
        //$http.get('https://iid.googleapis.com/iid/v1/'+$window.localStorage['firebaseRID']+'?details=true')
        $http.get('https://iid.googleapis.com/iid/v1/' + $window.localStorage['firebaseRID'] + '/rel/topics/' + topic)
    }
})
.factory('facebookLogin', function ($q) {
    return {
        Login: function () {
            var deferred = $q.defer();
            FB.getLoginStatus(function (response) {
                console.log(response);
                if (response.status === 'connected') {
                    Facebook.api('/me', function (res) {

                        console.log(res);
                    });
                    deferred.resolve(response);
                }
                else {
                    FB.login();
                    console.log('not log');
                }

            });
            return deferred.promise;
        }
    }
})
.service('modal', function ($ionicModal) {

    this.showModal = function (templateUrl, controller) {

        var service = this;

        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: null,
            controller: controller,
            animation: 'slide-in-up'
        }).then(function (modal) {
            service.modal = modal;
            service.modal.show();
        });
    };

    this.closeModal = function () {
        this.modal.hide();
    };

})

.factory('DomainService', function ($ajax, $stateParams, config) {

    return {
        //type Types --> CAT, SUB_CAT, COUNTRY, STATE, CITY
        getDomain: function (type, fatherId) {

            return $ajax.get(config.base + "/api/Domain/GetDomain?type=" + type + "&fatherId=" + fatherId);
        }
    }
})
.factory('facebookService', function ($q) {
    return {
        getMyLastName: function () {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'last_name'
            }, function (response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }
    }
})
.directive('clickForOptions', ['$ionicGesture', function ($ionicGesture) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $ionicGesture.on('tap', function (e) {

                // Grab the content
                var content = element[0].querySelector('.item-content');

                // Grab the buttons and their width
                var buttons = element[0].querySelector('.item-options');

                if (!buttons) {
                    console.log('There are no option buttons');
                    return;
                }
                var buttonsWidth = buttons.offsetWidth;

                ionic.requestAnimationFrame(function () {
                    content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

                    if (!buttons.classList.contains('invisible')) {
                        console.log('close');
                        content.style[ionic.CSS.TRANSFORM] = '';
                        setTimeout(function () {
                            buttons.classList.add('invisible');
                        }, 250);
                    } else {
                        buttons.classList.remove('invisible');
                        content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
                    }
                });

            }, element);
        }
    };
}])
.service('modal', function ($rootScope, $ionicModal) {
    var service = this;

    var $thisScope = $rootScope.$new(true);

    this.showModal = function (url, controller, param) {

        angular.extend($thisScope, this);
        console.log(param);
        $rootScope.$param = param;
        $ionicModal.fromTemplateUrl(url, {
            scope: $rootScope,
            controller: controller,
            animation: 'slide-in-up'
        }).then(function (modal) {

            service.modal = modal;
            service.modal.show();
        });
    };

    this.hideModal = function () {
        service.modal.hide();
    };

})
.filter('orderObjectBy', function () {
    return function (items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function (item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) filtered.reverse();
        return filtered;
    };
})
.filter('moment', function () {
    return function (input, momentFn /*, param1, param2, ...param n */) {
        var args = Array.prototype.slice.call(arguments, 2),
            momentObj = moment(input);
        moment.locale('pt-BR');
        return momentObj[momentFn].apply(momentObj, args);
    };
})
.constant('PaypalConfig', {

    payPalSandboxId: 'ASF-qCz8Po79gaDhMivkPCZKYUrVaH_s3MFmGhQXarJ5oPKg7loQ21V17Jk6kmeAmA7jceilAh50DudG',
    payPalProductionId: 'production id here',
    payPalEnv: 'PayPalEnvironmentSandbox',   // for testing  production for production
    payPalShopName: 'Reooz',
    payPalMerchantPrivacyPolicyURL: 'https://mytestshop.com/policy',
    payPalMerchantUserAgreementURL: 'https://mytestshop.com/agreement'

})
.factory('PaypalService', ['$q', '$ionicPlatform', 'PaypalConfig', '$filter', '$timeout', function ($q, $ionicPlatform, PaypalConfig, $filter, $timeout) {



    var init_defer;
    /**
     * Service object
     * @type object
     */
    var service = {
        initPaymentUI: initPaymentUI,
        createPayment: createPayment,
        configuration: configuration,
        onPayPalMobileInit: onPayPalMobileInit,
        makePayment: makePayment
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
    function initPaymentUI() {

        init_defer = $q.defer();
        $ionicPlatform.ready().then(function () {

            var clientIDs = {
                "PayPalEnvironmentProduction": PaypalConfig.payPalProductionId,
                "PayPalEnvironmentSandbox": PaypalConfig.payPalSandboxId
            };
            PayPalMobile.init(clientIDs, onPayPalMobileInit);
        });

        return init_defer.promise;

    }


    /**
     * @ngdoc method
     * @name createPayment
     * @methodOf app.PaypalService
     * @param {string|number} total total sum. Pattern 12.23
     * @param {string} name name of the item in paypal
     * @description
     * Creates a paypal payment object 
     *
     * 
     * @returns {object} PayPalPaymentObject
     */
    function createPayment(total, name) {

        // "Sale  == >  immediate payment
        // "Auth" for payment authorization only, to be captured separately at a later time.
        // "Order" for taking an order, with authorization and capture to be done separately at a later time.
        var payment = new PayPalPayment("" + total, "BRL", "" + name, "Sale");
        return payment;
    }
    /**
     * @ngdoc method
     * @name configuration
     * @methodOf app.PaypalService
     * @description
     * Helper to create a paypal configuration object
     *
     * 
     * @returns {object} PayPal configuration
     */
    function configuration() {
        // for more options see `paypal-mobile-js-helper.js`
        var config = new PayPalConfiguration({ merchantName: PaypalConfig.payPalShopName, merchantPrivacyPolicyURL: PaypalConfig.payPalMerchantPrivacyPolicyURL, merchantUserAgreementURL: PaypalConfig.payPalMerchantUserAgreementURL });
        return config;
    }

    function onPayPalMobileInit() {
        $ionicPlatform.ready().then(function () {
            // must be called
            // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
            PayPalMobile.prepareToRender(PaypalConfig.payPalEnv, configuration(), function () {

                $timeout(function () {
                    init_defer.resolve();
                });

            });
        });
    }

    /**
     * @ngdoc method
     * @name makePayment
     * @methodOf app.PaypalService
     * @param {string|number} total total sum. Pattern 12.23
     * @param {string} name name of the item in paypal
     * @description
     * Performs a paypal single payment 
     *
     * 
     * @returns {object} Promise gets resolved on successful payment, rejected on error 
     */
    function makePayment(total, name) {


        var defer = $q.defer();
        total = $filter('number')(total, 2);
        $ionicPlatform.ready().then(function () {
            PayPalMobile.renderSinglePaymentUI(createPayment(total, name), function (result) {
                $timeout(function () {
                    defer.resolve(result);
                });
            }, function (error) {
                $timeout(function () {
                    defer.reject(error);
                });
            });
        });

        return defer.promise;
    }

    return service;
}])
.factory('httpLoad',['$timeout','$injector', '$q',function($timeout, $injector, $q) {
  
    var requestInitiated;

    function showLoadingText() {
        $injector.get("$ionicLoading").show({
            template: 'Carregando...',
            animation: 'fade-in',
            showBackdrop: true
        });
    };
  
    function hideLoadingText(){
        $injector.get("$ionicLoading").hide();
    };

    return {
        request : function(config) {
            requestInitiated = true;
            showLoadingText();
            console.log('Request Initiated with interceptor');
            return config;
        },
        response : function(response) {
            requestInitiated = false;
        
            // Show delay of 300ms so the popup will not appear for multiple http request
            $timeout(function() {

                if(requestInitiated) return;
                hideLoadingText();
                console.log('Response received with interceptor');

            },300);
      
            return response;
        },
        requestError : function (err) {
            hideLoadingText();
            console.log('Request Error logging via interceptor');
            return err;
        },
        responseError : function (err) {
            hideLoadingText();
            console.log('Response error via interceptor');
            return $q.reject(err);
        }
    }
}])
.filter('mention', ['$filter', '$sce',
  function ($filter, $sce) {
      return function (text,target,users) {
          if (!text) return text;

          var replacedText = $filter('linky')(text, target);
          var targetAttr = "";
          if (angular.isDefined(target)) {
              targetAttr = ' target="' + target + '"';
          }

          // replace #hashtags
          var replacePattern1 = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;
          replacedText = replacedText.replace(replacePattern1, '$1<a href="https://twitter.com/search?q=%23$2"' + targetAttr + '>#$2</a>');

          // replace @mentions
          var replacePattern2 = /(^|\s)\@(\w*[a-zA-Z]+\w*)/gim;
           //replacedText = replacedText.replace(replacePattern2, '$1<a ui-sref="app.main.reoozerProfile({id:'+getId('rbaute1')+'})"><strong>$1@$2</strong></a>');
          /*replacedText = replacedText.replace(replacePattern2, function rep($1) {           
              return getId($1);
          });*/
          var repArray = replacedText.match(replacePattern2);
          angular.forEach(repArray, function (value) {
             
              replacedText = replacedText.replace(value,getId(value));
          })
         //console.log(getId('rbaute1'));
          function getId(strMach) {
              var strRep = strMach.replace('@', '').toLowerCase();
              strRep = strRep.replace(' ', '');
              var idRep = users[users.findIndex(function (x) { return x.userName.toLowerCase() == strRep })].personId;
              //console.log('user:' + strMach + ' - id:' + idRep)
              return '<a href="#/app/main/reoozrProfile/' + idRep + '/false"><strong>' + strMach + '</strong></a>'
              // return '<a ui-sref="app.main.reoozrProfile({id:' + idRep + ',contato:false})"><strong>' + strMach + '</strong></a>'
              //return '<a ng-click="funtion(){$state.go(\'app.main.reoozerProfile\',{id:'+ idRep + ',contato:false})}"><strong>' + strMach + '</strong></a>'
          }


          
          return $sce.trustAsHtml(replacedText);
      };
  }
])
.directive('isFocused', function ($timeout) {
    return function (scope, elem, attrs) {
        elem.bind('blur', function () {
            //scope.$apply(attrs.uiBlur);
            elem[0].focus();
        });
    };
})
.directive('imgPreload', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'A',
        scope: {
            ngSrc: '@'
        },
        link: function (scope, element, attrs) {
            element.on('load', function () {

                 //element.addClass('loader');
               element.parent().find('div').remove();
            })
           
            scope.$watch('ngSrc', function (newVal) {
               //  element.removeClass('loader');
               //element.parent().append('<span class="loader"></span>');
            });
        }
    };
}])
.directive('validateAlphaNumeric', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^a-z]/g, '');
                console.log(transformedInput);
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;  // or return Number(transformedInput)
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});



/*var $http,
      interceptor = ['$q', '$injector', '$ionicLoading', function ($q, $injector, $ionicLoading) {
          var error;

          function success(response) {
              // get $http via $injector because of circular dependency problem
              $http = $http || $injector.get('$http');
              if ($http.pendingRequests.length < 1) {
                  $ionicLoading.hide();
              }
              return response;
          }

          function error(response) {
              // get $http via $injector because of circular dependency problem
              $http = $http || $injector.get('$http');
              if ($http.pendingRequests.length < 1) {
                  $ionicLoading.hide();
              }
              return $q.reject(response);
          }

          return function (promise) {
              $ionicLoading.show({
                  template: 'Carregando...'

              })
              return promise.then(success, error);
          }
      }];*/