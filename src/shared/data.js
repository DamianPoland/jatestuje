




// ----------------------- START REGIONS ARRAY --------------------------//

export const wojewodztwa = [
    "dolnośląskie",
    "kujawsko-pomorskie",
    "lubelskie",
    "lubuskie",
    "łódzkie",
    "małopolskie",
    "mazowieckie",
    "opolskie",
    "podkarpackie",
    "podlaskie",
    "pomorskie",
    "śląskie",
    "świętokrzyskie",
    "warmińsko-mazurskie",
    "wielkopolskie",
    "zachodniopomorskie",]

// ----------------------- STOP REGIONS ARRAY --------------------------//





// ----------------------- START CARS ARRAY --------------------------//

// lista samochodów z olx + dodano jeszcze busy + zaktualizowano w oparciu o autocentrum ze stycznia 2021, jest 42 marki samochodów i około 1000 modeli

const alfaromeo = {
    id: "alfaromeo", name: "Alfa Romeo", models: [
        "33",
        "75",
        "145",
        "146",
        "147",
        "155",
        "156",
        "159",
        "164",
        "166",
        "Brera",
        "Crosswagon",
        "Giulia",
        "Giulietta",
        "GT",
        "GTV",
        "Mito",
        "Spider",
        "Sportwagon",
        "Stelvio",
        "Pozostałe",]
}

const audi = {
    id: "audi", name: "Audi", models: [
        "A1",
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
        "Cabriolet",
        "Coupe",
        "E-tron",
        "Q2",
        "Q3",
        "Q5",
        "Q7",
        "Q8",
        "R8",
        "Rs4",
        "Rs6",
        "S2",
        "S3",
        "S4",
        "S5",
        "S6",
        "S8",
        "TT",
        "Pozostałe",]
}

const bmw = {
    id: "bmw", name: "BMW", models: [
        "i3",
        "i8",
        "M1",
        "M3",
        "M5",
        "M6",
        "Seria 1",
        "Seria 2",
        "Seria 3",
        "Seria 4",
        "Seria 5",
        "Seria 6",
        "Seria 7",
        "Seria 8",
        "X1",
        "X2",
        "X3",
        "X4",
        "X5",
        "X6",
        "X7",
        "Z3",
        "Z4",
        "Z8",
        "Pozostałe",]
}

const cadillac = {
    id: "cadillac", name: "Cadillac", models: [
        "Cts",
        "Deville",
        "Dts",
        "Eldorado",
        "Escalade",
        "Fleetwood",
        "SRX",
        "Pozostałe",]
}

const chevrolet = {
    id: "chevrolet", name: "Chevrolet", models: [
        "Alero",
        "Astro",
        "Avalanche",
        "Aveo",
        "Blazer",
        "Camaro",
        "Captiva",
        "Corvette",
        "Cruze",
        "Epica",
        "Equinox",
        "Evanda",
        "HHR",
        "Kalos",
        "Lacetti",
        "Malibu",
        "Matiz",
        "Orlando",
        "Rezzo",
        "Silverado",
        "Spark",
        "Suburban",
        "Tahoe",
        "TrailBlazer",
        "Trans Sport",
        "Trax",
        "Venture",
        "Volt",
        "Pozostałe",]
}

const chrysler = {
    id: "chrysler", name: "Chrysler", models: [
        "300C",
        "300M",
        "Aspen",
        "Caravan",
        "Concorde",
        "Crossfire",
        "Grand Voyager",
        "Le Baron",
        "Neon",
        "New Yorker",
        "Pacifica",
        "PT Cruiser",
        "Sebring",
        "Stratus",
        "Town & Country",
        "Voyager",
        "Pozostałe",]
}

const citroen = {
    id: "citroen", name: "Citroen", models: [
        "AX",
        "Berlingo",
        "BX",
        "C-Crosser",
        "C-Elysee",
        "C1",
        "C2",
        "C3",
        "C3 Picasso",
        "C3 Pluriel",
        "C4",
        "C4 Cactus",
        "C4 Picasso",
        "C5",
        "C6",
        "C8",
        "CX",
        "DS",
        "Evasion",
        "GSA",
        "Jumper",
        "Nemo",
        "Saxo",
        "Spacetourer",
        "Xantia",
        "XM",
        "Xsara",
        "Xsara Picasso",
        "ZX",
        "Pozostałe",]
}

