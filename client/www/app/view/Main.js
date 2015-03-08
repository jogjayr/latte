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


var now = Date.now(),
    _10_sec_from_now = new Date(now + 10*1000);

cordova.plugins.notification.local.schedule({
    id:    1,
    title: 'Scheduled with delay',
    text:  'Test Message 1',
    at:    _10_sec_from_now,
    // sound: sound
});

