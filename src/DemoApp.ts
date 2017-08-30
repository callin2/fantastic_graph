import {AgensGraphWidget} from "./navex"

class DemoApp {
    gw: any;

    constructor() {
        this.initGraphWidget();
        this.initEvnt();

        this.gw.loadGexf("/data/dh11.gexf")
    }

    private initGraphWidget() {
        var widgetContainers = document.querySelector('.graph');
        this.gw = new AgensGraphWidget(widgetContainers)
    }

    private initEvnt() {
        var selElem = document.querySelector("select[name='datafile']")
        selElem.addEventListener('change',(evt)=>{
            var url = <HTMLInputElement>document.querySelector("select[name='datafile'] option:checked")
            this.gw.loadGexf(url.value)
        });

        var layoutElem = document.querySelector("select[name='layout']")
        layoutElem.addEventListener('change',(evt)=>{
            var layout = <HTMLInputElement>document.querySelector("select[name='layout'] option:checked")
            this.gw.setLayout(layout.value)
        });

        var colorElem = document.querySelector("select[name='coloring']")
        colorElem.addEventListener('change',(evt)=>{
            var colorType = <HTMLInputElement>document.querySelector("select[name='coloring'] option:checked")
            this.gw.setColorType(colorType.value)
        });

        var nsizeElem = document.querySelector("select[name='nsize']")
        nsizeElem.addEventListener('change',(evt)=>{
            var nsize = <HTMLInputElement>document.querySelector("select[name='nsize'] option:checked")
            this.gw.setNodeSize(nsize.value)
        });

        var nsTypeElem = document.querySelector("select[name='nodeselecttype']")
        nsTypeElem.addEventListener('change',(evt)=>{
            var nsType = <HTMLInputElement>document.querySelector("select[name='nodeselecttype'] option:checked")
            this.gw.setNodeSelectType(nsType.value)
        });


        var fitBtn = document.getElementById('fit')
        fitBtn.addEventListener('click', ()=>{
            this.gw.cy.fit(50)
        });

        var zoominBtn = document.getElementById('zoomin')
        zoominBtn.addEventListener('click', ()=>{
            this.gw.cy.zoom( this.gw.cy.zoom() * 1.2 )
            // console.log(this.gw.cy.zoom());
        });

        var zoomoutBtn = document.getElementById('zoomout')
        zoomoutBtn.addEventListener('click', ()=>{
            this.gw.cy.zoom( this.gw.cy.zoom() * .8 )
        });

        var dgrangeBtn = document.getElementById('dgrange')
        dgrangeBtn.addEventListener('change', ()=>{
            console.log( dgrangeBtn['value'] );
            this.gw.setNodeDegreeMin(dgrangeBtn['value'])
        });


    }
}

if(window) {
    window.addEventListener('load',()=>{
        new DemoApp();

        // var widgetContainers = document.querySelectorAll('*[data-agens]');
        // widgetContainers.forEach((el)=>{
        //     var widget = new AgensGraphWidget(el)
        //     el._widget = widget;
        // })
    })
}
