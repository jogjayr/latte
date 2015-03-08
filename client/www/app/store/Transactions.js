/*global Ext*/
'use strict';
console.log('in store file');
var localIP = '192.168.1.68';
var localIP = '192.168.1.68';
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
user.set('type', 'normal');
Ext.define('Latte_Factor.model.Transaction', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'account-id', 'amount', 'categorization', 'is-pending', 'merchant', 'raw-merchant', 'transaction-id', 'transaction-time'
        ]
    }
});

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
