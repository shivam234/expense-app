import Ember from 'ember';

export default Ember.Controller.extend({
	 actions : {
        remove : function(user){
        	 var x = confirm("Are you sure you want to delete?");
             if(x)
             {
          	  user.deleteRecord();
              user.save();
             }    
           }         
        }
    });
