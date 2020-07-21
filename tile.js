(function() {
    let _shadowRoot;
    let _id;
    let _password;

    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
        <div id="ui5_content" name="ui5_content">
         <slot name="content"></slot>
        </div>
        <script id="oView" name="oView" type="sapui5/xmlview">
            <mvc:View
			    controllerName="myView.Template"
				xmlns:l="sap.ui.layout"
				xmlns:mvc="sap.ui.core.mvc"
				xmlns:lidl="lidl.lib.ui5"
        			xmlns:chart="lidl.lib.ui5.chart"
				xmlns:viz.feeds="sap.viz.ui5.controls.common.feeds"
				    xmlns:viz.data="sap.viz.ui5.data"
				xmlns="sap.m">
				<l:VerticalLayout
					class="sapUiContentPadding"
					width="100%">
					<l:content>
						<Input
							id="passwordInput"
							type="Password"
							placeholder="Enter password ..." liveChange="onButtonPress"/>
					<chart:ChartTile class="sapUiMediumMargin" width="300px">
            <chart:chart>
                <chart:DonutChart
                        donutTitle="{= 313 + 224}"
                        showLabels="true"
                        donutSecondaryTitle="gescannt"
                        width="100%"
                        height="100%"
                        widthRatio="273"
                        heightRatio="273">
                    <chart:series>
                        <chart:ChartSeries color="#43b970" name="OK gescannt">
                            <chart:ChartDataPoint label="" value="313"/>
                        </chart:ChartSeries>
                        <chart:ChartSeries color="#e42912" name="Defekt gescannt">
                            <chart:ChartDataPoint label="" value="224"/>
                        </chart:ChartSeries>
                    </chart:series>
 
                    <chart:colors>
                        <chart:SeriesColor color="#43b970"/>
                        <chart:SeriesColor color="#e42912"/>
                        <chart:SeriesColor color="#ff9800"/>
                    </chart:colors>
 
                    <chart:xAxis>
                        <chart:ChartAxis type="Category" timeParseFormat="%d-%m-%Y">
                            <chart:categories>
                                <chart:ChartAxisCategory label="01-03-2017"/>
                                <chart:ChartAxisCategory label="01-04-2017"/>
                                <chart:ChartAxisCategory label="01-05-2017"/>
                                <chart:ChartAxisCategory label="01-07-2017"/>
                            </chart:categories>
                        </chart:ChartAxis>
                    </chart:xAxis>
 
 
                </chart:DonutChart>
            </chart:chart>
            <lidl:InformationChartLegend title="Legende">
                <lidl:InformationLabelObject color="#43b970" label="OK gescannt" value="313"/>
                <lidl:InformationLabelObject color="#e42912" label="Defekt gescannt" value="224"/>
            </lidl:InformationChartLegend>
        </chart:ChartTile>	
					</l:content>
				</l:VerticalLayout>
				
			</mvc:View>
        </script>        
    `;

    class InputPassword extends HTMLElement {

        constructor() {
            super();

            _shadowRoot = this.attachShadow({
                mode: "open"
            });
            _shadowRoot.appendChild(tmpl.content.cloneNode(true));
	jQuery.sap.registerModulePath("lidl.lib.ui5", "https://esc.sys.schwarz/sap/bc/ui5_ui5/sap/ZCAX_LIBUI5V144/lidl.lib.ui5/");
	sap.ui.getCore().loadLibrary("lidl.lib.ui5");

            _id = createGuid();
		

            _shadowRoot.querySelector("#oView").id = _id + "_oView";

            this._export_settings = {};
            this._export_settings.password = "";
            this.addEventListener("click", event => {
                console.log('click');
            });
        }

        connectedCallback() {
            try {
                if (window.commonApp) {
                    let outlineContainer = commonApp.getShell().findElements(true, ele => ele.hasStyleClass && ele.hasStyleClass("sapAppBuildingOutline"))[0]; // sId: "__container0"

                    if (outlineContainer && outlineContainer.getReactProps) {
                        let parseReactState = state => {
                            let components = {};

                            let globalState = state.globalState;
                            let instances = globalState.instances;
                            let app = instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"];
                            let names = app.names;

                            for (let key in names) {
                                let name = names[key];

                                let obj = JSON.parse(key).pop();
                                let type = Object.keys(obj)[0];
                                let id = obj[type];

                                components[id] = {
                                    type: type,
                                    name: name
                                };
                            }

                            for (let componentId in components) {
                                let component = components[componentId];
                            }

                            let metadata = JSON.stringify({
                                components: components,
                                vars: app.globalVars
                            });

                            if (metadata != this.metadata) {
                                this.metadata = metadata;

                                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                                    detail: {
                                        properties: {
                                            metadata: metadata
                                        }
                                    }
                                }));
                            }
                        };

                        let subscribeReactStore = store => {
                            this._subscription = store.subscribe({
                                effect: state => {
                                    parseReactState(state);
                                    return {
                                        result: 1
                                    };
                                }
                            });
                        };

                        let props = outlineContainer.getReactProps();
                        if (props) {
                            subscribeReactStore(props.store);
                        } else {
                            let oldRenderReactComponent = outlineContainer.renderReactComponent;
                            outlineContainer.renderReactComponent = e => {
                                let props = outlineContainer.getReactProps();
                                subscribeReactStore(props.store);

                                oldRenderReactComponent.call(outlineContainer, e);
                            }
                        }
                    }
                }
            } catch (e) {}
        }

        disconnectedCallback() {
            if (this._subscription) { 
                this._subscription();
                this._subscription = null;
            }
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            loadthis(this);
        }

        _firePropertiesChanged() {
            this.password = "";
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        password: this.password
                    }
                }
            }));
        }

        // SETTINGS
        get password() {
            return this._export_settings.password;
        }
        set password(value) {
            value = _password;
            this._export_settings.password = value;
        }

        static get observedAttributes() {
            return [
                "password"
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }

    }
    customElements.define("com-fd-djaja-sap-sac-inputpassword", InputPassword);

    // UTILS
    function loadthis(that) {
        var that_ = that;
      
        let content = document.createElement('div');
        content.slot = "content";
        that_.appendChild(content);

        sap.ui.getCore().attachInit(function() {
            "use strict";

            //### Controller ###
            sap.ui.define([
                "jquery.sap.global",
                "sap/ui/core/mvc/Controller"
            ], function(jQuery, Controller) {
                "use strict";

                return Controller.extend("myView.Template", {
                    onButtonPress: function(oEvent) {
                        _password = oView.byId("passwordInput").getValue();
                        that._firePropertiesChanged();
                        console.log(_password);

                        this.settings = {};
                        this.settings.password = "";

                        that.dispatchEvent(new CustomEvent("onStart", {
                            detail: {
                                settings: this.settings
                            }
                        }));
                    } 
                });
            });

            //### THE APP: place the XMLView somewhere into DOM ###
            var oView  = sap.ui.xmlview({
                viewContent: jQuery(_shadowRoot.getElementById(_id + "_oView")).html(),
            });
            oView.placeAt(content);


            if (that_._designMode) {
                oView.byId("passwordInput").setEnabled(true);
            }
        });
    }

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }  
})();
