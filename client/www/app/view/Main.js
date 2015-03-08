/*global cordova*/
/*global Ext*/
'use strict';
var transactions = Ext.create('Latte_Factor.store.Transactions', {});
Ext.define('User', {
    extend: 'Ext.data.Model',
    config: {
        fields: [{
            name: 'ambition',
            type: 'int'
        }]
    }
});

var user = Ext.create('User');
user.set('ambition', 1);

Ext.define('Latte_Factor.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'Ext.Video'
    ],
    config: {
        tabBarPosition: 'bottom',

        items: [{
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
        }, {
            title: 'Progress',
            iconCls: 'calendar',
            html: 'You saved $45.67 last month'
        }, {
            title: 'Settings',
            iconCls: 'settings',

            items: [{
                html: 'How ambitious are you?'
            }, {
                xtype: 'sliderfield',
                label: 'Ambition',
                minValue: 1,
                maxValue: 3,
                listeners: {
                    scope: this,
                    'change': function(data, slider) {
                        user.set('ambition', slider.getValue()[0]);
                        // console.log(data, slider.getValue(), data3);
                    }
                }
            }, {}]
        }]
    }
});

var notification;

function displayNotification() {
    console.log('in displayNotification');
    var now = Date.now(),
        _10_sec_from_now = new Date(now + 10 * 1000);

    notification = cordova.plugins.notification.local.schedule({
        id: 1,
        title: 'Scheduled with delay',
        text: 'Test Message 1',
        at: _10_sec_from_now,
        // sound: sound
    });
}

function failure() {
    console.log('in on failure')
    window.alert('could not get geo');
}

function showToast(text) {
    setTimeout(function() {
        window.plugins.toast.showLongCenter(text);
    }, 100);
}

function onDeviceReady() {
    console.log('in onDeviceReady');
    //var watchId = navigator.geolocation.watchPosition(displayNotification, failure  );

    cordova.plugins.notification.local.on('clear', function(notification) {
        console.log('onclear', arguments);
        var userAmbition = user.get('ambition');
        if (userAmbition === 3) {
            showToast('I\'m sorry Dave, but I can\'t let you do that');
            //place a phone call
        } else if(userAmbition === 2) {
            showToast('You can do better. I believe in you');

        } else {
            showToast('Keep drinking those lattes you consumer sucka');
        }
    });

    cordova.plugins.notification.local.on('cancel', function(notification) {
        console.log('oncancel', arguments);
        // showToast('canceled: ' + notification.id);
    });
    // cordova.plugins.notification.local.on('cancelall', function() {
    //     console.log('oncancelall', arguments);
    //     // showToast('canceled all');
    // });
    // cordova.plugins.notification.local.on('clearall', function() {
    //     console.log('onclearall', arguments);
    //     // showToast('cleared all');
    // });
    cordova.plugins.notification.local.on('click', function() {
        window.alert('Good choice Dave!');
    });
    displayNotification();

}
document.addEventListener("deviceready", onDeviceReady, false);