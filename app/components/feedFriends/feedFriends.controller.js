"use strict";

angular
	.module("reooz")
	.controller("FeedFriendsController", FeedFriendsController);

FeedFriendsController.$inject = ['$rootScope', '$scope', '$window', '$state', '$httpParamSerializerJQLike', '$ajax', 'config', '$messages', 'DomainService'];

function FeedFriendsController($rootScope, $scope, $window, $state, $httpParamSerializerJQLike, $ajax, config, $messages, DomainService) {


    var vm = this;
    var url = config.base;


    vm.loadItens = loadItens;
    vm.updateSub = updateSub;
    vm.busca = busca;
    vm.hideSearch = hideSearch;


    var page = 0;
    var pageSize = 16;
    var totalPages = 10;
    vm.moreDataCanBeLoaded = true;

    var timer;


    vm.options = {
        effect: 'slide',
        pagination: false,
        onSlideChangeStart: function (swiper) {
            vm.currentIndex = swiper.activeIndex
        },
        onInit: function (swiper) {
            vm.sliderF = swiper;
            swiper.hashnav = false;
        }
    };



    vm.itens = [];
    vm.imgPerfil = 'img/icons/icone-meuperfil.png';
    vm.imgPadrao = 'css/images-css/image1.jpg';
    vm.filter = false;
    vm.titleSeach = "";
    vm.searchFriends = true;
    vm.category = '';
    vm.subCategory = '';
    vm.noFeed = false;



    loadItens();
    function loadItens(filter) {
        if (!vm.filter) vm.moreDataCanBeLoaded = false;
        else page = 0;
        console.log('load');
        vm.category = vm.category == null ? '' : vm.category;
        vm.subCategory = vm.subCategory == null ? '' : vm.subCategory;
        var personId = vm.searchFriends == true ? $window.localStorage['personId'] : '';


        var headers = {
            'Authorization': 'Bearer ' + $window.localStorage['token']
        };

        $ajax.get(url + "/api/Product/List?personId=" + personId + "&title=" + vm.titleSeach + "&category=" + vm.category + "&subCategory=" + vm.subCategory + "&searchFriendsProducts=" + vm.searchFriends + "&page=" + page + "&pageSize=" + pageSize + "&orderBy=ProductId&orderDirection=DESC", null, headers).then(function (res) {
            console.log(res);
           

            if (res.returnCode == 1000) {
                if (!vm.filter) {
                    vm.itens = vm.itens.concat(res.products);
                    if (res.products.length < 1) vm.noFeed = true;
                } else {
                    console.log(res);
                    vm.itens = res.products;
                    page = 0;
                    vm.filter = false;

                }
                totalPages = res.totalPages;
            } else {
                $messages.alert(res.returnCode, res.returnMessage);
                vm.noFeed = true;
               
            }
            page++;
            if (page < totalPages) vm.moreDataCanBeLoaded = true;
        });

        $scope.$broadcast('scroll.infiniteScrollComplete');



    }

    vm.showModal = function (templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.filter = true;
            vm.modal = modal;
            vm.modal.show();
        });
    }

    // Close the modal
    vm.closeModal = function () {
        vm.filter = false;
        vm.modal.hide();
        vm.modal.remove()
    };
    DomainService.getDomain('CAT', 1).then(function (res) {
        vm.cat = res;

    })

    function updateSub(indice) {
        console.log('categoria');
        console.log(indice);
        DomainService.getDomain('SUB_CAT', indice).then(function (res) {
            vm.subCat = res;
        })
    }
    function busca() {
        clearTimeout(timer);
        vm.filter = true;
        timer = setTimeout(function () {
            vm.loadItens();
        }, 1000);
    }


    function busca() {

        vm.filter = true;
        vm.showSearch = false;
        vm.loadItens();

    }
    function hideSearch() {
        vm.titleSeach = '';
        vm.showSearch = false;
        vm.filter = true;
        vm.loadItens();
    }

}