angular
    .module('loc8rApp', [])
    .controller('locationListCtrl', locationListCtrl)
    .service('loc8rData', loc8rData)
    .service('geolocation', geolocation)
    .filter('formatDistance', formatDistance)
    .directive('ratingStars', ratingStars);

function loc8rData($http) {
    var locationByCoords = function(lat, lng) {

        return $http.get('api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=20');
    };

    return {
        locationByCoords: locationByCoords
    };
    //console.log("lng: "+lng+ "lat: "+lat);
    //return $http.get('api/locations?lng='+lng+'&lat='+lat+'&maxDistance=20');
    //return $http.get('api/locations?lng=-0.9690884&lat=51.45504102&maxDistance=20');
    //return $http.get('api/locations?lng=-0.969&&lat=51.45504102&maxDistance=20');

};

function locationListCtrl($scope, loc8rData, geolocation) {
    //console.log(loc8rData);
    $scope.message = "Checking your location";

    $scope.getData = function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        $scope.message = "Searching for nearby places";
        loc8rData.locationByCoords(lat, lng)
            .success(function(data) {
                $scope.message = data.length > 0 ? "" : "No locations found in lat: " + lat + " lng. " + lng;
                $scope.data = {
                    locations: data
                };
            })
            .error(function(e) {
                $scope.message = "Sorry, something's gone wrong ";
                console.log(e);
            });
    }
    $scope.showError = function(error) {
        $scope.$apply(function() {
            $scope.message = error.message;
        });
    };

    $scope.noGeo = function() {
        $scope.$apply(function() {
            $scope.message = "Geolocation not supported by this browser.";
        });
    };

    geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
};

function _isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

function formatDistance() {
    return function(distance) {
        var numDistance, unit;
        if (distance && _isNumeric(distance)) {
            if (distance > 1) {
                numDistance = parseFloat(distance).toFixed(1);
                unit = 'km';
            }
            else {
                numDistance = parseInt(distance * 1000, 10);
                unit = 'm';
            }
            return numDistance + unit;
        }
        else {
            return "?";
        }
    };
};


function ratingStars() {
    return {
        scope: {
            thisRating: '=rating'
        },
        //template: "{{ thisRating }}"
        templateUrl: '/angular/rating-stars.html'
    };
};


function geolocation() {
    var getPosition = function(cbSuccess, cbError, cbNoGeo) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
        }
        else {
            cbNoGeo();
        }
    };
    return {
        getPosition: getPosition
    };
};

