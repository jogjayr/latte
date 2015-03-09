
Ext.define('Latte_Factor.model.Transaction', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'account-id', 'amount', 'categorization', 'is-pending', 'merchant', 'raw-merchant', 'transaction-id', {name: 'transaction-time', type: 'date'}
        ],
        listeners: {
            scope: this,
            'initialize': function(data) {
                console.log(data);
            }
        }
    }
});