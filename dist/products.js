// Sample catalogue. Replace records and image paths with verified supplier data before launch.
const products = [
  {
    "id": "paper-a4",
    "category": "paper",
    "name": "A4 photocopy paper",
    "summary": "80 gsm \u00b7 white \u00b7 500 sheets",
    "unit": "Ream of 500 sheets",
    "specs": {
      "Size": "A4",
      "Weight": "80 gsm",
      "Colour": "White",
      "Sheets per ream": "500"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "paper-a3",
    "category": "paper",
    "name": "A3 photocopy paper",
    "summary": "80 gsm \u00b7 white \u00b7 500 sheets",
    "unit": "Ream of 500 sheets",
    "specs": {
      "Size": "A3",
      "Weight": "80 gsm",
      "Colour": "White",
      "Sheets per ream": "500"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "exam-pad",
    "category": "books",
    "name": "A4 examination pad",
    "summary": "100 sheets \u00b7 ruled",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Sheets": "100",
      "Ruling": "Ruled"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "pens-blue",
    "category": "pens",
    "name": "Blue ballpoint pens",
    "summary": "Medium tip \u00b7 pack of 10",
    "unit": "Pack of 10 pens",
    "specs": {
      "Ink colour": "Blue",
      "Tip": "Medium",
      "Pens per pack": "10"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "pens-black",
    "category": "pens",
    "name": "Black ballpoint pens",
    "summary": "Medium tip \u00b7 pack of 10",
    "unit": "Pack of 10 pens",
    "specs": {
      "Ink colour": "Black",
      "Tip": "Medium",
      "Pens per pack": "10"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "pencils-hb",
    "category": "pens",
    "name": "HB graphite pencils",
    "summary": "HB grade \u00b7 pack of 12",
    "unit": "Pack of 12 pencils",
    "specs": {
      "Grade": "HB",
      "Pencils per pack": "12"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "highlighters",
    "category": "pens",
    "name": "Assorted highlighters",
    "summary": "Chisel tip \u00b7 set of 4",
    "unit": "Set of 4",
    "specs": {
      "Tip": "Chisel",
      "Colours": "Assorted",
      "Markers per set": "4"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "file-lever",
    "category": "files",
    "name": "A4 lever arch file",
    "summary": "70 mm spine \u00b7 each",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Spine width": "70 mm",
      "Type": "Lever arch"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "file-pocket",
    "category": "files",
    "name": "A4 display file",
    "summary": "30 pockets \u00b7 each",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Pockets": "30",
      "Type": "Display file"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "folders",
    "category": "files",
    "name": "A4 document folders",
    "summary": "Manilla \u00b7 pack of 10",
    "unit": "Pack of 10 folders",
    "specs": {
      "Size": "A4",
      "Material": "Manilla",
      "Folders per pack": "10"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "exercise-72",
    "category": "books",
    "name": "A4 exercise book",
    "summary": "72 pages \u00b7 feint and margin",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Pages": "72",
      "Ruling": "Feint and margin"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "exercise-192",
    "category": "books",
    "name": "A4 hardcover notebook",
    "summary": "192 pages \u00b7 ruled",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Pages": "192",
      "Cover": "Hardcover",
      "Ruling": "Ruled"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "spiral-a5",
    "category": "books",
    "name": "A5 spiral notebook",
    "summary": "160 pages \u00b7 ruled",
    "unit": "Each",
    "specs": {
      "Size": "A5",
      "Pages": "160",
      "Binding": "Spiral",
      "Ruling": "Ruled"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "coloured-pencils",
    "category": "art",
    "name": "Coloured pencils",
    "summary": "12 colours \u00b7 one set",
    "unit": "Set of 12",
    "specs": {
      "Colours": "12 assorted",
      "Type": "Colouring pencils"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "wax-crayons",
    "category": "art",
    "name": "Wax crayons",
    "summary": "12 colours \u00b7 one set",
    "unit": "Set of 12",
    "specs": {
      "Colours": "12 assorted",
      "Type": "Wax crayons"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "glue-stick",
    "category": "art",
    "name": "Glue stick",
    "summary": "20 g \u00b7 each",
    "unit": "Each",
    "specs": {
      "Size": "20 g",
      "Type": "Glue stick"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "ruler-30",
    "category": "ruler",
    "name": "Clear plastic ruler",
    "summary": "30 cm \u00b7 each",
    "unit": "Each",
    "specs": {
      "Length": "30 cm",
      "Material": "Clear plastic"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "geometry-set",
    "category": "ruler",
    "name": "Geometry set",
    "summary": "Compass, ruler and drawing tools",
    "unit": "Set",
    "specs": {
      "Contents": "Confirm against your school list",
      "Type": "Geometry set"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "calculator-basic",
    "category": "calc",
    "name": "Desktop calculator",
    "summary": "12-digit display \u00b7 each",
    "unit": "Each",
    "specs": {
      "Display": "12 digits",
      "Type": "Desktop calculator"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "calculator-scientific",
    "category": "calc",
    "name": "Scientific calculator",
    "summary": "Specify the required model",
    "unit": "Each",
    "specs": {
      "Model": "Buyer to specify",
      "Type": "Scientific calculator",
      "Alternatives": "Subject to buyer approval"
    },
    "brand": "To be confirmed",
    "image": ""
  },
  {
    "id": "learner-pack",
    "category": "pack",
    "name": "Learner stationery pack",
    "summary": "Contents to match your approved list",
    "unit": "Pack per learner",
    "specs": {
      "Grade": "Buyer to specify",
      "Pack contents": "Attach approved list",
      "Quantity basis": "One pack per learner"
    },
    "brand": "To be confirmed",
    "image": ""
  }
];
