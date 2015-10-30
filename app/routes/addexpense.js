import Ember from 'ember';
export default Ember.Route.extend({
    setupController: function(controller) {
        var usersRecord = this.store.find('user');
        controller.set('users', usersRecord);
        controller.set('selectedValue', null);
    }
});