const dacia = {
    id: "dacia", name: "Dacia", models: [
        "Doker",
        "Duster",
        "Lodgy",
        "Logan",
        "Sandero",
        "Sandero Stepway",
        "Lodgy",
        "Pozostałe",]
}

const daewoo = {
    id: "daewoo", name: "Daewoo", models: [
        "Espero",
        "Kalos",
        "Korando",
        "Lanos",
        "Leganza",
        "Matiz",
        "Musso",
        "Nubira",
        "Rezzo",
        "Tacuma",
        "Tico",
        "Pozostałe",]
}

const daihatsu = {
    id: "daihatsu", name: "Daihatsu", models: [
        "Cuore",
        "Materia",
        "Move",
        "Sirion",
        "Feroza",
        "Terios",
        "Pozostałe",]
}

const dodge = {
    id: "dodge", name: "Dodge", models: [
        "Avenger",
        "Caliber",
        "Caravan",
        "Challenger",
        "Charger",
        "Durango",
        "Journey",
        "Grand Caravan",
        "Magnum",
        "Nitro",
        "Ram",
        "Stratus",
        "Pozostałe",]
}

const fiat = {
    id: "fiat", name: "Fiat", models: [
        "125p",
        "126",
        "500",
        "600",
        "Albea",
        "Barchetta",
        "Brava",
        "Bravo",
        "Cinquecento",
        "Coupe",
        "Croma",
        "Doblo",
        "Ducato",
        "Fiorino",
        "Freemont",
        "Grande Punto",
        "Idea",
        "Linea",
        "Marea",
        "Multipla",
        "Palio",
        "Panda",
        "Punto",
        "Punto Evo",
        "Scudo",
        "Sedici",
        "Seicento",
        "Siena",
        "Stilo",
        "Strada",
        "Tempra",
        "Tipo",
        "Qubo",
        "Ulysse",
        "Uno",
        "Pozostałe",]
}

const ford = {
    id: "ford", name: "Ford", models: [
        "Aerostar",
        "C-MAX",
        "Capri",
        "Cougar",
        "Econoline",
        "Ecosport",
        "Edge",
        "Edge Vignale",
        "Escape",
        "Escort",
        "Explorer",
        "F150",
        "F250",
        "F350",
        "Fiesta",
        "Fiesta Vignale",
        "Flex",
        "Focus",
        "Focus C-Max",
        "Focus Vignale",
        "Fusion",
        "Galaxy",
        "Granada",
        "Gt",
        "KA",
        "Kuga",
        "Maverick",
        "Mondeo",
        "Mondeo Vignale",
        "Mustang",
        "Orion",
        "Probe",
        "Puma",
        "Ranger",
        "S-Max",
        "Scorpio",
        "Sierra",
        "Streetka",
        "Taurus",
        "Tourneo",
        "Transit",
        "Windstar",
        "Pozostałe",]
}

const honda = {
    id: "honda", name: "Honda", models: [
        "Accord",
        "City",
        "Civic",
        "Concerto",
        "CR-V",
        "CRX",
        "e",
        "FR-V",
        "HR-V",
        "Insight",
        "Integra",
        "Jazz",
        "Legend",
        "NSX",
        "Odyssey",
        "Prelude",
        "S 2000",
        "Shuttle",
        "Stream",
        "Pozostałe",]
}

const hyundai = {
    id: "hyundai", name: "Hyundai", models: [
        "Accent",
        "Atos",
        "Coupe",
        "Elantra",
        "Getz",
        "H1",
        "H200",
        "i10",
        "i20",
        "i30",
        "i40",
        "IONIQ",
        "ix20",
        "ix35",
        "ix55",
        "Konta",
        "Lantra",
        "Santa Fe",
        "Sonata",
        "Terracan",
        "Tucson",
        "Veracruz",
        "Pozostałe",]
}

const infiniti = {
    id: "infiniti ", name: "Infiniti ", models: [
        "EX",
        "FX",
        "G",
        "M",
        "Q30",
        "Q50",
        "Q60",
        "Q70",
        "XQ",
        "XQ30",
        "XQ50",
        "XQ60",
        "XQ70",
        "Pozostałe",]
}

