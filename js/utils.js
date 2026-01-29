function getUniques(data, field) {
    return Array.from(new Set(data.map(d => d[field])));
}

const orange = "#F96000";
const gray = "#D9DBE1";
const black = "#131619";
const darkorange = "#AE4300";
const lightorange = "#FDCFB3";
const midorange = "#FB904D";