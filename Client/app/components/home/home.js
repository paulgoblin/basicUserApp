'use strict';
angular
  .module('userApp')
  .controller('HomeCtrl', ['$scope', '$state', 'UserSvc', 'StoreSvc', 'NavSvc', HomeCtrl])
  .directive('modal', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    template: "<div class='ng-modal' ng-show='show'>"+
                "<div class='reveal-modal' ng-show='show'>"+
                  "<div ng-transclude></div>"+
                  "<a class='close-reveal-modal' ng-click='hideModal()'>&#215;</a>"+
                "</div>"+
                "<div class='reveal-modal-bg' ng-click='hideModal()'></div>"+
              "</div>"
  };
});

function HomeCtrl($scope, $state, UserSvc, StoreSvc, NavSvc){

  var user;
  $scope.modalShown = false;

  if (StoreSvc.returnData('me')){
    updateView();
  }else{
    NavSvc.home(function (err, resp){
      if (err) {
        $state.go('landing_page');
        return;
      }
      console.log("user from navSvc",resp.data);
      StoreSvc.saveData('me', resp.data);
      updateView();
    })
  }

  function updateView() {
    user = StoreSvc.returnData('me');
    var User = {
      'Profile Name': user.profilename,
      Email: user.email,
      'Phone Number': user.phone,
      Address: user.address,
      Bio: user.about
    };

    console.log("updating View");
    $scope.user = User;
    $scope.avatarSrc = UserSvc.getAvatarSrc(user);
    console.log("avatar src", $scope.avatarSrc);
  }

  $scope.uploadAvatar = function(){
    var avatarData = { _id: StoreSvc.returnData('me')._id, img: $scope.images.upload };
    UserSvc.uploadAvatar(avatarData, editResHandler)
  }

  $scope.toggleModal = function(){
    $scope.modalShown = !$scope.modalShown;
  }

  $scope.save = function(){
    user.profilename = $scope.user['Profile Name'];
    user.email = $scope.user.Email;
    user.phone = $scope.user['Phone Number'];
    user.address = $scope.user.Address;
    user.about = $scope.user.Bio;

    UserSvc.edit( user, editResHandler );

    $scope.modalShown = !$scope.modalShown;
  }

  $scope.delete = function(){
    UserSvc.delete(user, function(err, resp){
      if (err){
        console.log(err);
      } else {
        NavSvc.logout(function (){
          $state.go('landing_page');
        });
      }
    });
  }

  function editResHandler(err, resp){
    if (err){
      console.log(err);
      updateView();
    }else{
      StoreSvc.saveData('me', resp.data);
      updateView();
    }
  }
}
