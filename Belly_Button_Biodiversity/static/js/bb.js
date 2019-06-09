function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  let url = `/metadata/${sample}`;

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function (response) {
    let panel = d3.select('#sample-metadata').html("");

    Object.entries(response).forEach(([key, value]) => {
      let cell = panel.append('tr')
      cell.text(`${key}: ${value}`);
    })
  })
  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let url = `/samples/${sample}`
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(url).then(function (response) {

    var bubble = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: { size: response.sample_values, color: response.otu_ids }
    };

    var bubble = [bubble]

    var layout = {
      title: 'Belly Button Bacteria'
    };

    Plotly.newPlot('bubble', bubble, layout)
  })

  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
  d3.json(url).then(function (response) {

    response.sample_values.sort((first, second) => second - first);

    var data = [{
      values: response.sample_values.slice(0, 10),
      labels: response.otu_ids.slice(0, 10),
      type: 'pie',
      hole: .4,
      name: response.otu_labels.slice(0, 10)
    }];
    var layout = {
      title: "Bacteria Frequency"
    }

    Plotly.newPlot('pie', data, layout)
  });
};


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
