import Ember from 'ember';

export default Ember.Controller.extend({
	 actions : {
        remove : function(user){
            user.deleteRecord();
            user.save();
        }
    }
});
