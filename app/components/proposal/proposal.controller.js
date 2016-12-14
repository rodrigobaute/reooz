"use strict";

angular
	.module("reooz")
	.controller("ProposalController", ProposalController);

ProposalController.$inject = ['$scope', '$window', '$state', '$stateParams','$ionicModal', '$ajax', 'config', '$messages', 'DomainService'];

function ProposalController($scope, $window, $state, $stateParams,$ionicModal, $ajax, config, $messages, DomainService) {

	var vm = this;
	var url = config.base;
	var headers = {
	    'Authorization': 'Bearer ' + $window.localStorage['token']
	};
	vm.imgPerfil = 'img/icons/icone-meuperfil.png';
	vm.imgPadrao = 'css/images-css/image1.jpg';
	var personId = $window.localStorage['personId'];

	vm.proposalDetails = proposalDetails;
	vm.acceptOffer = acceptOffer;
	vm.refuseOffer = refuseOffer;
	vm.newProposal = newProposal;
	vm.showContact = showContact;

    vm.owner={}


    vm.showButtons = true;

    vm.statusDescription = [
        'Nova Oferta de Negociação',
        'Oferta Aceita',
        'Oferta Negada',
        'Contra-Proposta feita pelo Dono',
        'Contra-Proposta feita pelo Proponente',
        'Negociação Cancelada'
    ];
    

	function loadItens(){
	    $ajax.get(url + "/api/Negotiation/ListMyNegotiations?personId=" + personId, null, headers).then(function (res) {
	        vm.negotiations = res.negotiations;
	        console.log(vm.negotiations);
	       
	    });
	}	
	loadItens();		
	
	function proposalDetails(item) {
	    $ajax.get(url + "/api/Negotiation/Get?negotiationId=" + item.negotiationId, null, headers).then(function (res) {
	        console.log(res);
	        vm.statusText = vm.statusDescription[res.status-1]
	        vm.owner = res.ownerPerson;
	        vm.proposer = res.proposerPerson
	        vm.offer = res;
	        if (vm.owner.personId == personId && res.status == 4 || vm.proposer.personId == personId && res.status == 5 || vm.proposer.personId == personId && res.status == 1 ||  res.status == 3||  res.status == 2) vm.showButtons = false;
	        vm.showModal('app/components/proposal/details.html');

	    });
	}
	function acceptOffer() {
	    $ajax.get(url + "/api/Negotiation/UpdateStatus?personId=" + personId + '&negotiationId=' + vm.offer.negotiationId + '&status=2', null, headers).then(function (res) {
	        $messages.alert('Negociação Aceita', 'Entre em contato com o usuário para acertar os detalhes');
	        setTimeout(function () {
	            //$state.go('app.main.feed');
	            vm.offer.status = 2;
	        },1000)
	    });
	}
	function refuseOffer() {
	    $ajax.get(url + "/api/Negotiation/UpdateStatusDenied?personId=" + personId + '&negotiationId=' + vm.offer.negotiationId + '&status=3', null, headers).then(function (res) {
	        $messages.alert('Negociação Recusada', '');
	        $state.go('app.main.feed');
	    });
	}
	function newProposal() {
	    var owProdId =[];
	    angular.forEach(vm.owner.products,function(value){
	        owProdId.push(value.productId);
	    });
	    var proProdId =[];
	    angular.forEach(vm.proposer.products,function(value){
	        proProdId.push(value.productId);
	    })
	    var newStatus = 1;
	    if (vm.owner.personId == personId) newStatus = 4;
	    else if (vm.proposer.personId == personId) newStatus = 5;
	    vm.closeModal();
	    $state.go('app.main.negotiation', { ownerProducts: owProdId, ownerId: vm.owner.personId, proposerProducts: proProdId, proposerId: vm.proposer.personId,status:newStatus });
	}
	function showContact() {
	    var redId = vm.owner.personId == personId ? vm.proposer.personId : vm.owner.personId;
	    vm.closeModal();
	    $state.go('app.main.reoozrProfile', { id: redId,contatos:true })
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

	
}