const jaguar = {
    id: "jaguar  ", name: "Jaguar  ", models: [
        "E-Pace",
        "E-Type",
        "F-Pace",
        "F-Type",
        "I-Pace",
        "S-Type",
        "X-Type",
        "XE",
        "XF",
        "XJ",
        "XJS",
        "XK",
        "Pozostałe",]
}

const jeep = {
    id: "jeep", name: "Jeep", models: [
        "Cherokee",
        "Commander",
        "Compass",
        "Grand Cherokee",
        "Liberty",
        "Patriot",
        "Renegade",
        "Wrangler",
        "Pozostałe",]
}

const kia = {
    id: "kia", name: "Kia", models: [
        "Carens",
        "Cee'd",
        "Cerato",
        "Niro",
        "Optima",
        "Picanto",
        "Procee'd",
        "Rio",
        "Sorento",
        "Soul",
        "Sportage",
        "Stinger",
        "Stonic",
        "Venga",
        "XCee'd",
        "Pozostałe",]
}

const lancia = {
    id: "lancia", name: "Lancia", models: [
        "Dedra",
        "Delta",
        "Kappa",
        "Lybra",
        "Musa",
        "Phedra",
        "Voyager",
        "Ypsilon",
        "Pozostałe",]
}

const landrover = {
    id: "landrover", name: "Land Rover", models: [
        "Defender",
        "Discovery",
        "Freelander",
        "Range Rover",
        "Velar",
        "Pozostałe",]
}

const lexus = {
    id: "lexus", name: "Lexus", models: [
        "CT",
        "ES",
        "GS",
        "GX",
        "HS",
        "IS",
        "LC",
        "LS",
        "LX",
        "NX",
        "RC",
        "RX",
        "UX",
        "Pozostałe",]
}

const mazda = {
    id: "mazda", name: "Mazda", models: [
        "2",
        "3",
        "5",
        "6",
        "CX-3",
        "CX-30",
        "CX-5",
        "CX-7",
        "CX-8",
        "CX-9",
        "MX-3",
        "MX-30",
        "MX-5",
        "MX-6",
        "RX-7",
        "RX-8",
        "Pozostałe",]
}

const mercedesbenz = {
    id: "mercedesbenz", name: "Mercedes-Benz", models: [
        "Klasa A",
        "Klasa B",
        "Klasa C",
        "Klasa E",
        "Klasa G",
        "Klasa M",
        "Klasa R",
        "Klasa S",
        "Klasa V",
        "CL",
        "CLA",
        "CLC",
        "CLK",
        "CLS",
        "EQC",
        "EQV",
        "GL",
        "GLA",
        "GLB",
        "GLC",
        "GLE",
        "GLK",
        "GLS",
        "Maybach",
        "ML",
        "SL",
        "SLC",
        "SLK",
        "Seria 190",
        "Seria 200",
        "Seria 300",
        "Citan",
        "Sprinter",
        "Vaneo",
        "Viano",
        "Vito",
        "W123",
        "W124",
        "Pozostałe",]
}

const mini = {
    id: "mini", name: "Mini", models: [
        "Cabrio",
        "Clubman",
        "Clubvan",
        "Cooper",
        "Cooper S",
        "Countryman",
        "Coupe",
        "Mini",
        "One",
        "Paceman",
        "Roadster",
        "Pozostałe",]
}

const mitsubishi = {
    id: "mitsubishi", name: "Mitsubishi", models: [
        "3000 GT",
        "ASX",
        "Carisma",
        "Colt",
        "Eclipse",
        "Endeavor",
        "Galant",
        "Grandis",
        "L200",
        "L400",
        "Lancer",
        "Lancer Evolution VII",
        "Lancer Evolution VIII",
        "Lancer Evolution IX",
        "Lancer Evolution X",
        "Montero",
        "Outlander",
        "Pajero",
        "Sigma",
        "Space Gear",
        "Space Runner",
        "Space Star",
        "Space Wagon",
        "Pozostałe",]
}

