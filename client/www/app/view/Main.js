'use strict';
var transactions = Ext.create('Latte_Factor.store.Transactions', {});
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
                itemTpl: new Ext.XTemplate(
                    '<div>{categorization/}</div>',
                    '<tpl if="amount &lt; 0">',
                        '<div class="red">-${amount / -10000}</div>',
                    '</tpl>',
                    '<tpl if="amount &gt; 0">',
                        '<div class="green">${amount/10000}</div>',
                    '</tpl>')
            },
            {
                title: 'Progress',
                iconCls: 'calendar',
                html: 'You saved $45.67 last month'
            },
            {
                title: 'Settings',
                iconCls: 'settings',
                
                items: [{
                    html: 'How ambitious are you?'
                }, {
                    xtype: 'sliderfield',
                    label: 'Ambition',
                    value: 2,
                    minValue: 1,
                    maxValue: 3
                }, {}]
            }
        ]
    }
});


function displayNotification() {
    console.log('in displayNotification');
    var now = Date.now(),
    _10_sec_from_now = new Date(now + 1*1000);

    cordova.plugins.notification.local.schedule({
        id:    1,
        title: 'Scheduled with delay',
        text:  'Test Message 1',
        at:    now,
        // sound: sound
    });
}

function failure() {
    console.log('in on failure')
    window.alert('could not get geo');
}
function onDeviceReady() {
    console.log('in onDeviceReady');
    var watchId = navigator.geolocation.watchPosition(displayNotification, failure  );

}
document.addEventListener("deviceready", onDeviceReady, false);
