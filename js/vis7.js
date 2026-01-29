function vis7() {
    const title = "Adolescent motherhood costs the economy a fair share of GDP";
    const subtitle = "Opportunity cost associated with adolescent motherhood";
    const source = "Source: UNFPA - Socioeconomic Consequences of Adolescent Pregnancy in LAC (2025)";

    d3.select("#title7").html(title);
    d3.select("#subtitle7").html(subtitle);
    d3.select("#source7").html(source);
    const wrapper = d3.select(".wrapper");
    const tooltip = d3.select(".tooltip");

    const width = 750;
    const height = 260;
    const margin = {
        left: 20,
        top: 80,
        right: 20,
        bottom: 80
    }

    const svg = d3.select("#vis7")
        .append('svg')
        .attr("height", height)
        .attr('width', width)
        .attr("viewbox", `0 0 ${width} ${height}`);

    Promise.all([
        d3.csv("./data/vis7.csv")
    ])
    .then(rawData => {

        const rectHeight = 130;
        const strokeWidth = 5;
        const xText = 4;
        const yText = 20;

        const data = rawData[0];

        data.forEach(d => {
            d.Share = +d.Share;
        });

        const total = d3.sum(data, d => d.Share);

        function groupDataFunc(data) {
            let cumulative = 0;
            const _data = data.map((d, i) => {
                cumulative += d.Share
                return {
                    value: d.Share,
                    cumulative: cumulative - d.Share,
                    type: d.Type,
                    who: d.Who,
                    shift: i * strokeWidth,
                    words: formatType(d.Type)
                }
            })
            return _data
        };

        function formatType(type) {
            if (type === "Employment and inactivity") {
                return ["Employment", "and inactivity"];
            } else if (type === "Tax revenue loss") {
                return ["Tax", "revenue", "loss"];
            } else {
                return [type];
            }
        }

        const groupData = groupDataFunc(data);        

        const xScale = d3.scaleLinear()
            .domain([0, total])
            .range([margin.left, width - margin.right - strokeWidth * (groupData.length - 1)]);

        svg.selectAll(".rect")
            .data(groupData)
            .join("rect")
                .attr("class", "rect")
                .attr("x", d => xScale(d.cumulative) + d.shift)
                .attr("y", height - margin.bottom - rectHeight)
                .attr("width", d => xScale(d.value) - xScale(0))
                .attr("height", rectHeight)
                .attr("fill", d => d.who === "Women" ? orange : midorange);

        const labels = svg.selectAll(".rect-label")
            .data(groupData)
            .join("text")
                .attr("class", "rect-label uppercase")
                .attr("x", d => 
                    d.type === 'Healthcare'
                        ? xScale(d.cumulative) + d.shift + 6 * xText
                        : xScale(d.cumulative) + d.shift + 2 * xText
                )
                .attr("y", d => 
                    d.type === 'Healthcare'
                        ? height - margin.bottom - rectHeight - yText
                        : height - margin.bottom - rectHeight + yText
                )
                .style("font-size", "14px")
                .style("font-weight", 700)
                .style("font-family", "Atkinson Hyperlegible")
                .attr("fill", d => d.type === 'Healthcare' ? "#000" : "#fff");

        labels.selectAll("tspan")
            .data(d => d.words.map(w => ({
                word: w,
                shift: d.shift,
                cumulative: d.cumulative,
                type: d.type
            })))
            .join("tspan")
                .attr("x", d => 
                    d.type === 'Healthcare'
                        ? xScale(d.cumulative) + d.shift + 6 * xText
                        : xScale(d.cumulative) + d.shift + 2 * xText
                )
                .attr("dy", (_, i) => i === 0 ? '0': `16px`)
                .text(d => d.word);

        const hcLabel = svg.selectAll(".hc")
            .data(groupData.filter(d => d.type === 'Healthcare'))
            .join("g")
                .attr("class", "hc")
                .attr("transform", d => `translate(${xScale(d.cumulative) + d.shift + 4 * xText}, ${height - margin.bottom - rectHeight + yText})`);

        hcLabel.append('circle')
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 2)
            .attr("fill", black);

        hcLabel.append('line')
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", -2 * yText - 12)
            .attr("stroke", black)
            .attr("stroke-width", "0.5px");

        const dy = 20;
        const dx = 200;

        svg.append("line")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", height - margin.bottom - rectHeight)
            .attr("y2", height - margin.bottom + dy)
            .attr("stroke", black)
            .attr("stroke-width", "0.5px");

        svg.append("line")
            .attr("x1", width)
            .attr("x2", width)
            .attr("y1", height - margin.bottom - rectHeight)
            .attr("y2", height - margin.bottom + dy)
            .attr("stroke", black)
            .attr("stroke-width", "0.5px");

        svg.append("line")
            .attr("x1", 0)
            .attr("x2", dx)
            .attr("y1", height - margin.bottom + dy)
            .attr("y2", height - dy)
            .attr("stroke", black)
            .attr("stroke-width", "0.5px");

        svg.append("line")
            .attr("x1", width)
            .attr("x2", width - dx)
            .attr("y1", height - margin.bottom + dy)
            .attr("y2", height - dy)
            .attr("stroke", black)
            .attr("stroke-width", "0.5px");

        // gYears.selectAll(".year-rect")
        //     .data(d => [Object.fromEntries(
        //         data.filter(datum => datum.year === d).map(datum => [datum.age, datum.value])
        //     )])
        //     .join("rect")
        //         .attr("class", "year-rect")
        //         .attr("fill", lightorange)
        //         .style("opacity", 0.4)
        //         .attr("x", -rectWidth/2)
        //         .attr("y", d => yScale(d['15 to 19']))
        //         .attr("width", rectWidth)
        //         .attr("height", d => yScale(d['15 to 49']) - yScale(d['15 to 19']))
        //         .on("mousemove", (evt, d) => {
        //             const [x, y] = d3.pointer(evt, wrapper.node());
        //             tooltip
        //                 .style("display", "block")
        //                 .style("top", `${y}px`)
        //                 .style("left", `${x + 8}px`)
        //                 .html(`
        //                     <p class="country mb">Sexual violence (15-19)</p>
        //                     <p>${(d['15 to 19']/d['15 to 49']).toFixed(1)} times more likely than among 15-49 year olds</p>
        //                 `);

        //             tooltipCircle
        //                 .attr("cx", evt.offsetX)
        //                 .attr("cy", evt.offsetY)
        //                 .style("opacity", 1);
                    
        //         })
        //         .on("mouseout", () => {
        //             tooltip.style("display", "none");
        //             tooltipCircle.style("opacity", 0);
        //         })

        // gYears.selectAll(".year-circle")
        //     .data(d => data.filter(datum => datum.year === d))
        //     .join("circle")
        //         .attr("class", "year-circle")
        //         .attr("fill", d => d.age === '15 to 19' ? orange : gray)
        //         .attr("stroke", d => d.age === '15 to 19' ? orange : black)
        //         .attr("stroke-width", "0.5px")
        //         .attr("cx", 0)
        //         .attr("cy", d => yScale(d.value))
        //         .attr("r", rectWidth/2)

        // gYears.selectAll(".year-text")
        //     .data(d => data.filter(datum => datum.year === d))
        //     .join("text")
        //         .attr("class", "year-text")
        //         .style("font-size", "14px")
        //         .style("font-weight", 400)
        //         .style("font-family", "Atkinson Hyperlegible")
        //         .attr("x", rectWidth/2 + 6)
        //         .attr("y", d => yScale(d.value) + 5)
        //         .text(d => d.value);

        // const tooltipCircle = svg.append("circle")
        //     .attr("class", "tooltip-circle")
        //     .attr("r", 4)
        //     .style("stroke", "#000")
        //     .style("fill", "#fff")
        //     .style("opacity", 0);
    })
}

vis7();