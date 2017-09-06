import * as cytoscape from "cytoscape"
import * as euler_reg from 'cytoscape-euler'
import * as cycola from 'cytoscape-cola'
import {EventEmitter} from "eventemitter3"
import * as gexf  from "gexf"
import * as d3 from "d3"
import * as fa from "fontawesome"
import * as _ from "lodash"


type ListenerFn = (...args: Array<any>) => void;
let scaleLinear = d3['scaleLinear']

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

    fire(event: string, ...args: Array<any>): boolean {
        return this.ee.emit(event, ...args)
    }

}

class AgensGraphWidget extends EventSource{
    domEl: any;
    cy: any;
    layout: any;
    nodeColorScale: any;
    nodeSizeScale: any;
    nstyle: any;
    estyle: any;
    nodeSelectType: string;
    grpIdx: number;
    neighborDepth: number;
    isSemanticZoom: boolean;

    nodeFromColor: string;
    nodeToColor: string;

    constructor(domId:string | any, option?: any) {
        super();

        this.nodeFromColor = '#ffffff';
        this.nodeToColor = '#0000ff';

        this.nstyle = {};
        this.estyle = {};
        this.grpIdx = 0;

        this.nodeColorScale = scaleLinear().domain([0,1.2]).range([this.nodeFromColor, this.nodeToColor]);
        this.nodeSizeScale = scaleLinear().domain([0,20]).range([30,150]);

        if(typeof domId == 'string') {
            this.domEl = document.getElementById(domId);
        }else {
            this.domEl = domId;
        }

        // register extensions !!
        euler_reg(cytoscape);
        cycola(cytoscape);

        var _option = _.defaults({
            container: this.domEl,
            textureOnViewport: true,
            style: [
                {
                    selector : 'edge',
                    style:{
                        width:3,
                        'target-arrow-shape':"triangle",
                        'target-arrow-color':"red",
                        // 'curve-style' : 'segments',
                        'line-style' : 'solid',
                    }
                },{
                    selector: 'node',
                    style: {
                        "text-valign": 'center',
                        // label: fa['youtube'],
                        "font-family": "FontAwesome"
                    }
                },{
                    selector: 'node.group',
                    style: {
                        "border-width": 2,
                        "border-color": 'green'
                    }
                }
            ]
        },option)

        this.cy = cytoscape(_option);
        this.cy.on('click','node', (evt)=>{
            this.nodeClickHandler(evt)
        });

        // this.cy.userZoomingEnabled(false)
        this.cy.boxSelectionEnabled(true)

        // node edge size 고장
        this.cy.on('zoom',()=>{

            if(!this.isSemanticZoom) return;

            var zoom = this.cy.zoom();
            var nodeSize = 20 / zoom

            // if(nodeSize > 100) {
            //     nodeSize = 100
            // }else if(nodeSize < 20) {
            //     nodeSize = 20
            // }

            var edgeSize = 3 / zoom

            this.cy.batch(()=>{
                this.cy.$('node').style({
                    width: nodeSize,
                    height: nodeSize,
                    "font-size":nodeSize*0.7
                });

                this.cy.$('edge').style({
                    width: edgeSize
                })
            });

        });

        this.cy.on('unselect',()=>{
            console.log('unselect')
        })

    }

    setColorScale(fromColor, toColor) {
        this.nodeFromColor = fromColor;
        this.nodeToColor = toColor;
        this.nodeColorScale = scaleLinear().domain([0,1]).range([fromColor,toColor]);
    }


    toggleSemanticZoom() {
        this.isSemanticZoom = !this.isSemanticZoom;
    }

    loadJson(fileUrl: string) {
        this.clear();

        return fetch(fileUrl).then((res)=>{
            return res.text()
        })
        .then((text)=> {
            console.log(text)
            return JSON.parse(text);
        })
        .then((json: any)=>{
            console.log(json)
            this.cy.add(json)
            this.cy.fit(50)
        })
    }

