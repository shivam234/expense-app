import Ember from "ember";
export default Ember.Handlebars.helper('format-date', function(date){
    return moment(date).fromNow();
});