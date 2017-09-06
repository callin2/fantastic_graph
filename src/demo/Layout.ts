import {Application} from "../Application"
import {AgensGraphWidget} from "../navex"

class Layout extends Application {
    agw: AgensGraphWidget
    private xAxisColName: string;
    private yAxisColName: string;

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

        this.agw.loadJson('data/gal.json').then(()=>{

            this.agw.setLayout('euler')
        })
    }

    coseLayout() {
        this.agw.setLayout('euler')
    }

    colaLayout() {
        this.agw.setLayout('cola')
    }

    eulerLayout() {
        this.agw.setLayout('euler')
    }

    customLayout() {
        this.agw.setLayout('custom')
    }

    xAxisChange(evt) {
        console.log(evt)
        var opt = <HTMLInputElement>evt.target.querySelector("option:checked")
        this.xAxisColName = opt.value

        this.agw.setLayout('custom', {x:this.xAxisColName,y:this.yAxisColName})
    }

    yAxisChange(evt) {
        var opt = <HTMLInputElement>evt.target.querySelector("option:checked")
        this.yAxisColName = opt.value


        this.agw.setLayout('custom', {x:this.xAxisColName,y:this.yAxisColName})
    }


}

window.addEventListener('load',()=>new Layout(document.querySelector("body")))
