function getUniques(data, field) {
    return Array.from(new Set(data.map(d => d[field])));
}

const orange = "#F96000";
const gray = "#D9DBE1";
const black = "#131619";
const darkorange = "#AE4300";
const lightorange = "#FDCFB3";
const midorange = "#FB904D";

const svgWidth = 734;
const isMobile = window.innerWidth < svgWidth;

const dictionary = {
    'World': "Mundo",
    'Latin America and the Caribbean': "América Latina y el Caribe",
    'Latin America': "América Latina",
    'and the Caribbean': "y el Caribe",
    "LAC": "ALC",
    "Peru": "Perú",
    "Brazil": "Brasil"
};

const translate = (word, inEn) => inEn ? word : (Object.keys(dictionary).includes(word) ? dictionary[word] : word);
