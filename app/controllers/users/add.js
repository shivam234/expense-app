import Ember from 'ember';

export default Ember.Controller.extend({
	actions : {
        addUser : function(){
            var name = this.get('name');
            var description = this.get('description');
       
            if (!name.trim()&&!description.trim()){return;}

            var user = this.store.createRecord('user', {
                'name'			: name,
                'description'	: description
            });

            this.set('name', '');
            this.set('description', '');
            user.save();
        }
    }
});
