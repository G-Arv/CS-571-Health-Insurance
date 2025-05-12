function createBarChart2(state) {
    let color = d3.scaleOrdinal(["hotpink", "royalblue"]);
    const data = d3.csv(`data2/healthInsurance.csv`).then(output => {
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
        let barChart = d3.selectAll("#bar-chart2");
        const width = 500;
        const height = 500;
        const margin = { left: 60, bottom: 30, top: 30, right: 30 };
        barChart.append("rect").attr("width", height).attr("height", width).style("stroke", "none").style("fill", "lightblue");
        const barSearch = ["Medicaid_Enrollment_(2013)", "Medicaid_Enrollment_(2016)"];
        const barSearchCleaned = ["Medicaid Enrollment (2013)", "Medicaid Enrollment (2016)"];
        let data13 = parseInt(data[barSearch[0]]);
        let data16 = parseInt(data[barSearch[1]]);
        let scale = Math.pow(10, (Math.min(data13, data16).toString().length - 1));
        const barData = [Math.log(data13/scale), Math.log(data16/scale)];
        let max = Math.round(Math.max(...barData));
        let xScale = d3.scaleBand().domain(barSearchCleaned).range([margin.left, width - margin.right]);
        let yScale = d3.scaleLinear().domain([0, max]).range([height - margin.top, margin.bottom]);
        let xAxis = d3.axisBottom().tickValues(barSearchCleaned);
        xAxis.scale(xScale);
        let yAxis = d3.axisLeft().ticks(10);
        yAxis.scale(yScale);

        // Append axes to bar chart
        barChart.append("g").attr("transform", `translate(0, ${height - margin.bottom})`).call(xAxis);
        barChart.append("g").attr("transform", `translate(${margin.left}, 0)`).call(yAxis);
        let barWidth = Math.floor((width - margin.left - margin.right)/4);  // Create bars

        barChart.append('g').attr("class", "barChart").selectAll(".barChart").data(barData).enter().append("rect").style("fill", (d, i) => color(i))
                .merge(barChart).attr("x", (d, i) => i * barWidth * 2 + margin.right * 3.75).attr("y", (d, i) => yScale(d)).attr("width", barWidth)
                .attr("height", d => height - yScale(d) - margin.bottom).attr("opacity", 1);
        
        // Add label for y axis
        barChart.append("text").attr("class", "yAxisLabel").attr("text-anchor", "end").attr("y", 5).attr("dy", "0.75em")
            .attr("transform", "rotate(-90)").text("Natural Log of Patients Enrolled in Medicaid")

    }
}

function createPieChart(state) {
    let color = d3.scaleOrdinal(["dodgerblue", "royalblue"]);
    d3.csv(`data/alldata.csv`).then(output => {
        let uninsuredSum = 0;
        let insuredSum = 0;
        let count = 0;

        for (let i = 0; i < output.length; ++i) {
            if (output[i].Location == state) {
                let uninsured = parseFloat(output[i]["Uninsured"]);
                let total = parseFloat(output[i]["Total"]);
                if (!isNaN(uninsured) && !isNaN(total)) {
                    let insured = total - uninsured;
                    uninsuredSum += uninsured;
                    insuredSum += insured;
                    count++;
                }
            }
        }

        if (count > 0) { 
            uninsuredavg = uninsuredSum / count;
            insuredavg = insuredSum / count;
            makePie([uninsuredavg, insuredavg]); 
        }
    });

    function makePie(pieData) {
        let svg = d3.select("#pie-chart");
        svg.selectAll("*").remove(); 
        const width = 500;
        const height = 500;
        const radius = Math.min(width, height) / 4;
        let g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        let pie = d3.pie();
        let arc = d3.arc().innerRadius(0).outerRadius(radius);
        let arcs = g.selectAll("arc").data(pie(pieData)).enter().append("g").attr("class", "arc");
        arcs.append("path").attr("fill", (d, i) => color(i)).attr("d", arc);
        let legend = svg.selectAll(".legend").data(pie(pieData)).enter().append("g")
            .attr("transform", (d, i) => "translate(" + (width / 4) + "," + (i * 15 + 400) + ")").attr("class", "legend");
        legend.append("rect").attr("width", 15).attr("height", 15).attr("fill", (d, i) => color(i));
        legend.append("text").text((d, i) => i === 0 ? "Uninsured State Average" : "Insured State Average").style("font-size", 15)
        .attr("y", 10).attr("x", 20);
    }
}


function createBarChart(state) {
    const svg = d3.select("#bar-chart");
    svg.selectAll("*").remove(); // Clear bar old charts
    const margin = { top: 40, right: 20, bottom: 50, left: 70 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const keys = ["Employer Only","Non-group Only","Medicaid and Private Insurance","Medicaid and Medicare",
        "Medicaid Only","Medicare and Private Insurance","Medicare Only","Military"];
    const color = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory10);
    d3.csv("data/alldata.csv").then(data => {
        const filtered = data.filter(d => d.Location === state); // Filter by selected state
        filtered.forEach(d => {keys.forEach(key => d[key] = +d[key]); d.Year = d.Year;});
        const stackedData = d3.stack().keys(keys)(filtered);  // Stack the data
        const x = d3.scaleBand().domain(filtered.map(d => d.Year)).range([0, width]).padding(0.2); //by year
        const y = d3.scaleLinear().domain([0, d3.max(filtered, d => {return keys.reduce((sum, key) => sum + d[key], 0);})]).nice()
        .range([height, 0]); //total
        g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        g.append("g").call(d3.axisLeft(y));
        g.selectAll("g.layer").data(stackedData).enter().append("g").attr("fill", d => color(d.key)).selectAll("rect")
            .data(d => d).enter().append("rect").attr("x", d => x(d.data.Year)).attr("y", d => y(d[1])).attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth());  // Draw bars
        const legend = svg.append("g").attr("transform", `translate(${width + margin.left + 10},${margin.top})`); //legend
        keys.forEach((key, i) => {
            const row = legend.append("g").attr("transform", `translate(0,${i * 20})`);
            row.append("rect").attr("width", 15).attr("height", 20).attr("fill", color(key));
            row.append("text").attr("x", 20).attr("y", 12).text(key).style("font-size", "15px");
        });
    });
}

