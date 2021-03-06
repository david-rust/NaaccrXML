/*
 * File: app/store/race1.js
 *
 * This file was generated by Sencha Architect version 4.2.3.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 6.5.x Classic library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 6.5.x Classic. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('XMLParser.store.race1', {
    extend: 'Ext.data.Store',

    requires: [
        'Ext.data.field.Field'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'race1',
            data: [
                {
                    value: 10,
                    translation: 'TEST'
                },
                {
                    value: 42,
                    translation: 'TEST2'
                },
                {
                    value: 42,
                    translation: 'TEST3'
                }
            ],
            fields: [
                {
                    name: 'value'
                },
                {
                    name: 'translation'
                }
            ]
        }, cfg)]);
    }
});