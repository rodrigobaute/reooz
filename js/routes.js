"use strict";

angular.module("reooz")
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){	
    $urlRouterProvider.otherwise("/login");

    $stateProvider
		.state('app', {
			url: '/app',
			abstract: true,						
			templateUrl: 'app/shared/menu/menu.html',
			controller: 'MenuCtrl',
			controllerAs: "menuVm"
			
			 
		  })
		 .state('app.main', {
			url: '/main',
			abstract: true,	
			views: {
			  'main': {		
			templateUrl: 'app/shared/menu/tabs.html',
			controller: 'MenuCtrl',
			controllerAs: "menuVm"
				}
			}
			 
		  })
		 
		 .state("login", {
			url: "/login",
			templateUrl: "app/components/login/login.html",
			title: "Login",
			controller: "LoginController",
			controllerAs: "LoginVm"
			
		})

		.state("app.main.feed", {
		    url: "/feed",
		    class: 'profile',
			views: {
			  'feed': {
				controller: "FeedController",
				templateUrl: 'app/components/feed/feed.html',				
				controllerAs: "feedVm"
			  }
			}
		})
		.state("app.main.feedFriends", {
		    url: "/feedFriends",
            
            class: 'profile',
			views: {
			  'feed': {
				controller: "FeedFriendsController",
				templateUrl: 'app/components/feedFriends/feedFriends.html',				
				controllerAs: "feedFriendsVm"
			  }
			}
		})
		.state("app.main.self", {
		    url: "/self",
		    
            class:'profile',
			views: {
			  'feed': {
				controller: "FeedSelfController",
				templateUrl: 'app/components/feedSelf/feedSelf.html',				
				controllerAs: "feedSelfVm"
			  }
			}
		})
        .state("app.main.favourites", {
            url: "/favourites",
            class: 'product-grid',
            
            views: {
                'feed': {
                    controller: "FavouritesController",
                    templateUrl: 'app/components/favourites/favourites.html',
                    controllerAs: "favouritesVm"
                }
            }
        })
		.state("app.main.product", {
		    url: "/product/:id",
		    
		    class: 'produtos',
			views: {
			  'feed': {
				controller: "ProductController",
				templateUrl: 'app/components/product/product.html',				
				controllerAs: "productVm"
			  }
			}
		})
        .state("app.main.negotiation", {
            url: "/negotiation/:ownerProducts/:ownerId/:proposerProducts/:proposerId/:status",
           
            class: 'produtos',
            views: {
                'feed': {
                    controller: "NegotiationController",
                    templateUrl: 'app/components/negotiation/negotiation.html',
                    controllerAs: "negotiationVm"
                }
            }
        })
        .state("app.main.reoozrProfile", {
            url: "/reoozrProfile/:id/:contatos",
           
            class: 'profile',
            views: {
                'feed': {
                    controller: "reoozrProfile",
                    templateUrl: 'app/components/reoozrProfile/reoozrProfile.html',
                    controllerAs: "reoozrVm"
                }
            }
        })
        .state("app.main.reoozrList", {
            url: "/reoozrList/:id",
            
            class: 'profile',
            views: {
                'feed': {
                    controller: "ReoozrListController",
                    templateUrl: 'app/components/reoozrList/reoozrList.html',
                    controllerAs: "reoozrListVm"
                }
            }
        })
    
		.state("app.main.profile", {
		    url: "/profile/:id",
		   
		    class: 'profile',
			views: {
			  'feed': {
				controller: "ProfileController",
				templateUrl: 'app/components/profile/profile.html',				
				controllerAs: "profileVm"
			  }
			}
		})
        .state("app.main.config", {
            url: "/config",
           
            class: 'produtos',
            views: {
                'feed': {
                    controller: "ConfigurationController",
                    templateUrl: 'app/components/configuration/configuration.html',
                    controllerAs: "configVm"
                }
            }
        })
		.state("app.main.friends", {
		    url: "/friends",
            cache:false,
            class: 'profile',
			views: {
			  'feed': {
				controller: "FriendsController",
				templateUrl: 'app/components/friends/friends.html',				
				controllerAs: "friendsVm"
			  }
			}
		})
        .state("app.main.activity", {
            url: "/activity",
           
            class:'notification',
            views: {
                'feed': {
                    controller: "ActivityController",
                    templateUrl: 'app/components/activity/activity.html',
                    controllerAs: "activityVm"
                }
            }
        })
        .state("app.main.proposal", {
            url: "/proposal",
           
            class: 'notification',
            views: {
                'feed': {
                    controller: "ProposalController",
                    templateUrl: 'app/components/proposal/proposal.html',
                    controllerAs: "proposalVm"
                }
            }
        })
		
		
		
	;

}]);
