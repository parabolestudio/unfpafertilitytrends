function vis4() {
    const title = "Structural barriers drive high rates of unintended fertility in certain communities";
    const subtitle = "Average number of children women want versus the number they actually have (among women aged 15–49)";
    const source = "Source: Elaboración propia, a partir de INEI. ENDES 1986 y 2024";

    d3.select("#title4").html(title);
    d3.select("#subtitle4").html(subtitle);
    d3.select("#source4").html(source);
    const wrapper = d3.select(".wrapper");
    const tooltip = d3.select(".tooltip");

    function formatType(type) {
        if (isMobile) return [type];
        if (type === "Area of residence") {
            return ["Area of", "residence"];
        } else if (type === "Natural region") {
            return ["Natural", "region"];
        } else {
            return [type];
        }
    }

    const width = isMobile ? window.innerWidth : 750;
    const height = 520;
    const xGroup = 0;
    const xLevel = isMobile ? 0 : 120;
    const margin = {
        left: xLevel + 80,
        top: 0,
        right: isMobile ? 20 : 60,
        bottom: 80
    }

    const svg = d3.select("#vis4")
        .append('svg')
        .attr("height", height)
        .attr('width', width)
        .attr("viewbox", `0 0 ${width} ${height}`);

    if (isMobile) {
        d3.select("#img-legend")
            .attr("src", "./assets/legend4-mobile.svg")
    }
    

    Promise.all([
        d3.csv("./data/vis4.csv")
    ])
    .then(rawData => {

        let selectedYear = '2024';
        const xText = 10;

        const buttonsDiv = d3.select(".buttons");
        
        const buttons = buttonsDiv.selectAll(".button")
        
        buttons.data(['1986', '2024'])
            .join("span")
                .attr("class", "button")
                .classed("checked", d => d === selectedYear);

        buttons.on("click", (evt, d) => {
            const clickedYear = evt.target.innerHTML;
            if (clickedYear !== selectedYear) {
                selectedYear = clickedYear
                buttons.classed("checked", d => d === selectedYear);
                updateVis();
            }
        })

        const data = rawData[0];
        const rectHeight = 12;

        data.forEach(d => {
            d.desired = +d.desired;
            d.observed = +d.observed;
        });

        const groups = getUniques(data.filter(d => d.group !== "Average"), "group");

        const yGroup = d3.scaleBand()
            .domain(groups)
            .range([margin.top, height - margin.bottom])
            .padding(0.5);

        const yLevel = d3.scalePoint()
            .domain([0,1,2])
            .range([0, yGroup.bandwidth()])
            .padding(0);

        const xAxis = svg.append('g')
            .attr('class', "x-axis axis");

        function updateVis() {

            const is24 = selectedYear === '2024';

            if (!isMobile) {
                d3.select("#bubble4")
                    .style("top", is24 ? "180px" : "400px")
                    .style("left", is24 ? "560px" : "560px");
            }

            d3.select("#note4").html(is24 ? "&#8203;" : "*Data is missing for 1986")
            
            const xTicks = selectedYear === '2024'
                ? [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]
                // ? [0, 1, 2, 3, 4, 5, 6, 7]
                : [0, 1, 2, 3, 4, 5, 6, 7];
            const xExtent = [xTicks[0], xTicks[xTicks.length - 1]];

            const xScale = d3.scaleLinear()
                .domain(xExtent)
                .range([margin.left, width - margin.right]);

            xAxis.selectAll("line")
                .data([0])
                .join("line")
                .attr("x1", xScale(xExtent[0]))
                .attr("x2", xScale(xExtent[1]))
                .attr("y1", height - 20)
                .attr("y2", height - 20);

            xAxis.selectAll(".xtick-label")
                .data(xTicks)
                .join("text")
                    .attr("class", "xtick-label")
                    .attr("text-anchor", "middle")
                    .attr("y", height - 20 + 14)
                    .attr("x", d => xScale(d))
                    .text(d => `${d}`);
                    
            const gGroups = svg.selectAll(".group")
                .data(groups)
                .join("g")
                    .attr("class", "group")
                    .attr("transform", d => `translate(${xGroup}, ${yGroup(d)})`);

            const gGroupText = gGroups.selectAll(".group-name")
                .data(d => [d])
                .join("text")
                    .attr("class", "group-name")
                    .style("font-size", isMobile ? "12px" : "14px")
                    .style("font-weight", 400)
                    .style("font-family", "Atkinson Hyperlegible")
                    .style("opacity", 0.4)
                    .attr("x", 0)
                    .attr("y", isMobile ? - 20 : 0)
            
            gGroupText.selectAll("tspan")
                .data(d => formatType(d))
                .join("tspan")
                    .attr("x", 0)
                    .attr("dy", (_, i) => i === 0 ? '10px': `16px`)
                    .text(d => d);

            const gLevel = gGroups.selectAll(".g-level")
                .data(d => data.filter(datum => datum.group === d && datum.year === selectedYear).map((lvl,i) => ({
                    ...lvl,
                    idx: i
                })))
                .join("g")
                    .attr("class", "g-level")
            
            gLevel.selectAll(".level-name")
                .data(d => [d])
                .join("text")
                    .attr("class", "level-name")
                    .attr("text-anchor", "start")
                    .style("font-size", isMobile ? "12px" : "14px")
                    .style("font-weight", 400)
                    .attr("y", d => yLevel(d.idx) + 10)
                    .attr("x", xLevel)
                    .text(d => d.desired === 0 || d.observed === 0 ? `${d.level}*` : `${d.level}`);

            gLevel.selectAll(".level-rect")
                .data(d => [d])
                .join("rect")
                    .attr("class", "level-rect")
                    .attr("fill", orange)
                    .attr("x", d => xScale(d.desired))
                    .attr("y", d => yLevel(d.idx))
                    .attr("width", d => d.desired === 0 || d.observed === 0 ? 0 : xScale(d.observed) - xScale(d.desired))
                    .attr("height", rectHeight)
                    .on("mousemove", (evt, d) => {
                        const [x, y] = d3.pointer(evt, wrapper.node());
                        tooltip
                            .style("display", "block")
                            .style("top", `${y}px`)
                            .style("left", `${x + 8}px`)
                            .html(`
                                <p class="country mb">${d.level}</p>
                                <p>${((d.observed-d.desired)/d.desired * 100).toFixed(1)}% more pregnancies observed than desired</p>
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

            gLevel.selectAll(".level-desired")
                .data(d => [d])
                .join("circle")
                    .attr("class", "level-desired")
                    .attr("fill", "#fff")
                    .attr("stroke", black)
                    .attr("stroke-width", "1.5px")
                    .attr("cx", d => xScale(d.desired))
                    .attr("cy", d => yLevel(d.idx) + rectHeight/2)
                    .attr("r", d => d.desired === 0 ? 0 : rectHeight/2);

            gLevel.selectAll(".level-desired-text")
                .data(d => [d])
                .join("text")
                    .attr("class", "level-desired-text")
                    .style("font-size", "14px")
                    .style("font-weight", 400)
                    .style("font-family", "Atkinson Hyperlegible")
                    .attr("x", d => xScale(d.desired) - xText)
                    .attr("y", d => yLevel(d.idx) + 10)
                    .attr("text-anchor", "end")
                    .text(d => d.desired === 0 ? '' : d.desired);

            gLevel.selectAll(".level-observed")
                .data(d => [d])
                .join("circle")
                    .attr("class", "level-observed")
                    .attr("fill", black)
                    .attr("stroke", black)
                    .attr("stroke-width", "1.5px")
                    .attr("cx", d => xScale(d.observed))
                    .attr("cy", d => yLevel(d.idx) + rectHeight/2)
                    .attr("r", d => d.observed === 0 ? 0 : rectHeight/2);

            gLevel.selectAll(".level-observed-text")
                .data(d => [d])
                .join("text")
                    .attr("class", "level-observed-text")
                    .style("font-size", "14px")
                    .style("font-weight", 400)
                    .style("font-family", "Atkinson Hyperlegible")
                    .attr("x", d => xScale(d.observed) + xText)
                    .attr("y", d => yLevel(d.idx) + 10)
                    .attr("text-anchor", "start")
                    .text(d => d.observed === 0 ? '' : d.observed);

            const averageData = data.find(d => d.group === 'Average' && d.year === selectedYear);
            const avgAvg = (averageData.desired + averageData.observed)/2;

            const gAvg = svg.selectAll('.average')
                .data([{
                        ...averageData,
                        idx: 0
                    }, {
                        ...averageData,
                        idx: 1
                    }
                ])
                .join("g")
                    .attr("class", "average")
                    .attr("transform", d =>
                        d.idx === 0
                            ? `translate(${xScale(d.desired)}, 0)`
                            : `translate(${xScale(d.observed)}, 0)`
                    );

            gAvg.selectAll(".avg-circle")
                .data(d => [d])
                .join("circle")
                    .attr("class", "avg-circle")
                    .attr("fill", black)
                    .attr("stroke", black)
                    .attr("stroke-width", "1px")
                    .style("opacity", 0.4)
                    .attr("cx", 0)
                    .attr("cy", height - margin.bottom)
                    .attr("r", 2);

            gAvg.selectAll(".avg-text")
                .data(d => [d])
                .join("text")
                    .attr("class", "avg-text")
                    .style("font-size", "14px")
                    .style("font-weight", 400)
                    .style("font-family", "Atkinson Hyperlegible")
                    .style("opacity", 0.4)
                    .attr("x", d => d.idx === 0 ? -xText : xText)
                    .attr("y", height - margin.bottom + 4)
                    .attr("text-anchor", d => d.idx === 0 ? "end" : "start")
                    .text(d => d.idx === 0 ? d.desired : d.observed);

            gAvg.selectAll(".avg-line")
                .data(d => [d])
                .join("line")
                    .attr("class", "avg-line")
                    .attr("stroke", black)
                    .attr("stroke-width", 1)
                    .attr("stroke-dasharray", d => d.idx === 0 ? [1, 3] : [4, 4])
                    .style("opacity", 0.4)
                    .attr("x1", 0)
                    .attr("x2", 0)
                    .attr("y1", yGroup("Area of residence"))
                    .attr("y2", height - margin.bottom)
                    .attr("text-anchor", d => d.idx === 0 ? "end" : "start")

            svg.selectAll(".avg-label")
                .data([avgAvg])
                .join("text")
                    .attr("class", "avg-label")
                    .style("font-size", "14px")
                    .style("font-weight", 400)
                    .style("font-family", "Atkinson Hyperlegible")
                    .style("opacity", 0.4)
                    .attr("x", d => xScale(d))
                    .attr("y", height - margin.bottom + 24)
                    .attr("text-anchor", "middle")
                    .text("National average")
        }
        
        updateVis();

        const tooltipCircle = svg.append("circle")
            .attr("class", "tooltip-circle")
            .attr("r", 4)
            .style("stroke", "#000")
            .style("fill", "#fff")
            .style("opacity", 0);
    })
}

vis4();