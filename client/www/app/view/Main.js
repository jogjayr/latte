/*global cordova*/
/*global Ext*/
'use strict';
var localIP = '192.168.1.68';
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
            url: 'http://'+ localIP +':5000/get-transactions',
            reader: {
                type:'json',
                rootProperty: 'transactions'
            }
        }
    },
    
    extend: 'Ext.data.Store'
});

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
            items: [{
                xtype: 'button',
                text: 'This will be hidden',
                cls: 'hide',
                listeners: {
                    scope: this,
                    'tap': function() {
                        console.log('clicked on this invisible area');
                    }
                }
            }]
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
        title: 'Tap to save $5',
        text: 'Are you buying coffee?',
        at: _10_sec_from_now,
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
    cordova.plugins.notification.local.on('clear', function(notification) {
        console.log('onclear', arguments);
        var userAmbition = user.get('ambition');
        if (userAmbition === 3) {
            showToast('I\'m sorry Dave, but I can\'t let you do that');

            //place a phone call
        } else if (userAmbition === 2) {
            showToast('You can do better. I believe in you');

        } else {
            showToast('Keep drinking those lattes you consumer sucka');
        }
    });

    cordova.plugins.notification.local.on('cancel', function(notification) {
        console.log('oncancel', arguments);
    });

    cordova.plugins.notification.local.on('click', function() {
        Ext.Ajax.request({
            url: 'http://'+localIP+'/save-latte',
        });
        window.alert('Good choice Dave! Transferred $5 to your Vanguard account');
    });
    displayNotification();

}
document.addEventListener("deviceready", onDeviceReady, false);