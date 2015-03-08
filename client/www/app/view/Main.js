var transactions = Ext.create('Latte_Factor.store.Transactions', {


});
Ext.define('Latte_Factor.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'Ext.Video'
    ],
    config: {
        tabBarPosition: 'bottom',

        items: [
            {
                title: 'Activity',
                iconCls: 'list',
                xtype: 'list',
                styleHtmlContent: true,
                scrollable: true,
                store: transactions,
                itemTpl: '<div>{categorization}</div><div>{amount}</div>'

            },
            {
                title: 'Progress',
                iconCls: 'speedometer2',
                html: 'You saved $45.67 last month'
            },
            {
                title: 'Settings',
                iconCls: 'settings',
                html: 'Here you would set your settings'
            }
        ]
    }
});
