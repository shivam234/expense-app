import Ember from 'ember';

export default Ember.Controller.extend({
	actions : {
        addExpense : function(){
            var description = this.get('description');
            var amount = this.get('amount');
            var spendingUser = this.get('spendingUser');
            var affectedUsers = this.get('affectedUsers');
            
            var self = this,
                expense, 
                settlement, settlements, amt;
            
            this.users.then(function(response) {
                var userBuffer = [],i;
                for ( i=0;i<response.content.length;i++){
                    userBuffer.push(response.content[i]._data);
                }
              
                userBuffer.findNameById = function(id){
                    for (i=0;i<userBuffer.length;i++){
                        if (userBuffer[i].id === id) {
                            return userBuffer[i].name;
                        }
                    }
                };

                spendingUser = spendingUser.toString().split(":")[2];
                var id = spendingUser.substring(0,spendingUser.length-1);
                
                spendingUser = {
                    id      : id,
                    name    : userBuffer.findNameById(id)
                };
                
                var len;
                affectedUsers = affectedUsers.toString().split(",");
                len = affectedUsers.length;
                for( i=0;i<len;i++) {
                    var x = affectedUsers[i].split(":")[2];
                    x = x.substring(0,x.length-1); 
                    affectedUsers[i] = {
                        id      : x,
                        name    : userBuffer.findNameById(x),
                    };
                }
                // validate not-empty
                if (!amount.trim()&&!description.trim()&&!spendingUser.trim()&&!affectedUsers.trim()){return;}

                expense = self.store.createRecord('expense', {
                    'amount'          : amount,
                    'description'     : description,
                    'spendingUser'    : spendingUser,
                    'affectedUsers'   : affectedUsers
                });
                // persist
                expense.save();
                
                // building settlement object
                len = affectedUsers.length;
                settlements = [];
                for(i=0;i<len;i++) {
                    if ( affectedUsers[i].name !== spendingUser.name ) {
                        var ob = {
                            user : affectedUsers[i].name,
                            settled: false
                        };
                        settlements.push(ob);
                    }
                }
                amt = Number(amount);
                amt = Math.ceil(amt/len);
                
                settlement = self.store.createRecord('settlement', {
                    'expenseDescription'    : description,
                    'settlements'           : settlements,
                    'spendingUser'          : spendingUser.name,
                    'amount'                : amt
                });
                settlement.save();
                expense.set("settlementID", settlement.id);
                expense.save();
                // reset fields 
                self.set('amount', '');
                self.set('description', '');
                self.set('spendingUser', '');
                self.set('affectedUsers', '');
                
                self.transitionTo("expenses");
            });
        }
    }
});
