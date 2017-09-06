import {Application} from "../Application"
import {AgensGraphWidget} from "../navex"

class FitZoom extends Application {
    agw: AgensGraphWidget

    constructor(rootElem: HTMLElement | any) {
        super(rootElem);
        this.agw = new AgensGraphWidget(document.querySelector('body'),{
            style:[
                {
                    selector: 'node',
                    style: {
                        'text-halign': 'right',
                        "text-valign": 'center',
                        "font-family": "Oswald",
                        "color": "black",
                        "label":  "xxx" //(ele)=>{return ele.data('name')}
                    }
                }
            ]
        })

        this.agw.loadJson('/data/gal.json').then(()=>{
            this.agw.cy.style()
                .selector('node')
                .style({
                    'text-halign': 'right',
                    "text-valign": 'center',
                    "font-family": "Oswald",
                    "color": "black",
                    "label":  (ele)=>{return ele.data('name')}
                })
                .update();

            this.agw.setLayout('euler')
        })
    }

    toggleZoomMode() {
        this.agw.toggleSemanticZoom();
    }

    fit() {
        this.agw.cy.fit()
    }
}

window.addEventListener('load',()=>{
    new FitZoom(document.querySelector("body"))
})
