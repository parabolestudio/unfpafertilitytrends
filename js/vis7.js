function vis7(inEn) {
    const title = inEn
        ? "Adolescent motherhood costs the economy a fair share of GDP"
        : "La maternidad adolescente le cuesta a la economía una parte considerable del PBI ";
    const subtitle = inEn
        ? "Opportunity cost associated with adolescent motherhood"
        : "Costo de oportunidad asociado con la maternidad adolescente";
    const source = inEn
        ? "Source: UNFPA - Socioeconomic Consequences of Adolescent Pregnancy in LAC, 2025"
        : "Fuente: UNFPA - Consecuencias socioeconómicas del embarazo adolescente en América Latina y el Caribe, 2025";
    const bigNumber = inEn
        ? "0.14%"
        : "0,14%";
    const calloutParagraph = inEn
        ? " of GDP of Peru"
        : " del PBI del Perú";
    const legendTitle = inEn
        ? "Cost type"
        : "Tipo de coste";
    const legendItem1 = inEn
        ? "Opportunity cost to women"
        : "Coste de oportunidad para las mujeres";
    const legendItem2 = inEn
        ? "Cost to the State"
        : "Coste para el Estado";

    d3.select("#title7").html(title);
    d3.select("#subtitle7").html(subtitle);
    d3.select("#source7").html(source);
    d3.select(".big-number").html(bigNumber);
    d3.select(".rest-callout").html(calloutParagraph);
    d3.select("#legend-title").html(legendTitle);
    d3.select("#legend-item-1").html(legendItem1);
    d3.select("#legend-item-2").html(legendItem2);

    const wrapper = d3.select(".wrapper");
    const tooltip = d3.select(".tooltip");

    const width = isMobile ? window.innerWidth * 0.9 : svgWidth;
    const height = 260;
    const margin = {
        left: isMobile ? 5 : 20,
        top: 80,
        right: isMobile ? 5 : 20,
        bottom: 80
    }

    const svg = d3.select("#vis7")
        .append('svg')
        .attr("height", height)
        .attr('width', width)
        .attr("viewbox", `0 0 ${width} ${height}`);

    if (isMobile) {
        d3.select("#legend7 .legend-title").html('')
            .style("margin-right", "0")
    }

    Promise.all([
        d3.csv("./data/vis7.csv")
    ])
    .then(rawData => {

        const rectHeight = 130;
        const strokeWidth = 5;
        const xText = isMobile ? 0.5 : 4;
        const yText = isMobile ? 16 : 20;

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

        const specials = isMobile
            ? {
                "Healthcare": "left",
                "Education": "right",
                "Tax revenue loss": "left"
            }
            : {
                "Healthcare": "right"
            };

        const dxText = isMobile ? 10 : 2 * xText;

        const specialLabels = Object.keys(specials);

        const getX = (d) => {
            if (isMobile) {
                const shift = specials[d.type] === 'right' ? 4 : -4;
                return d.type === 'Tax revenue loss'
                        ? xScale(d.cumulative) + d.shift + 70 * xText + shift
                        : xScale(d.cumulative) + d.shift + 12 * xText + shift
            } else {
                return d.type === 'Healthcare'
                        ? xScale(d.cumulative) + d.shift + 6 * xText
                        : xScale(d.cumulative) + d.shift + 2 * xText
            }
        }

        const getY = (d) => {
            if (isMobile) {
                return specialLabels.includes(d.type)
                        ? height - margin.bottom - rectHeight - 2.5 * yText
                        : height - margin.bottom - rectHeight + yText
            } else {
                return specialLabels.includes(d.type)
                        ? height - margin.bottom - rectHeight - yText
                        : height - margin.bottom - rectHeight + yText
            }
        }

        const getTextAnchor = (d) => {
            if (isMobile) {
                return ['Healthcare', 'Tax revenue loss'].includes(d.type)
                    ? "end"
                    : "begin";
            } else {
                return "begin";
            }
        }

        const labels = svg.selectAll(".rect-label")
            .data(groupData)
            .join("text")
                .attr("class", "rect-label")
                .attr("x", getX)
                .attr("y", getY)
                .style("font-size", "14px")
                .style("font-weight", 700)
                .style("font-family", "Atkinson Hyperlegible")
                .attr("text-anchor", getTextAnchor)
                .attr("fill", d => specialLabels.includes(d.type) ? "#000" : "#fff");

        labels.selectAll("tspan")
            .data(d => d.words.map(w => ({
                word: w,
                shift: d.shift,
                cumulative: d.cumulative,
                type: d.type
            })))
            .join("tspan")
                .attr("x", getX)
                .attr("dy", (_, i) => i === 0 ? '0': `16px`)
                .text(d => d.word);

        const getXTranslate = (d) => {
            if (isMobile) {
                return d.type === 'Tax revenue loss'
                        ? xScale(d.cumulative) + d.shift + 72 * xText
                        : xScale(d.cumulative) + d.shift + 10 * xText
            } else {
                return xScale(d.cumulative) + d.shift + 4 * xText
            }
        }

        const getYTranslate = (d) => {
            return getY(d) - 12;
        }

        const hcLabel = svg.selectAll(".hc")
            .data(groupData.filter(d => specialLabels.includes(d.type)))
            .join("g")
                .attr("class", "hc")
                .attr("transform", d => `translate(${getXTranslate(d)}, 0)`);

        hcLabel.append('circle')
            .attr("cx", 0)
            .attr("cy", height - margin.bottom - rectHeight + yText)
            .attr("r", 2)
            .attr("fill", black);

        hcLabel.append('line')
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", height - margin.bottom - rectHeight + yText)
            .attr("y2", getYTranslate)
            .attr("stroke", black)
            .attr("stroke-width", "0.5px");

        if(!isMobile) {
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
        }
        
    })
}