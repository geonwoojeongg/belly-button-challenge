const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// check objects
d3.json(url).then(function(data) {
  console.log(data);  
});

// init
function init() {

  let dropdownMenu = d3.select("#selDataset");

  d3.json(url).then((data) => {
      let names = data.names;

      names.forEach((id) => {
        dropdownMenu.append("option")
        .text(id)
        .property("value",id);
      });

      let sample1 = names[0];

      Metadata(sample1);
      BarChart(sample1);
      BubbleChart(sample1);
  });
};

// bar chart
function BarChart(sample) {

  d3.json(url).then((data) => {

      let sampledata = data.samples;
      let value = sampledata.filter(info => info.id == sample);
      let sampleinfo = value[0];

      let otu_ids = sampleinfo.otu_ids;
      let otu_labels = sampleinfo.otu_labels;
      let sample_values = sampleinfo.sample_values;

      let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
      let xticks = sample_values.slice(0,10).reverse();
      let labels = otu_labels.slice(0,10).reverse();
      
      let trace1 = {
          x: xticks,
          y: yticks,
          text: labels,
          type: "bar",
          orientation: "h"
      };

      let layout = {
          title: "Top 10 OTUs Found"
      };

      Plotly.newPlot("bar", [trace1], layout)
  });
};

// bubble chart
function BubbleChart(sample) {
  d3.json(url).then((data) => {
      
      let sampledata = data.samples;
      let value = sampledata.filter(info => info.id == sample);
      let sampleinfo = value[0];

      let otu_ids = sampleinfo.otu_ids;
      let otu_labels = sampleinfo.otu_labels;
      let sample_values = sampleinfo.sample_values;

      let trace2 = {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Earth"
          }
      };

      let layout = {
          hovermode: "closest",
          xaxis: {title: "OTU ID"},
      };

      Plotly.newPlot("bubble", [trace2], layout)
  });
};

// metadata
function Metadata(sample) {

  d3.json(url).then((data) => {

      let metadata = data.metadata;
      let value = metadata.filter(info => info.id == sample);
      let sampleinfo = value[0];

      d3.select("#sample-metadata").html("");

      Object.entries(sampleinfo).forEach(([key,value]) => {
          d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });
  });

};

// call functions
function optionChanged(value) { 

  Metadata(value);
  BarChart(value);
  BubbleChart(value);
};

init();
