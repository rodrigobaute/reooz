(function() {
  angular
    .module('validation.rule', ['validation'])
    .config(['$validationProvider', function($validationProvider) {
      var expression = {
        required: function(value) {
          return !!value;
        },
        url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
        number: /^\d+$/,
        minlength: function(value, scope, element, attrs, param) {
          return value.length >= param;
        },
        maxlength: function(value, scope, element, attrs, param) {
          return value.length <= param;
        }
      };

      var defaultMsg = {
        required: {
          error: 'Campo com preenchimento obrigatorio',
          success: ''
        },
        url: {
          error: 'Url invalid',
          success: ''
        },
        email: {
          error: 'E-mail invalido',
          success: ''
        },
        number: {
          error: 'Preencha apenas com numeros',
          success: ''
        },
        minlength: {
          error: 'Conteudo do campo muito curto',
          success: ''
        },
        maxlength: {
          error: 'Conteudo do campo muito longo',
          success: ''
        }
      };
      $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
    }]);
}).call(this);
