angular.module('ion-select-autocomplete', [])

.directive('ionSelectAutocomplete', [
  '$ionicModal',
  function($ionicModal) {
    return {
      restrict: 'AE',
      transclude: true,
      replace: true,
      name: 'ctrl',
      controller: '@',
      controllerAs: 'vm',
      bindToController: {
          selected: '&'
      },
      
      scope: {
        multiselect: '=',
        options: '=',
        output: '=',
       
      },
     
      template: "<input type='text' ng-model='displayVal' placeholder='{{header}}' />",
      link: function($scope, element, attrs, ctrl, transclude) {
          //console.log(ctrl);
          $scope.header = attrs.header;
        $scope.label = attrs.labelKey;
        $scope.value = attrs.valueKey;        
        $scope.predicate = 'checked';
        console.log($scope.options);
        console.log($scope.output);
       
        $scope.$watch('options', function () {
            if ($scope.output > 0 && $scope.options && $scope.displayVal=='') $scope.header = $scope.options[$scope.options.findIndex(function (x) { return x.id == $scope.output })].text;
        });
       
        $scope.reverse = true;
        var templateName = '';

        if($scope.multiselect) {
          $scope.output = $scope.output || [];
          templateName = 'checkbox_autocomplete.html';
          var labelArray = [];

          $scope.toggleSelection = function toggleSelection(label, value) {
            var idx = $scope.output.indexOf(value);
            // is currently selected
            if (idx > -1) {
              $scope.output.splice(idx, 1);
              labelArray.splice(idx, 1);
              $scope.displayVal = labelArray.join(' , ');
            }
            // is newly selected
            else {
              $scope.output.push(value);
              labelArray.push(label);
              $scope.displayVal = labelArray.join(' , ');
            }
          };

          $scope.ifChecked = function(value) {
            return $scope.output.indexOf(value) > -1;
          }
        } else {
          $scope.output = $scope.output || '';
          templateName = 'radio_autocomplete.html';
         
           
          $scope.onRadioClick = function (label, value) {
             
            $scope.output = value;
            $scope.displayVal = label;
            if (typeof ctrl.selected === 'function') setTimeout(function () { ctrl.selected(); }, 100);
            $scope.modal.hide();
          }
        }

        $ionicModal.fromTemplateUrl(templateName, {
            scope: $scope,
            focusFirstInput: true,
        }).then(function(modal) {
            $scope.modal = modal;            
        });

        element.bind("click", function(e) {
          $scope.modal.show();
        });

      }
    };
  }
])

.run([
  '$templateCache',
  function($templateCache) {
      var begin = "<ion-modal-view>" +
        "<ion-header-bar>" +
          "<h1 class='title'>{{header}}</h1>" +
          "<button class=' button button-icon button-clear  pull-right' ng-click='modal.hide()'><span class='ion-close-circled close color-title-grey' ></span></button>" +
        "</ion-header-bar>" +
        "<ion-header-bar class='bar-subheader item-input-inset'>" +
          "<label class='item-input-wrapper mb10'>" +
            "<i class='icon ion-ios-search placeholder-icon'></i>" +
            "<input type='search' placeholder='Buscar' ng-model='searchText[label]' ng-init='$element.focus()' class='ptb' id='buscaSelect'>" +
          "</label>" +
        "</ion-header-bar>" +
        "<ion-content>" +
          "<ion-list>";

      var checkbox = "<ion-checkbox collection-repea='opt in options | filter:searchText[label]' item-height='55px' item-width='100%' value='{{opt[value]}}' ng-checked='opt.checked = ifChecked(opt[value])' ng-click='toggleSelection(opt[label], opt[value])'>{{opt[label]}}</ion-checkbox>";

      var radio = "<ion-radio collection-repeat='opt in options | filter:searchText[label]' item-height='55px' item-width='100%' ng-model='output' ng-click='onRadioClick(opt[label], opt[value])' ng-value='opt[value]'>{{opt[label]}}</ion-radio>";

      var end = "</ion-list>" +
        "</ion-content>" +
      "</ion-modal-view>";

    $templateCache.put('checkbox_autocomplete.html', begin + checkbox + end);
    $templateCache.put('radio_autocomplete.html', begin + radio + end);
  }
]);
