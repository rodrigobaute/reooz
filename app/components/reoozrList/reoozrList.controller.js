"use strict";

angular
	.module("reooz")
	.controller("ReoozrListController", ReoozrListController);

ReoozrListController.$inject = ['$scope', '$window', '$state', '$stateParams', '$ajax', 'config', '$messages', 'modal', 'DomainService'];

function ReoozrListController($scope, $window, $state, $stateParams, $ajax, config, $messages, modal, DomainService) {

    var vm = this;
    var url = config.base;
    var headers = {
        'Authorization': 'Bearer ' + $window.localStorage['token']
    };

    vm.imgPerfil = 'img/icons/icone-meuperfil.png';
  

    if ($stateParams.id) loadItens($stateParams.id);

    function loadItens(index) {
        $ajax.get(url + "/api/Friend/ListMyFriends?personId=" + index + "&status=3", null, headers).then(function (res) {
            console.log(res);
            if (res.returnCode == '1000') {
                vm.friends = res.friendsResult;
                vm.semAmigos = false;
            }
            else vm.semAmigos = res.returnMessage;
        });
    }
   
    

}