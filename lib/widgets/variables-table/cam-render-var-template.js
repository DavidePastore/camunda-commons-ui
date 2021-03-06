define([
  'angular',
], function(
  angular
) {
  'use strict';

  return [
    '$compile',
  function(
    $compile
  ) {
    return {
      template: '<div></div>',

      scope: {
        info:       '=',
        headerName: '='
      },

      link: function ($scope, element) {
        var obj = $scope.info.additions[$scope.headerName] || {};
        obj.scopeVariables = obj.scopeVariables || {};

        for(var key  in obj.scopeVariables) {
          $scope[key] = obj.scopeVariables[key];
        }

        $scope.variable = $scope.info.variable;

        element.html('<div>' + obj.html + '</div>');

        $compile(angular.element('div', element)[0])($scope);

      }
    };
  }];
});
