"use strict";

angular
	.module("reooz")
	.controller("reoozrProfile", reoozrProfile);

reoozrProfile.$inject = ['$scope', '$window', '$state', '$stateParams', '$ajax', 'config', '$messages', 'modal', 'DomainService'];

function reoozrProfile($scope, $window, $state, $stateParams, $ajax, config, $messages, modal, DomainService) {

    var vm = this;
    var url = config.base;
    var headers = {
        'Authorization': 'Bearer ' + $window.localStorage['token']
    };

     var arrFav = $window.localStorage['itemFav'];
   
    vm.addFriend = addFriend;
    



    vm.imgPerfil = 'img/icons/icone-meuperfil.png';
    vm.imgPadrao = 'css/images-css/image1.jpg';
    vm.itemFav = false;
    vm.self = false;
    vm.modal = modal;
    vm.contatos = false;

    vm.currentItem;
    vm.reoozr = { friendsQuantity: 0 };
    vm.friend = false;

    var personId = $window.localStorage['personId'];

    if ($stateParams.id) loadItens($stateParams.id);
    if ($stateParams.contatos) vm.contatos = true;

    function loadItens(index) {
        vm.self = (index == personId)?true:false;
        $ajax.get(url + "/api/Account/GetRoozerProfile?personId=" + index, null, headers).then(function (res) {
            vm.reoozr = res;
            
            $ajax.get(url + "/api/Friend/ListMyFriends?personId=" + personId + "&status=3", null, headers).then(function (result) {
                console.log(result);
                if (result.friendsResult.findIndex(function (x) { return x.personId == vm.reoozr.user.personId }) != -1) vm.friend = true;
               
            });
           
           
            vm.reoozr.products = orderBy(vm.reoozr.products, 'productId', true);

            DomainService.getDomain('STATE', 1).then(function (res) {
                var indexState = getIndice(res,'id' ,vm.reoozr.user.stateId);
                console.log(indexState);
                vm.reoozr.user.estado = res[indexState];
                DomainService.getDomain('CITY', vm.reoozr.user.stateId).then(function (val) {
                    var indexCity = getIndice(val, 'id', vm.reoozr.user.cityId);
                   
                    vm.reoozr.user.cidade = val[indexCity];
                })
            })
        });
    }
    
    function addFriend() {
        var headers = {
            'Authorization': 'Bearer ' + $window.localStorage['token']
        };
        var obj = {
            PersonId: $window.localStorage['personId'],
            FriendId: vm.reoozr.user.personId,
            Status: 1
        };

        $ajax.post(url + "/api/Friend/Add", obj, headers).then(function (res) {
            $messages.alert(res.returnCode, res.returnMessage);
            console.log(res);
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
    function getIndice(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
       
    }
    

}