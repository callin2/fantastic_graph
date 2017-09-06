declare var QuickSettings:any;

import {Application} from "../Application"
import {AgensGraphWidget} from "../navex"
import * as d3 from "d3"


let scaleLinear = d3['scaleLinear']

class Styling extends Application {
    agw: AgensGraphWidget
    settings: any
    fromColor: string
    toColor: string
    private nodeColorScale: any;
    private nodeSizeScale: any;

    constructor(rootElem: HTMLElement | any) {
        super(rootElem);

        this.fromColor = 'white';
        this.toColor = 'blue';

        this.nodeColorScale = scaleLinear().domain([0,15]).range([this.fromColor, this.toColor]);
        this.nodeSizeScale = scaleLinear().domain([0,20]).range([30,150]);

        this.settings = QuickSettings.create(0, 0, "Color");
        this.settings.addColor("from", "#ffffff", (color)=>{
            console.log('color', color)
            this.fromColor = color
            this.nodeColorScale = scaleLinear().domain([0,15]).range([this.fromColor, this.toColor]);

            this.agw.cy.style()
                .selector('node')
                .style({
                    "background-color":  (ele)=> this.nodeColorScale(ele.data('degree_layout'))
                }).update()

        });
        this.settings.addColor("to", "#0000ff", (color)=>{
            console.log('color', color)
            this.toColor = color
            this.nodeColorScale = scaleLinear().domain([0,15]).range([this.fromColor, this.toColor]);

            this.agw.cy.style()
                .selector('node')
                .style({
                    "background-color":  (ele)=> this.nodeColorScale(ele.data('degree_layout'))
                })

        });


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

        this.agw.loadJson('data/gal.json').then(()=>{
            this.agw.cy.style()
                .selector('node')
                .style({
                    'text-halign': 'right',
                    "text-valign": 'center',
                    "font-family": "Oswald",
                    "color": "black",
                    "label":  (ele)=>{return ele.data('name')},
                    "width":  'mapData(degree_layout, 0, 10, 20, 60)',
                    "height":  'mapData(degree_layout, 0, 10, 20, 60)',
                    "background-color":  'mapData(degree_layout, 0, 15, white, #ff0000)',
                    // "background-color":  `mapData(degree_layout, 0, 15, ${this.fromColor}, ${this.toColor})`,
                })
                .selector('edge')
                .style({
                    "width":  'mapData(EdgeBetweenness, 0, 1000, 1, 6)',
                    // "label":  (ele)=>{return ele.data('name')},
                    // "text-rotation": "autorotate"
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

    filter(evt) {
        console.log(evt)
        this.agw.setNodeDegreeMin(evt.target['value'])
    }
}

window.addEventListener('load',()=>{
    new Styling(document.querySelector("body"))
})
