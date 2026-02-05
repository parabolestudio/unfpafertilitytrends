function vis5(inEn) {
    const title = inEn
        ? "Adolescents face a significantly higher risk of sexual violence than adult women"
        : "Las adolescentes enfrentan un riesgo de violencia sexual significativamente mayor que las mujeres adultas";
    const subtitle = inEn
        ? "Share of women who experienced physical or sexual violence in the past 12 months"
        : "Porcentaje de mujeres que experimentaron violencia física o sexual en los últimos 12 meses";
    const source = inEn
        ? "Source: INEI - ENDES"
        : "Fuente: INEI - ENDES";
    const calloutTitle = inEn
        ? "The gap"
        : "La brecha";
    const calloutParagraph = inEn
        ? "Violence against adolescents is nearly twice as high as the overall rate"
        : "La violencia contra las adolescentes es casi el doble que la tasa general";
    const legendTitle = inEn
        ? "Age group"
        : "Grupo de edad";
    const legendItem1 = inEn
        ? "15 to 49"
        : "15 a 49";
    const legendItem2 = inEn
        ? "15 to 19"
        : "15 a 19";

    d3.select("#title5").html(title);
    d3.select("#subtitle5").html(subtitle);
    d3.select("#source5").html(source);
    d3.select(".callout-title").html(calloutTitle);
    d3.select(".callout-p").html(calloutParagraph);
    d3.select("#legend-title").html(legendTitle);
    d3.select("#legend-item-1").html(legendItem1);
    d3.select("#legend-item-2").html(legendItem2);

    const wrapper = d3.select(".wrapper");
    const tooltip = d3.select(".tooltip");

    const width = isMobile ? 0.9 * window.innerWidth - 40 : 534;
    const height = 376;
    const margin = {
        left: 35,
        top: 10,
        right: 60,
        bottom: 20
    }

    const svg = d3.select("#vis5")
        .append('svg')
        .attr("height", height)
        .attr('width', width)
        .attr("viewbox", `0 0 ${width} ${height}`);

    d3.select("#bubble5")
        .style("top", isMobile ? "380px" : "230px")
        .style("left", isMobile ? `${window.innerWidth - 140}px` : "460px");

    Promise.all([
        d3.csv("./data/vis5.csv")
    ])
    .then(rawData => {

        const data = rawData[0];

        data.forEach(d => {
            d.value = +d.value;
        });

        const years = getUniques(data, "year");
        const yTicks = [0, 5, 10, 15, 20, 25];
        const yExtent = [yTicks[0], yTicks[yTicks.length - 1]];
        const rectWidth = 14;

        const xScale = d3.scalePoint()
            .domain(years)
            .range([margin.left, width - margin.right])
            .padding(1);

        const yScale = d3.scaleLinear()
            .domain(yExtent)
            .range([height - margin.bottom, margin.top]);

        const yAxis = svg.append('g')
            .attr('class', "y-axis axis")
            .attr("transform", `translate(${margin.left}, 0)`);

        yAxis.append("line")
            .attr("y1", yScale(yExtent[0]))
            .attr("y2", yScale(yExtent[1]))
            .attr("x1", 0)
            .attr("x2", 0)

        yAxis.selectAll(".tick-label")
            .data(yTicks)
            .join("text")
                .attr("class", "tick-label")
                .attr("text-anchor", "begin")
                .attr("y", d => yScale(d) + 5)
                .attr("x", -margin.left)
                .text(d => d === 25 ? `${d}%` : `${d}`);

        const xAxis = svg.append('g')
            .attr('class', "x-axis axis");

        xAxis.selectAll(".xtick-label")
            .data(years)
            .join("text")
                .attr("class", "xtick-label")
                .attr("text-anchor", "middle")
                .style("font-family", "Atkinson Hyperlegible")
                .style("color", black)
                .style("opacity", 1)
                .attr("y", yScale(0) + margin.bottom)
                .attr("x", d => xScale(d))
                .text(d => `${d}`);

        const gYears = svg.selectAll(".year")
            .data(years)
            .join("g")
                .attr("class", "year")
                .attr("transform", d => `translate(${xScale(d)}, 0)`);

        gYears.selectAll(".year-line")
            .data(d => [d])
            .join("line")
                .attr("class", "year-line")
                .attr("y1", yScale(yExtent[0]))
                .attr("y2", yScale(yExtent[1]))
                .attr("x1", 0)
                .attr("x2", 0)
                .attr("stroke", black)
                .attr("stroke-width", "0.5px");


        gYears.selectAll(".year-rect")
            .data(d => [Object.fromEntries(
                data.filter(datum => datum.year === d).map(datum => [datum.age, datum.value])
            )])
            .join("rect")
                .attr("class", "year-rect")
                .attr("fill", lightorange)
                .style("opacity", 0.4)
                .attr("x", -rectWidth/2)
                .attr("y", d => yScale(d['15 to 19']))
                .attr("width", rectWidth)
                .attr("height", d => yScale(d['15 to 49']) - yScale(d['15 to 19']))
                .on("mousemove", (evt, d) => {
                    const [x, y] = d3.pointer(evt, wrapper.node());
                    tooltip
                        .style("display", "block")
                        .style("top", `${y}px`)
                        .style("left", `${x + 8}px`)
                        .html(`
                            <p class="country mb">Sexual violence (15-19)</p>
                            <p>${(d['15 to 19']/d['15 to 49']).toFixed(1)} times more likely than among 15-49 year olds</p>
                        `);

                    tooltipCircle
                        .attr("cx", evt.offsetX)
                        .attr("cy", evt.offsetY)
                        .style("opacity", 1);
                    
                })
                .on("mouseout", () => {
                    tooltip.style("display", "none");
                    tooltipCircle.style("opacity", 0);
                })

        gYears.selectAll(".year-circle")
            .data(d => data.filter(datum => datum.year === d))
            .join("circle")
                .attr("class", "year-circle")
                .attr("fill", d => d.age === '15 to 19' ? orange : gray)
                .attr("stroke", d => d.age === '15 to 19' ? orange : black)
                .attr("stroke-width", "0.5px")
                .attr("cx", 0)
                .attr("cy", d => yScale(d.value))
                .attr("r", rectWidth/2)

        gYears.selectAll(".year-text")
            .data(d => data.filter(datum => datum.year === d))
            .join("text")
                .attr("class", "year-text")
                .style("font-size", "14px")
                .style("font-weight", 400)
                .style("font-family", "Atkinson Hyperlegible")
                .attr("x", rectWidth/2 + 6)
                .attr("y", d => yScale(d.value) + 5)
                .text(d => d.value);

        const tooltipCircle = svg.append("circle")
            .attr("class", "tooltip-circle")
            .attr("r", 4)
            .style("stroke", "#000")
            .style("fill", "#fff")
            .style("opacity", 0);
    })
}

vis5(true);