    loadGexf(fileUrl: string) {
        this.clear();

        return fetch(fileUrl).then((res)=>{
            return res.text()
        })
        .then((text)=>gexf.parse(text))
        .then((graph: any)=>{
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
            // this.setLayout('cose')
            // this.layout = this.cy.layout({name: 'cose'});
            // this.layout.run()
        });
    }

    clear() {
        this.cy.remove('edge')
        this.cy.remove('node')
    }

    setLayout(layoutName: string, option?: any) {
        console.log("node count", this.cy.$('node').size())
        console.log("edge count", this.cy.$('edge').size())
        console.time(layoutName)
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
        }else if(layoutName == 'custom') {
            // console.log('layoutName', layoutName)

            var xColName =option.x ? option.x : 'AverageShortestPathLength'
            var yColName =option.y ? option.y : 'Radiality'


            var xmm = this.cy.nodes().reduce((memo, ele)=>{
                var v = ele.data(xColName)
                // console.log('--------------', v)
                memo.min = Math.min(memo.min, v)
                memo.max = Math.max(memo.max, v)
                return memo;
            },{min:Infinity, max:-Infinity})

            var ymm = this.cy.nodes().reduce((memo, ele)=>{
                var v = ele.data(yColName)
                // console.log('--------------', v)
                memo.min = Math.min(memo.min, v)
                memo.max = Math.max(memo.max, v)
                return memo;
            },{min:Infinity, max:-Infinity})





            var xScale = scaleLinear().domain([xmm.min,xmm.max]).range([0,1000])
            var yScale = scaleLinear().domain([ymm.min,ymm.max]).range([-1000,0])

            this.layout = this.cy.layout({
                name: 'preset',
                fit: false,
                positions: (node)=>{
                    // console.log(node.data())
                    // return node.data().viz.position
                    return {
                        x: xScale(node.data(xColName)),
                        y: yScale(node.data(yColName))
                    };
                },
                animate: true
            });

            this.layout.run()
        }else if(layoutName == 'cola'){
            this.layout = this.cy.layout({
                name: layoutName,
                randomize: true,
                refresh: 5,
                // infinite: true,

            })
            this.layout.run()

        }else{
            this.layout = this.cy.layout({name: layoutName, randomize: true, animate: true})
            this.layout.run()
        }

        console.timeEnd(layoutName)
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

    groupSelectedNode() {
        // pre conditions
        var selectedNodes = this.cy.$('node:selected')
        var selectedEles= this.cy.$(':selected')
        if(selectedNodes.size() < 2) return;


        // add group node
        var pos = selectedNodes.first().position()
        var grpNode = this.cy.add({group:'nodes', data:{id:"grp"+this.grpIdx++, nodeType:'group'}, position: {x:pos.x, y:pos.y}})
        grpNode.addClass('group');

        // add group link
        let cutEdge = this._findCuttingEdge(this.cy.$(':selected'));
        cutEdge.forEach((ed)=>{
            console.log('ed', ed.data())

            if(selectedEles.contains(ed.source())) {
                this.cy.add({
                    group: "edges",
                    data: {source: grpNode.id() , target: ed.target().id()}
                })
            }else {
                this.cy.add({
                    group: "edges",
                    data: {target: grpNode.id() , source: ed.source().id()}
                })
            }
        });

        var grpPosition = grpNode.position()
        selectedNodes.map((n)=>{
            var nodePosition = n.position()
            n.scratch({
                dx: grpPosition.x - nodePosition.x ,
                dy: grpPosition.y - nodePosition.y
            })
        });

        selectedNodes.animate({
            position: grpPosition,
            duration: 300,
            complete: _.once(()=>{
                grpNode.scratch('subgraph', selectedNodes.remove())
            })
        });
    }

    _findCuttingEdge(eles) {
        var nb = eles.neighborhood();

        console.log("xxx", eles.size(), nb.size())

        var outerEdges = nb.difference(eles).filter('edge');
        console.log('outerEdges', outerEdges)
        return outerEdges
    }

