// import * as oui from "ouioui"
declare var QuickSettings:any;

import {AgensGraphWidget} from "./navex"
import {Application} from "./Application"

class DemoApp extends Application {
    gw: any;
    private sizeSettings: any;
    private settings: any;
    private colorSettings: any;
    private labelSettings: any;

    constructor(rootElem: HTMLElement | any) {
        super(rootElem);
        this.initGraphWidget();

        this.gw.loadJson("/data/gal.json");
        this.gw.on('nodeSelected',(node)=>{
            console.log(node,'MM', node.data())

            var nodeData = node.data()


            var allProps = Object.getOwnPropertyNames(nodeData)
            this.labelSettings.removeControl("text")


            this.labelSettings.addDropDown("text", allProps ,(labelProp)=>{
                console.log('labelProp', labelProp.value)

                this.gw.cy.style()
                    .selector('node')
                    .style({label: (ele) => ele.data(labelProp.value)})
                    .update();
            });


            this.colorSettings.addDropDown("by", allProps , (labelProp)=>{
                this.gw.cy.style()
                    .selector('node')
                    .style({label: (ele) => ele.data(labelProp.value)})
                    .update();
            })

        });



        this.initSettingDlg();



    }

    private initGraphWidget() {
        var widgetContainers = document.querySelector('.graph');
        this.gw = new AgensGraphWidget(widgetContainers)
    }


    handleFileChange(evt): void {
        var url = <HTMLInputElement>evt.target.querySelector("option:checked")
        if(url.value.indexOf("json")>0) {
            this.gw.loadJson(url.value)
        }else {
            this.gw.loadGexf(url.value)
        }
    }

    handleLayoutChange(evt): void {
        var layout = <HTMLInputElement>evt.target.querySelector("option:checked")
        this.gw.setLayout(layout.value)
    }

    handleColoring(evt): void {
        var colorType = <HTMLInputElement>evt.target.querySelector("option:checked")
        this.gw.setColorType(colorType.value)
    }

    handleSize(evt): void {
        var nsize = <HTMLInputElement>evt.target.querySelector("option:checked")
        this.gw.setNodeSize(nsize.value)
    }

    fit(evt): void {
        this.gw.cy.fit(50)
    }

    zoomin(evt): void {
        this.gw.cy.zoom( this.gw.cy.zoom() * 1.2 )
    }

    zoomout(evt): void {
        this.gw.cy.zoom( this.gw.cy.zoom() * .8 )
    }

    groupNode(evt): void {
        this.gw.groupSelectedNode()
    }

    ungroupNode(evt): void {
        this.gw.ungroupSelectedNode()
    }

    degreeFilterChange(evt): void {
        this.gw.setNodeDegreeMin(evt.target['value'])
    }

    toggleSemanticZoom(evt): void {
        this.gw.toggleSemanticZoom()
    }

    clacBc(): void {
        this.gw.clacBc()
    }


    private initSettingDlg() {
        this.settings = QuickSettings.create(0, 0, "Agens Browser");
        this.labelSettings = QuickSettings.create(210, 0, "Label").hide();
        this.colorSettings = QuickSettings.create(420, 0, "Color").hide();
        this.sizeSettings = QuickSettings.create(630, 0, "Size").hide();

        this.settings.addDropDown("Data File", [
            "dh11.gexf", "photoviz dynamic.gexf","github.gexf", "ccnr-universe-fa2-ncolorModularity-nsizeBeteewnessCentrality.gexf",
            "diseasome.gexf","diseasome_10000.gexf","EuroSiSPays.gexf",
            "data.json", "gal.json"
        ], (file) => {
            if(file.value.indexOf("json") > 0) {
                this.gw.loadJson("/data/"+file.value)
            }else {
                this.gw.loadGexf("/data/"+file.value)
            }
        });

        this.settings.addDropDown("Layout", [
            "random", "preset","concentric",
            "grid","circle",
            "cose", "euler",
            "cola"
        ], (layout) => {
            this.gw.setLayout(layout.value)
        });

        this.settings.addBoolean("Label", false, (val)=>{
            val ? this.labelSettings.show() : this.labelSettings.hide()
        });

        this.settings.addBoolean("Color", false, (val)=>{
            val ? this.colorSettings.show() : this.colorSettings.hide()
        });

        this.settings.addBoolean("Size", false, (val)=>{
            val ? this.sizeSettings.show() : this.sizeSettings.hide()
        });

        this.settings.addButton("Fit",()=>{
            this.fit(null)
        });

        //========================
        this.colorSettings.addColor("from", "#ffff00", (fromColor)=>{

        })
        this.colorSettings.addColor("to", "#ff0000", (fromColor)=>{

        })
        this.colorSettings.addDropDown("type", [
            "linear", "pow", "log"
        ], (scaleType)=>{

        })


        // label setting


    }
}

if(window) {
    window.addEventListener('load',()=>{
        new DemoApp( document.getElementById("app"));
    })
}
