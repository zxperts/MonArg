Highcharts.chart('container', {

    chart: {
        height: 620,
        inverted: false,
        spacing: 8,
        style: {
            fontFamily: 'Oswald, sans-serif'
        },
    },
    title: {
        text: null
    },
    series: [{
        type: 'organization',
        name: 'Highcharts',
        animation: false,
        keys: ['from', 'to'],
        data: [
            ['FICTIF01', 'FICTIF1'],
            ['FICTIF02', 'FICTIF1'],
            ['FICTIF1', 'FICTIF2'],
            ['FICTIF1', 'FICTIF3'],
            ['FICTIF2', 'FICTIF4'],
            ['FICTIF2', 'FICTIF5'],
            ['FICTIF3', 'FICTIF6'],
            ['FICTIF3', 'FICTIF7'],
            ['FICTIF4', 'FICTIF8'],
            ['FICTIF4', 'FICTIF9'],
            ['FICTIF5', 'FICTIF10'],
            ['FICTIF5', 'FICTIF11'],
            ['FICTIF6', 'FICTIF12'],
            ['FICTIF6', 'FICTIF13'],
            ['FICTIF7', 'FICTIF14'],
            ['FICTIF7', 'FICTIF15'],
          ],
        levels: [{
          level: -1
        },{
            level: 0
        }, {
            level: 1
        }, {
            level: 2
        }, {
            level: 3
        }, {
            level: 4
        }, {
            level: 5
        }, {
            level: 6
        }],
        linkColor: '#ccc',
        linkLineWidth: 4,
        linkRadius: 20,
        nodes: [
          {
            "id": "FICTIF02",
            "name": "🇫🇷 France-1 <br> 🇪🇸 Espagne-2",
            color: '#5fb6f2',
            
            "level": 0,
            "info": "Info name 15"
          },
          {
            "id": "FICTIF01",
            "name": "🇫🇷 France-1 <br> 🇪🇸 Espagne-2",
            color: '#5fb6f2',
            
            "level": 0,
            "info": "Info name 15"
          },
            {
              "id": "FICTIF1",
              "name": "🇧🇪 Belgique-1 <br> 🇸🇰 Slovaquie-2",
              "color": "#4682b4",
              "width": 360,
              "level": 1,
              "info": "Info name 1"
            },
            {
              "id": "FICTIF2",
              "name": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Angleterre-1 <br> Portugal-2",
              "color": "#4682b4",
              color: '#4dc9e9',
            level: 2,
              "info": "Info name 2"
            },
            {
              "id": "FICTIF3",
              "name": "🇫🇷 France-1 <br> 🇪🇸 Espagne-2",
              "color": "#4682b4",
              color: '#4dc9e9',
            level: 2,
              "info": "Info name 3"
            },
            {
              "id": "FICTIF4",
              "name": "🇮🇹 Italie-1 <br> 🇩🇪 Allemagne-2",
              color: '#4dc9e9',
              
              "level": 2,
              "info": "Info name 4"
            },
            {
              "id": "FICTIF5",
              "name": "🇲🇦 Maroc-1 <br> 🇭🇷 Croatie-2",
              color: '#4dc9e9',
              
              "level": 2,
              "info": "Info name 5"
            },
            {
              "id": "FICTIF6",
              "name": "🇦🇷 Argentine-1 <br> 🇫🇷 France-2",
              color: '#4dc9e9',
              
              "level": 2,
              "info": "Info name 6"
            },
            {
              "id": "FICTIF7",
              "name": "🇧🇪 Belgique-1 <br> 🇸🇰 Slovaquie-2",
              color: '#4dc9e9',
              
              "level": 2,
              "info": "Info name 7"
            },
            {
              "id": "FICTIF8",
              "name": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Angleterre-1 <br> Portugal-2",
              color: '#5fb6f2',
              
              "level": 3,
              "info": "Info name 8"
            },
            {
              "id": "FICTIF9",
              "name": "🇫🇷 France-1 <br> 🇪🇸 Espagne-2",
              color: '#5fb6f2',
              "level": 3,
              "info": "Info name 9"
            },
            {
              "id": "FICTIF10",
              "name": "🇮🇹 Italie-1 <br> 🇩🇪 Allemagne-2",
              color: '#5fb6f2',
              
              "level": 3,
              "info": "Info name 10"
            },
            {
              "id": "FICTIF11",
              "name": "🇲🇦 Maroc-1 <br> 🇭🇷 Croatie-2",
              color: '#5fb6f2',
              
              "level": 3,
              "info": "Info name 11"
            },
            {
              "id": "FICTIF12",
              "name": "🇦🇷 Argentine-1 <br> 🇫🇷 France-2",
              color: '#5fb6f2',
              
              "level": 3,
              "info": "Info name 12"
            },
            {
              "id": "FICTIF13",
              "name": "🇧🇪 Belgique-1 <br> 🇸🇰 Slovaquie-2",
              color: '#5fb6f2',
              
              "level": 3,
              "info": "Info name 13"
            },
            {
              "id": "FICTIF14",
              "name": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Angleterre-1 <br> Portugal-2",
              color: '#5fb6f2',
              
              "level": 3,
              "info": "Info name 14"
            },
            {
              "id": "FICTIF15",
              "name": "🇫🇷 France-1 <br> 🇪🇸 Espagne-2",
              color: '#5fb6f2',
              
              "level": 3,
              "info": "Info name 15"
            }
          ],
        colorByPoint: false,
        color: '#007ad0',
        shadow: {
            color: '#d1d1d1',
            width: 8,
            offsetX: 0,
            offsetY: 4
        },
        borderColor: null,
        borderRadius: 0,
        nodeWidth: 65,
        nodePadding: 20
    }],
    tooltip: {
        outside: true,
        backgroundColor: '#666',
        borderColor: '#666',
        borderRadius: 2,
        style:{
            color: '#fff',
            cursor: 'default',
            fontSize: '14px',
            lineHeight: '22px',
        },
        formatter: function() {
            return this.point.info;
        }
    },

});
