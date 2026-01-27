function vis1() {
    const title = "High adolescent fertility persists in the region despite global trends";
    const subtitle = "Adolescent fertility rate per 1,000 women aged 15-19 years, South American countries, 2024";
    const source = "Source: UNFPA - Socioeconomic Consequences of Adolescent Pregnancy in LAC (2025)";

    d3.select("#title1").html(title);
    d3.select("#subtitle1").html(subtitle);
    d3.select("#source1").html(source);

    const width = 750;
    const height = 300;
    const margin = {
        left: 90,
        top: 60,
        right: 16,
        bottom: 20
    }

    const svg = d3.select("#vis1")
        .append('svg')
        .attr("height", height)
        .attr('width', width)
        .attr("viewbox", `0 0 ${width} ${height}`);

    Promise.all([
        d3.csv("./data/vis1.csv")
    ])
    .then(rawData => {

        const data = rawData[0];

        data.forEach(d => {
            d.Value = +d.Value;
        });

        const barData = data.filter(d => d.Type === 'country');
        const lineData = data.filter(d => d.Type === 'average');
        const countries = getUniques(barData, "Country");
        console.log(countries)

        const xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleBand()
            .domain(countries)
            .range([margin.top, height - margin.bottom])
            .paddingInner(0.15);

        const xAxis = svg.append('g')
            .attr('class', "x-axis axis")
            .attr("transform", `translate(0, ${margin.top - 20})`);

        const xTicks = [0, 20, 40, 60, 80, 100]
        
        xAxis.append("line")
            .attr("x1", xScale(xTicks[0]))
            .attr("x2", xScale(xTicks[xTicks.length - 1]))
            .attr("y1", 0)
            .attr("y2", 0)

        xAxis.selectAll(".tick-label")
            .data(xTicks)
            .join("text")
                .attr("class", "tick-label")
                .attr("text-anchor", "middle")
                .attr("x", d => xScale(d))
                .attr("y", -5)
                .text(d => `${d}`)

        const gCountries = svg.selectAll(".country")
            .data(barData)
            .join("g")
                .attr("class", "country")
                .attr("transform", d => `translate(0, ${yScale(d.Country)})`);

        gCountries.selectAll(".country-name")
            .data(d => [d])
            .join("text")
                .attr("class", "country-name")
                .style("font-size", "14px")
                .style("font-weight", d => d.Country === "Peru" ? 700 : 400)
                .attr("text-anchor", "start")
                .attr("x", 0)
                .attr("y", yScale.bandwidth() - 5)
                .text(d => d.Country)

        gCountries.selectAll(".country-bar")
            .data(d => [d])
            .join("rect")
                .attr("class", "country-bar")
                .attr("fill", d => d.Country === "Peru" ? orange : gray)
                .attr("x", xScale(0))
                .attr("y", 0)
                .attr("width", d => xScale(d.Value) - xScale(0))
                .attr("height", yScale.bandwidth())
                .text(d => d.Country)

        gCountries.selectAll(".country-number")
            .data(d => [d])
            .join("text")
                .attr("class", "country-name")
                .style("font-size", "14px")
                .style("font-weight", d => d.Country === "Peru" ? 700 : 400)
                .style("fill", d => d.Country === "Peru" ? orange : gray)
                .attr("text-anchor", "start")
                .attr("x", d => xScale(d.Value) + 6)
                .attr("y", yScale.bandwidth() - 5)
                .text(d => d.Country === "Peru" ? `${d.Value}` : '')


        const gAverages = svg.selectAll(".average")
            .data(lineData)
            .join("g")
                .attr("class", "average")
                .attr("transform", d => `translate(${xScale(d.Value)}, 0)`);

        gAverages.selectAll(".average-line")
            .data(d => [d])
            .join("line")
                .attr("class", "average-line")
                .attr("stroke", black)
                .attr("stroke-width", "0.5px")
                .attr("x1", 0)
                .attr("x2", 0)
                .attr("y1", yScale.range()[0] - 20)
                .attr("y2", yScale.range()[1]);

        gAverages.selectAll(".average-text")
            .data(d => [d])
            .join("text")
                .attr("class", "average-text")
                .style("font-size", "12px")
                .style("font-weight", 400)
                .style("fill", black)
                .attr("text-anchor", "start")
                .attr("x", 6)
                .attr("y", yScale.range()[1])
                .text(d => d.Country)
    })
}

vis1();