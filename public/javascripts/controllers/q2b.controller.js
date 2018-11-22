var app = angular.module('app');

app.controller('q2bCtrl', function($scope, $http){

    $scope.countries = null;

    $scope.init = () => {
        // Retrieve cleaned data from the server.
        $http.get('/data').then(res => {
            let countryRes = transformQ2b(res.data);
            let d3Data = transformQ2bD3(countryRes);
            $scope.countries = d3Data;
            displayQ2bMultilineGraph($scope.countries);
        });
    };
});
