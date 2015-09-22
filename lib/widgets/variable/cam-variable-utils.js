define([
  'camunda-bpm-sdk-js-type-utils'
], function (
  typeUtils
) {
  'use strict';
  var varUtils = {};

  function camundaFormattedDate(date) {
    date = date || new Date();
    return date.toISOString().slice(0, -5);
  }
  varUtils.camundaFormattedDate = camundaFormattedDate;


  varUtils.types = [
    'Boolean',
    'Date',
    'Double',
    'Integer',
    'Long',
    'Null',
    'Object',
    'Short',
    'String'
  ];


  varUtils.defaultValues = {
    'Boolean':    false,
    'Date':       camundaFormattedDate(),
    'Double':     0,
    'Integer':    0,
    'Long':       0,
    'Null':       '',
    'Short':      0,
    'String':     '',
    'Object':     {}
  };


  varUtils.isPrimitive = function ($scope) {
    return function (type) {
      type = type || $scope.variable.type;
      if (!type) { return true; }

      return [
        'Boolean',
        'Date',
        'Double',
        'Integer',
        'Long',
        'Short',
        'String'
      ].indexOf(type) >= 0;
    };
  };


  varUtils.useCheckbox = function ($scope) {
    return function (type) {
      type = type || $scope.variable.type;
      return type === 'Boolean';
    };
  };

  varUtils.validate = function ($scope) {
    return function () {
      if (!$scope.variable.name || !$scope.variable.type) {
        $scope.valid = false;
      }

      else if ($scope.variable.value === null ||
               ['String', 'Object', 'Null'].indexOf($scope.variable.type) > -1) {
        $scope.valid = true;
      }

      else {
        $scope.valid = typeUtils.isType($scope.variable.value, $scope.variable.type);
      }

      if($scope.valid) {
        // save the variable in the appropriate type
        if ($scope.variable.type &&
            $scope.variable.value !== null &&
            $scope.isPrimitive($scope.variable.type)) {
          var newTyped;

          if ($scope.variable.type !== 'Boolean') {
            newTyped = typeUtils.convertToType($scope.variable.value, $scope.variable.type);
          }
          else {
            newTyped = $scope.variable.value ?
                        $scope.variable.value !== 'false' :
                        false;
          }

          // only change value if newType has different type, to avoid infinite recursion
          if(typeof $scope.variable.value !== typeof newTyped) {
            $scope.variable.value = newTyped;
          }
        }
      }
    };
  };

  return varUtils;
});
