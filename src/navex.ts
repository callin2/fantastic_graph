import * as cytoscape from "cytoscape"
import {EventEmitter} from "eventemitter3"
import * as gexf  from "gexf"
import {scaleLinear} from "d3"

type ListenerFn = (...args: Array<any>) => void;

class EventSource {
    ee: EventEmitter;

    constructor() {
        this.ee = new EventEmitter();
    }

    on(eventName: string, eventHandler: ListenerFn, context?: any) {
        this.ee.on(eventName, eventHandler, context);
        return this;
    }

    off(event: string, fn?: ListenerFn) {
        this.ee.off(event, fn)
    }
}


class AgensGraphWidget extends EventSource{
    domEl: any;
    cy: any;
    layout: any;
    nodeColorScale: any;
    nstyle: any;
    estyle: any;
    nodeSelectType: string;

    constructor(domId:string | any) {
        super();

        this.nstyle = {};
        this.estyle = {};

        this.nodeColorScale = scaleLinear().domain([0,1]).range(['yellow','red']);

        if(typeof domId == 'string') {
            this.domEl = document.getElementById(domId);
        }else {
            this.domEl = domId;
        }

        this.cy = cytoscape({
            container: this.domEl,
            style: [
                {
                    selector : 'edge',
                    style:{
                        width:3,
                        'target-arrow-shape':"triangle",
                        'target-arrow-color':"red",
                        'curve-style' : 'bezier',
                        'line-color' : 'green',
                        'line-style' : 'solid',

                    }
                }
            ]
        });
    }

    setColorScale(fromColor, toColor) {
        this.nodeColorScale = scaleLinear().domain([0,1]).range([fromColor,toColor]);
    }

    loadGexf(fileUrl: string) {
        this.clear();

        fetch(fileUrl).then((res)=>{
            return res.text()
        })
        .then((text)=>gexf.parse(text))
        .then((graph)=>{
            console.log(graph);
            graph.nodes.forEach((n)=>{
                n.id = 'n' + n.id;
                this.cy.add({
                    group: "nodes",
                    data: n
                })
            });
            graph.edges.forEach((e)=>{
                e.source = 'n' + e.source;
                e.target = 'n' + e.target;
                this.cy.add({
                    group: "edges",
                    data: e
                })
            });
        }).then(()=>{
            this.layout = this.cy.layout({name: 'cose'});
            this.layout.run()
        });
    }

    clear() {
        this.cy.remove('edge')
        this.cy.remove('node')
    }

    setLayout(layoutName: string) {
        console.log('layoutName', layoutName)
        if(this.layout) {
            this.layout.stop()
        }

        if(layoutName == 'preset') {
            console.log('layoutName', layoutName)
            var xScale = scaleLinear().domain([0,0.5]).range([0,1000])
            var yScale = scaleLinear().domain([0,10]).range([-1000,0])

            this.layout = this.cy.layout({
                name: layoutName,
                fit: false,
                positions: (node)=>{
                    console.log(node.data())
                    // return node.data().viz.position
                    return {
                        x: xScale(node.data().attributes.eigencentrality),
                        y: yScale(node.data().attributes.degree)
                    };
                },
                animate: true
            });

            this.layout.run()
        }else{
            this.layout = this.cy.layout({name: layoutName})
            this.layout.run()
        }
    }

    setColorType(colorType: string) {
        // console.log('colorType ', colorType);

        switch(colorType) {
            case "degree":
                this.degreeColor();
                break;
            case "centrality.out":
                this.centralityColor('out');
                break;
            case "centrality.in":
                this.centralityColor('in');
                break;
        }
    }

    setNodeSize(sizeBy: string) {
        // console.log('sizeBy', sizeBy);

        switch(sizeBy) {
            case "degree":
                this.degreeSize();
                break;
            case "centrality":
                this.centralitySize();
                break;
        }
    }

    setNodeSelectType(nsType: string) {
        this.nodeSelectType = nsType


    }

    degreeSize() {
        this.nstyle.width = (ele)=>{
            return ele.degree(true)*5 + 5;
        };

        this.nstyle.height = (ele)=>{
            return ele.degree(true)*5 + 5;
        };


        console.log("this.cy.style()", this.cy.style())


        this.cy.style()
            .selector('node')
            .style(this.nstyle)
            .update();

    }

    centralitySize() {
        let centrality = this.cy.$().dcn({directed:true});

        this.nstyle.width = (ele)=>{
            return 5 + centrality.outdegree(ele) * 100
            // return 30
        };

        this.nstyle.height = (ele)=>{
            return 5 + centrality.indegree(ele) * 100
            // return 30
        };

        this.cy.style()
            .selector('node')
            .style(this.nstyle)
            .update();
    }


    degreeColor(): any {
        // console.log("degreeColor")

        this.nstyle['background-color'] = (ele)=>{
            // console.log("ele.degree(true)", ele.degree(true), ele.position())
            return this.nodeColorScale(ele.degree(true)/10)
        };

        this.cy.style()
            .selector('node')
            .style(this.nstyle)
            .update();
    }

    centralityColor(io) {
        let centrality = this.cy.$().dcn({directed:true});

        this.nstyle['background-color'] = (ele)=>{
            return this.nodeColorScale(io == 'out' ? centrality.outdegree(ele) : centrality.indegree(ele))
        };

        this.cy.style()
            .selector('node')
            .style(this.nstyle)
            .update();
    }

    setNodeDegreeMin(min: number) {
        // this.cy.$((ele))
        this.cy.nodes().forEach((n)=>{
            if(n.degree() < min) {
                n.style('display', 'none')
                // n.addClass("selected")
            }else {
                n.style('display', '')
                // n.removeClass("selected")
            }
        })

        // this.cy.fit(this.cy.$(':selected'), 50)

    }

}

export { AgensGraphWidget }
