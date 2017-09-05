import {Application} from "../Application"
import {AgensGraphWidget} from "../navex"

class NodeSelect extends Application {
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
                },
                {
                    selector: 'node.group',
                    style: {
                        "border-width": 4,
                        "width": 40,
                        "height": 40,
                        "shape": "rectangle",
                        "border-color": 'green'
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

    group() {
        this.agw.groupSelectedNode();
    }

    ungroup() {
        this.agw.ungroupSelectedNode()
    }
}

window.addEventListener('load',()=>new NodeSelect(document.querySelector("body")))