const nissan = {
    id: "nissan", name: "Nissan", models: [
        "100 NX",
        "200 SX",
        "300 ZX",
        "350 Z ",
        "370 Z",
        "Almera",
        "Altima",
        "Evalia",
        "Frontier",
        "GT-R",
        "Juke",
        "King Cab",
        "Leaf",
        "Maxima",
        "Micra",
        "Murano",
        "Navara",
        "New Micra",
        "Note",
        "NV200",
        "Pathfinder",
        "Patrol",
        "Pickup",
        "Pixo",
        "Prairie",
        "Primastar",
        "Primera",
        "Qashqai",
        "Quest ",
        "Sentra",
        "Serena",
        "Skyline",
        "Sunny",
        "Terrano",
        "Tiida",
        "X-Trail",
        "Pozostałe",]
}

const opel = {
    id: "opel", name: "Opel", models: [
        "Agila",
        "Antara",
        "Ascona",
        "Astra",
        "Calibra",
        "Campo",
        "Combo",
        "Corsa",
        "Crosslod",
        "Frontera",
        "GT",
        "Grandland",
        "Insignia",
        "Kadett",
        "Manta",
        "Meriva",
        "Mokka",
        "Monterey",
        "Movano",
        "Omega",
        "Rekord",
        "Senator",
        "Signum",
        "Sintra",
        "Tigra",
        "Vectra",
        "Vivaro",
        "Zafira",
        "Pozostałe",]
}

const peugeot = {
    id: "peugeot", name: "Peugeot", models: [
        "106",
        "107",
        "205",
        "206",
        "206 CC",
        "206 plus",
        "207",
        "207 CC",
        "208",
        "301",
        "306",
        "307",
        "308",
        "309",
        "404",
        "405",
        "406",
        "407",
        "508",
        "605",
        "607",
        "806",
        "807",
        "1007",
        "2008",
        "3008",
        "4007",
        "5008",
        "Boxer",
        "Bipper",
        "Expert",
        "Partner",
        "RCZ",
        "Rifter",
        "Traveller",
        "Pozostałe",]
}

const porsche = {
    id: "porsche", name: "Porsche", models: [
        "911",
        "924",
        "928",
        "944",
        "Boxster",
        "Carrera",
        "Cayenne",
        "Cayenne S",
        "Cayenne Turbo",
        "Cayman",
        "Macan",
        "Panamera",
        "Taycan",
        "Pozostałe",]
}

const renault = {
    id: "renault", name: "Renault", models: [
        "4",
        "5",
        "11",
        "19",
        "21",
        "Avantime",
        "Captur",
        "Clio",
        "Coupe",
        "Espace",
        "Fluence",
        "Grand Espace",
        "Grand Scenic",
        "Kadjar",
        "Kangoo",
        "Koleos",
        "Laguna",
        "Latitude",
        "Master",
        "Megane",
        "Modus",
        "Safrane",
        "Scenic",
        "Scenic Conquest",
        "Scenic RX4",
        "Talisman",
        "Thalia",
        "Trafic",
        "Twingo",
        "Vel Satis",
        "Zoe",
        "Pozostałe",]
}

const rover = {
    id: "rover", name: "Rover", models: [
        "25",
        "45",
        "75",
        "111",
        "200",
        "214",
        "216",
        "218",
        "220",
        "400",
        "414",
        "416",
        "418",
        "420",
        "600",
        "618",
        "620",
        "623",
        "820",
        "825",
        "827",
        "MG",
        "Pozostałe",]
}

const saab = {
    id: "saab", name: "Saab", models: [
        "9-3",
        "9-5",
        "9-7X",
        "900",
        "9000",
        "Pozostałe",]
}

const seat = {
    id: "seat", name: "Seat", models: [
        "Alhambra",
        "Altea",
        "Altea XL",
        "Arosa",
        "Arona",
        "Ateca",
        "Cordoba",
        "Exeo",
        "Ibiza",
        "Inca",
        "Leon",
        "Terra",
        "Tarraco",
        "Toledo",
        "Pozostałe",]
}

const skoda = {
    id: "skoda", name: "Skoda", models: [
        "Citigo",
        "Enyaq iV",
        "Fabia",
        "Kamiq",
        "Karoq",
        "Kodiaq",
        "Octavia",
        "Scala",
        "Rapid",
        "Roomster",
        "Superb",
        "Yeti",
        "Pozostałe",]
}

const smart = {
    id: "smart", name: "Smart", models: [
        "Fortwo",
        "Forfour",
        "Roadster",
        "Pozostałe",]
}

const ssangyong = {
    id: "ssangyong", name: "SsangYong", models: [
        "Korando",
        "Musso",
        "Kyron",
        "Rexton",
        "Tivoli",
        "XLV",
        "Pozostałe",]
}

