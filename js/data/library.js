// export const svgLibrary = [
//   {
//     id: "label",
//     label: "Beschriftung",
//     station: "Werkzeuge",
//     tags: ["text", "label", "beschriftung"]
//   },

//   {
//     id: "pipette",
//     label: "Pipette",
//     station: "Laborgeräte",
//     path: "assets/svg/pipette.svg",
//     tags: ["pipette", "labor", "flüssigkeit"]
//   },

//   {
//     id: "becherglas",
//     label: "Becherglas",
//     station: "Glaswaren",
//     path: "assets/svg/becherglas.svg",
//     tags: ["glas", "becher", "chemie"]
//   }
// ];

// export const svgLibrary = [
//   {
//     id: "label",
//     label: "Beschriftung",
//     station: "Werkzeuge",
//     tags: ["text", "label", "beschriftung"],
//     anchorPoints: [
//       { id: "left", label: "Links", x: -10, y: -12, type: "connector" },
//       { id: "right", label: "Rechts", x: 160, y: -12, type: "connector" }
//     ]
//   },

//   {
//     id: "pipette",
//     label: "Pipette",
//     station: "Laborgeräte",
//     path: "assets/svg/pipette.svg",
//     tags: ["pipette", "labor", "flüssigkeit"],
//     anchorPoints: [
//       { id: "tip", label: "Spitze", x: 50, y: 180, type: "connector" },
//       { id: "top", label: "Oberes Ende", x: 50, y: 10, type: "connector" },
//       { id: "center", label: "Mitte", x: 50, y: 95, type: "center" }
//     ]
//   },

//   {
//     id: "becherglas",
//     label: "Becherglas",
//     station: "Glaswaren",
//     path: "assets/svg/becherglas.svg",
//     tags: ["glas", "becher", "chemie"],
//     anchorPoints: [
//       { id: "rim-left", label: "Rand links", x: 20, y: 25, type: "connector" },
//       { id: "rim-right", label: "Rand rechts", x: 80, y: 25, type: "connector" },
//       { id: "surface", label: "Flüssigkeitsoberfläche", x: 50, y: 65, type: "connector" },
//       { id: "center", label: "Mitte", x: 50, y: 90, type: "center" }
//     ]
//   },

//   {
//     id: "testtube",
//     label: "Reagenzglas",
//     station: "Glaswaren",
//     path: "assets/svg/testtube.svg",
//     tags: ["reagenzglas", "glas", "probe"],
//     anchorPoints: [
//       { id: "opening", label: "Öffnung", x: 50, y: 10, type: "connector" },
//       { id: "middle", label: "Mitte", x: 50, y: 100, type: "center" },
//       { id: "bottom", label: "Boden", x: 50, y: 190, type: "connector" },
//       { id: "liquid", label: "Flüssigkeitsstand", x: 50, y: 90, type: "connector" }
//     ]
//   },

//   {
//     id: "microscope",
//     label: "Mikroskop",
//     station: "Mikroskopie",
//     path: "assets/svg/microscope.svg",
//     tags: ["mikroskop", "mikroskopie", "biologie"],
//     anchorPoints: [
//       { id: "stage", label: "Objekttisch", x: 105, y: 120, type: "connector" },
//       { id: "eyepiece", label: "Okular", x: 75, y: 35, type: "connector" },
//       { id: "base", label: "Fuß", x: 110, y: 185, type: "connector" }
//     ]
//   }
// ];

