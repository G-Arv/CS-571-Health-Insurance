function drawMap() {
    const mapWidth = 960;
    const mapHeight = 600;
    const svg = d3.select("#map").append("svg").attr("width", mapWidth).attr("height", mapHeight);
    const projection = d3.geoAlbersUsa().translate([mapWidth / 2, mapHeight / 2]).scale(1000);
    const path = d3.geoPath().projection(projection);

    let tooltip = d3.select(".tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body")
            .append("div").attr("class", "tooltip").style("opacity", 0).style("position", "absolute").style("background", "#eee")
            .style("padding", "6px").style("border", "1px solid #aaa");
    }

    Promise.all([d3.json("us-states.json"), d3.csv("healthInsurance.csv")
    ]).then(([us, data]) => {
        const insuranceByStates = {};
        data.forEach(d => { insuranceByStates[d.state] = +d.insured; });
        const color = d3.scaleQuantize().domain([d3.min(Object.values(insuranceByStates)), d3.max(Object.values(insuranceByStates))]).range(d3.schemeBlues[9]);
        svg.append("g").selectAll("path").data(us.features).join("path").attr("d", path)
            .attr("fill", d => {
                const name = d.properties.name;
                return insuranceByStates[name] ? color(insuranceByStates[name]) : "#ccc";
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .on("mouseover", function(event, d) {
                const name = d.properties.name;
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`${name}<br/>Insured: ${insuranceByStates[name] ?? 'N/A'}%`)
                    .style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px");
            }).on("mouseout", () => tooltip.transition().duration(300).style("opacity", 0));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    drawMap();
});
