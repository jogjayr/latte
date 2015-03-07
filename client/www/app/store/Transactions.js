/*global Ext*/
'use strict';
console.log('in store file');
Ext.define('Latte_Factor.model.Transaction', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'account-id', type: 'string'},
            {name: 'amount', type: 'int'},
            {name: 'categorization', type: 'string'},
            {name: 'is-pending', type: 'boolean'},
            {name: 'merchant', type:  'string'},
            {name: 'raw-merchant', type:  'string'},
            {name: 'transaction-id', type:  'string'},
            {name: 'transaction-time'}
        ]
    }
});

Ext.define('Latte_Factor.store.Transactions', {
    config: {
        requires: ['Ext.data.proxy.JsonP'],
        storeId: 'userTransactions',
        autoLoad: true,
        model: 'Latte_Factor.model.Transaction',
        proxy: {
            type: 'jsonp',
            url: 'http://127.0.0.1:5000/get-transactions',
            reader: {
                type:'json',
                rootProperty: 'transactions'
            }
        }
    },
    
    extend: 'Ext.data.Store'
});
