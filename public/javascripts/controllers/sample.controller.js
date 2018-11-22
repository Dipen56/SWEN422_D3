var app = angular.module('app');

app.controller('myCtrl', function($scope, $http){
    $scope.foo = () => {
        var colour = generateRandomColour();
        console.log(colour);
    }
    // Add code here
});