export const svgLibrary = [
  {
    id: "Material",
    label: "Material",
    station: "Checkpoint Alpha",
    path: "assets/svg/Test.svg"
  },
  {
    id: "Daphnien_Becherglas",
    label: "Daphnien (Becherglas)",
    station: "Checkpoint Beta",
    path: "assets/svg/Daphnien_Becherglas.svg",
    tags: ["glas", "becher", "chemie"],
    anchorPoints: [
      { id: "rim-left", label: "Rand links", x: 20, y: 25, type: "connector" },
      { id: "rim-right", label: "Rand rechts", x: 80, y: 25, type: "connector" },
      { id: "surface", label: "Flüssigkeitsoberfläche", x: 50, y: 65, type: "connector" },
      { id: "center", label: "Mitte", x: 50, y: 90, type: "center" }
    ]
  },
  {
    id: "Taschenlampe_UV",
    label: "Taschenlampe (UV)",
    station: "Checkpoint Beta",
    path: "assets/svg/Taschenlampe_UV.svg"
  },
  {
    id: "Schutzbrille_UV",
    label: "Schutzbrille (UV)",
    station: "Checkpoint Beta",
    path: "assets/svg/Schutzbrille_UV.svg"
  },
  {
    id: "Stativ",
    label: "Stativ",
    station: "Checkpoint Beta",
    path: "assets/svg/Stativ.svg"
  },
  {
    id: "Stereomikroskop",
    label: "Stereomikroskop",
    station: "Checkpoint Beta",
    path: "assets/svg/Stereomikroskop.svg",
    tags: ["mikroskop", "mikroskopie", "biologie"],
    anchorPoints: [
      { id: "stage", label: "Objekttisch", x: 105, y: 120, type: "connector" },
      { id: "eyepiece", label: "Okular", x: 75, y: 35, type: "connector" },
      { id: "base", label: "Fuß", x: 110, y: 185, type: "connector" }
    ]
  },
  {
    id: "Schnappdeckelglas_Suspension",
    label: "Schnappdeckelglas (Suspension)",
    station: "Checkpoint Beta",
    path: "assets/svg/Schnappdeckelglas_Suspension.svg"
  },
  {
    id: "Pipette",
    label: "Pipette",
    station: "Checkpoint Beta",
    path: "assets/svg/Pipette.svg",
    tags: ["pipette", "labor", "flüssigkeit"],
    anchorPoints: [
      { id: "tip", label: "Spitze", x: 50, y: 180, type: "connector" },
      { id: "top", label: "Oberes Ende", x: 50, y: 10, type: "connector" },
      { id: "center", label: "Mitte", x: 50, y: 95, type: "center" }
    ]
  },
  {
    id: "Uhrglas",
    label: "Uhrglas",
    station: "Checkpoint Beta",
    path: "assets/svg/Uhrglas.svg"
  },
  {
    id: "Präparat_Glanzwurm",
    label: "Präparat (Glanzwurm)",
    station: "Checkpoint Beta",
    path: "assets/svg/Präparat_Glanzwurm.svg"
  },
  {
    id: "Taschenlampe_Grünlicht",
    label: "Taschenlampe (Grünlicht)",
    station: "Checkpoint Beta",
    path: "assets/svg/Taschenlampe_Grünlicht.svg"
  },
    {
    id: "Mikroskop (Invers)",
    label: "Mikroskop (Invers)",
    station: "Checkpoint Beta",
    path: "assets/svg/Inverses_Mikroskop.svg",
    tags: ["mikroskop", "mikroskopie", "biologie"],
    anchorPoints: [
      { id: "stage", label: "Objekttisch", x: 105, y: 120, type: "connector" },
      { id: "eyepiece", label: "Okular", x: 75, y: 35, type: "connector" },
      { id: "base", label: "Fuß", x: 110, y: 185, type: "connector" }
    ]
  },
  {
    id: "Mikrotom",
    label: "Mikrotom",
    station: "Checkpoint Beta",
    path: "assets/svg/Mikrotom.svg"
  },
  {
    id: "Petrischale_Wasser",
    label: "Petrischale (Wasser)",
    station: "Checkpoint Beta",
    path: "assets/svg/Petrischale_Wasser.svg"
  },
  {
    id: "Pinzette",
    label: "Pinzette",
    station: "Checkpoint Beta",
    path: "assets/svg/Pinzette.svg"
  },
  {
    id: "Pinsel",
    label: "Pinsel",
    station: "Checkpoint Beta",
    path: "assets/svg/Pinsel.svg"
  },
  {
    id: "Objektträger",
    label: "Objektträger",
    station: "Checkpoint Beta",
    path: "assets/svg/Objektträger.svg"
  },
    {
    id: "Stereomikroskop",
    label: "Stereomikroskop",
    station: "Checkpoint Beta",
    path: "assets/svg/Stereomikroskop.svg",
    tags: ["mikroskop", "mikroskopie", "biologie"],
    anchorPoints: [
      { id: "stage", label: "Objekttisch", x: 105, y: 120, type: "connector" },
      { id: "eyepiece", label: "Okular", x: 75, y: 35, type: "connector" },
      { id: "base", label: "Fuß", x: 110, y: 185, type: "connector" }
    ]
  },
  {
    id: "Schnappdeckelglas_Wasser",
    label: "Schnappdeckelglas (Wasser)",
    station: "Checkpoint Beta",
    path: "assets/svg/Schnappdeckelglas_Wasser.svg"
  },
  {
    id: "Petrischale_Leer",
    label: "Petrischale (Leer)",
    station: "Checkpoint Beta",
    path: "assets/svg/Petrischale_Leer.svg"
  },
  {
    id: "Taschenlampe_Grünlicht",
    label: "Taschenlampe (Grünlicht)",
    station: "Checkpoint Beta",
    path: "assets/svg/Taschenlampe_Grünlicht.svg"
  },
  {
    id: "Pinzette",
    label: "Pinzette",
    station: "Checkpoint Beta",
    path: "assets/svg/Pinzette.svg"
  },
    {
    id: "Stereomikroskop",
    label: "Stereomikroskop",
    station: "Checkpoint Beta",
    path: "assets/svg/Stereomikroskop.svg",
    tags: ["mikroskop", "mikroskopie", "biologie"],
    anchorPoints: [
      { id: "stage", label: "Objekttisch", x: 105, y: 120, type: "connector" },
      { id: "eyepiece", label: "Okular", x: 75, y: 35, type: "connector" },
      { id: "base", label: "Fuß", x: 110, y: 185, type: "connector" }
    ]
  },
  {
    id: "Reagenzglas_Paramecium",
    label: "Reagenzglas (Paramecium)",
    station: "Checkpoint Beta",
    path: "assets/svg/Reagenzglas_Paramecium.svg",
    tags: ["reagenzglas", "glas", "probe"],
    anchorPoints: [
      { id: "opening", label: "Öffnung", x: 50, y: 10, type: "connector" },
      { id: "middle", label: "Mitte", x: 50, y: 100, type: "center" },
      { id: "bottom", label: "Boden", x: 50, y: 190, type: "connector" },
      { id: "liquid", label: "Flüssigkeitsstand", x: 50, y: 90, type: "connector" }
    ]
  },
  // {
  //   id: "Petrischale_Amöben",
  //   label: "Petrischale (Amöben)",
  //   path: "assets/svg/Petrischale_Amöbe.svg"
  // },
  {
    id: "Objektträger",
    label: "Objektträger",
    station: "Checkpoint Beta",
    path: "assets/svg/Objektträger.svg"
  },
  {
    id: "Glassplitter",
    label: "Glassplitter",
    station: "Checkpoint Beta",
    path: "assets/svg/Glassplitter.svg"
  },
  {
    id: "Deckgläschen",
    label: "Deckgläschen",
    station: "Checkpoint Beta",
    path: "assets/svg/Deckgläschen.svg"
  },
  {
    id: "Schnappdeckelglas_Suspension",
    label: "Schnappdeckelglas (Suspension)",
    station: "Checkpoint Beta",
    path: "assets/svg/Schnappdeckelglas_Suspension.svg"
  },
  {
    id: "Eppendorf-Pipette",
    label: "Eppendorf-Pipette",
    station: "Checkpoint Beta",
    path: "assets/svg/Eppendorf-Pipette.svg"
  },
  {
    id: "Petrischale_Leer",
    label: "Petrischale (Leer)",
    station: "Checkpoint Beta",
    path: "assets/svg/Petrischale_Leer.svg"
  },
    {
    id: "Stereomikroskop",
    label: "Stereomikroskop",
    station: "Checkpoint Beta",
    path: "assets/svg/Stereomikroskop.svg",
    tags: ["mikroskop", "mikroskopie", "biologie"],
    anchorPoints: [
      { id: "stage", label: "Objekttisch", x: 105, y: 120, type: "connector" },
      { id: "eyepiece", label: "Okular", x: 75, y: 35, type: "connector" },
      { id: "base", label: "Fuß", x: 110, y: 185, type: "connector" }
    ]
  },
    {
    id: "Durchlicht_Mikroskop",
    label: "Durchlicht Mikroskop",
    station: "Checkpoint Beta",
    path: "assets/svg/Durchlicht_Mikroskop.svg"
  },
  {
    id: "Calciumchlorid-Lösung",
    label: "Calciumchlorid-Lösung",
    station: "Checkpoint Gamma",
    path: "assets/svg/Calciumchlorid-Lösung.svg"
  },
  {
    id: "Wasser_Blau",
    label: "Wasser (Blau)",
    station: "Checkpoint Gamma",
    path: "assets/svg/Wasser_Blau.svg"
  },
  {
    id: "Ethanol_Gelb",
    label: "Ethanol Gelb",
    station: "Checkpoint Gamma",
    path: "assets/svg/Ethanol_Gelb.svg"
  },
  {
    id: "Reagenzglas_Leer",
    label: "Reagenzglas (Leer)",
    station: "Checkpoint Gamma",
    path: "assets/svg/Reagenzglas_Leer.svg",
    tags: ["reagenzglas", "glas", "probe"],
    anchorPoints: [
      { id: "opening", label: "Öffnung", x: 50, y: 10, type: "connector" },
      { id: "middle", label: "Mitte", x: 50, y: 100, type: "center" },
      { id: "bottom", label: "Boden", x: 50, y: 190, type: "connector" },
      { id: "liquid", label: "Flüssigkeitsstand", x: 50, y: 90, type: "connector" }
    ]
  },
  {
    id: "Holzspieß",
    label: "Holzspieß",
    station: "Checkpoint Gamma",
    path: "assets/svg/Holzspieß.svg"
  },
  {
    id: "Kunststoff-Granulat",
    label: "Kunststoff-Granulat",
    station: "Checkpoint Gamma",
    path: "assets/svg/Kunststoff-Granulat.svg"
  },
  {
    id: "Dichteflasche",
    label: "Dichteflasche",
    path: "assets/svg/Dichteflasche.svg"
  },
  {
    id: "Objektträger_Deckgläschen",
    label: "Objektträger mit Deckgläschen",
    path: "assets/svg/Objektträger_Deckgläschen.svg"
  },
  {
    id: "Reagenzglasständer",
    label: "Reagenzglasständer",
    path: "assets/svg/Reagenzglasständer.svg"
  },
  {
    id: "Schnappdeckelglas_Leer",
    label: "Schnappdeckelglas (Leer)",
    path: "assets/svg/Schnappdeckelglas_Leer.svg"
  },
  {
    id: "Schutzbrille",
    label: "Schutzbrille (Normal)",
    path: "assets/svg/Schutzbrille.svg"
  },
  {
    id: "Material",
    label: "Material",
    path: "assets/svg/Material.svg"
  },
  {
    id: "Daphnia_Magna",
    label: "Daphnia Magna",
    path: "assets/svg/Daphnia_Magna.svg"
  },
{
  id: "label",
  label: "Beschriftung",
  station: "Werkzeuge",
  icon: "assets/icons/text.svg",
    tags: ["text", "label", "beschriftung"],
    anchorPoints: [
      { id: "left", label: "Links", x: -10, y: -12, type: "connector" },
      { id: "right", label: "Rechts", x: 160, y: -12, type: "connector" }
    ]
}
];