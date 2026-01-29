function vis2() {
    const title = "Where a girl lives strongly shapes early motherhood";
    const subtitle = "Number of live births per 1,000 girls and adolescents aged 10-19 by region, 2024";
    const source = "Source: Online Live Birth Registration System (CNV), Ministry of Health; population estimates 2024";

    d3.select("#title2").html(title);
    d3.select("#subtitle2").html(subtitle);
    d3.select("#source2").html(source);
    const wrapper = d3.select(".wrapper");
    const tooltip = d3.select(".tooltip");

    const width = 750;
    const height = 566;
    const margin = {
        left: 90,
        top: 60,
        right: 16,
        bottom: 20
    }


    const colormap = ["#FFE8D9", "#FFD0B2", "#F96000", "#702B00"];
    const stops = [0, 0.25, 0.5, 1];
    const colorExtent = [0, 45];
    const xColorbar = 4;
    const yColorbar = height - 60;
    const heightColorbar = 20;
    const widthColorbar = 175;
    const xHighlighted = 600;

    const interpolator = d3.piecewise(colormap);
    // const interpolator = d3.interpolateRgbBasis(colormap);
    const colorScale = d3.scaleSequential()
        .interpolator(interpolator)
        .domain(colorExtent)
        .clamp(true);

    const projection = d3
        .geoMercator()
        .center([-75, -9.25])
        .scale(1620)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const svg = d3.select("#vis2")
        .append('svg')
        .attr("height", height)
        .attr('width', width)
        .attr("viewbox", `0 0 ${width} ${height}`);

    const highlighted = ['Loreto', 'San Martín', 'Ucayali', 'Madre de Dios'];

    d3.select("#bubble2")
        .style("top", "320px")
        .style("left", "0");

    Promise.all([
        d3.csv("./data/vis2.csv"),
        d3.json("./data/peru.geojson")
    ])
    .then(rawData => {

        const data = rawData[0];
        const geodata = rawData[1];

        data.forEach(d => {
            d.value = +d.value;
        });

        // Merge data
        geodata.features.forEach(feat => {
            const match = data.find(d => d.adm1_pcode === `PE${feat.properties.FIRST_IDDP}`);

            feat.properties.departamento = match.departamento;
            feat.properties.value = match.value;
        });

        const highlightedData = highlighted.map(dep => {
            const feat = geodata.features.find(ft => ft.properties.departamento === dep);
            const [x, y] = path.centroid(feat);

            return {
                label: dep,
                x: x,
                y: y,
                value: feat.properties.value
            }
        });

        const g = svg.append('g');

        g.selectAll("path")
            .data(geodata.features)
            .join("path")
                .attr("fill", d => colorScale(d.properties.value))
                .attr("stroke", "#fff")
                .attr('d', path)
                .on("mousemove", (evt, d) => {
                    const [x, y] = d3.pointer(evt, wrapper.node());
                    tooltip
                        .style("display", "block")
                        .style("top", `${y}px`)
                        .style("left", `${x + 8}px`)
                        .html(`
                            <p class="country mb">${d.properties.departamento}</p>
                            <p>Number of live births</p>
                            <p class="bold">${d.properties.value}</p>
                        `);

                    tooltipCircle
                        .attr("cx", evt.offsetX)
                        .attr("cy", evt.offsetY)
                        .style("opacity", 1);
                    
                })
                .on("mouseout", () => {
                    tooltip.style("display", "none");
                    tooltipCircle.style("opacity", 0);
                });

        const gBar = svg.append('g');

        const linearGradient = gBar.append("linearGradient")
            .attr("id", "gradient");

        linearGradient.selectAll("stop")
            .data(colormap)
            .join("stop")
                .attr("offset", (_, i) => stops[i])
                .attr("stop-color", d => d);

        gBar.append("text")
            .attr("x", xColorbar)
            .attr("y", yColorbar - 20)
            .attr("text-anchor", 'begin')
            .style("font-weight", 700)
            .style("font-size", '14px')
            .text("Births per 1,000")

        gBar.append("rect")
            .attr("x", xColorbar)
            .attr("y", yColorbar)
            .attr("width", widthColorbar)
            .attr("height", heightColorbar)
            .style("fill", "url(#gradient)");

        gBar.selectAll(".number-label")
            .data(colorExtent)
            .join("text")
                .attr("x", (_, i) => i === 0 ? xColorbar : xColorbar + widthColorbar)
                .attr("y", yColorbar + heightColorbar + 16)
                .attr("text-anchor", 'middle')
                .style("font-weight", 400)
                .style("font-size", '14px')
                .text(d => `${d}`)

        const gLabels = svg.append("g");

        const gCountries = gLabels.selectAll(".highlighted-country")
            .data(highlightedData)
            .join("g")
                .attr("class", "highlighted-country");

        gCountries.selectAll(".centroid")
            .data(d => [d])
            .join("circle")
                .attr("class", "centroid")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", 2)
                .style("fill", black)
                .style("opacity", 1);

        gCountries.selectAll(".line")
            .data(d => [d])
            .join("line")
                .attr("class", "line")
                .attr("x1", d => d.x)
                .attr("x2", xHighlighted)
                .attr("y1", d => d.y)
                .attr("y2", d => d.y)
                .attr("stroke", black)
                .attr("stroke-width", '0.5px')
                // .attr("stroke-dasharray", [2,4])
                // .style("opacity", 0.2);

        gCountries.selectAll(".dep")
            .data(d => [d])
            .join("text")
                .attr("class", "dep")
                .attr("x", xHighlighted + 6)
                .attr("y", d => d.y - 4)
                .attr("text-anchor", 'begin')
                .style("font-weight", 700)
                .style("font-size", '14px')
                .text(d => d.label);

        gCountries.selectAll(".value")
            .data(d => [d])
            .join("text")
                .attr("class", "value")
                .attr("x", xHighlighted + 6)
                .attr("y", d => d.y + 14)
                .attr("text-anchor", 'begin')
                .style("font-weight", 400)
                .style("font-size", '14px')
                .text(d => d.value);

        const tooltipCircle = svg.append("circle")
            .attr("class", "tooltip-circle")
            .attr("r", 4)
            .style("stroke", "#000")
            .style("fill", "#fff")
            .style("opacity", 0);

    })
}

vis2();