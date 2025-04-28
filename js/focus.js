// This is where the code for the focus parts will be
// TODO: fix the frontend to include this script from the start

// Creates a pie chart for the given state
// Parameters: state (string) - a given state
function createPieChart(state) {
    let color = d3.scaleOrdinal(["#264653", "#f4a261"]);

    const data = d3.csv(`data/healthInsurance.csv`).then(output => {
        for(let i = 0; i < output.length; ++i) {
            if(output[i].State == state) {
                console.log(output[i])
                makePie(output[i])
                break;
            }
        }
    });

    // Makes the pie specifically
    // Parameters: data (object) - the data for a given state
    function makePie(data) {
        const pieSearch = ["Marketplace_Health_Insurance_Coverage_(2016)", "Marketplace_Tax_Credits_(2016)"]
        const pieData = [data[pieSearch[0]], data[pieSearch[1]]];
        
        let svg = d3.select("#pie-chart")
        const width = 500;
        const height = 500;
        const radius = Math.min(width, height) / 4;
        let g = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Creates the pie
        let pie = d3.pie();

        // Generates the arcs
        let arc = d3.arc()
                     .innerRadius(0)
                     .outerRadius(radius);
    
        // Generate the groups for the arcs
        let arcs = g.selectAll("arc")
                    .data(pie(pieData))
                    .enter()
                    .append("g")
                    .attr("class", "arc");
        
        arcs.append("path")
            .attr("fill", (d, i) => {
                return color(i);
            })
            .attr("d", arc);
        
        // Creates a legend for the pie chart
        let legend = svg.selectAll(".legend")
                        .data(pie(pieData))
                        .enter()
                        .append("g")
                        .attr("transform", (d, i) => {
                            return "translate(" + (width/4) + "," + (i*15+400) + ")";
                        })
                        .attr("class", "legend");

        legend.append("rect")
              .attr("width", 15)
              .attr("height", 15)
              .attr("fill", (d, i) => {
                return color(i)
              });
        
        legend.append("text")
              .text(((d, i) => {
                  return pieSearch[i].replaceAll("_", " ")
              }))
              .style("font-size", 12)
              .attr("y", 10)
              .attr("x", 20);
    }

}

// TODO: to replace the table, we can compare medicaid enrollment
//       via a bar chart I guess,

// This is temporarily set to Massachusetts, it does look the same for different states...
createPieChart("Massachusetts");