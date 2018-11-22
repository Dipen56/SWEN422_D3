var app = angular.module('app');

app.controller('q3bCtrl', function($scope, $http){

    $scope.seasons = [];

    $scope.init = () => {
        // Retrieve cleaned data from the server.
        $http.get('/data').then(res => {
            let data = transformQ3b(res.data);
            $scope.seasons = data;
            let year = data[0]; // key for first entry
            displayQ3bBarGraph(year.year, year.values);
        });
    };

    $scope.changeDisplay = () => {
        let data = $scope.current;
        let year = data.year;
        displayQ3bBarGraph(year, data.values);
    }
});


