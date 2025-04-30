// Creates a pie chart for the given state
// Parameters: state (string) - a given state
function createPieChart(state) {
    let color = d3.scaleOrdinal(["#264653", "#f4a261"]);

    const data = d3.csv(`data/healthInsurance.csv`).then(output => {
        for(let i = 0; i < output.length; ++i) {
            if(output[i].State == state) {
                makePie(output[i])
                break;
            }
        }
    });

    // Makes the pie specifically
    // Parameters: data (object) - the data for a given state
    function makePie(data) {
        const pieSearch = ["Marketplace_Health_Insurance_Coverage_(2016)", "Marketplace_Tax_Credits_(2016)"];
        const pieData = [data[pieSearch[0]], data[pieSearch[1]]];
        
        let svg = d3.select("#pie-chart");
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
            .attr("fill", (d, i) => color(i))
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

// Creates the bar chart for Medicaid information for a given state
// Parameters: state (string) - a given state
function createBarChart(state) {
    let color = d3.scaleOrdinal(["#363653", "#fb9259"]);

    const data = d3.csv(`data/healthInsurance.csv`).then(output => {
        for(let i = 0; i < output.length; ++i) {
            let currState = output[i].State
            if(currState == state && currState != "Maine" && currState != "Connecticut") {
                makeBar(output[i])
                break;
            }
        }
    });

    // Makes the bar chart specifically
    // Parameters: data (object) - the data for a given state
    function makeBar(data) {
        let barChart = d3.selectAll("#bar-chart");

        const width = 500;
        const height = 500;
        const margin = { left: 60, bottom: 30, top: 30, right: 30 };

        barChart.append("rect") 
                .attr("width", height)
                .attr("height", width)
                .style("stroke", "none")
                .style("fill", "lightblue");
        
        const barSearch = ["Medicaid_Enrollment_(2013)", "Medicaid_Enrollment_(2016)"];
        const barSearchCleaned = ["Medicaid Enrollment (2013)", "Medicaid Enrollment (2016)"];
        let data13 = parseInt(data[barSearch[0]]);
        let data16 = parseInt(data[barSearch[1]]);

        let scale = Math.pow(10, (Math.min(data13, data16).toString().length - 1));
        const barData = [Math.log(data13/scale), Math.log(data16/scale)];

        let max = Math.round(Math.max(...barData));

        let xScale = d3.scaleBand()
                        .domain(barSearchCleaned)
                        .range([margin.left, width - margin.right]);

        let yScale = d3.scaleLinear()
                        .domain([0, max])
                        .range([height - margin.top, margin.bottom]);

        let xAxis = d3.axisBottom().tickValues(barSearchCleaned);
        xAxis.scale(xScale);

        let yAxis = d3.axisLeft().ticks(10);
        yAxis.scale(yScale);

        // Append axes to bar chart
        barChart.append("g")
                .attr("transform", `translate(0, ${height - margin.bottom})`)
                .call(xAxis);

        barChart.append("g")
                .attr("transform", `translate(${margin.left}, 0)`)
                .call(yAxis);

        
        // Create bars
        let barWidth = Math.floor((width - margin.left - margin.right)/4);

        barChart.append('g')
                .attr("class", "barChart")
                .selectAll(".barChart")
                .data(barData)
                .enter()
                .append("rect")
                .style("fill", (d, i) => color(i))
                .merge(barChart)
                .attr("x", (d, i) => i * barWidth * 2 + margin.right * 3.75)
                .attr("y", (d, i) => yScale(d))
                .attr("width", barWidth)
                .attr("height", d => height - yScale(d) - margin.bottom)
                .attr("opacity", 1);
        
        // Add label for y axis
        barChart.append("text")
            .attr("class", "yAxisLabel")
            .attr("text-anchor", "end")
            .attr("y", 5)
            .attr("dy", "0.75em")
            .attr("transform", "rotate(-90)")
            .text("Natural Log of Patients Enrolled in Medicaid")

    }
}

// This is temporarily set to Massachusetts
let currState = "Massachusetts"
createPieChart(currState);
createBarChart(currState)