const subaru = {
    id: "subaru", name: "Subaru", models: [
        "Forester",
        "Impreza",
        "Justy",
        "Legacy",
        "Outback",
        "Tribeca",
        "WRX STI",
        "XV",
        "Pozostałe",]
}

const suzuki = {
    id: "suzuki", name: "Suzuki", models: [
        "Across",
        "Alto",
        "Baleno",
        "Calerio",
        "Grand Vitara",
        "Ignis",
        "Jimny",
        "Liana",
        "Samurai",
        "SJ",
        "Splash",
        "Swace",
        "Swift",
        "SX4 ",
        "Vitara",
        "Wagon",
        "Pozostałe",]
}

const toyota = {
    id: "toyota", name: "Toyota", models: [
        "4Runner",
        "Auris",
        "Avalon",
        "Avensis",
        "Avensis Verso",
        "Aygo",
        "C-HR",
        "Camry",
        "Carina",
        "Celica",
        "Corolla",
        "Corolla Verso",
        "FJ",
        "GT86",
        "Highlander",
        "Hilux",
        "iQ",
        "Land Cruiser",
        "Matrix",
        "MR2",
        "Paseo",
        "Previa",
        "Prius",
        "Proace",
        "RAV4",
        "Sequoia",
        "Sienna",
        "Starlet",
        "Supra",
        "Tacoma",
        "Verso",
        "Yaris",
        "Yaris Hybrid",
        "Yaris Verso",
        "Pozostałe",]
}

const volkswagen = {
    id: "volkswagen", name: "Volkswagen", models: [
        "Amarok",
        "Arteon",
        "Beetle",
        "Bora",
        "Buggy",
        "CC",
        "Caddy",
        "Caravelle",
        "Corrado",
        "Crafter",
        "Eos",
        "Fox",
        "Garbus",
        "Golf",
        "Golf Plus",
        "ID.3",
        "ID.4",
        "Jetta",
        "Lupo",
        "Multivan",
        "New Beetle",
        "Passat",
        "Passat CC",
        "Phaeton",
        "Polo",
        "Scirocco",
        "Sharan",
        "T-Cross",
        "T-Roc",
        "Tiguan",
        "Touareg",
        "Touran",
        "Transporter",
        "Up!",
        "Vento",
        "Pozostałe",]
}

const volvo = {
    id: "volvo", name: "Volvo", models: [
        "C30",
        "C70",
        "S40",
        "S60",
        "S70",
        "S80",
        "S90",
        "V40",
        "V50",
        "V60",
        "V70",
        "V90",
        "XC40",
        "XC60",
        "XC70",
        "XC90",
        "Pozostałe",]
}

//     "Alfa Romeo",
//     "Audi",
//     "BMW",
//     "Cadillac",
//     "Chevrolet",
//     "Chrysler",
//     "Citroen",
//     "Dacia",
//     "Daewoo",
//     "Daihatsu",
//     "Dodge",
//     "Fiat",
//     "Ford",
//     "Honda",
//     "Hyundai",
//     "Infiniti",
//     "Jaguar",
//     "Jeep",
//     "Kia",
//     "Lancia",
//     "Land Rover",
//     "Lexus",
//     "Mazda",
//     "Mercedes-Benz",
//     "Mini",
//     "Mitsubishi",
//     "Nissan",
//     "Opel",
//     "Peugeot",
//     "Porsche",
//     "Renault",
//     "Rover",
//     "Saab",
//     "Seat",
//     "Skoda",
//     "Smart",
//     "SsangYong",
//     "Subaru",
//     "Suzuki",
//     "Toyota",
//     "Volkswagen",
//     "Volvo",
//     "Pozostałe",


export const cars = [alfaromeo, audi, bmw, cadillac, chevrolet, chrysler, citroen, dacia, daewoo, daihatsu, dodge, fiat, ford, honda, hyundai, infiniti, jaguar, jeep, kia, lancia, landrover, lexus, mazda, mercedesbenz, mini, mitsubishi, nissan, opel, peugeot, porsche, renault, rover, saab, seat, skoda, smart, ssangyong, subaru, suzuki, toyota, volkswagen, volvo]


// ----------------------- STOP CARS ARRAY --------------------------//

