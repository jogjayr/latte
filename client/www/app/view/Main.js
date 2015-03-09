/*global cordova*/
/*global Ext*/
'use strict';


var transactions = Ext.create('Latte_Factor.store.Transactions', {});

Ext.define('Latte_Factor.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'Ext.Video',
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
                    '<div>{categorization}</div>',
                    '<tpl if="amount &lt; 0">',
                        '<div class="red">-${amount /-10000}</div>',
                    '</tpl>',
                    '<tpl if="amount &gt; 0">',
                        '<div class="green">${amount / 10000}</div>',
                    '</tpl>')
        }, {
            title: 'Progress',
            iconCls: 'calendar',
            items: [{
                xtype: 'container',
                listeners: {
                    scope: this,
                    'initialize': function(me) {
                        Ext.data.JsonP.request({
                            url: 'http://' + localIP  + ':5000/get-savings-graph?=' + user.get('type'),
                            params: {
                                user: user.get('type')
                            },
                            success: function(data) {
                                me.setHtml('<iframe src="' + data.url + '" height="500" width="320"></iframe>');
                            }
                        });
                    }
                }
            }]
        }, {
            title: 'Settings',
            iconCls: 'settings',

            items: [{
                // xtype: 'header',
                html: '<h1>How ambitious are you?</h1>',
                margin: '20px 0',
                cls: 'header'
            }, {
                xtype: 'sliderfield',
                label: 'Ambition',
                minValue: 1,
                maxValue: 3,
                listeners: {
                    scope: this,
                    'change': function(data, slider) {
                        user.set('ambition', slider.getValue()[0]);
                        user.fireEvent('change',  slider.getValue()[0]);
                        // console.log(data, slider.getValue(), data3);
                    }
                }
            }, {
                xtype: 'container',
                cls: 'ambition_text',
                centered: true,
                listeners: {
                    scope: this,
                    'initialize': function(me) {
                        user.addListener('change', function(val) {
                            if(val === 3) {
                                me.setHtml('I will be rich soon');
                            } else if (val === 2) {
                                me.setHtml('I will be rich one day');
                            } else {
                                me.setHtml('Lattes are delicious');
                            }
                        });
                    }
                }
            }, {
                xtype: 'button',
                text: 'This will be hidden',
                cls: 'hide',
                listeners: {
                    scope: this,
                    'tap': function() {
                        console.log('clicked on this invisible area');
                        displayNotification();
                    }
                }
            }]
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
            //place a phone call
            showToast('I\'m sorry Dave, but I can\'t let you do that');
            Ext.data.JsonP.request({
                url: 'http://' + localIP  + ':5000/call-user?=' + user.get('type'),
                params: {
                    user: user.get('type')
                }
            });
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
            url: 'http://'+localIP+':5000/save-latte?user=' + user.get('type'),
        });
        window.alert('Good choice Dave! Transferred $5 to your Vanguard account');
    });
    

}
document.addEventListener("deviceready", onDeviceReady, false);
