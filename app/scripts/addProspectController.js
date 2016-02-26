var baseURL = "http://presaleshuddle:8080/";
//var baseURL = "http://golangwebservice-presales.rhcloud.com/";


angular.module('PreSales-Huddle')

    .controller('AddProspectCtrl', function($scope, $filter, $http, $rootScope, $location) {
        document.getElementById('signin').style.visibility='hidden';
        document.getElementById('g-signinP').style.height = '0px';
        document.getElementById('sign-out').style.visibility='visible';
        document.getElementById('prospectList').style.visibility='visible';
        document.getElementById('clientList').style.visibility='visible';
        document.getElementById('headerText').style.visibility='visible';
        document.getElementById('notifications').style.visibility='visible';
        document.getElementById('titleText').style.display='none';

        $scope.maxDate = new Date();
        var currentYear = $scope.maxDate.getFullYear();
        var currentMonth = $scope.maxDate.getMonth();
        var currentDate = $scope.maxDate.getDate();

        $scope.date = new Date(currentYear, currentMonth, currentDate);
        console.log("$scope.date", $scope.date);

        $rootScope.showProspectNote = 0;
        //$rootScope.showContactDetails = 0;
        $rootScope.showaddPropsectForm = 1;
        $scope.revenue =
            [{
                value: 'Pre-revenue',
                name:  'Pre-revenue'
            }, {
                value: 'Revenue under $10M',
                name:  'Revenue under $10M'
            }, {
                value: 'Revenue over $10M',
                name:  'Revenue over $10M'
            }]
        ;
        $scope.PreRevenue = 'Pre-revenue';

        $scope.addProspect = function() {
            if (angular.equals(undefined, $scope.techStack)) {
                $scope.techStack = "Unknown";
            }
            if (angular.equals(undefined, $scope.domain)) {
                $scope.domain = "Unknown";
            }
            if (angular.equals(undefined, $scope.teamSize)) {
                $scope.teamSize = 1;
            }
            if ($scope.date == undefined) {
                console.log("undefined $scope.createDate: ", $scope.date);
                $scope.date = new Date(currentYear, currentMonth, currentDate);
                console.log("$scope.date: ", $scope.date);
            }
            //console.log("$scope.date: ", $scope.date);
            //console.log("$scope.date.toLocaleDateString()", $scope.date.toLocaleDateString());
            var n = (new Date ($scope.date)).toDateString();
            var time = $scope.date.toLocaleTimeString();
            var status = "Prospect created" + " on " + n;
            //$rootScope.ProspectCreationStatus = status + " on " + n;

            var data = {
                Name:               $scope.prospectName,
                CreateDate :        $scope.date,
                TechStack:          $scope.techStack,
                Domain:             $scope.domain,
                DesiredTeamSize:    $scope.teamSize,
                ProspectNotes:      $scope.notes,
                ProspectStatus:     status,
                SalesID:            $rootScope.salesName,
                KeyContacts:        $scope.keyContacts,
                WebsiteURL:         $scope.websiteURL,
                FolderURL:          $scope.folderURL,
                Revenue:            $scope.PreRevenue
            };

            console.log(data);

            var config = {
                headers: {'Authentication': JSON.parse($rootScope.authenticationData)}
            };

            /*$("#myModal3").modal({backdrop: false});*/
            $http.post(baseURL + 'prospect/', data = data, config).success(function(data, status, headers, config) {
                console.log('Prospect added.');
                $("#prospectAddedModal").modal({backdrop: "static"});

            }).error(function(data, status, headers, config) {
                    console.log('Prospect not added.');
                });
            /* $location.path('/prospects');*/
            $scope.prospectName = "";
            $scope.date = "";
            $scope.techStack = "";
            $scope.domain = "";
            $scope.teamSize = "";
            $scope.ProspectNotes = "";
            $scope.keyContacts = "";
            $scope.websiteURL = "";
            $scope.folderURL = "";
            $scope.PreRevenue = "";
        };

        $scope.notesPage = function() {
            $rootScope.nameOfProspect = $scope.prospectName;
            $rootScope.showProspectNote = 1;
           // $rootScope.showContactDetails = 0;
            $rootScope.showaddPropsectForm = 0;
        };

        /*$scope.contactsPage = function() {
            $rootScope.showProspectNote = 0;
            $rootScope.showContactDetails = 1;
            $rootScope.showaddPropsectForm = 0;
        };
*/
        $scope.addProspectForm = function() {
            $rootScope.showProspectNote= 0 ;
         //   $rootScope.showContactDetails = 0;
            $rootScope.showaddPropsectForm = 1;
        };

        $scope.goBack = function() {
            $('body').removeClass('modal-open');
            $location.path('/viewProspects');
        };

        // Cancel button function
        $scope.go = function(path) {
            console.log("path: ", path);
            $rootScope.lastform = "create";
            $location.path(path);

        };

       /* $(function(){

            $("#tags input").on({
                focusout : function() {
                    var txt= this.value.replace(/[^a-z0-9\+\-\.]/ig,''); // allowed characters
                    if(txt) $("<span/>",{text:txt.toLowerCase(), insertAfter:this});
                    this.value="";
                },
                keyup : function(ev) {
                    // if: comma|enter (delimit more keyCodes with | pipe)
                    if(/(188|13)/.test(ev.which)) $(this).focusout();
                }
            });
            $('#tags').on('click', 'span', function() {
                if(confirm("Remove "+ $(this).text() +"?")) $(this).remove();
            });

        });*/
       /* $(function(e) {
            var target = $(e.target);
            if (target.hasClass('tagit-label')) {
                var tag = target.closest('.tagit-choice');
                if (!tag.hasClass('removed')) {
                    that._trigger('onTagClicked', e, {
                        tag: tag,
                        tagLabel: that.tagLabel(tag)
                    });
                }
            }
        });*/
    }) ;
