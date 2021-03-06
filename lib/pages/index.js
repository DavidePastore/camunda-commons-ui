define(['angular', 'angular-route'],
function(angular) {
  'use strict';

  var $ = angular.element;

  var pagesModule = angular.module('camunda.common.pages', [
    'ngRoute'
  ]);

  function setHeadTitle(url) {
    var pageTitle = 'camunda Login';

    if (url.indexOf('/cockpit/') !== -1) {
      pageTitle = 'camunda Cockpit';
    } else

    if (url.indexOf('/tasklist/') !== -1) {
      pageTitle = 'camunda Tasklist';
    } else

    if (url.indexOf('/admin/') !== -1) {
      pageTitle = 'camunda Admin';
    }

    $('head title').text(pageTitle);
  }



  var ResponseErrorHandlerInitializer = [
    '$rootScope', '$location', 'Notifications',   'AuthenticationService',
    function($rootScope, $location, Notifications, AuthenticationService) {

    function addError(error) {
      error.http = true;
      error.exclusive = [ 'http' ];

      Notifications.addError(error);
    }

    /**
     * A handler function that handles HTTP error responses,
     * i.e. 4XX and 5XX responses by redirecting / notifying the user.
     */
    function handleHttpError(event, error) {

      var status = error.status,
          data = error.data;

      switch (status) {
      case 500:
        if (data && data.message) {
          addError({
            status: 'Server Error',
            message: data.message,
            exceptionType: data.exceptionType
          });
        } else {
          addError({
            status: 'Server Error',
            message: 'The server reported an internal error. Try to refresh the page or login and out of the application.'
          });
        }
        break;

      case 0:
        addError({ status: 'Request Timeout', message:  'Your request timed out. Try to refresh the page.' });
        break;

      case 401:

        if ($location.absUrl().indexOf('/setup/#') !== -1) {
          $location.path('/setup');
        } else {
          addError({ type: 'warning', status: 'Session ended', message: 'Your session timed out or was ended from another browser window. Please signin again.' });

          setHeadTitle($location.absUrl());

          AuthenticationService.updateAuthentication(null);
          $rootScope.$broadcast('authentication.login.required');
        }
        break;

      case 403:
        if (data.type == 'AuthorizationException') {
          addError({
            status: 'Access Denied',
            message: 'You are unauthorized to ' +
            data.permissionName.toLowerCase() + ' ' +
            data.resourceName.toLowerCase() +
            (data.resourceId ? ' ' + data.resourceId : 's') +
            '.' });
        } else {
          addError({
            status: 'Access Denied',
            message: 'Executing an action has been denied by the server. Try to refresh the page.'
          });
        }
        break;

      case 404:
        addError({ status: 'Not found', message: 'A resource you requested could not be found.' });
        break;
      default:
        addError({
          status: 'Communication Error',
          message: 'The application received an unexpected ' + status + ' response from the server. Try to refresh the page or login and out of the application.'
        });
      }
    }

    // triggered by httpStatusInterceptor
    $rootScope.$on('httpError', handleHttpError);
  }];





  var ProcessEngineSelectionController = [
    '$scope', '$http', '$location', '$window', 'Uri', 'Notifications',
    function($scope, $http, $location, $window, Uri, Notifications) {

    var current = Uri.appUri(':engine');
    var enginesByName = {};

    $http.get(Uri.appUri('engine://engine/')).then(function(response) {
      $scope.engines = response.data;

      angular.forEach($scope.engines , function(engine) {
        enginesByName[engine.name] = engine;
      });

      $scope.currentEngine = enginesByName[current];

      if (!$scope.currentEngine) {
        Notifications.addError({ status: 'Not found', message: 'The process engine you are trying to access does not exist', scope: $scope });
        $location.path('/');
      }
    });

    $scope.$watch('currentEngine', function(engine) {
      if (engine && current !== engine.name) {
        $window.location.href = Uri.appUri('app://../' + engine.name + '/');
      }
    });
  }];





  var NavigationController = [ '$scope', '$location', function($scope, $location) {

      $scope.activeClass = function(link) {
        var path = $location.absUrl();
        return path.indexOf(link) != -1 ? 'active' : '';
      };
  }];





  var AuthenticationController = [
    '$scope', '$window', '$cacheFactory', '$location', 'Notifications', 'AuthenticationService', 'Uri',
    function($scope, $window, $cacheFactory, $location, Notifications, AuthenticationService, Uri) {
      $scope.logout = function() {
        AuthenticationService.logout();
      };
  }];





  return pagesModule
    .run(ResponseErrorHandlerInitializer)
    .controller('ProcessEngineSelectionController', ProcessEngineSelectionController)
    .controller('AuthenticationController', AuthenticationController)
    .controller('NavigationController', NavigationController);
});
