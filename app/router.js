import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource("users", { path : '/users' }, function(){
       this.route("add", { path : '/add' });
   });

  this.resource("expenses", { path : '/expenses' }, function() {
  });

  this.route("addexpense", { path : '/addexpense' });
  this.route("settlements", { path : '/settlements' });
});

export default Router;
