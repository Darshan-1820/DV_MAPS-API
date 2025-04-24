let map;
let chart;
let data = [
  {
    city: "New York",
    lat: 40.7128,
    lng: -74.006,
    population: 8419000,
    gdp: 1.5,
  },
  { city: "London", lat: 51.5074, lng: -0.1278, population: 8982000, gdp: 1.2 },
  {
    city: "Tokyo",
    lat: 35.6762,
    lng: 139.6503,
    population: 13960000,
    gdp: 1.9,
  },
  { city: "Mumbai", lat: 19.076, lng: 72.8777, population: 12440000, gdp: 0.4 },
];

// Initialize Map
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 20, lng: 0 },
    zoom: 2,
  });

  // Add Markers
  data.forEach((location) => {
    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      title: location.city,
    });

    // Add Info Window
    const infowindow = new google.maps.InfoWindow({
      content: `<h3>${location.city}</h3>
                     <p>Population: ${location.population.toLocaleString()}</p>
                     <p>GDP: $${location.gdp.toLocaleString()}T</p>`,
    });

    marker.addListener("click", () => {
      infowindow.open(map, marker);
      // Highlight corresponding chart data
      chart.setSelection([{ row: data.indexOf(location) }]);
    });
  });

  // Initialize Chart
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
}

// Draw Chart
function drawChart() {
  const chartData = new google.visualization.DataTable();
  chartData.addColumn("string", "City");
  chartData.addColumn("number", "Population");
  chartData.addColumn("number", "GDP (Trillion USD)");

  data.forEach((location) => {
    chartData.addRow([location.city, location.population, location.gdp]);
  });

  const options = {
    title: "City Statistics",
    chartArea: { width: "60%" },
    hAxis: { title: "Population", minValue: 0 },
    vAxis: { title: "City" },
    bars: "horizontal",
    height: 400,
    colors: ["#4285F4", "#34A853"],
  };

  chart = new google.visualization.BarChart(document.getElementById("chart"));
  chart.draw(chartData, options);

  // Add Chart Selection Handler
  google.visualization.events.addListener(chart, "select", () => {
    const selection = chart.getSelection();
    if (selection.length > 0) {
      const row = selection[0].row;
      const location = data[row];
      map.panTo({ lat: location.lat, lng: location.lng });
      map.setZoom(8);
    }
  });
}
