function vis6() {
    const title = "Adolescents face a disproportionate risk of death due to pregnancy";
    const subtitle = "Maternal mortality rate per 100,000 live births, 2024";
    const source = "Source: Maternal Mortality Inter-Agency Group (MMEIG); Ministry of Health - Online Live Birth Certificate Registration System; Ministry of Health - Maternal Mortality and Severe Maternal Morbidity Situation Room";

    d3.select("#title6").html(title);
    d3.select("#subtitle6").html(subtitle);
    d3.select("#source6").html(source);

    const width = isMobile ? 0.9 * window.innerWidth : svgWidth;
    const height = 245;
    const margin = {
        left: 90,
        top: 60,
        right: 16,
        bottom: 40
    }

    const svg = d3.select("#vis6")
        .append('svg')
        .attr("height", height)
        .attr('width', width)
        .attr("viewbox", `0 0 ${width} ${height}`);

    const data = {
        'National estimate': 51,
        'Adolescents (≤19)': 84
    };

    const circleRadius = isMobile ? 6 : 7.5;
    const circlePadding = isMobile ? 2.5 : 4;
    const nCircles = 10;
    const pieWidth = nCircles * circleRadius * 2 + (nCircles - 1) * circlePadding;
    const piePadding = isMobile ? 20 : 40;
    const pieShift = pieWidth + piePadding;
    const totalWidth = 2 * pieShift + piePadding + 150;

    d3.select("#bubble6")
        .style("top", totalWidth > window.innerWidth ? "30px" : "50px")
        .style("left", totalWidth > window.innerWidth ? "10px" : `${2 * pieShift + piePadding}px`);

    const gPies = svg.selectAll(".pie")
        .data(Object.keys(data))
        .join("g")
            .attr("class", "pie")
            .style("fill", d => d === 'National estimate' ? gray : orange)
            .attr("transform", (_,i) => `translate(${i * pieShift}, 0)`);

    gPies.selectAll(".pie-name")
        .data(d => [d])
        .join("text")
            .attr("class", "pie-name")
            .style("font-size", "14px")
            .style("font-weight", 400)
            .style("fill", black)
            .attr("text-anchor", "middle")
            .attr("x", pieWidth / 2)
            .attr("y", height)
            .text(d => d);

    gPies.selectAll(".pie-circle")
        .data(d => d3.range(data[d]))
        .join("circle")
            .attr("class", "pie-circle")
            .attr("cx", d => {
                const i = Math.floor(d/nCircles);
                const j = d % nCircles;
                return circleRadius + j * (2 * circleRadius + circlePadding)
            })
            .attr("cy", d => {
                const i = Math.floor(d/nCircles);
                return height - margin.bottom - circleRadius - i * (2 * circleRadius + circlePadding)
            })
            .attr("r", circleRadius);

    gPies.selectAll(".pie-label")
        .data(d => [d])
        .join("text")
            .attr("class", "pie-label")
            .style("font-size", "32px")
            .style("font-weight", 700)
            .style("font-family", "Atkinson Hyperlegible")
            .style("fill", black)
            .attr("text-anchor", "start")
            .attr("x", 0)
            .attr("y", d => {
                const i = Math.floor(data[d]/nCircles);
                return height - margin.bottom - circleRadius - i * (2 * circleRadius + circlePadding) - 20
            })
            .text(d => data[d]);

    
}

vis6();