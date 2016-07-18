/**
* File Uploader Directive
* https://github.com/DevTeamHub/file-uploader-directive
* (c) 2016 Dev Team Inc. http://dev-team.com
* License: MIT
*/

var fileUploaderModule = angular.module('dev-team-file-uploader', []);

fileUploaderModule.directive("dtFile", dtFileDirective)
				  .directive("dtUploader", dtUploaderDirective);

function dtFileDirective() {
    return {
        scope: {
            upload: '&'
        },
        restrict: 'E',
        replace: true,
        template: '<input type="file"></input>',
        link: function(scope, element) {
            element.bind('change', function(event) {
                var fileInput = event.target;
                var file = fileInput.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        scope.upload({ file: file, url: e.target.result });
                    };
                    reader.readAsDataURL(file);
                }
                fileInput.value = "";
            });
        }
    };
}

function dtUploaderController($scope) {
    this.init = function() {
        if (!$scope.urlCopy) $scope.urlCopy = $scope.url;
    };

    this.upload = function(file, url) {
        $scope.$apply(function() {
            $scope.file = file;
            $scope.editMode = true;
            $scope.url = url;
        });
    };

    this.cancel = function() {
        $scope.editMode = false;
        $scope.url = $scope.urlCopy;
        $scope.urlCopy = null;
    }

    this.save = function() {
        $scope.upload({ data: $scope.file });
        $scope.editMode = false;
        $scope.urlCopy = null;
    }

    this.hide = function() {
        return $scope.hideMode && !$scope.editMode;
    }
}


function dtUploaderDirective() {
    return {
        scope: {
            width: "@",
            height: "@",
            upload: "&",
            url: "=?",
            hideMode: "@"
        },
        restrict: 'E',
        replace: true,
        controller: ['$scope', dtUploaderController],
        controllerAs: "ctrl",
        templateUrl: templateSelector,
        link: function(scope) {
            scope.editMode = false;
        }
    };

    function templateSelector(element, attrs) {
        if (attrs.templateUrl) {
            return attrs.templateUrl;
        }
        return "dt-uploader.tmpl.html";
    }
}

fileUploaderModule.run(["$templateCache", function ($templateCache) {
    $templateCache.put("dt-uploader.tmpl.html",
	"<div><img ng-src=\"{{url}}\" width=\"{{width}}\" height=\"{{height}}\" ng-hide=\"ctrl.hide()\" \/><dt-file upload=\"ctrl.upload(file, url)\" ng-click=\"ctrl.init()\" value=\"Browse\" class=\"btn btn-default\" ng-style=\"{width: width}\"><\/dt-file><input type=\"button\" class=\"btn btn-warning\" value=\"OK\" ng-click=\"ctrl.save()\" ng-show=\"editMode\" \/><input type=\"button\" class=\"btn btn-warning\" value=\"Cancel\" ng-click=\"ctrl.cancel()\" ng-show=\"editMode\" \/><\/div>");
}]);