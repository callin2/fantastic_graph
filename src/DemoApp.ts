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
            var url = document.querySelector("select[name='datafile'] option:checked")
            this.gw.loadGexf(url.value)
        });

        var layoutElem = document.querySelector("select[name='layout']")
        layoutElem.addEventListener('change',(evt)=>{
            var layout = document.querySelector("select[name='layout'] option:checked")
            this.gw.setLayout(layout.value)
        });

        var colorElem = document.querySelector("select[name='coloring']")
        colorElem.addEventListener('change',(evt)=>{
            var colorType = document.querySelector("select[name='coloring'] option:checked")
            this.gw.setColorType(colorType.value)
        });

        var nsizeElem = document.querySelector("select[name='nsize']")
        nsizeElem.addEventListener('change',(evt)=>{
            var nsize = document.querySelector("select[name='nsize'] option:checked")
            this.gw.setNodeSize(nsize.value)
        });

        var fitBtn = document.getElementById('fit')
        fitBtn.addEventListener('click', ()=>{
            this.gw.cy.fit(50)
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
