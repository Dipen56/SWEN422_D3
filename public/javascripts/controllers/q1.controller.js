var app = angular.module('app');

app.controller('q1Ctrl', function($scope, $http){
    // placing array used to display the placing selection
    $scope.placing = [];
    // used to store the display function
    var displayChart;
    // used to store the clean and formatted
    var d3Data2;
    $scope.init = () => {
        // Retrieve cleaned data from the server.
        $http.get('/data').then(res => {
            //this will get the data and do transformations
            let teamResult = transformq1(res.data);
            // this will order the results
            let orderedResult = orderFinalPlacing(teamResult.teamsResult);
            // this will convert the object to an array form
            let d3Data1 = convertToD3(orderedResult);
            // this will convert the array in a format compatible with d3
            d3Data2 = convertToD3Two(d3Data1);
            $scope.placing.push("All");
            for(let i = 1;i <= d3Data2.series[0].values.length; i++){
                $scope.placing.push(i);
            }
            // this will send the data to the d3 function
            displayChart = displayQ1MultilineGraph(d3Data2);
        });
    };
    // used to change the chart display
    $scope.changeDisplay = () => {
        // calls the inner function to update the chart
        displayChart.inner($scope.current);
    }


});