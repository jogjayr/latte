/*global Ext*/
'use strict';
console.log('in store file');
var localIP = '10.90.1.151';

console.log('in store file');


Ext.define('Latte_Factor.model.User', {
    extend: 'Ext.data.Model',
    config: {
        fields: [{
            name: 'ambition',
            type: 'int'
        }, {
            name: 'type',
            type: 'string'
        }]
    }
});

var user = Ext.create('Latte_Factor.model.User');
user.set('ambition', 1);
user.set('type', 'poor');


Ext.define('Latte_Factor.store.Transactions', {
    config: {
        requires: [
            'Ext.data.proxy.JsonP', 
            'Latte_Factor.model.Transaction'
        ],
        storeId: 'userTransactions',
        autoLoad: true,
        model: 'Latte_Factor.model.Transaction',
        proxy: {
            type: 'jsonp',
            url: 'http://'+ localIP +':5000/get-transactions?user=' + user.get('type'),
            reader: {
                type:'json',
                rootProperty: 'transactions'
            }
        }
    },
    
    extend: 'Ext.data.Store'
});