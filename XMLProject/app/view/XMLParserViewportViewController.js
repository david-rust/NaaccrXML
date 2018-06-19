/*
 * File: app/view/XMLParserViewportViewController.js
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

Ext.define('XMLParser.view.XMLParserViewportViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.xmlparserviewport',

    makeRequest: function(mongoQuery) {
        var controller = this;
        var params = {};
        if(!Ext.isEmpty(mongoQuery))
        {
            params.filter = mongoQuery;
        }
        Ext.Ajax.request({

            url: 'http://52.90.197.198:5000/counts/',
            params:params,
            success: function(response)
            {
                var countsObj = Ext.decode(response.responseText).data;
                controller.updateCounts(countsObj);
            },
            failure: function(response)
            {
               Ext.Msg.alert("Failed Call: ", Ext.encode(mongoQuery));
            },
            method: "POST"


        });
    },

    updateCounts: function(counts) {
        var store = Ext.getStore("MyTreeStore");
        var controller = this;
        store.each(function(record){

            if(record.get("oDesc") == null)
            {
                record.set("oDesc", record.get("description"));
            }

            if(record.get("leaf"))
            {
                record.set("description", record.get("oDesc") + " (0)");
            }
            record.commit();

        });

        //Ext.getStore("sex").removeAll();
        //Ext.getStore("primarySite").removeAll();
        this.getView().down("#pie1").getStore().removeAll();
        this.getView().down("#pie2").getStore().removeAll();
        this.getView().down("#pie3").getStore().removeAll();
        this.getView().down("#col1").getStore().removeAll();
        this.getView().down("#col2").getStore().removeAll();
        var sexArr = [];
        var race1Arr = [];
        var ageArr = [];
        var vsArr = [];
        var siteArr = [];


        Ext.each(counts,function(item){
            store.each(function(record){
                var naaccrIdInItem = record.get("naaccrId") in item ;
                var codeIsItemType = record.get("value") == item[record.get("naaccrId")];
                var isLT18 = record.get("value") == "18" && item[record.get("naaccrId")] == "<18";
                var isGT65 = record.get("value") == "65" && item[record.get("naaccrId")] == ">65";
                var isBT18and65 = record.get("start") == "18" && record.get("end") == "65" && item[record.get("naaccrId")] == "18-65";

                if(naaccrIdInItem && (codeIsItemType || isLT18 || isGT65 || isBT18and65))
                {
                    //if(!Ext.isEmpty(Ext.getStore(record.get("naaccrId"))))
                    if(record.get('naaccrId') == "sex")
                    {
                        sexArr.push({
                            translation: record.get("oDesc"),
                            value: item["count"]

                        });
                    }
                    if(record.get('naaccrId') == "race1")
                    {
                        race1Arr.push({
                            translation: record.get("oDesc"),
                            value: item["count"]

                        });
                    }
                    if(record.get('naaccrId') == "vitalStatus")
                    {
                        vsArr.push({
                            translation: record.get("oDesc"),
                            value: item["count"]

                        });
                    }
                    if(record.get('naaccrId') == "ageAtDiagnosis")
                    {
                        ageArr.push({
                            translation: record.get("oDesc"),
                            value: item["count"]

                        });
                    }


                    if(record.get('naaccrId') == "primarySite")
                    {
                        siteArr.push({
                            translation: record.get("oDesc"),
                            value: item["count"]

                        });
                    }

                    record.set("description",record.get("oDesc")+" ("+item["count"]+")");
                    record.commit();
                }
            });
        });

        function compare(a,b) {
          if (a.value > b.value)
            return -1;
          if (a.value < b.value)
            return 1;
          return 0;
        }

        race1Arr.sort(compare);
        siteArr.sort(compare);

        this.getView().down("#pie1").getStore().add(sexArr);
        this.getView().down("#pie2").getStore().add(ageArr);
        this.getView().down("#pie3").getStore().add(vsArr);
        this.getView().down("#col1").getStore().add(race1Arr);
        this.getView().down("#col2").getStore().add(siteArr);


    },

    refreshCharts: function(mongoQuery) {

        debugger;
        var filter = "";
        if(!Ext.isEmpty(mongoQuery)){
            filter += "?filter="+mongoQuery;
        }

        var comp1 = this.getView().down("#chart1Comp").getEl();
        var comp2 = this.getView().down("#chart2Comp").getEl();
        var comp3 = this.getView().down("#chart3Comp").getEl();
        var comp4 = this.getView().down("#chart4Comp").getEl();
        var comp5 = this.getView().down("#chart5Comp").getEl();
        var comp6 = this.getView().down("#chart6Comp").getEl();

        if(!Ext.isEmpty(comp1))
            comp1.dom.src = "http://52.90.197.198/d3graphs/trialKM.html"+filter;
        if(!Ext.isEmpty(comp2))
            comp2.dom.src = "http://52.90.197.198/d3graphs/USMap.html"+filter;

        if(!Ext.isEmpty(comp5))
            comp5.dom.src = "http://52.90.197.198/d3graphs/choroplethAll.html"+filter;

        debugger;

        /*
        //var comp1 = this.getView().down("#chart1").down().getEl();
        var comp2 = this.getView().down("#chart2").down();
        var comp4 = this.getView().down("#chart4").down();

        comp1.set({
            src: "./resources/trialKM.html?cb="+(Math.random()*100000)+filter
        });
        comp2.set({
            src: "./resources/USMap.html?cb="+(Math.random()*100000)+filter
        });
        comp4.set({
            src: "./resources/Pie.html?cb="+(Math.random()*100000)+filter
        });*/
    },

    checkButtons: function(checked) {
        var store = Ext.getStore("MyTreeStore");

        store.each(function(record){

            if(record.get("leaf"))
            {
                record.set("checked",checked);
            }

        });
    },

    checkChange: function() {
        var treePanel = this.getView().down("#xmlTreePanel");
        var rootNode = treePanel.getRootNode();
        var groups = {};
        var leafIndex = 0, nodeIndex=0;
        var leavesChecked = 0;
        //begin first and
        var mongoQuery = "{ \"$and\":[";
        var andedNodes = [];
        var filter = { "$and":[]};
        groups.patientLevel = [];

        //Tree is only two children deep, so calling eachChild twice will be sufficient to iterate through all nodes
        rootNode.eachChild(function(rootChild){

            columns = [];
            var nodeClause = "";
            var values = "";
            var valArr = [];

            if(rootChild.hasChildNodes())
            {
                if(rootChild.getData().comparator == "IN")
                {
                    nodeClause += " { \""+rootChild.getData().naaccrId+ "\": { \"$in\": [";

                    rootChild.eachChild(function(leaf)
                    {
                        if(leaf.getData().checked)
                        {
                           if(!Ext.isEmpty(values))
                           {
                                values += ", ";
                           }
                           values += "\""+leaf.getData().value+"\"";
                           valArr.push(leaf.getData().value);
                           leavesChecked++;
                        }
                    });
                    nodeClause += values + "]}} ";
                    if(leavesChecked === 0)
                    {
                        nodeClause = "";
                    }
                    else
                    {
                        andedNodes.push(nodeClause);
                        filter["$and"].push({"$in":valArr});
                    }
                    mongoQuery += nodeClause;


                }
                else if(rootChild.getData().comparator == "RANGE")
                {
                    var rootChildOperand = (rootChild.getData().operand == "OR") ? "\"$or\"" : "\"$and\"";
                    nodeClause += "{ "+rootChildOperand+": [";
                    rootChild.eachChild(function(leaf)
                    {
                        if(leaf.getData().checked)
                        {
                           if(!Ext.isEmpty(values))
                           {
                                values += ", ";
                           }
                           if(leaf.getData().comparator == "RANGE")
                           {
                               values += "{ \"$and\" : [";
                               values += "{ \""+rootChild.getData().naaccrId +"\": { \"$gte\": "+leaf.getData().start+"} },";
                               values += "{ \""+rootChild.getData().naaccrId +"\": { \"$lt\": "+leaf.getData().end+"} }";
                               values += "]} ";
                               var gte = {"$gte":leaf.getData().start};
                               var lte = {"$lt":leaf.getData().end};
                               var key = rootChild.getData().naaccrId;
                               valArr.push({key:gte});
                               valArr.push({key:lte});
                           }
                           else
                           {
                               values += " { \""+rootChild.getData().naaccrId+"\": {\""+leaf.getData().comparator+"\":"+leaf.getData().value+"}}";
                               var okey = rootChild.getData().naaccrId;
                               var compKey = leaf.getData().comparator;
                               valArr.push({okey:{compKey:leaf.getData().value}});
                           }
                           leavesChecked++;
                        }
                    });
                    nodeClause += values + "]} ";
                    if(leavesChecked === 0)
                    {
                        nodeClause = "";
                    }
                    else{
                    andedNodes.push(nodeClause);
                        filter["$and"].push({"$in":valArr});

                    }
                    mongoQuery += nodeClause;
                }

                leavesChecked=0;
            }



        });



        //Close first and
        mongoQuery +="] }";
        mongoQuery = "{ \"$and\": [" +andedNodes.join(", ") +" ]}";

        if(mongoQuery == "{ \"$and\": [ ]}")
        {
            mongoQuery ="";
        }

        //Really pass mongo query to ajax request

        return mongoQuery;
    },

    update: function(mongoQuery) {

        this.makeRequest(mongoQuery);
        this.refreshCharts(mongoQuery);
    },

    onTreepanelCheckChange: function(node, checked, e, eOpts) {
        var mongoQuery = this.checkChange();
        this.update(mongoQuery);

        /*var treePanel = this.getView().down("#xmlTreePanel");
        var rootNode = treePanel.getRootNode();
        var groups = {};
        var leafIndex = 0, nodeIndex=0;
        var leavesChecked = 0;
        //begin first and
        var mongoQuery = "{ \"$and\":[";
            var andedNodes = [];
            var filter = { "$and":[]};
            groups.patientLevel = [];

            //Tree is only two children deep, so calling eachChild twice will be sufficient to iterate through all nodes
            rootNode.eachChild(function(rootChild){

                columns = [];
                var nodeClause = "";
                var values = "";
                var valArr = [];

                if(rootChild.hasChildNodes())
                {
                    if(rootChild.getData().comparator == "IN")
                    {
                        nodeClause += " { \""+rootChild.getData().naaccrId+ "\": { \"$in\": [";

                            rootChild.eachChild(function(leaf)
                            {
                                if(leaf.getData().checked)
                                {
                                    if(!Ext.isEmpty(values))
                                    {
                                        values += ", ";
                                    }
                                    values += "\""+leaf.getData().value+"\"";
                                    valArr.push(leaf.getData().value);
                                    leavesChecked++;
                                }
                            });
                        nodeClause += values + "]}} ";
                        if(leavesChecked === 0)
                        {
                            nodeClause = "";
                        }
                        else
                        {
                            andedNodes.push(nodeClause);
                            filter["$and"].push({"$in":valArr});
                        }
                        mongoQuery += nodeClause;


                    }
                    else if(rootChild.getData().comparator == "RANGE")
                    {
                        var rootChildOperand = (rootChild.getData().operand == "OR") ? "\"$or\"" : "\"$and\"";
                        nodeClause += "{ "+rootChildOperand+": [";
                            rootChild.eachChild(function(leaf)
                            {
                                if(leaf.getData().checked)
                                {
                                    if(!Ext.isEmpty(values))
                                    {
                                        values += ", ";
                                    }
                                    if(leaf.getData().comparator == "RANGE")
                                    {
                                        values += "{ \"$and\" : [";
                                            values += "{ \""+rootChild.getData().naaccrId +"\": { \"$gte\": "+leaf.getData().start+"} },";
                                            values += "{ \""+rootChild.getData().naaccrId +"\": { \"$lte\": "+leaf.getData().end+"} }";
                                        values += "]} ";
                                        var gte = {"$gte":leaf.getData().start};
                                        var lte = {"$lte":leaf.getData().end};
                                        var key = rootChild.getData().naaccrId;
                                        valArr.push({key:gte});
                                        valArr.push({key:lte});
                                    }
                                    else
                                    {
                                        values += " { \""+rootChild.getData().naaccrId+"\": {\""+leaf.getData().comparator+"\":"+leaf.getData().value+"}}";
                                        var okey = rootChild.getData().naaccrId;
                                        var compKey = leaf.getData().comparator;
                                        valArr.push({okey:{compKey:leaf.getData().value}});
                                    }
                                    leavesChecked++;
                                }
                            });
                        nodeClause += values + "]} ";
                        if(leavesChecked === 0)
                        {
                            nodeClause = "";
                        }
                        else{
                            andedNodes.push(nodeClause);
                            filter["$and"].push({"$in":valArr});

                        }
                        mongoQuery += nodeClause;
                    }

                    leavesChecked=0;
                }



            });



            //Close first and
        mongoQuery +="] }";
        mongoQuery = "{ \"$and\": [" +andedNodes.join(", ") +" ]}";
        //console.log("Mongo Query :" + mongoQuery);
        console.log("Other Query :{ \"$and\": [" +andedNodes.join(", ") +" ]}");
        //this.updateCounts();
        //this.refreshCharts();
        debugger;
        if(mongoQuery == "{ \"$and\": [ ]}")
        {
            mongoQuery ="";
        }
        this.makeRequest(mongoQuery);

        //Really pass mongo query to ajax request

        return mongoQuery;*/
    },

    onCheckAllClick: function(button, e, eOpts) {
        this.checkButtons(true);
        var mongoQuery = this.checkChange();
        this.update(mongoQuery);
    },

    onUncheckAllButtonClick: function(button, e, eOpts) {
        this.checkButtons(false);
        var mongoQuery = this.checkChange();
        this.update(mongoQuery);
    },

    onExportClick: function(button, e, eOpts) {
        var mongoQuery = this.checkChange();
        var controller = this;
        var params = {};
        if(!Ext.isEmpty(mongoQuery))
        {
            filter = "?filter="+mongoQuery;
        }
        else
        {
            filter = "";
        }

        var downloadUrl = 'http://52.90.197.198:5000/export/'+filter;

        if(Ext.getElementById('hiddenform-iframe')!=null)
        {
            Ext.removeNode(Ext.getElementById('hiddenform-iframe'));
        }

        if(Ext.getElementById('hiddenform-form')!=null)
        {
            Ext.removeNode(Ext.getElementById('hiddenform-form'));
        }



        var body = Ext.getBody();

        var frame = body.createChild({
            tag:'iframe',
            cls:'x-hidden',
            id:'hiddenform-iframe',
            name:'iframe'
        });

        var form = body.createChild({
            tag:'form',
            cls:'x-hidden',
            id:'hiddenform-form',
            action: downloadUrl,
            target:'iframe'
        });

        form.dom.submit();


        /*

        if(Ext.getElementById('export_iframe')!=null)
        {
        Ext.removeNode(Ext.getElementById('export_iframe'));
        }

        if(Ext.getElementById('form')!=null)
        {
        Ext.removeNode(Ext.getElementById('form'));
        }

        var frame = Ext.getBody().createChild(
        {
        tag:'iframe',
        cls:'x-hidden',
        id:'export_iframe',
        name:'export_iframe'

        });


        var iframeForm = Ext.getBody().createChild(
        {
        tag:'form',
        cls:'x-hidden',
        id:'form',
        action: Ext.htmlEncode(encodeURI(downloadUrl)),
        target:'export_iframe',
        method: 'POST'
        });


        iframeForm.dom.submit();*/

    },

    onChart1CompAfterRender: function(component, eOpts) {
        var mongoQuery = this.checkChange();
        this.update(mongoQuery);
    },

    onChart2CompAfterRender: function(component, eOpts) {
        var mongoQuery = this.checkChange();
        this.update(mongoQuery);
    },

    onChart5CompAfterRender: function(component, eOpts) {
        var mongoQuery = this.checkChange();
        this.update(mongoQuery);
    },

    onViewportBoxReady: function(component, width, height, eOpts) {
        this.checkButtons(false);
        var mongoQuery = this.checkChange();
        this.update(mongoQuery);
    }

});
