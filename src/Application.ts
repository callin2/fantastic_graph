

class Application    {
    rootElem : HTMLElement | any
    constructor(rootElem: HTMLElement | any) {
        this.rootElem = rootElem;
        this.bindEvent(this.rootElem)
    }

    private bindEvent(elem: HTMLElement ) {
        let allAttr = elem.attributes;
        var evtNameRe = /^@([\w]+)$/

        // find @{event} attr
        for(var i=0; i<allAttr.length; i++) {
            let attr = allAttr[i];
            let matchRslt = evtNameRe.exec(attr.name);
            // console.log(attr.name, evtNameRe.exec(attr.name))

            if(matchRslt == null) continue;
            let handlerName = elem.getAttribute(matchRslt[0])

            elem.addEventListener(matchRslt[1],(evt)=> {
                if( typeof this[handlerName] != 'function') {
                    console.error('event handler "'+handlerName+'() not found!' )
                    return;
                }

                this[handlerName](evt)

            })

        }

        // bind child Elemeent
        for(var i=0; i<elem.children.length; i++) {
            this.bindEvent(<HTMLElement>elem.children[i]);
        }
    }
}


export { Application }