var app = angular.module('app');

app.controller('q3Ctrl', function($scope, $http){

    $scope.teams = {};

    $scope.init = () => {
        // Retrieve cleaned data from the server.
        $http.get('/data').then(res => {
            let teamResult = transformQ3(res.data);
            displayQ3MultilineGraph(teamResult);
        });
    };
});