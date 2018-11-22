var app = angular.module('app');

app.controller('q1bCtrl', function($scope, $http){

    $scope.seasons = [];

    $scope.init = () => {
        // Retrieve cleaned data from the server.
        $http.get('/data').then(res => {
            let teamResult = transformq1(res.data);
            let d3Data = transformQ1bD3(teamResult);
            $scope.seasons = d3Data;
            let year = d3Data[0];
            displayQ1bBarGraph(year.year, year.values);
        });
    };

    $scope.changeDisplay = () => {
        let data = $scope.current;
        let year = data.year;
        displayQ1bBarGraph(year, data.values);
    }
});