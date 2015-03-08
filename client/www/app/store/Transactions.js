/*global Ext*/
'use strict';
console.log('in store file');
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
        requires: ['Ext.data.proxy.JsonP'],
        storeId: 'userTransactions',
        autoLoad: true,
        model: 'Latte_Factor.model.Transaction',
        proxy: {
            type: 'jsonp',
            url: 'http://192.168.1.68:5000/get-transactions',
            reader: {
                type:'json',
                rootProperty: 'transactions'
            }
        }
    },
    
    extend: 'Ext.data.Store'
});
