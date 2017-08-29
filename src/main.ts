require("./style/dark.styl");

import * as gexf  from "gexf"

window.onload = function() {

    fetch('/data/data.json', {mode: 'no-cors'})
        .then(function(res) {
            return res.json()
        })
        .then(function(data) {
            console.log(data);
            var cy = window.cy = cytoscape({


                container: document.getElementById('graph'),

                // style: cytoscape.stylesheet()
                //     .selector('node')
                //     .css({
                //         'width': 'mapData(weight, 0, 100, 10, 60)',
                //         'height': 'mapData(weight, 0, 100, 10, 60)'
                //     })
                //     .selector('edge')
                //     .css({
                //         'opacity': '0.666',
                //         'width': 'mapData(weight, 0, 100, 1, 6)',
                //         'curve-style': 'haystack' // fast edges!
                //     })
                //     .selector(':selected')
                //     .css({
                //         'background-color': 'black',
                //         'opacity': 1
                //     }),

                // layout: {
                //     name: 'concentric',
                //     concentric: function( ele ){ return ele.data('weight'); },
                //     levelWidth: function( nodes ){ return 10; },
                //     padding: 10
                // },

                elements: data
            });
        });


}