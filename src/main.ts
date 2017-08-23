
// https://medium.com/@sapegin/css-modules-with-typescript-and-webpack-6b221ebe5f10
// import("style/dark.styl")
require("./style/dark.styl");


window.onload = function() {
    // var map = L.map('map', {
    //     center: [51.505, -0.09],
    //     zoom: 13,
    //     renderer: L.canvas()
    // });

    // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    //     maxZoom: 18,
    //     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    //     '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    //     'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    //     id: 'mapbox.streets'
    // }).addTo(map);



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