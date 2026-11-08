// Sample catalogue. Images are AI-generated illustrations, not actual-stock photographs.
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
    "image": "images/paper-a4-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/paper-a3-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/exam-pad-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/pens-blue-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/pens-black-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/pencils-hb-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/highlighters-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/file-lever-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/file-pocket-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/folders-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/exercise-72-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/exercise-192-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/spiral-a5-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/coloured-pencils-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/wax-crayons-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/glue-stick-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/ruler-30-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/geometry-set-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/calculator-basic-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/calculator-scientific-v1.webp",
    "imageType": "generated illustrative image"
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
    "image": "images/learner-pack-v1.webp",
    "imageType": "generated illustrative image"
  }
,
{
  "id": "glenanda-01",
  "category": "files",
  "name": "A4 blue PVC 2-ring binder",
  "summary": "25 mm · marked DISC in source",
  "unit": "Each",
  "specs": {
    "Size": "A4",
    "Spine width": "25 mm",
    "Material": "PVC",
    "Colour": "Blue",
    "Source status": "Marked **DISC**; availability to be confirmed"
  },
  "brand": "Not specified",
  "sourceDescription": "**DISC**A4 2 RING BINDER 25MM PVC BLUE"
},
{
  "id": "glenanda-02",
  "category": "files",
  "name": "Board Trunk A4 2-ring binder",
  "summary": "25 mm · BIN-6000-01",
  "unit": "Each",
  "specs": {
    "Size": "A4",
    "Spine width": "25 mm",
    "Material": "Board",
    "Model": "BIN-6000-01"
  },
  "brand": "Board Trunk",
  "sourceDescription": "A4 2 RING BINDER 25MM BOARD TRUNK BIN-6000-01 *BTS*"
},
{
  "id": "glenanda-03",
  "category": "books",
  "name": "A4 punched examination pad",
  "summary": "80 pages · punched",
  "unit": "Each",
  "specs": {
    "Size": "A4",
    "Pages": "80",
    "Type": "Punched exam pad"
  },
  "brand": "Not specified",
  "sourceDescription": "A4 80P EXAM PAD PUNCHED"
},
{
  "id": "glenanda-04",
  "category": "files",
  "name": "A4 clear stud-close carry folder",
  "summary": "160 micron PVC",
  "unit": "Each",
  "specs": {
    "Size": "A4",
    "Material": "PVC",
    "Thickness": "160 micron",
    "Closure": "Stud"
  },
  "brand": "Not specified",
  "sourceDescription": "A4 CARRY FOLDER WITH STUD CLOSE PVC CLEAR 160MIC EACH"
},
{
  "id": "glenanda-05",
  "category": "files",
  "name": "Donau A4 black lever arch file",
  "summary": "Black polypropylene",
  "unit": "Each",
  "specs": {
    "Size": "A4",
    "Material": "Polypropylene",
    "Colour": "Black",
    "Type": "Lever arch"
  },
  "brand": "Donau",
  "sourceDescription": "A4 LEVER ARCH FILE BLACK POLYPRO DONAU EACH *BTS*"
},
{
  "id": "glenanda-06",
  "category": "files",
  "name": "A4 clear multipunch filing pockets",
  "summary": "40/50 micron · pack of 10",
  "unit": "Pack of 10 pockets",
  "specs": {
    "Size": "A4",
    "Material": "Polypropylene",
    "Thickness": "40/50 micron",
    "Finish": "Glass clear, anti-static"
  },
  "brand": "Not specified",
  "sourceDescription": "A4 MULTIPUNCH POCKETS PP 40/50 MIC 10S GLASS CLEAR ANTI-STATIC"
},
{
  "id": "glenanda-07",
  "category": "files",
  "name": "A4 clear secretarial folder",
  "summary": "Clear · each",
  "unit": "Each",
  "specs": {
    "Size": "A4",
    "Colour": "Clear",
    "Type": "Secretarial folder"
  },
  "brand": "Not specified",
  "sourceDescription": "A4 SECRETARIAL FOLDER CLEAR EACH"
},
{
  "id": "glenanda-08",
  "category": "art",
  "name": "Amos glue stick 22 g",
  "summary": "22 g · each",
  "unit": "Each",
  "specs": {
    "Size": "22 g",
    "Type": "Glue stick"
  },
  "brand": "Amos",
  "sourceDescription": "AMOS GLUE STICK 22G"
},
{
  "id": "glenanda-09",
  "category": "art",
  "name": "Amos glue stick 40 g",
  "summary": "40 g · each",
  "unit": "Each",
  "specs": {
    "Size": "40 g",
    "Type": "Glue stick"
  },
  "brand": "Amos",
  "sourceDescription": "AMOS GLUE STICK 40G*BTS*"
},
{
  "id": "glenanda-10",
  "category": "pack",
  "name": "Large pencil case",
  "summary": "Large · 330 × 100 × 50 mm",
  "unit": "Each",
  "specs": {
    "Size": "330 × 100 × 50 mm",
    "Model": "MC2000 / Ritebox",
    "Type": "Pencil case",
    "Brand alternatives": "Bantex / Penflex"
  },
  "brand": "Brand to be confirmed",
  "sourceDescription": "BANTEX MC2000/ PENFLEX RITEBOX PENCIL CASE LARGE 330 X 100 X 50MM *BTS*"
},
{
  "id": "glenanda-11",
  "category": "files",
  "name": "Bantex A4 multipunch filing pockets",
  "summary": "50 micron · pack of 10",
  "unit": "Pack of 10 pockets",
  "specs": {
    "Size": "A4",
    "Thickness": "50 micron",
    "Type": "Multipunch pockets"
  },
  "brand": "Bantex",
  "sourceDescription": "BANTEX MULTIPUNCH FILING POCKETS 10S 50MIC A4"
},
{
  "id": "glenanda-12",
  "category": "pens",
  "name": "BIC Crystal Xtra Life blue ballpoint pen",
  "summary": "Medium point · each",
  "unit": "Each",
  "specs": {
    "Ink colour": "Blue",
    "Tip": "Medium",
    "Model": "Crystal Xtra Life"
  },
  "brand": "BIC",
  "sourceDescription": "BIC CRYSTAL MEDIUM XTRA LIFE BALL PEN BLUE"
},
{
  "id": "glenanda-13",
  "category": "pens",
  "name": "BIC Orange fine point blue pen",
  "summary": "Fine point · each",
  "unit": "Each",
  "specs": {
    "Ink colour": "Blue",
    "Tip": "Fine",
    "Model": "Orange"
  },
  "brand": "BIC",
  "sourceDescription": "BIC ORANGE FINE POINT BLUE PEN*BTS*"
},
{
  "id": "glenanda-14",
  "category": "pack",
  "name": "Long clear blue pencil bag",
  "summary": "33 cm · each",
  "unit": "Each",
  "specs": {
    "Length": "33 cm",
    "Colour": "Clear blue",
    "Type": "Pencil bag"
  },
  "brand": "Not specified",
  "sourceDescription": "BLUE PENCIL BAG (LONG) 33CM CLEAR"
},
{
  "id": "glenanda-15",
  "category": "pack",
  "name": "Denim chair bag with pocket 44 cm",
  "summary": "44 cm · each",
  "unit": "Each",
  "specs": {
    "Size": "44 cm",
    "Material": "Denim",
    "Type": "Chair bag with pocket"
  },
  "brand": "Not specified",
  "sourceDescription": "CHAIR BAG DENIM 44CM WITH POCKET *BTS*"
},
{
  "id": "glenanda-16",
  "category": "pack",
  "name": "Denim chair bag with pocket 53.5 cm",
  "summary": "Special size · 53.5 cm",
  "unit": "Each",
  "specs": {
    "Size": "53.5 cm",
    "Material": "Denim",
    "Type": "Chair bag with pocket"
  },
  "brand": "Not specified",
  "sourceDescription": "CHAIR BAG DENIM 53.5CM WITH POCKET SPECIAL SIZE"
},
{
  "id": "glenanda-17",
  "category": "pens",
  "name": "Deli black whiteboard marker",
  "summary": "Bullet tip · 2 or 1.8 mm",
  "unit": "Each",
  "specs": {
    "Ink colour": "Black",
    "Tip": "Bullet",
    "Tip size": "2 or 1.8 mm (source specification)",
    "Type": "Whiteboard marker"
  },
  "brand": "Deli",
  "sourceDescription": "DELI WHITEBOARD MARKER BULLET TIP BLACK 2 OR 1.8MM*BTS*"
},
{
  "id": "glenanda-18",
  "category": "files",
  "name": "Kangaroo A4 display book 10 pockets",
  "summary": "10 pockets · 50 micron",
  "unit": "Each",
  "specs": {
    "Size": "A4",
    "Pockets": "10",
    "Thickness": "50 micron",
    "Type": "Display book"
  },
  "brand": "Kangaroo",
  "sourceDescription": "DISPLAY BOOK A4 10 POCKET 50MIC KANGAROO"
},
{
  "id": "glenanda-19",
  "category": "files",
  "name": "Kangaroo A4 display book 20 pockets",
  "summary": "20 pockets · 50 micron",
  "unit": "Each",
  "specs": {
    "Size": "A4",
    "Pockets": "20",
    "Thickness": "50 micron",
    "Type": "Display book"
  },
  "brand": "Kangaroo",
  "sourceDescription": "DISPLAY BOOK A4 20 POCKET 50MIC KANGAROO"
},
{
  "id": "glenanda-20",
  "category": "files",
  "name": "Kangaroo A4 display book 30 pockets",
  "summary": "30 pockets · 50 micron",
  "unit": "Each",
  "specs": {
    "Size": "A4",
    "Pockets": "30",
    "Thickness": "50 micron",
    "Type": "Display book"
  },
  "brand": "Kangaroo",
  "sourceDescription": "DISPLAY BOOK A4 30 POCKET 50MIC KANGAROO"
},
{
  "id": "glenanda-21",
  "category": "files",
  "name": "Wooden green felt chalkboard duster",
  "summary": "150 × 40 mm · each",
  "unit": "Each",
  "specs": {
    "Size": "150 × 40 mm",
    "Material": "Wood and green felt",
    "Type": "Chalkboard duster"
  },
  "brand": "Not specified",
  "sourceDescription": "DUSTER CHALK BOARD GREEN FELT ECONOMICAL 150MM X 40MM WOODEN"
},
{
  "id": "glenanda-22",
  "category": "files",
  "name": "Small wooden green felt board duster",
  "summary": "50 mm · each",
  "unit": "Each",
  "specs": {
    "Size": "50 mm",
    "Material": "Wood and green felt",
    "Type": "Board duster"
  },
  "brand": "Not specified",
  "sourceDescription": "DUSTER SMALL BOARD 50MM WOOD & GREEN FELT"
},
{
  "id": "glenanda-23",
  "category": "art",
  "name": "Aquarelle colouring pencils",
  "summary": "12 full-length pencils · AHT120212E",
  "unit": "Set of 12 pencils",
  "specs": {
    "Colours": "12 assorted",
    "Type": "Aquarelle colouring pencils",
    "Model": "AHT120212E",
    "Brand alternatives": "Faber-Castell / Adel"
  },
  "brand": "Brand to be confirmed",
  "sourceDescription": "FABER-CASTELL / ADEL COLOURING PENCILS AQUARELLE 12S FULL LENGTH (AHT120212E)"
},
{
  "id": "glenanda-24",
  "category": "art",
  "name": "Faber-Castell hexagonal colouring pencils",
  "summary": "12 pencils · 7 mm × 175 mm",
  "unit": "Set of 12 pencils",
  "specs": {
    "Colours": "12 assorted",
    "Size": "7 mm × 175 mm",
    "Type": "Hexagonal colouring pencils"
  },
  "brand": "Faber-Castell",
  "sourceDescription": "FABER-CASTELL COLOURING PENCILS 12S 7MM HEXAGONAL 175MM LENGTH*BTS*"
},
{
  "id": "glenanda-25",
  "category": "art",
  "name": "Faber-Castell Tri Grip slim wax crayons",
  "summary": "24 crayons · slim",
  "unit": "Set of 24 crayons",
  "specs": {
    "Colours": "24 assorted",
    "Type": "Tri Grip slim wax crayons"
  },
  "brand": "Faber-Castell",
  "sourceDescription": "FABER-CASTELL WAX CRAYONS TRI GRIP 24S SLIM"
},
{
  "id": "glenanda-26",
  "category": "ruler",
  "name": "Pre-cut flard cards / spreikaart",
  "summary": "Number range 0–1000",
  "unit": "Set",
  "specs": {
    "Number range": "0–1000",
    "Type": "Pre-cut number cards"
  },
  "brand": "Not specified",
  "sourceDescription": "FLARD CARD / SPREIKAART (PRE-CUT) 0 - 1000"
},
{
  "id": "glenanda-27",
  "category": "files",
  "name": "Black foldback clip 32 mm",
  "summary": "32 mm · each",
  "unit": "Each",
  "specs": {
    "Size": "32 mm",
    "Colour": "Black",
    "Type": "Foldback clip"
  },
  "brand": "Not specified",
  "sourceDescription": "FOLDBACK CLIPS 32MM BLACK EACH"
},
{
  "id": "glenanda-28",
  "category": "files",
  "name": "Black foldback clip 41 mm",
  "summary": "41 mm · each",
  "unit": "Each",
  "specs": {
    "Size": "41 mm",
    "Colour": "Black",
    "Type": "Foldback clip"
  },
  "brand": "Not specified",
  "sourceDescription": "FOLDBACK CLIPS 41MM BLACK EACH"
},
{
  "id": "glenanda-29",
  "category": "pens",
  "name": "Goldfaber HB pencil",
  "summary": "HB · each",
  "unit": "Each",
  "specs": {
    "Grade": "HB",
    "Type": "Graphite pencil"
  },
  "brand": "Goldfaber",
  "sourceDescription": "GOLDFABER PENCIL HB EACH*BTS*"
},
{
  "id": "glenanda-30",
  "category": "pack",
  "name": "Canvas library book bag",
  "summary": "Short handles · zip closure",
  "unit": "Each",
  "specs": {
    "Material": "Canvas",
    "Closure": "Zip",
    "Handle": "Short",
    "Type": "Library book bag"
  },
  "brand": "Not specified",
  "sourceDescription": "LIBRARY BOOK BAG CANVAS SHORT HANDLE ZIP *BTS*"
},
{
  "id": "glenanda-31",
  "category": "pack",
  "name": "3-division polyester pencil bag",
  "summary": "Polyester · 3 divisions",
  "unit": "Each",
  "specs": {
    "Material": "Polyester",
    "Compartments": "3",
    "Type": "Pencil bag",
    "Brand alternatives": "Marlin / Nexx"
  },
  "brand": "Brand to be confirmed",
  "sourceDescription": "MARLIN/NEXX POLYESTER PENCIL BAG 3 DIVISION"
},
{
  "id": "glenanda-32",
  "category": "ruler",
  "name": "Croxley 3500 mathematics set",
  "summary": "11 pieces · each set",
  "unit": "Set of 11 pieces",
  "specs": {
    "Type": "Mathematics set",
    "Pieces": "11",
    "Model": "3500"
  },
  "brand": "Croxley",
  "sourceDescription": "MATH SET 11 PIECE CROXLEY EACH 3500"
},
{
  "id": "glenanda-33",
  "category": "files",
  "name": "Nova antibacterial wet wipes",
  "summary": "Pack of 72 wipes",
  "unit": "Pack of 72 wipes",
  "specs": {
    "Type": "Antibacterial wet wipes",
    "Wipes per pack": "72"
  },
  "brand": "Nova",
  "sourceDescription": "NOVA ANTIBACTERIAL WET WIPES PACK 72 WIPES"
},
{
  "id": "glenanda-34",
  "category": "art",
  "name": "Oil pastels",
  "summary": "25 pastels · 9 mm × 60 mm",
  "unit": "Set of 25 pastels",
  "specs": {
    "Colours": "25 assorted",
    "Size": "9 mm × 60 mm",
    "Type": "Oil pastels",
    "Brand note": "Source names both DOMS and Pentel; confirm required brand",
    "Brand alternatives": "Pentel / DOMS"
  },
  "brand": "Brand to be confirmed",
  "sourceDescription": "OFFICE USE DOMS** PENTEL OIL PASTELS 25S REGULAR 9MM DIA X 60MM LENGTH *BTS*"
},
{
  "id": "glenanda-35",
  "category": "pens",
  "name": "Pilot EE102 large plastic eraser",
  "summary": "60 × 20 mm · each",
  "unit": "Each",
  "specs": {
    "Size": "60 × 20 mm",
    "Model": "EE102",
    "Type": "Plastic eraser"
  },
  "brand": "Pilot",
  "sourceDescription": "PILOT EE102 PLASTIC ERASER LARGE 60MM X 20MM*BTS*"
},
{
  "id": "glenanda-36",
  "category": "art",
  "name": "Wooden puzzle 48 pieces",
  "summary": "Assorted designs · each puzzle",
  "unit": "Each puzzle",
  "specs": {
    "Pieces": "48",
    "Material": "Wood",
    "Design": "Assorted",
    "Type": "Puzzle"
  },
  "brand": "Not specified",
  "sourceDescription": "PUZZLE WOODEN 48 PIECE EACH (ASSORTED DESIGNS)"
},
{
  "id": "glenanda-37",
  "category": "ruler",
  "name": "Deans assorted colour plastic ruler",
  "summary": "30 cm · 1 cm and 0.5 cm markings",
  "unit": "Each",
  "specs": {
    "Length": "30 cm",
    "Material": "Plastic",
    "Colour": "Assorted",
    "Markings": "1 cm and 0.5 cm"
  },
  "brand": "Deans",
  "sourceDescription": "RULER 30CM ASSORTED COLOURS PLASTIC EACH (1CM & 0.5CM) DEANS*BTS*"
},
{
  "id": "glenanda-38",
  "category": "art",
  "name": "Orange handle school scissors 165 mm",
  "summary": "165 mm · 1.5 mm blade",
  "unit": "Each",
  "specs": {
    "Size": "165 mm",
    "Blade thickness": "1.5 mm",
    "Handle colour": "Orange",
    "Type": "School scissors"
  },
  "brand": "Not specified",
  "sourceDescription": "SCISSORS 165MM ORANGE HANDLE SCHOOL BLADE 1.5MM*BTS*"
},
{
  "id": "glenanda-39",
  "category": "art",
  "name": "Maped right-handed school scissors 130 mm",
  "summary": "Metal · round tip · 130 mm",
  "unit": "Each",
  "specs": {
    "Size": "130 mm",
    "Handedness": "Right-handed",
    "Tip": "Round",
    "Type": "School scissors"
  },
  "brand": "Maped",
  "sourceDescription": "SCISSORS MAPED 130MM RIGHT HANDED SCHOLASTIC METAL ROUND TIP (SCHOOL USE)*BTS*"
},
{
  "id": "glenanda-40",
  "category": "pens",
  "name": "Maped Shaker 2-hole barrel sharpener",
  "summary": "Plastic barrel · model 534755",
  "unit": "Each",
  "specs": {
    "Model": "Shaker 534755",
    "Holes": "2",
    "Material": "Plastic",
    "Type": "Container sharpener"
  },
  "brand": "Maped",
  "sourceDescription": "SHARPENER 2 HOLE PLASTIC BARREL MAPED SHAKER 534755 *BTS*"
},
{
  "id": "glenanda-41",
  "category": "pens",
  "name": "Y+ Polka 2-hole container sharpener",
  "summary": "2 holes · each",
  "unit": "Each",
  "specs": {
    "Holes": "2",
    "Type": "Container sharpener"
  },
  "brand": "Y+ Polka",
  "sourceDescription": "SHARPENER 2 HOLE Y+POLKA CONTAINER EACH"
},
{
  "id": "glenanda-42",
  "category": "art",
  "name": "Teddy play dough kit",
  "summary": "4 × 100 g tubs",
  "unit": "Kit of 4 × 100 g",
  "specs": {
    "Size": "4 × 100 g",
    "Type": "Play dough kit"
  },
  "brand": "Teddy",
  "sourceDescription": "TEDDY DOUGH 4 X 100G KIT PLAY *BTS*"
},
{
  "id": "glenanda-43",
  "category": "files",
  "name": "Pillowy Soft tissues",
  "summary": "Pack of 90 tissues",
  "unit": "Pack of 90 tissues",
  "specs": {
    "Type": "Tissues",
    "Tissues per pack": "90"
  },
  "brand": "Pillowy Soft",
  "sourceDescription": "TISSUES PACK OF 90S PILLOWY SOFT PACK. USE FOR PVT"
},
{
  "id": "glenanda-44",
  "category": "art",
  "name": "Dala thin round wax crayons",
  "summary": "24 crayons · 8 mm",
  "unit": "Set of 24 crayons",
  "specs": {
    "Colours": "24 assorted",
    "Size": "8 mm",
    "Type": "Thin round wax crayons",
    "Model": "A24"
  },
  "brand": "Dala",
  "sourceDescription": "WAX CRAYONS A24 THIN 8MM ROUND THIN 24S (DALA)"
},
{
  "id": "glenanda-45",
  "category": "art",
  "name": "Bantex jumbo round wax crayons",
  "summary": "9 crayons · 14 mm",
  "unit": "Set of 9 crayons",
  "specs": {
    "Colours": "9 assorted",
    "Size": "14 mm",
    "Type": "Jumbo round wax crayons",
    "Model": "C9 / BKR972383"
  },
  "brand": "Bantex",
  "sourceDescription": "WAX CRAYONS C9 JUMBO 14MM ROUND THICK 9S BANTEX BKR972383*BTS*"
},
{
  "id": "glenanda-46",
  "category": "files",
  "name": "Parrot A4 writing white slate",
  "summary": "A4 · each",
  "unit": "Each",
  "specs": {
    "Size": "A4",
    "Type": "Writing white slate"
  },
  "brand": "Parrot",
  "sourceDescription": "WRITING WHITE SLATE A4 SIZE **PARROT BRAND"
}
];
