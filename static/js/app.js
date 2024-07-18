// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    // Filter the metadata for the object with the desired sample number
    // the first index of the array is needed
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let metadata = data.metadata;
    let mdresults = metadata.filter(sampleNum => sampleNum.id == sample);
    let idResults = mdresults[0];
    let smpanel =d3.select('#sample-metadata');
    smpanel.html("");
    Object.entries(idResults).forEach(([key, value]) =>{
      console.log(key, value);
      smpanel.append("div").text(`${key}: ${value}`)

    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    // Filter the samples for the object with the desired sample number
    // Get the otu_ids, otu_labels, and sample_values
    let sampleValues = data.samples;
    let sampleFr = sampleValues.filter(material => material.id == sample);
    let sampleAll = sampleFr[0];

    let otu_ids = sampleAll.otu_ids;
    let otu_labels = sampleAll.otu_labels;
    let sample_values = sampleAll.sample_values;


    // Build a Bubble Chart
    // Render the Bubble Chart
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let scaledSizes = sample_values.map(size => size * 10);
    let traceOne = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      markers: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };
    let bData = [traceOne];
    let bLayout = {
 
      title: "Bacteria Cultures per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      autosize: true
    };
    Plotly.newPlot("bubble", bData, bLayout);

    
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    // Render the Bar Chart
    let barYaxis = otu_ids.slice(0, 10).reverse().map(otuID => `OTU ${otuID}`);
    let barXaxis = sample_values.slice(0, 10).reverse();
    let bartext = otu_labels.slice(0, 10).reverse();
    let barSetup = {
      x: barXaxis,
      y: barYaxis,
      text: bartext,
      type: "bar",
      orientation: "h"
    };
    let barTitles = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
      margin: { t: 30, l: 150 }
    };
    Plotly.newPlot("bar", [barSetup], barTitles);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    // Use d3 to select the dropdown with id of `#selDataset`
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    // Get the first sample from the list
    let names = data.names
    let dd = d3.select("#selDataset");
    names.forEach((name) => {
      dd.append("option").text(name).property("value", name);
    });
    let stSample = names[0];
    buildCharts(stSample);
    buildMetadata(stSample);

    // Build charts and metadata panel with the first sample

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialize the dashboard
init();
