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

    constructor(domId:string | any) {
        super();

        this.nodeColorScale = scaleLinear().domain([0,1]).range(['yellow','red']);

        if(typeof domId == 'string') {
            this.domEl = document.getElementById(domId);
        }else {
            this.domEl = domId;
        }

        this.cy = cytoscape({
            container: this.domEl,
            style: [
                {selector : 'edge', style:{width:1, 'target-arrow-shape':"triangle"}},
                {selector : 'node', style:{width:20, height:10}},
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
        }).then(gexf.parse)
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
            this.layout = this.cy.layout({name: 'circle', animate:true});
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

            // cy.nodes().forEach((node)=>{
            //     console.log(node.position)
            //     return {x:0, y:0}
            // });

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
                        y: yScale(node.data().attributes.degree)}
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
        console.log('colorType', colorType);

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
        console.log('sizeBy', sizeBy);

        switch(sizeBy) {
            case "degree":
                this.degreeSize();
                break;
            case "centrality":
                this.centralitySize();
                break;
        }
    }

    degreeSize(): any {
        var styleSheet = cytoscape.stylesheet()
            .selector('node')
            .style({
                'width': (ele)=>{
                    ele.degree(true) + 5
                },
                'height': (ele)=>{
                    ele.degree(true) + 5
                }
            });

        this.cy.style(styleSheet).update();
    }

    centralitySize() {
        let centrality = this.cy.$().dcn({directed:true});

        var styleSheet = cytoscape.stylesheet()
            .selector('node')
            .style({
                'width': (ele)=>{
                    centrality.outdegree(ele) * 10
                },
                'height': (ele)=>{
                    centrality.indegree(ele)  * 10
                }
            });

        this.cy.style(styleSheet).update();
    }


    degreeColor(): any {
        console.log("degreeColor")

        var styleSheet = cytoscape.stylesheet()
            .selector('node')
            .style({
                'background-color': (ele)=>{
                    console.log("ele.degree(true)", ele.degree(true), ele.position())
                    return this.nodeColorScale(ele.degree(true)/10)
                }
            })

        this.cy.style(styleSheet).update();
    }

    centralityColor(io) {
        let centrality = this.cy.$().dcn({directed:true});

        var styleSheet = cytoscape.stylesheet()
            .selector('node')
            .style({
                'background-color': (ele)=>{
                    // let centrality = this.cy.$().dcn({root:ele, directed:true});
                    // console.log("centrality", centrality)
                    return this.nodeColorScale(io == 'out' ? centrality.outdegree(ele) : centrality.indegree(ele))
                }
            })

        this.cy.style(styleSheet).update();
    }

}

export { AgensGraphWidget }
