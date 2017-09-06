import {Application} from "../Application"
import {AgensGraphWidget} from "../navex"

class Filter extends Application {
    agw: AgensGraphWidget

    constructor(rootElem: HTMLElement | any) {
        super(rootElem);
        this.agw = new AgensGraphWidget(document.querySelector('#graph'),{
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

        this.agw.loadJson('data/gal.json').then(()=>{
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
        this.agw.cy.fit(this.agw.cy.$(':visible'), 50)
        // this.agw.cy.fit()
    }

    filter(evt) {
        console.log(evt)
        this.agw.setNodeDegreeMin(evt.target['value'])
        var eles = this.agw.cy.$(':visible')

        console.log(eles.size())

        this.agw.cy.fit(this.agw.cy.$(':visible'), 50)
    }
}

window.addEventListener('load',()=>{
    new Filter(document.querySelector("body"))
})
