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
    'World': "Mundial",
    'Latin America and the Caribbean': "América Latina y el Caribe",
    'Latin America': "América Latina",
    'and the Caribbean': "y el Caribe",
    "LAC": "ALC",
    "Peru": "Perú",
    "Brazil": "Brasil",
    "Births per 1,000": "Nacimientos por cada 1.000 habitantes",
    'National estimate': "Estimación nacional",
    'Adolescents (≤19)': 'Adolescentes (≤19)',
    "Education": "Educación",
    "Employment and inactivity": "Empleo e inactividad",
    "Income": "Ingresos",
    "Healthcare": "Asistencia sanitaria",
    "Tax revenue loss": "Pérdida de ingresos fiscales",
    "Urban": "Urbana",
    "Metropolitan Lima": "Lima Metropolitana",
    "Amazon": "Selva",
    "Highlands": "Sierra",
    "Coast": "Costa",
    "No education": "Sin educación",
    "Primary or less": "Primaria",
    "Higher": "Superior",
    "Lowest quintile": "Quintil inferior",
    "Intermediate quintile": "Quintil intermedio",
    "Highest quintile": "Quintil superior",
    "National": "Nacional",
    "National average": "Promedio nacional",
    "Area of residence": 'Área de residencia',
    "Natural region": "Región natural",
    "Area of": 'Área de',
    "residence": 'residencia',
    "Natural": 'Región',
    "region": "natural",
    "more pregnancies observed than desired": "más embarazos observados que deseados",
    "times more likely than among 15-49 year olds": "veces más probable que entre 15 a 49 años",
    "Sexual violence": "Violencia sexual"
};

const translate = (word, inEn) => inEn ? word : (Object.keys(dictionary).includes(word) ? dictionary[word] : word);
const formatNumber = (number, inEn) => inEn ? `${number}` : `${number}`.replace(".", ",");
