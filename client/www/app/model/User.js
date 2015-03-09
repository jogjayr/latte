
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