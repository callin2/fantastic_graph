declare var QuickSettings:any;

import {Application} from "../Application"
import {AgensGraphWidget} from "../navex"
import * as d3 from "d3"


let scaleLinear = d3['scaleLinear']

class PropEdit extends Application {
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

        this.agw.loadGexf('data/github.gexf').then(()=>{

            console.log('loadgexf complete')
            this.agw.setLayout('euler')
        })
    }


}

window.addEventListener('load',()=>{
    new PropEdit(document.querySelector("body"))
})
