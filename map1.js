mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 3.5, // starting zoom
        center: [-95.5, 39.5] // starting center
    }
);

async function geojsonFetch() { 
    // other operations
    let response = await fetch('us-covid-2020-rates.json');
let covidData = await response.json();

map.on('load', function loadingData() {
    // add layer
    map.addSource('covidData', {
        type: 'geojson',
        data: covidData
    });
    
    map.addLayer({
        'id': 'covidData-layer',
        'type': 'fill',
        'source': 'covidData',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'rates'],
                '#FFEDA0',   // stop_output_0
                10,          // stop_input_0
                '#FED976',   // stop_output_1
                20,          // stop_input_1
                '#FEB24C',   // stop_output_2
                50,          // stop_input_2
                '#FD8D3C',   // stop_output_3
                100,         // stop_input_3
                '#FC4E2A',   // stop_output_4
                200,         // stop_input_4
                '#E31A1C',   // stop_output_5
                500,         // stop_input_5
                '#BD0026',   // stop_output_6
                1000,        // stop_input_6
                "#800026"    // stop_output_7
            ],
            'fill-outline-color': '#BBBBBB',
            'fill-opacity': 0.7,
        }
    });
    // add legend
    const layers = [
        '0-0.002',
        '0.003-0.005',
        '0.006-0.009',
        '0.01-0.02',
        '0.03-0.04',
        '0.05-0.06',
        '0.07 and more'
    ];
    const colors = [
        '#FFEDA070',
        '#FED97670',
        '#FEB24C70',
        '#FD8D3C70',
        '#FC4E2A70',
        '#E31A1C70',
        '#BD002670'
    ];
    const legend = document.getElementById('legend');
legend.innerHTML = "<b>COVID Death Rate Per Case<br></b><br><br>";

layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    const value = document.createElement('span');
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
});
map.on('mousemove', ({point}) => {
    const covid = map.queryRenderedFeatures(point, {
        layers: ['covidData-layer']
    });
    document.getElementById('text-description').innerHTML = covid.length ?
        `<h3>${covid[0].properties.county} County</h3><p><strong><em>${(covid[0].properties.deaths/covid[0].properties.cases)}</strong> deaths per case</em></p>` :
        `<p>Hover over a county!</p>`;
});
});
}

geojsonFetch();
