// Validate Photos have a valid owner in the "user" pointer.
Parse.Cloud.beforeSave('Photo', function(request, response) {
  var currentUser = request.user;
  var objectUser = request.object.get('user');
  var text = request.object.get('text');
  var type = request.object.get('type');

  currentUser.fetch().then(function(fetching) {	
  if (currentUser.get('isDead')) {
   response.error('Yes dead user');
  }
  if(!currentUser || !objectUser) {
    response.error('A Photo should have a valid user.');
  } 
  if (type == 'text') {
  	if (text === '' && type == 'text') {
    	response.error('Spam text post without content.');
 	 } else if (!text.replace(/\s/g, '').length && type == 'text') {
    	response.error('Spam text post with only spaces.');
  	}
  	else if (text.replace(/\s/g, '').length <= 1 && type == 'text') {
      	response.error('Spam text post with too few chars.');
 	 }
  }

      response.success();
      
      });


});
