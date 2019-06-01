function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var url = `/metadata/${sample}`;
    d3.json(url).then(function(Data) {
      var sample_metadata = d3.select("#sample-metadata");
      // Use `.html("") to clear any existing metadata
      sample_metadata.html("");
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(Data).forEach(([key, value]) => {
        var row = sample_metadata.append("p");
        row.html(`<strong>${key}</strong>: ${value}`);
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}
)};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var url = `/samples/${sample}`;
    d3.json(url).then(function (sample_data){
      //Building Bubble chart
      // Bubble chart data
      var x_value = sample_data.otu_ids;
      var y_value = sample_data.sample_values;
      var marker_size = sample_data.sample_values;
      var marker_color = sample_data.otu_ids; 
      var text = sample_data.otu_labels;

      // Create Trace
      var trace = {
        x: x_value,
        y: y_value,
        text: text,
        mode: 'markers',
        marker: {
          color: marker_color,
          size: marker_size
        } 
      };
    
      var data = [trace];

      // Layout
      var layout = {
        
        xaxis: {
          title: {
            text: 'OTU ID',
            font: {
              family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          },
        },
        yaxis: {
          title: {
            text: 'Sample Values',
            font: {
              family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          }
        }
      };

      Plotly.newPlot('bubble', data,layout);

    })

      // Building Pie Chart
      d3.json(url).then(function(sample_data) {  

        // Sort the data
        values_raw = sample_data.sample_values;
        labels_raw = sample_data.otu_ids;
        hovertext_raw = sample_data.otu_labels;
    
        values_sorted = values_raw.slice(0).sort().reverse();
        labels_sorted = [];
        hovertext_sorted = [];
    
        for (var i = 0; i<values_sorted.length; i++) {
          labels_sorted.push(labels_raw[values_raw.indexOf(values_sorted[i])]);
          hovertext_sorted.push(hovertext_raw[values_raw.indexOf(values_sorted[i])]);
        }
    
        // Slice the data
        var values = values_sorted.slice(0,10);
        var labels = labels_sorted.slice(0,10);
        var hovertext = hovertext_sorted.slice(0,10);
    
        // var color_list = chroma
        //    .scale(["#fafa6e", "#2A4858"])
        //    .mode("rgb")
        //    .colors(10);
        var colorList = ['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7','#e0e0e0','#bababa','#878787','#4d4d4d','#1a1a1a'];
    
        // Pie chart plot
        var data = [{
          values: values,
          labels: labels,
          hovertext: hovertext,
          type: 'pie',
          hole: .4,
          marker: {
            colors: colorList,
          }  
        }];
    
        var layout = {legend: {
    
          height: 600,
          width: 600,
          x: 5,
          y: 1.1,
          traceorder: 'normal',
          font: {
            family: 'sans-serif',
            size: 8,
            color: '#000'
          },
          bgcolor: '#E2E2E2',
          bordercolor: '#FFFFFF',
          borderwidth: 2
        }};
    
        Plotly.newPlot('pie', data,layout);
    
      })
    
    }

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