let currState = ""; 
createPieChart(currState);
createBarChart(currState);
createBarChart2(currState);

function createLine() {
    d3.csv("data3/alldata2.csv").then(data => {
        data.forEach(d => { d.Year =+ d.Year; d.Value =+ d["Total Health Spending"]; });
        const svg = d3.select("#line-chart"), margin = {top: 20, right: 30, bottom: 50, left: 60},
            width =+ svg.attr("width") - margin.left - margin.right, height =+ svg.attr("height") - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const line = d3.line().x(d => x(d.Year)).y(d => y(d.Value));
        const allStates = Array.from(new Set(data.map(d => d.Location))).sort();
        const stateData = d3.groups(data, d => d.Location).map(([key, values]) => ({state: key, values: values.sort((a, b) => a.Year - b.Year)
        }));

        x.domain(d3.extent(data, d => d.Year));
        y.domain([0, d3.max(data, d => d.Value)]);
        g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
        g.append("g").call(d3.axisLeft(y));

        //ChatGPT(LLM) By OpenAI was used to create the state selecting line functionality for the line graph when the user clicks a state's check box the line for that state appears
        //“Checkbox Toggle for D3 Chart”. ChatGPT, 9 May 2025, OpenAI, March 2023, chat.openai.com.
        const checkContainer = d3.select("#checkbox-container"); //check box for each state
        allStates.forEach(state => {
            checkContainer.append("label").html(`<input type="checkbox" value="${state}"> ${state}`).on("change", updateChart);
        });

        function updateChart() {
            //ChatGPT(LLM) By OpenAI was used to create the state selecting line functionality for the line graph when the user clicks a state's check box the line for that state appears
        //“Checkbox Toggle for D3 Chart”. ChatGPT, 9 May 2025, OpenAI, March 2023, chat.openai.com.
            const selected = Array.from(document.querySelectorAll("#checkbox-container input[type=checkbox]:checked")).map(d => d.value);
            const filtered = stateData.filter(d => selected.includes(d.state));
            const lines = g.selectAll(".line").data(filtered, d => d.state);
            
            lines.enter().append("path") //lines
                .attr("class", "line").attr("fill", "none").attr("stroke", d => color(d.state)).attr("stroke-width", 2).merge(lines)
                .transition().duration(500).attr("d", d => line(d.values));

            lines.exit().remove();

            const legendContainer = d3.select("#legend");
            legendContainer.selectAll("*").remove(); 

            filtered.forEach(d => {
                const item = legendContainer.append("div").attr("class", "legend-item");
                item.append("div").attr("class", "legend-color").style("background-color", color(d.state));
                item.append("span").text(d.state);
            });
        }

    });


}