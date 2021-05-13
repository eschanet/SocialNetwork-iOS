Parse.Cloud.afterDelete('_User', function(request) {
	var deletedUser = request.object;

	console.log("After user delete for "+deletedUser.id);

  var objectsToDelete = [];
  var activityQuery = new Parse.Query("Activity");
  activityQuery.equalTo("fromUser", deletedUser);
  activityQuery.find({useMasterKey: true}).then(function(activities) {
    var photoQuery = new Parse.Query("Photo");
    photoQuery.equalTo("user", deletedUser);
    objectsToDelete = objectsToDelete.concat(activities);
    return photoQuery.find({useMasterKey: true});
  }).then(function(photos) {
    var commenterQuery = new Parse.Query("PhotoCommenters");
    commenterQuery.equalTo("User", deletedUser);
    objectsToDelete = objectsToDelete.concat(photos);
    return commenterQuery.find({useMasterKey: true});
  }).then(function(commenters) {
    var toActivityQuery = new Parse.Query("Activity");
    toActivityQuery.equalTo("toUser", deletedUser);
    objectsToDelete = objectsToDelete.concat(commenters);
    return toActivityQuery.find({useMasterKey: true});
  }).then(function(toAct) {
    objectsToDelete = objectsToDelete.concat(toAct);
    return Parse.Object.destroyAll(objectsToDelete, {useMasterKey: true});
  }).then(function(success) {
    console.log("successfully deleted all associated comments, likes and photos.");
  }, function(error) {
    console.error("Error deleting associated comments, likes and photos" + error.code + ": " + error.message);
  });

});
