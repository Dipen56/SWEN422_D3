var app = angular.module('app');

app.controller('q2Ctrl', function($scope, $http){

    $scope.teams = {};

    $scope.init = () => {
        // Retrieve cleaned data from the server.
        $http.get('/data').then(res => {
            let teamResult = transformQ2(res.data);
            let d3Data = transformQ2D3(teamResult);
            $scope.teams = d3Data;
            displayQ2MultilineGraph(d3Data);
        });
    };
});
