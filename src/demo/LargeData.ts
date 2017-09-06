declare var QuickSettings:any;

import {Application} from "../Application"
import {AgensGraphWidget} from "../navex"
import * as d3 from "d3"


let scaleLinear = d3['scaleLinear']

class LargeData extends Application {
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
                        "color": "black"
                    }
                }
            ]
        })

        console.time('loadgexf')
        this.agw.loadGexf('data/github.gexf').then(()=>{

            console.timeEnd('loadgexf')
            this.agw.setLayout('euler')
        })
    }

    fit() {
        this.agw.cy.fit()
    }


}

window.addEventListener('load',()=>{
    console.log("onLoad");
    new LargeData(document.querySelector("body"))
})
