console.log('in model file');
Ext.define('Latte_Factor.model.Transaction', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'account-id', 'amount', 'categorization', 'is-pending', 'merchant', 'raw-merchant', 'transaction-id', 'transaction-time'
        ]
    }
});
