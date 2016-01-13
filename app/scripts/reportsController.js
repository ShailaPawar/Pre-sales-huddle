
var baseURL = "http://presaleshuddle:8080/";

angular.module('PreSales-Huddle')

    //controller for reports
    .controller('ReportsListCtrl',function($scope, $http, $rootScope, $location){
        document.getElementById('signin').style.visibility = 'hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility = 'visible';
        document.getElementById('prospectList').style.visibility = 'visible';
        document.getElementById('clientList').style.visibility = 'visible';
        document.getElementById('headerText').style.visibility = 'visible';
        document.getElementById('reports').style.visibility = 'visible';
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display = 'none';


        $rootScope.currentDate = new Date();
        $rootScope.previousYearDate = new Date($rootScope.currentDate);
        $rootScope.previousYearDate.setMonth($rootScope.currentDate.getMonth() - 11);
        console.log("$rootScope.previousYearDate: ", $rootScope.previousYearDate);
        console.log("$rootScope.currentDate: ", $rootScope.currentDate);

        $rootScope.currentYear = $rootScope.currentDate.getFullYear();
        $rootScope.currentMonth = $rootScope.currentDate.getMonth();
        console.log(  "  $rootScope.currentYear",$rootScope.currentYear);
        console.log("  $rootScope.currentMonth",  $rootScope.currentMonth);
        $rootScope.previousYear = $rootScope.previousYearDate.getFullYear();
        $rootScope.previoustMonth = $rootScope.previousYearDate.getMonth();
        console.log("$rootScope.previoustMonth",$rootScope.previoustMonth);


        $scope.prospect = $rootScope.prospectToUpdate;
        $http.get(baseURL + 'prospect/all/').success(function (data, status, headers, config) {
            $scope.prospect = data;

               $rootScope.flag = 1;
            var testArray = [],a = [],b=[], i, countCurrentJan = 0, countCurrentFeb = 0, countCurrentMar = 0, countCurrentApr = 0,
                countCurrentMay = 0, countCurrentJun = 0,countCurrentJul = 0, countCurrentAug = 0, countCurrentSept = 0, countCurrentOct = 0,
                countCurrentNov = 0, countCurrentDec = 0,countPrevJan = 0,countPrevFeb = 0,countPrevMar = 0,countPrevApr = 0,countPrevMay = 0,
                countPrevJun= 0,countPrevJul = 0,countPrevAug = 0, countPrevSept = 0,countPrevOct = 0,countPrevNov = 0,countPrevDec =0;

            for ( i = 0; i < data.length; i++ ) {

                testArray[i] = new Date(data[i].CreateDate).toString();
                $rootScope.prospectArray = testArray;
                $rootScope.prospectArray[i] = new Date( $rootScope.prospectArray[i]);
                a[i] = $rootScope.prospectArray[i].getMonth();
                $rootScope.month = a;
                b[i] = $rootScope.prospectArray[i].getFullYear();
                $rootScope.year = b;

            }

            for( j = 0;j < $rootScope.prospectArray.length; j++){

                if(angular.equals($rootScope.currentYear,$rootScope.year[j]) || angular.equals($rootScope.previousYear,$rootScope.year[j])){

                    if(angular.equals($rootScope.currentYear,$rootScope.year[j])){

                        if($rootScope.month[j] <= $rootScope.currentMonth){
                            if($rootScope.month[j] === 0){

                                countCurrentJan++;
                            }
                            else if($rootScope.month[j] === 1){

                                countCurrentFeb++;
                            }
                            else if($rootScope.month[j] === 2){

                                countCurrentMar++;
                            }
                            else if($rootScope.month[j] === 3){

                                countCurrentApr++;
                            }
                            else if($rootScope.month[j] === 4){

                                countCurrentMay++;
                            }
                            else if($rootScope.month[j] === 5){

                                countCurrentJun++;
                            }
                            else if($rootScope.month[j] === 6){

                                countCurrentJul++;
                            }
                            else if($rootScope.month[j] === 7){

                                countCurrentAug++;
                            }
                            else if($rootScope.month[j] === 8){

                                countCurrentSept++;
                            }
                            else if($rootScope.month[j] === 9){

                                countCurrentOct++;
                            }
                            else if($rootScope.month[j] === 10){

                                countCurrentNov++;
                            }
                            else if($rootScope.month[j] === 11){

                                countCurrentDec++;
                            }
                        }

                    }
                    else if(angular.equals($rootScope.previousYear,$rootScope.year[j])){

                        if($rootScope.month[j] >= $rootScope.previoustMonth){
                            if($rootScope.month[j] === 0){

                                countPrevJan++;
                            }
                            else if($rootScope.month[j] === 1){

                                countPrevFeb++;
                            }
                            else if($rootScope.month[j] === 2){

                                countPrevMar++;
                            }
                            else if($rootScope.month[j] === 3){

                                countPrevApr++;
                            }
                            else if($rootScope.month[j] === 4){

                                countPrevMay++;
                            }
                            else if($rootScope.month[j] === 5){

                                countPrevJun++;
                            }
                            else if($rootScope.month[j] === 6){

                                countPrevJul++;
                            }
                            else if($rootScope.month[j] === 7){

                                countPrevAug++;
                            }
                            else if($rootScope.month[j] === 8){

                                countPrevSept++;
                            }
                            else if($rootScope.month[j] === 9){

                                countPrevOct++;
                            }
                            else if($rootScope.month[j] === 10){

                                countPrevNov++;
                            }
                            else if($rootScope.month[j] === 11){

                                countPrevDec++;
                            }

                        }

                    }

                }

            }
            console.log(countCurrentJan);

            $(document).ready(function () {
                if($rootScope.currentMonth == 0){
                    RenderLineChart('report-container', [
                        [countPrevFeb],[countPrevMar],[countPrevApr],[countPrevMay],[countPrevJun],
                        [countPrevJul],[countPrevAug],[countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                        [countCurrentJan]
                    ]);

                }
                else if($rootScope.currentMonth == 1){
                    RenderLineChart('report-container', [
                        [countPrevMar],[countPrevApr],[countPrevMay],[countPrevJun],
                        [countPrevJul],[countPrevAug],[countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                        [countCurrentJan],[countCurrentFeb]
                    ]);

                }
                else if($rootScope.currentMonth == 2){
                    RenderLineChart('report-container', [
                        [countPrevApr],[countPrevMay],[countPrevJun],
                        [countPrevJul],[countPrevAug],[countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                        [countCurrentJan],[countCurrentFeb],[countCurrentMar]
                    ]);

                }
                else if($rootScope.currentMonth == 3){
                    RenderLineChart('report-container', [
                        [countPrevMay],[countPrevJun],
                        [countPrevJul],[countPrevAug],[countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                        [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr]
                    ]);

                }
                else if($rootScope.currentMonth == 4){
                    RenderLineChart('report-container', [
                        [countPrevJun],
                        [countPrevJul],[countPrevAug],[countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                        [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay]
                    ]);

                }
                else if($rootScope.currentMonth == 5){
                    RenderLineChart('report-container', [
                        [countPrevJul],[countPrevAug],[countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                        [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay],[countCurrentJun]
                    ]);

                }
                else if($rootScope.currentMonth == 6){
                    RenderLineChart('report-container', [
                        [countPrevAug],[countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                        [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay],[countCurrentJun],
                        [countCurrentJul]
                    ]);

                }
                else if($rootScope.currentMonth == 7){
                    RenderLineChart('report-container', [
                        [countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                        [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay],[countCurrentJun],
                        [countCurrentJul],[countCurrentAug]
                    ]);

                }
                else if($rootScope.currentMonth == 8){
                    RenderLineChart('report-container', [
                        [countPrevOct],[countPrevNov],[countPrevDec],
                        [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay],[countCurrentJun],
                        [countCurrentJul],[countCurrentAug],[countCurrentSept]
                    ]);

                }
                else if($rootScope.currentMonth == 9){
                    RenderLineChart('report-container', [
                        [countPrevNov],[countPrevDec],
                        [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay],[countCurrentJun],
                        [countCurrentJul],[countCurrentAug],[countCurrentSept],[countCurrentOct]
                    ]);

                }
                else if($rootScope.currentMonth == 10){
                    RenderLineChart('report-container', [
                        [countPrevDec],
                        [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay],[countCurrentJun],
                        [countCurrentJul],[countCurrentAug],[countCurrentSept],[countCurrentOct],[countCurrentNov]
                    ]);

                }
                else if($rootScope.currentMonth == 11){
                    RenderLineChart('report-container', [
                        [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay],[countCurrentJun],
                        [countCurrentJul],[countCurrentAug],[countCurrentSept],[countCurrentOct],[countCurrentNov] ,[countCurrentDec]
                    ]);

                }

            });

            $scope.reportTypes =
                [{
                    value: 'Prospect addition per month',
                    name: 'Prospect addition per month'

                }, {
                    value: 'Demand for various technologies',
                    name: 'Demand for various technologies'
                }, {
                    value: 'Prospect segregation by domain',
                    name: 'Prospect segregation by domain'
                }, {
                    value: 'Probable team size',
                    name: 'Probable team size'
                }, {
                    value: 'Number of prospects by each sales person',
                    name: 'Number of prospects by each sales person'
                },{
                    value: 'Ratio of prospects vs clients',
                    name: 'Ratio of prospects vs clients'
                },{
                    value: 'Prospect segregation by status',
                    name: 'Prospect segregation by status'
                },{
                    value: 'Volunteer participation for prospects',
                    name: 'Volunteer participation for prospects'
                }]
            ;
            $scope.reportType = 'Prospect addition per month';
            $scope.changeReport = function () {

                $rootScope.flag = 1;
                var testArray = [],a = [],b=[], i,split_array = [], trimmed_array = [], j, k, l, m, p, q,index,prospectCount = 0, clientsCount = 0,
                    countCurrentJan = 0, countCurrentFeb = 0, countCurrentMar = 0, countCurrentApr = 0, countCurrentMay = 0, countCurrentJun = 0,
                    countCurrentJul = 0, countCurrentAug = 0, countCurrentSept = 0, countCurrentOct = 0, countCurrentNov = 0, countCurrentDec = 0,
                    countPrevJan = 0,countPrevFeb = 0,countPrevMar = 0,countPrevApr = 0,countPrevMay = 0,countPrevJun= 0,countPrevJul = 0,countPrevAug = 0,
                    countPrevSept = 0,countPrevOct = 0,countPrevNov = 0,countPrevDec =0,countOne = 0,countTwo = 0,
                    countThreeToFive = 0,countFiveToTen = 0,countTenPlus = 0,countCreated = 0,countPrep = 0,countClient = 0,countDead = 0,
                    countClientCreated = 0,countFollowUP = 0 ;

                if ( angular.equals($scope.reportType, $scope.reportTypes[0].value) ) {

                    for ( i = 0; i < data.length; i++ ) {

                        testArray[i] = new Date(data[i].CreateDate).toString();

                        $rootScope.prospectArray = testArray;
                        $rootScope.prospectArray[i] = new Date( $rootScope.prospectArray[i]);
                        a[i] = $rootScope.prospectArray[i].getMonth();
                        $rootScope.month = a;
                        b[i] = $rootScope.prospectArray[i].getFullYear();
                        $rootScope.year = b;
                    }
                    console.log( "testArray",testArray);
                    for( j = 0;j < $rootScope.prospectArray.length; j++){

                        if(angular.equals($rootScope.currentYear,$rootScope.year[j]) || angular.equals($rootScope.previousYear,$rootScope.year[j])){

                            if(angular.equals($rootScope.currentYear,$rootScope.year[j])){

                                if($rootScope.month[j] <= $rootScope.currentMonth){
                                    if($rootScope.month[j] === 0){

                                        countCurrentJan++;
                                    }
                                    else if($rootScope.month[j] === 1){

                                        countCurrentFeb++;
                                    }
                                   else if($rootScope.month[j] === 2){

                                        countCurrentMar++;
                                    }
                                   else if($rootScope.month[j] === 3){

                                        countCurrentApr++;
                                    }
                                    else if($rootScope.month[j] === 4){

                                        countCurrentMay++;
                                    }
                                    else if($rootScope.month[j] === 5){

                                        countCurrentJun++;
                                    }
                                    else if($rootScope.month[j] === 6){

                                        countCurrentJul++;
                                    }
                                    else if($rootScope.month[j] === 7){

                                        countCurrentAug++;
                                    }
                                    else if($rootScope.month[j] === 8){

                                        countCurrentSept++;
                                    }
                                    else if($rootScope.month[j] === 9){

                                        countCurrentOct++;
                                    }
                                    else if($rootScope.month[j] === 10){

                                        countCurrentNov++;
                                    }
                                    else if($rootScope.month[j] === 11){

                                        countCurrentDec++;
                                    }
                                }

                            }
                            else if(angular.equals($rootScope.previousYear,$rootScope.year[j])){

                                if($rootScope.month[j] >= $rootScope.previoustMonth){
                                    if($rootScope.month[j] === 0){

                                        countPrevJan++;
                                    }
                                    else if($rootScope.month[j] === 1){

                                        countPrevFeb++;
                                    }
                                    else if($rootScope.month[j] === 2){

                                        countPrevMar++;
                                    }
                                    else if($rootScope.month[j] === 3){

                                        countPrevApr++;
                                    }
                                    else if($rootScope.month[j] === 4){

                                        countPrevMay++;
                                    }
                                    else if($rootScope.month[j] === 5){

                                        countPrevJun++;
                                    }
                                    else if($rootScope.month[j] === 6){

                                        countPrevJul++;
                                    }
                                    else if($rootScope.month[j] === 7){

                                        countPrevAug++;
                                    }
                                    else if($rootScope.month[j] === 8){

                                        countPrevSept++;
                                    }
                                    else if($rootScope.month[j] === 9){

                                        countPrevOct++;
                                    }
                                    else if($rootScope.month[j] === 10){

                                        countPrevNov++;
                                    }
                                    else if($rootScope.month[j] === 11){

                                        countPrevDec++;
                                    }

                                }

                            }

                        }

                    }
                    console.log(countCurrentJan);

                    $(document).ready(function () {
                        if($rootScope.currentMonth == 0){
                            RenderLineChart('report-container', [
                                [countPrevFeb],[countPrevMar],[countPrevApr],[countPrevMay],[countPrevJun],
                                [countPrevJul],[countPrevAug],[countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                                [countCurrentJan]
                            ]);

                        }
                        else if($rootScope.currentMonth == 1){
                            RenderLineChart('report-container', [
                                [countPrevMar],[countPrevApr],[countPrevMay],[countPrevJun],
                                [countPrevJul],[countPrevAug],[countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                                [countCurrentJan],[countCurrentFeb]
                            ]);

                        }
                        else if($rootScope.currentMonth == 2){
                            RenderLineChart('report-container', [
                                [countPrevApr],[countPrevMay],[countPrevJun],
                                [countPrevJul],[countPrevAug],[countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                                [countCurrentJan],[countCurrentFeb],[countCurrentMar]
                            ]);

                        }
                        else if($rootScope.currentMonth == 3){
                            RenderLineChart('report-container', [
                                [countPrevMay],[countPrevJun],
                                [countPrevJul],[countPrevAug],[countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                                [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr]
                            ]);

                        }
                        else if($rootScope.currentMonth == 4){
                            RenderLineChart('report-container', [
                                    [countPrevJun],
                                [countPrevJul],[countPrevAug],[countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                                [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay]
                        ]);

                        }
                        else if($rootScope.currentMonth == 5){
                            RenderLineChart('report-container', [
                                [countPrevJul],[countPrevAug],[countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                                [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay],[countCurrentJun]
                            ]);

                        }
                        else if($rootScope.currentMonth == 6){
                            RenderLineChart('report-container', [
                                [countPrevAug],[countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                                [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay],[countCurrentJun],
                                [countCurrentJul]
                            ]);

                        }
                        else if($rootScope.currentMonth == 7){
                            RenderLineChart('report-container', [
                                [countPrevSept],[countPrevOct],[countPrevNov],[countPrevDec],
                                [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay],[countCurrentJun],
                                [countCurrentJul],[countCurrentAug]
                            ]);

                        }
                        else if($rootScope.currentMonth == 8){
                            RenderLineChart('report-container', [
                                [countPrevOct],[countPrevNov],[countPrevDec],
                                [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay],[countCurrentJun],
                                [countCurrentJul],[countCurrentAug],[countCurrentSept]
                            ]);

                        }
                        else if($rootScope.currentMonth == 9){
                            RenderLineChart('report-container', [
                                [countPrevNov],[countPrevDec],
                                [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay],[countCurrentJun],
                                [countCurrentJul],[countCurrentAug],[countCurrentSept],[countCurrentOct]
                            ]);

                        }
                        else if($rootScope.currentMonth == 10){
                            RenderLineChart('report-container', [
                                    [countPrevDec],
                                [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay],[countCurrentJun],
                                [countCurrentJul],[countCurrentAug],[countCurrentSept],[countCurrentOct],[countCurrentNov]
                            ]);

                        }
                        else if($rootScope.currentMonth == 11){
                            RenderLineChart('report-container', [
                                [countCurrentJan],[countCurrentFeb],[countCurrentMar],[countCurrentApr],[countCurrentMay],[countCurrentJun],
                                [countCurrentJul],[countCurrentAug],[countCurrentSept],[countCurrentOct],[countCurrentNov] ,[countCurrentDec]
                            ]);
                        }
                    });
                }

                else if ( angular.equals($scope.reportType, $scope.reportTypes[1].value) ) {

                    for ( i = 0; i < data.length; i++ ) {
                        testArray[i] = data[i].TechStack;
                    }
                    for ( j = 0; j < testArray.length; j++ ) {
                        a[j] = testArray[j];
                        if (a[j].indexOf(',') !== -1) {
                            split_array = a[j].split(',');
                            for ( k = 0; k < split_array.length; k++) {
                                testArray.push(split_array[k]);
                            }
                        }
                    }
                    for ( l = 0; l < testArray.length; l++) {
                        if (testArray[l].indexOf(',') == -1) {
                            trimmed_array.push(testArray[l]);
                        }
                    }
                    testArray = trimmed_array;

                    for ( m = 0; m < testArray.length; m++ ) {

                        testArray[m] = angular.uppercase(testArray[m]);
                        testArray[m] = testArray[m].replace(/^[\s,]+|[\s,]+$/g,'');
                    }
                    var newArray = countArray(testArray);

                    newArray.sort(function(a, b){return b.count - a.count});
                    for(  p = 10; p < newArray.length; p++) {
                        index = newArray.indexOf(newArray[p]);
                        newArray.splice(index,1,"OTHER");
                    }
                    var sortArray = sortArrayTechstack(newArray);
                    if(newArray.length > 10){
                        newArray.length = 10;

                    }

                    console.log(newArray);
                    var finalArray = newArray.concat(sortArray);
                    console.log(finalArray);

                    $(document).ready(function () {

                        var parentArray = $.map(finalArray[0], function (value) {
                            return [value];
                        });
                        for ( i = 0; i < finalArray.length; i++ ) {
                            var array = $.map(finalArray[i], function (value) {
                                return [value];
                            });
                            parentArray[i] = array;
                        }

                        if(finalArray.length == 1 && parentArray.length == 2){

                            parentArray.length = 1;
                        }
                        var Array = $.map(parentArray, function (value) {
                            return [value];
                        });
                        RenderPieChartTechstack('report-container', [
                            Array
                        ]);
                    });
                }

                else if ( angular.equals($scope.reportType, $scope.reportTypes[2].value) ) {

                    for ( i = 0; i < data.length; i++ ) {
                        testArray[i] = data[i].Domain;
                    }
                    for ( j = 0; j < testArray.length; j++ ) {
                        a[j] = testArray[j];
                        if (a[j].indexOf(',') !== -1) {
                            split_array = a[j].split(',');
                            for ( k = 0; k < split_array.length; k++ ) {
                                testArray.push(split_array[k]);
                            }
                        }
                    }
                    for ( l = 0; l < testArray.length; l++ ) {
                        if (testArray[l].indexOf(',') == -1) {
                            trimmed_array.push(testArray[l]);
                        }
                    }
                    testArray = trimmed_array;

                    for ( m = 0; m < testArray.length; m++ ) {
                        testArray[m] = angular.uppercase(testArray[m]);
                        testArray[m] = testArray[m].replace(/^[\s,]+|[\s,]+$/g, '');
                    }

                    for(  p = 10; p < testArray.length; p++){
                        index = testArray.indexOf(testArray[p]);
                        testArray.splice(index,1,"OTHER");
                    }
                    var newArray = countArray(testArray);

                    $(document).ready(function () {

                        var parentArray = $.map(newArray[0], function (value, index) {
                            return [value];
                        });
                        for (var i = 0; i < newArray.length; i++) {
                            var array = $.map(newArray[i], function (value, index) {
                                return [value];
                            });
                            parentArray[i] = array;
                        }
                        if(newArray.length == 1 && parentArray.length == 2){

                            parentArray.length = 1;
                        }
                        var Array = $.map(parentArray, function (value, index) {
                            return [value];
                        });

                        RenderPieChartDomain('report-container', [
                            Array

                        ]);
                    });
                }

                else if ( angular.equals($scope.reportType, $scope.reportTypes[3].value) ) {

                    for ( i = 0; i < data.length; i++ ) {
                        testArray[i] = data[i].DesiredTeamSize.toString();

                        if(testArray[i] == 1){

                            countOne++;
                        }
                        else if(testArray[i] == 2){
                            countTwo++;
                        }
                        else if(testArray[i] >= 3 && testArray[i] <= 5){
                            countThreeToFive++;
                        }
                        else if(testArray[i] >= 5 && testArray[i] <= 10){

                            countFiveToTen++;
                        }
                        else if(testArray[i] > 10){
                            countTenPlus++;
                        }

                    }
                    console.log(countThreeToFive);
                    /*var newArray = countArrayTeamSize(testArray);
                     console.log(newArray);*/
                    $(document).ready(function () {
                        /*var parentArray = $.map(newArray[0], function (value, index) {
                         return [value];
                         });
                         for ( i = 0; i < newArray.length; i++ ) {
                         var array = $.map(newArray[i], function (value, index) {
                         return [value];
                         });
                         parentArray[i] = array;
                         }
                         if(newArray.length == 1 && parentArray.length == 2){

                         parentArray.length = 1;
                         }
                         var Array = $.map(parentArray, function (value, index) {
                         return [value];
                         });*/
                        RenderPieChartTeamSize('report-container', [
                            ['1' ,countOne],['2',countTwo],['3 - 5',countThreeToFive],
                            ['5 - 10',countFiveToTen],['10+',countTenPlus]
                        ]);
                    });

                }

                else if ( angular.equals($scope.reportType, $scope.reportTypes[4].value) ) {

                    for( i = 0; i < data.length; i++ ){
                        testArray[i] = data[i].SalesID;
                    }
                    for ( j = 0; j < testArray.length; j++ ) {

                        testArray[j] = angular.uppercase(testArray[j]);
                    }
                    console.log(testArray);
                    var newArray = countArray(testArray);

                    $(document).ready(function () {

                        var parentArray = $.map(newArray[0], function (value, index) {
                            return [value];
                        });
                        for ( i = 0; i < newArray.length; i++ ) {
                            var array = $.map(newArray[i], function (value, index) {
                                return [value];
                            });
                            parentArray[i] = array;
                        }
                        console.log(parentArray);
                        console.log(parentArray[0]);
                        console.log(newArray.length);
                        if(newArray.length == 1 && parentArray.length == 2){

                            parentArray.length = 1;
                        }
                        console.log(parentArray.length);
                        var Array = $.map(parentArray, function (value, index) {
                            return [value];
                        });
                        console.log(Array);
                        RenderBarChartSalesPerson('report-container', [
                            Array
                        ]);
                    });
                }

                else if ( angular.equals($scope.reportType, $scope.reportTypes[5].value) ) {

                    for ( i = 0; i < data.length; i++ ) {
                        testArray[i] = data[i].BUHead;

                        if (testArray[i].length === 0 ) {
                            prospectCount++;
                        }
                        else {
                            clientsCount++;
                        }
                    }
                    $(document).ready(function () {

                        RenderPieChartPropsectvsClient('report-container', [
                            ['Propsects',prospectCount],
                            ['Clients',clientsCount]
                        ]);
                    });
                }

                else if ( angular.equals($scope.reportType, $scope.reportTypes[6].value) ) {

                    for(  i = 0;i < data.length; i++ ){

                        testArray[i] = data[i].ProspectStatus;
                    }
                    console.log(testArray);
                    for( j = 0; j < testArray.length; j++){

                        if(testArray[j].indexOf("created") !== -1){
                            countCreated++;
                        }else if(testArray[j].indexOf("Prep") !== -1){

                            countPrep++;
                        }else if(testArray[j].indexOf("Client") !== -1){

                            countClient++;
                        }
                        else if(testArray[j].indexOf("Dead prospect") !== -1){
                            countDead++

                        }else if(testArray[j].indexOf("Prospect converted") !== -1){

                            countClientCreated++;
                        }
                        else{
                            countFollowUP++;

                        }
                    }
                    $(document).ready(function () {

                        RenderPieChartProspectStatus('report-container', [
                            ['Propsect Created',countCreated],['Prep call scheduled',countPrep],
                            ['Client call scheduled',countClient],['Dead Prospect',countDead],
                            ['Prospect converted to client',countClientCreated],['Reminder set up',countFollowUP]
                        ])
                    });
                }

                else if ( angular.equals($scope.reportType, $scope.reportTypes[7].value) ) {

                    $scope.prospect = $rootScope.prospectToUpdate;

                    $http.get(baseURL + 'prospect/all/').success(function(data, status, headers, config) {

                        var prospectData = JSON.stringify(data);
                        var prospectList = JSON.parse(prospectData);
                        var numberOfProspects = prospectList.length;
                        var testArray = [],a = [];
                        for(var i = 0; i < numberOfProspects; i++){
                            (function (index) {
                                $http.get(baseURL + 'participant/prospectid/' + prospectList[i].ProspectID)
                                    .success(function(participantData, status, headers, config){
                                        /*// console.log(participantData);
                                         for(var k = 0;k < numberOfProspects.length; k++){
                                         a[i] = participantData[i].ParticipationRole;
                                         }
                                         console.log(a);*/
                                        var participantdata = JSON.stringify(participantData);


                                        if (JSON.parse(participantdata) == null) {
                                            prospectList[index].noOfVolunteers = 0;
                                        }
                                        else {
                                            prospectList[index].noOfVolunteers = JSON.parse(participantdata).length;
                                        }
                                        for(var j= 0;j < prospectList.length; j++){
                                            testArray[j] = prospectList[j].noOfVolunteers;

                                        }
                                        var newArray = combineVolunteerData(prospectList);
                                        // console.log(newArray);
                                        $(document).ready(function () {

                                            var parentArray = $.map(newArray[0], function (value, index) {
                                                return [value];
                                            });
                                            for ( i = 0; i < newArray.length; i++ ) {
                                                var array = $.map(newArray[i], function (value, index) {
                                                    return [value];
                                                });
                                                parentArray[i] = array;
                                            }

                                            if(newArray.length == 1 && parentArray.length == 2){

                                                parentArray.length = 1;
                                            }
                                            var Array = $.map(parentArray, function (value, index) {
                                                return [value];
                                            });
                                            //console.log(Array);
                                            RenderBarChartVolunteer('report-container', [
                                                Array
                                            ]);
                                        });
                                    }).error(function(data, status, header, config) {
                                    console.log("Not able to calculate volunteer count")
                                });

                            }(i));
                        }

                    }).error(function(data, status, header, config) {});
                }
            };

        }).error(function (data, status, header, config) {});
        function RenderLineChart(elementId,dataList) {
           var max =  Date.UTC($rootScope.currentYear, $rootScope.currentMonth);
           var min = Date.UTC($rootScope.previousYear, $rootScope.previoustMonth);
            var a = [];
            var xAxisValues = [];
            var mon;
            console.log("$rootScope.previoustMonth",$rootScope.previoustMonth);
            for(var i =  $rootScope.previoustMonth ; i < 12; i++){

                if (i == 0 ){
                    mon = "Jan";
                } else if(i == 1){
                    mon = "Feb";
                } else if(i == 2){
                    mon = "Mar";
                } else if(i == 3){
                    mon = "Apr";
                } else if(i == 4){
                    mon = "May";
                } else if(i == 5){
                    mon = "Jun";
                } else if(i == 6){
                    mon = "Jul";
                } else if(i == 7){
                    mon = "Aug";
                } else if(i == 8){
                    mon = "Sep";
                } else if(i == 9){
                    mon = "Oct";
                } else if(i == 10){
                    mon = "Nov";
                } else if(i == 11){
                    mon = "Dec";
                }

                a.push(Date.UTC($rootScope.previousYear,$rootScope.previoustMonth + i));
                xAxisValues.push($rootScope.previousYear + " " + mon);


            }
                 for(var j = 0;j <= $rootScope.currentMonth; j++){
                     if (j == 0 ){
                         mon = "Jan";
                     } else if(j == 1){
                         mon = "Feb";
                     } else if(j == 2){
                         mon = "Mar";
                     } else if(j == 3){
                         mon = "Apr";
                     } else if(j == 4){
                         mon = "May";
                     } else if(j == 5){
                         mon = "Jun";
                     } else if(j == 6){
                         mon = "Jul";
                     } else if(j == 7){
                         mon = "Aug";
                     } else if(j == 8){
                         mon = "Sep";
                     } else if(j == 9){
                         mon = "Oct";
                     } else if(j == 10){
                         mon = "Nov";
                     } else if(j == 11){
                         mon = "Dec";
                     }

                     a.push(Date.UTC($rootScope.currentYear,$rootScope.currentMonth + j));
                     xAxisValues.push($rootScope.currentYear + " " + mon);
                 }
            console.log(xAxisValues);
            console.log(a);
            console.log($rootScope.currentMonth);
            new Highcharts.Chart({
                title: {
                    text: 'Prospect addition per month',
                    x: -20 //center
                },
                chart: {
                    renderTo: elementId,
                    height: 600,
                    width: 1140
                },
                xAxis: {
               /*  categories: [ 'Feb\'15', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']*/
                    categories:xAxisValues
                 },
               /* xAxis: {
                    type: 'datetime',
                    tickInterval: 30 * 24 * 3600 * 1000,
                   /!* max : Date.UTC($rootScope.currentYear, $rootScope.currentMonth),
                    min : Date.UTC($rootScope.previousYear, $rootScope.previoustMonth),*!/

                    labels:{
                        rotation: 45,
                        step: 1
                    },
                    dateTimeLabelFormats: { // don't display the dummy year
                        month: '%b \'%y'
                    }

                },*/
                yAxis: {
                    title: {
                        text: 'No. of Prospects Added'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {},

                series: [{
                    name: 'No. of Prospects',
                    data: dataList
                }]
            })

        }
        function RenderPieChartTechstack(elementId, dataList) {

            for ( i = 0; i < dataList.length; i++) {
                new Highcharts.Chart({

                    chart: {
                        renderTo: elementId,
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        height:600,
                        width:1140
                    },
                    colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
                        '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1','#8c8c8c'],
                    title: {
                        text: 'Demand for various technologies'
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.point.name + '</b>: ' + this.point.y;
                        }
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            size:400,
                            center:[550,200],
                            cursor: 'pointer',
                            borderColor: null,
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                formatter: function () {
                                    return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 2) + '%';
                                }
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Browser share',
                        data: dataList[0]
                    }]
                });
            }
        }
        function RenderPieChartDomain(elementId, dataList) {

            for (var i = 0; i < dataList.length; i++ ) {
                new Highcharts.Chart({

                    chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        },
                        renderTo: elementId,
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        height:600,
                        width:1140
                    }, title: {
                        text: 'Prospect segregation by domain',
                        name: 'Prospect segregation by domain'
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.point.name + '</b>: ' + this.point.y;
                        }
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            size:'100%',
                            center:[550,200],
                            cursor: 'pointer',
                            depth:55,
                            dataLabels:{
                                formatter: function () {
                                    return '<b>' + this.point.name + '</b>: '+ Highcharts.numberFormat(this.percentage, 2) + '%';
                                }
                            }
                        }
                    },
                    series: [{

                        type: 'pie',
                        name: 'Browser share',
                        data: dataList[0]
                    }]
                });
            }
        }
        function RenderPieChartTeamSize(elementId, dataList) {


            new Highcharts.Chart({

                chart: {
                    type: 'pie',

                    options3d: {
                        enabled: true,
                        alpha: 45,
                        beta: 0
                    },

                    renderTo: elementId,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    height:600,
                    width:1140
                },
                colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
                    '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1','#E5005A'],
                title: {
                    text: 'Probable team size'
                },
                tooltip: {
                    enabled:false
                    
                },
                legend: {
                    align: 'right',
                    verticalAlign: 'bottom',
                    layout: 'vertical',
                    borderColor:'black',
                    itemStyle: {
                        fontSize:15
                    },
                    borderWidth:1,
                    labelFormatter: function () {
                        return this.name + ' Person team';
                    }
                },
                plotOptions: {
                    pie: {

                        allowPointSelect: true,
                        innerSize: 170,
                        size:400,
                        center:[550,200],
                        cursor: 'pointer',
                        depth:55,
                        showInLegend: true,
                        dataLabels:{

                            formatter: function () {
                                if (this.y != 0){
                                    return  Highcharts.numberFormat(this.percentage, 2) + '%';
                                }
                                else{
                                    return null;
                                }
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: dataList
                }]
            });

        }
        function RenderBarChartSalesPerson(elementId, dataList) {

            for (var i = 0; i < dataList.length; i++ ) {
                new Highcharts.Chart({

                    chart: {
                        margin: 75,
                        options3d: {
                            enabled: true,
                            alpha: 15,
                            beta: 15,
                            depth: 50,
                            viewDistance: 25
                        },
                        type: 'column',
                        renderTo: elementId,
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        height:600,
                        width:1140
                    }, title: {
                        text:'Number of prospects by each sales person'
                    },
                    xAxis: {
                        categories: [

                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text:' <b>Number of propsects</b>'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0,
                            depth:25
                        }
                    },
                    series: [{
                        showInLegend: false,
                        name:'Number of Prospects',
                        data: dataList[0]
                    }]
                });
            }
        }
        function RenderPieChartPropsectvsClient(elementId, dataList) {

            new Highcharts.Chart({

                chart: {
                    type: 'pie',
                    options3d: {
                        enabled: true,
                        alpha: 45,
                        beta: 0
                    },
                    renderTo: elementId,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    height:600,
                    width:1140
                },
                colors: ['#FFA500','#008000'],
                title: {
                    text: 'Ratio of prospects vs clients'
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.point.name + '</b>: ' + this.point.y ;
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        size:400,
                        center:[550,200],
                        cursor: 'pointer',
                        depth:55,
                        dataLabels:{
                            formatter: function () {

                                if (this.y != 0){
                                    return '<b>' + this.point.name + '</b>: '+ Highcharts.numberFormat(this.percentage, 2) + '%';
                                }
                                else{
                                    return null;
                                }
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: dataList
                }]
            });
        }
        function RenderPieChartProspectStatus(elementId, dataList) {
            new Highcharts.Chart({

                chart: {
                    renderTo: elementId,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    height:600,
                    width:1140
                },
                colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
                    '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1','#8c8c8c'],
                title: {
                    text: 'Prospect segregation by status'
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.point.name + '</b>: ' + this.point.y;
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        size:400,
                        center:[550,200],
                        cursor: 'pointer',
                        borderColor: null,
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            formatter: function () {
                                if (this.y != 0){
                                    return '<b>' + this.point.name + '</b>: '+ Highcharts.numberFormat(this.percentage, 2) + '%';
                                }
                                else{
                                    return null;
                                }                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: dataList
                }]
            });
        }
        function RenderBarChartVolunteer(elementId, dataList) {

            for (var i = 0; i < dataList.length; i++ ) {
                new Highcharts.Chart({

                    chart: {
                        margin: 75,
                        options3d: {
                            enabled: true,
                            alpha: 15,
                            beta: 15,
                            depth: 50,
                            viewDistance: 25
                        },
                        type: 'column',
                        renderTo: elementId,
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        height:600,
                        width:1140
                    }, title: {
                        text:'Volunteer participation for propsects'
                    },
                    xAxis: {
                        categories: [

                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text:' <b>Number of volunteers</b>'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0,
                            depth:25
                        }
                    },
                    series: [{
                        showInLegend: false,
                        name:'Number of volunteers',
                        data: dataList[0]
                    }]
                });
            }
        }
        function countArray(original) {
            var compressed = [];
            // make a copy of the input array
            var copy = original.slice(0);
            // first loop goes over every element
            for (var i = 0; i < original.length; i++) {
                var myCount = 0;
                // loop over every element in the copy and see if it's the same
                for (var w = 0; w < copy.length; w++) {
                    if (original[i] == copy[w]) {
                        // increase amount of times duplicate is found
                        myCount++;
                        // sets item to undefined
                        delete copy[w];
                    }
                }
                if (myCount > 0) {
                    var a = {};
                    a.value = original[i];
                    a.count = myCount;
                    compressed.push(a);
                }
            }
            return compressed;
        }
        function sortArrayTechstack(original) {
            var compressed = [];
            // make a copy of the input array
            var copy = original.slice(0);
            // first loop goes over every element
            for (var i = 10; i < original.length; i++) {
                var myCount = 0;
                // loop over every element in the copy and see if it's the same
                for (var w = 0; w < copy.length; w++) {
                    if (original[i] == copy[w]) {
                        // increase amount of times duplicate is found
                        myCount++;
                        // sets item to undefined
                        delete copy[w];
                    }
                }
                if (myCount > 0) {
                    var a = {};
                    a.value = original[i];
                    a.count = myCount;
                    compressed.push(a);
                }
            }
            return compressed;
        }
        function combineVolunteerData(original) {
            var compressed = [];
            for (var i = 0; i < original.length; i++) {
                var a = {};
                a.value = original[i].Name;
                a.count = original[i].noOfVolunteers;
                compressed.push(a);

            }
            return compressed;
        }
    });
