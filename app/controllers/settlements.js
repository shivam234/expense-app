import Ember from 'ember';

export default Ember.Controller.extend({
	payables : {},
    actions: {
        save: function(model) {
            var payables = this.get('payables');
            
            function contains(array,name){
                for (var p = 0; p < array.length; p++) {
                    var item = array[p];
                    if ( item.user == name ) {
                        return true;
                    }
                }
                return false;
            }
            var arrayOfSettlementIds = [];
            var settlementsRecord = this.store.find('settlement');
            var self = this;
            Ember.RSVP.Promise.all([settlementsRecord]).then(function(results){
                
                settlementsRecord = results[0];
                
                for (var i = 0; i < payables.length; i++) {
                    var payableObject = payables[i];

                    // operate on items clicked and ignore rest
                    if (payableObject.settled == true) {
                        var by = payableObject.by;
                        var to = payableObject.to;

                        // find settlemts where `by` is spending user and `to` is one of the affected && `to` is spending user and `by` is one of the affected and mark them as settled
                        for (var j=0; j<settlementsRecord.content.length; j++){
                            var settlementObject = settlementsRecord.content[j]._data;

                            if (settlementObject.spendingUser === by 
                                    && contains(settlementObject.settlements, to)) {

                                for (var k = 0; k < settlementObject.settlements.length; k++) {
                                    var buff = settlementObject.settlements[k];
                                    if (buff.user === to && buff.settled === false){
                                        settlementObject.settlements[k].settled = true;
                                        
                                        var ob = {
                                            settlementID : settlementObject.id,
                                            settlements  : settlementObject.settlements
                                        };
                                        arrayOfSettlementIds.push(ob);
                                    }
                                }

                                

                            } else if (settlementObject.spendingUser === to
                                            && contains(settlementObject.settlements, by)) {

                                for (var k = 0; k < settlementObject.settlements.length; k++) {
                                    var buff = settlementObject.settlements[k];
                                    if (buff.user === by && buff.settled === false) {
                                        settlementObject.settlements[k].settled = true;
                                        
                                        var ob = {
                                            settlementID : settlementObject.id,
                                            settlements  : settlementObject.settlements
                                        };
                                        arrayOfSettlementIds.push(ob);
                                    }
                                }

                                

                            }
                        }
                    }
                }
            
                for (var i = 0; i < arrayOfSettlementIds.length; i++) {
                    var item = arrayOfSettlementIds[i];
                    var settlementID = item.settlementID;

                    self.store.find('settlement',settlementID).then(function(settlement){
                        settlement.set('settlements',item.settlements);
                        settlement.save();
                    });
                }
                self.transitionTo("expenses")
            });
            
        },
        deleteRecord: function() {
            this.get('model').deleteRecord();
            this.get('model').save();
        }
    }
});