    ungroupSelectedNode() {

        var selectedNodes = this.cy.$('node:selected')
        if(selectedNodes.size() != 1) return;

        var grpNode = selectedNodes.first()

        var rmElem = grpNode.scratch('subgraph')

        console.log('rmElem', rmElem)

        var grpPosition = grpNode.position()

        rmElem.forEach((n)=>{
            if(n.isEdge()) return;
            var delta = n.scratch()
            n.position({x: grpPosition.x - delta.dx, y:grpPosition.y - delta.dy})
        });

        rmElem.restore()
        grpNode.remove()
    }


    groupSelectedNode_old() {

        console.log('groupSelectedNode')
        var selectedNodes = this.cy.$('node:selected')
        if(selectedNodes.size() < 2) return;

        var newNodes = []
        newNodes.push({group:'nodes', data:{id:"grp"+this.grpIdx++}, position: selectedNodes.first().position() })

        var box = selectedNodes.renderedBoundingBox()
        console.log('box', box)

        this.cy.add({group:'nodes', data:{id:"grp"+this.grpIdx++}, position: {x: box.x1, y: box.y1} })

        selectedNodes.forEach((n)=>{
            // n.data('parentxx', newNodes[0].data.id);
            var nd = n.data();
            nd.parent = newNodes[0].data.id
            newNodes.push({group:"nodes", data: nd})
        })

        console.log(JSON.stringify(newNodes))

        var removedElem = selectedNodes.remove()
        console.log(removedElem)
        this.cy.add(newNodes)
        removedElem.restore()
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

    setAllNodeSize() {
        this.nstyle.width = (ele) => {
            return ele.degree(true) * 5 + 5;
        };
        this.nstyle.height = (ele) => {
            return ele.degree(true) * 5 + 5;
        };
        console.log("this.cy.style()", this.cy.style());
        this.cy.style()
            .selector('node')
            .style(this.nstyle)
            .update();
    }

    setNodeSelectType(nsType: string) {
        this.nodeSelectType = nsType


    }

    degreeSize() {
        this.nstyle.width = (ele)=>{
            return this.nodeSizeScale(ele.degree(true));
        };

        this.nstyle.height = (ele)=>{
            return this.nodeSizeScale(ele.degree(true));
        };


        console.log("this.cy.style()", this.cy.style())


        this.cy.style()
            .selector('node')
            .style(this.nstyle)
            .update();
    }

    clacBc() {
        this.cy.$(':selected')
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
                n.style('display', 'element')
                // n.removeClass("selected")
            }
        })

        this.cy.fit(this.cy.$(':visible'), 50)

    }

    nodeClickHandler(evt: any) {
        console.log(evt)
        let targetNode = evt.target[0]
        let isAlreadySelected = evt.target[0].selected()

        console.log(targetNode,isAlreadySelected)

        if(!isAlreadySelected) {
            setTimeout(()=>{
                this.neighborDepth = 1;
                this.cy.scratch('selElems', this.cy.$(':selected'))
                    this.fire('nodeSelected', evt.target[0])
            });

            return;
        }

        console.log(this.neighborDepth)

        setTimeout(()=>{
            this.neighborDepth++

            var d1Col = this.cy.scratch('selElems');

            console.log(d1Col.size())

            var d2Col= d1Col.union(d1Col.neighborhood());
            d2Col.select()

            console.log(d2Col.size())

            this.cy.scratch('selElems', d2Col)

            this.cy.animation({
                fit: {
                    eles: d2Col,
                    padding: 200
                },
                duration: 500
            }).play()
        },0)



    }

    setNodeToColor(color: any) {
        this.setColorScale(this.nodeFromColor, color)
    }

    setNodeFromColor(color: any) {
        this.setColorScale(color, this.nodeToColor)
    }
}

export { AgensGraphWidget }
