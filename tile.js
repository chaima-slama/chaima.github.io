(function () {
	let tmpl = document.createElement("template");
	tmpl.innerHTML =
		`
    	<!DOCTYPE html>
		<html>
    	<head>
        <meta charset="utf-8">
        <title>SAPUI5 single file template | nabisoft</title>
        <!-- decide what version you want to use, see http://scn.sap.com/community/developer-center/front-end/blog/2015/07/30/multi-version-availability-of-sapui5:
        <script src="https://sapui5.hana.ondemand.com/resources/sap-ui-core.js"
        <script src="https://sapui5.hana.ondemand.com/1.28.28/resources/sap-ui-core.js"
        <script src="https://openui5beta.hana.ondemand.com/resources/sap-ui-core.js"
        <script src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js"
        <script src="https://openui5.hana.ondemand.com/1.36.12/resources/sap-ui-core.js"
        -->
        <script src="https://openui5.hana.ondemand.com/1.36.12/resources/sap-ui-core.js"
            id="sap-ui-bootstrap"
            data-sap-ui-theme="sap_bluecrystal"
            data-sap-ui-libs="sap.m"
            data-sap-ui-bindingSyntax="complex"
            data-sap-ui-compatVersion="edge"
            data-sap-ui-preload="async"></script>
            <!-- use "sync" or change the code below if you have issues -->
 
        <!-- XMLView -->
        <script id="myXmlView" type="ui5/xmlview">
            <mvc:View
                controllerName="MyController"
                xmlns="sap.m"
                xmlns:core="sap.ui.core"
                xmlns:mvc="sap.ui.core.mvc"
                xmlns:nabisoft="nabisoft.ui">
 
                <!-- use our custom control, see below -->
                <nabisoft:Headline text="SAPUI5 single file template using XMLViews, Controllers, Fragments and Custom Controls for bug illustrations, support requests or demos"/>
 
                <Table
                    id="myTable"
                    growing="true"
                    growingThreshold="10"
                    growingScrollToLoad="true"
                    busyIndicatorDelay="0">
                    <headerToolbar>
                        <Toolbar>
                            <Title text="Orders of ALFKI"/>
                            <ToolbarSpacer/>
                        </Toolbar>
                    </headerToolbar>
                    <columns>
                        <Column>
                            <Text text="OrderID"/>
                        </Column>
                        <Column>
                            <Text text="Order Date"/>
                        </Column>
                        <Column>
                            <Text text="To Name"/>
                        </Column>
                        <Column>
                            <Text text="Ship City"/>
                        </Column>
                    </columns>
                    <items>
                        <!-- filled via bindItems() in controller -->
                    </items>
                </Table>
 
            </mvc:View>
        </script>
 
        <!-- XML Fragment -->
        <script id="myXMLFragment" type="ui5/fragment">
            <core:FragmentDefinition
                xmlns="sap.m"
                xmlns:core="sap.ui.core">
                <ColumnListItem type="Active">
                    <cells>
                        <ObjectIdentifier title="{OrderID}"/>
 
                        <Text
                            text="{
                                path:'OrderDate',
                                type:'sap.ui.model.type.Date',
                                formatOptions: { style: 'medium', strictParsing: true}
                            }"/>
 
                        <Text text="{ShipName}"/>
 
                        <Text text="{ShipCity}"/>
 
                    </cells>
                </ColumnListItem>
            </core:FragmentDefinition>
        </script>
 
        <script>
            sap.ui.getCore().attachInit(function () {
                "use strict";
 
                //### Custom Control ###
                // remove the first parameter in "real" apps
                sap.ui.define("nabisoft/ui/Headline",[
                    "sap/ui/core/Control"
                ], function(Control) {
                    "use strict";
 
                    return Control.extend("nabisoft.ui.Headline", {
                        metadata : {
                            properties : {
                                text: {type : "string"}
                            },
                            aggregations : { },
                            associations : { },
                            events : { }
                        },
 
                        init : function () { },
 
                        renderer : function (oRM, oControl) {
                            oRM.write("<h3");
                            oRM.writeControlData(oControl);
                            oRM.addClass("nabiUiHeadline");
                            oRM.writeClasses();
                            oRM.write(">");
                            oRM.writeEscaped(oControl.getText());
                            oRM.write("</h3>");
                        }
                    });
                });
 
                //### Controller ###
                sap.ui.define([
                    "sap/ui/core/mvc/Controller",
                    "sap/ui/model/odata/v2/ODataModel"
                ], function (Controller, ODataModel) {
                    "use strict";
 
                    return Controller.extend("MyController", {
                        onInit : function () {
                            this.getView().setModel(
                                new ODataModel("https://cors-anywhere.herokuapp.com/services.odata.org/V2/Northwind/Northwind.svc/", {
                                    json : true,
                                    useBatch : false
                                })
                            );
 
                            var sPath = "/Customers('ALFKI')/Orders";
                            var oTable = this.byId("myTable");
                            var oTemplate =  sap.ui.xmlfragment({
                                fragmentContent : jQuery("#myXMLFragment").html()
                            });
 
                            oTable.bindItems(sPath, oTemplate, null /*oSorter*/, null /*aFilters*/);
                        }
                    });
                });
 
                //### THE APP: place the XMLView somewhere into DOM ###
                sap.ui.xmlview({
                    viewContent : jQuery("#myXmlView").html()
                }).placeAt("content");
 
            });
        </script>
 
    </head>
 
    <body class="sapUiBody">
        <div id="content"></div>
    </body>
</html>      
    `;

})();
