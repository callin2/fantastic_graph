import {AgensGraphWidget} from "./navex"
import {Application} from "./Application"

class DemoApp extends Application {
    gw: any;

    constructor(rootElem: HTMLElement | any) {
        super(rootElem);
        this.initGraphWidget();

        this.gw.loadGexf("/data/dh11.gexf")
    }

    private initGraphWidget() {
        var widgetContainers = document.querySelector('.graph');
        this.gw = new AgensGraphWidget(widgetContainers)
    }

    handleFileChange(evt): void {
        var url = <HTMLInputElement>evt.target.querySelector("option:checked")
        this.gw.loadGexf(url.value)
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

}

if(window) {
    window.addEventListener('load',()=>{
        new DemoApp( document.getElementById("app"));
    })
}
