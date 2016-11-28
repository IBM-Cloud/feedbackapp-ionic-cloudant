angular.module('app.controllers', ['ionic', 'ionic.rating'])

.controller('feedbackCtrl', function ($scope, $http, $rootScope, $ionicPopup, CLOUDANTDB_CONFIG) {

    // set the rate and max variables
    $scope.rating = {};
    $scope.rating.max = 5;
    $scope.readOnly = false;


    // Create Base64 Object
    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function (e) {
            var t = "";
            var n, r, i, s, o, u, a;
            var f = 0;
            e = Base64._utf8_encode(e);
            while (f < e.length) {
                n = e.charCodeAt(f++);
                r = e.charCodeAt(f++);
                i = e.charCodeAt(f++);
                s = n >> 2;
                o = (n & 3) << 4 | r >> 4;
                u = (r & 15) << 2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) {
                    u = a = 64
                } else if (isNaN(i)) {
                    a = 64
                }
                t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
            }
            return t
        },
        decode: function (e) {
            var t = "";
            var n, r, i;
            var s, o, u, a;
            var f = 0;
            e = e.replace(/[^A-Za-z0-9+/=]/g, "");
            while (f < e.length) {
                s = this._keyStr.indexOf(e.charAt(f++));
                o = this._keyStr.indexOf(e.charAt(f++));
                u = this._keyStr.indexOf(e.charAt(f++));
                a = this._keyStr.indexOf(e.charAt(f++));
                n = s << 2 | o >> 4;
                r = (o & 15) << 4 | u >> 2;
                i = (u & 3) << 6 | a;
                t = t + String.fromCharCode(n);
                if (u != 64) {
                    t = t + String.fromCharCode(r)
                }
                if (a != 64) {
                    t = t + String.fromCharCode(i)
                }
            }
            t = Base64._utf8_decode(t);
            return t
        },
        _utf8_encode: function (e) {
            e = e.replace(/rn/g, "n");
            var t = "";
            for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r)
                } else if (r > 127 && r < 2048) {
                    t += String.fromCharCode(r >> 6 | 192);
                    t += String.fromCharCode(r & 63 | 128)
                } else {
                    t += String.fromCharCode(r >> 12 | 224);
                    t += String.fromCharCode(r >> 6 & 63 | 128);
                    t += String.fromCharCode(r & 63 | 128)
                }
            }
            return t
        },
        _utf8_decode: function (e) {
            var t = "";
            var n = 0;
            var r = c1 = c2 = 0;
            while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r);
                    n++
                } else if (r > 191 && r < 224) {
                    c2 = e.charCodeAt(n + 1);
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                    n += 2
                } else {
                    c2 = e.charCodeAt(n + 1);
                    c3 = e.charCodeAt(n + 2);
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    n += 3
                }
            }
            return t
        }
    }

    // Define the Credentials string to be encoded.
    var credentialstobeEncoded = CLOUDANTDB_CONFIG.userName + ":" + CLOUDANTDB_CONFIG.password;

    // Encode the String
    var encodedString = Base64.encode(credentialstobeEncoded);
    console.log("ENCODED: " + encodedString);

    $scope.createFeedback = function (feedback) {

        $http({
            method: 'POST',
            url: CLOUDANTDB_CONFIG.baseUrl + "/" + CLOUDANTDB_CONFIG.dbName,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + encodedString
            },
            data: {
                _id: feedback.email,
                name: feedback.name,
                email: feedback.email,
                org: feedback.org,
                phone: feedback.phone,
                lab: feedback.lab,
                rating: feedback.rating,
                comments: feedback.comments

            }
        }).then(function successCallback(response) {
            console.log("SUCCESS");

            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.showAlert = function () {
                var alertPopup = $ionicPopup.alert({
                    title: 'Please submit your feedback again.',
                    template: 'Looks like you are not connected to internet or there is an error.'
                });

                alertPopup.then(function (res) {
                    console.log('Thank you for not eating my delicious ice cream cone');
                });
            };
        });
    };

    $rootScope.reload = function () {
        $scope.feedback.name = null;
        $scope.feedback.email = null;
        $scope.feedback.org = null;
        $scope.feedback.phone = null;
        $scope.feedback.lab = null;
        $scope.feedback.rating = null;
        $scope.feedback.comments = null;
        $scope.feedbackForm.$setPristine();
    };


    $scope.clearFields = function () {
        var clear = {
            name: "",
            email: "",
            org: "",
            phone: "",
            lab: "",
            rating: "",
            comments: ""
        };
        console.log("CLEAR FIELDS");

    }

    // An alert dialog
    $rootScope.showAlert = function () {
        if ($scope.feedbackForm.$valid) {
            var alertPopup = $ionicPopup.alert({
                title: 'Thanks for your valuable feedback.',
                template: 'You are an Awesome Developer'
            });

            alertPopup.then(function (res) {
                $scope.reload();
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        } else {
            $scope.showAlert = function () {
                var alertPopup = $ionicPopup.alert({
                    title: 'Please submit your feedback again.',
                    template: 'Looks like there is an error.'
                });

                alertPopup.then(function (res) {
                    console.log('Thank you for not eating my delicious ice cream cone');
                });
            };
        }



    };
});