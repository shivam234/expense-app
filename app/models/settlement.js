import DS from 'ember-data';

export default DS.Model.extend({
    settlements     : DS.attr(),
    spendingUser    : DS.attr('string'),
    amount          : DS.attr('number'),
});
