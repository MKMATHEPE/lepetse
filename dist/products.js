// Catalogue and supplier references. Retired requirements preserve saved basket quantities and units.
const products = [
  {
    "id": "waltons-801215",
    "category": "paper",
    "name": "Mondi Rotatrim A4 photocopy paper",
    "summary": "80 gsm · white",
    "unit": "Ream of 500 sheets",
    "specs": {
      "Size": "A4",
      "Weight": "80 gsm",
      "Colour": "White",
      "Sheets per ream": "500"
    },
    "brand": "Mondi Rotatrim",
    "image": "images/waltons/sku-801215.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "801215",
      "url": "https://www.waltons.co.za/buy/mondi-rotatrim-copy-paper-a4-80gsm-bond-white-ream-500-sheets",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/801215/mondi-rotatrim-copy-paper-a4-80gsm-bond-white-ream-500-sheets-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "paper-a4"
    ]
  },
  {
    "id": "waltons-801224",
    "category": "paper",
    "name": "Mondi Rotatrim A3 photocopy paper",
    "summary": "80 gsm · white",
    "unit": "Ream of 500 sheets",
    "specs": {
      "Size": "A3",
      "Weight": "80 gsm",
      "Colour": "White",
      "Sheets per ream": "500"
    },
    "brand": "Mondi Rotatrim",
    "image": "images/waltons/sku-801224.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "801224",
      "url": "https://www.waltons.co.za/buy/mondi-rotatrim-copy-paper-a3-80gsm-bond-white-ream-500-sheets",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/801224/mondi-rotatrim-copy-paper-a3-80gsm-bond-white-ream-500-sheets-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "paper-a3"
    ]
  },
  {
    "id": "waltons-811436",
    "category": "books",
    "name": "Croxley A4 punched examination pad W389P",
    "summary": "100 pages · feint and margin",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Pages": "100",
      "Ruling": "Feint and margin",
      "Model": "W389P",
      "Type": "Punched examination pad"
    },
    "brand": "Croxley",
    "image": "images/waltons/sku-811436.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "811436",
      "url": "https://www.waltons.co.za/buy/waltons-exam-pad-a4-fntmarg-100pg-punched-w389p",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/811436/waltons-exam-pad-a4-fntmarg-100pg-punched-w389p-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "exam-pad",
      "glenanda-03"
    ]
  },
  {
    "id": "waltons-21924804",
    "category": "pens",
    "name": "Waltons Primeline blue ballpoint pen",
    "summary": "1.0 mm · medium point",
    "unit": "Each",
    "specs": {
      "Ink colour": "Blue",
      "Tip": "Medium",
      "Point size": "1.0 mm",
      "Type": "Ballpoint pen"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-21924804.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "21924804",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-ballpoint-pen-blue",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/21924804/waltons-primeline-ballpoint-pen-blue-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "pens-blue"
    ]
  },
  {
    "id": "waltons-21924802",
    "category": "pens",
    "name": "Waltons Primeline black ballpoint pen",
    "summary": "1.0 mm · medium point",
    "unit": "Each",
    "specs": {
      "Ink colour": "Black",
      "Tip": "Medium",
      "Point size": "1.0 mm",
      "Type": "Ballpoint pen"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-21924802.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "21924802",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-ballpoint-pen-black",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/21924802/waltons-primeline-ballpoint-pen-black-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "pens-black"
    ]
  },
  {
    "id": "waltons-204363",
    "category": "pens",
    "name": "Waltons Primeline HB graphite pencils",
    "summary": "HB · hexagonal barrel",
    "unit": "Box of 12 pencils",
    "specs": {
      "Grade": "HB",
      "Type": "Graphite pencil",
      "Pack size": "12"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-204363.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204363",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-pencil-hb-box-of-12",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204363/waltons-primeline-pencil-hb-box-of-12-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "pencils-hb"
    ]
  },
  {
    "id": "waltons-723117",
    "category": "pens",
    "name": "Stabilo Boss jumbo highlighters",
    "summary": "Assorted colours · model 7004",
    "unit": "Set of 4 highlighters",
    "specs": {
      "Type": "Highlighter",
      "Colour": "Assorted",
      "Model": "7004",
      "Pack size": "4"
    },
    "brand": "Stabilo",
    "image": "images/waltons/sku-723117.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "723117",
      "url": "https://www.waltons.co.za/buy/stabilo-boss-jumbo-highlighters-set-of-4-7004",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/723117/stabilo-boss-jumbo-highlighters-set-of-4-7004-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "highlighters"
    ]
  },
  {
    "id": "waltons-578138",
    "category": "files",
    "name": "Croxley A4 mottled lever arch file ALF1007",
    "summary": "70 mm spine · Rado locking",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Spine": "70 mm",
      "Material": "Board",
      "Colour": "Black mottled",
      "Model": "ALF1007",
      "Type": "Lever arch file"
    },
    "brand": "Croxley",
    "image": "images/waltons/sku-578138.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "578138",
      "url": "https://www.waltons.co.za/buy/croxley-lever-arch-board-file-black-mottled-with-rado-and-eyelets-a4-70mm-alf1007",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/578138/croxley-lever-arch-board-file-black-mottled-with-rado-and-eyelets-a4-70mm-alf1007-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "file-lever"
    ]
  },
  {
    "id": "waltons-847207",
    "category": "files",
    "name": "Waltons Primeline A4 display file",
    "summary": "20 pockets · polypropylene",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Pockets": "20",
      "Material": "Polypropylene",
      "Type": "Display file"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-847207.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "847207",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-display-file-a4-20-pocket",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/847207/waltons-primeline-display-file-a4-20-pocket-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "file-pocket"
    ]
  },
  {
    "id": "waltons-55000203",
    "category": "files",
    "name": "Croxley buff foolscap manilla folder",
    "summary": "348 × 228 mm · buff",
    "unit": "Each",
    "specs": {
      "Size": "Foolscap",
      "Dimensions": "348 × 228 mm",
      "Material": "Manilla",
      "Colour": "Buff",
      "Model": "M220F / FOL220F",
      "Type": "Document folder"
    },
    "brand": "Croxley",
    "image": "images/waltons/sku-55000203.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "55000203",
      "url": "https://www.waltons.co.za/buy/croxley-manilla-folder-foolscap-size-348mmx-x228mm-m220ffol220f-per-1-buff",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/55000203/croxley-manilla-folder-foolscap-size-348mmx-x228mm-m220ffol220f-per-1-buff-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "folders"
    ]
  },
  {
    "id": "waltons-204015",
    "category": "books",
    "name": "Waltons Primeline A4 exercise book",
    "summary": "72 pages · feint and margin",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Pages": "72",
      "Ruling": "Feint and margin",
      "Binding": "Soft cover"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-204015.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204015",
      "url": "https://www.waltons.co.za/buy/primeline-soft-cover-exercise-book-a4-72-page-feint-margin",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204015/primeline-soft-cover-exercise-book-a4-72-page-feint-margin-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "exercise-72"
    ]
  },
  {
    "id": "waltons-111162",
    "category": "books",
    "name": "Waltons Primeline A4 hardcover counter book",
    "summary": "192 pages · feint and margin",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Pages": "192",
      "Ruling": "Feint and margin",
      "Binding": "Hard cover"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-111162.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "111162",
      "url": "https://www.waltons.co.za/buy/primeline-2-quire-hard-cover-counter-book-a4-192-page-feint-margin",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/111162/primeline-2-quire-hard-cover-counter-book-a4-192-page-feint-margin-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "exercise-192"
    ]
  },
  {
    "id": "waltons-744199UO",
    "category": "books",
    "name": "Rexel Colourhide A5 spiral notebook",
    "summary": "200 pages · feint ruled · pastel blue",
    "unit": "Each",
    "specs": {
      "Size": "A5",
      "Pages": "200",
      "Ruling": "Feint ruled",
      "Binding": "Spiral",
      "Colour": "Pastel blue"
    },
    "brand": "Rexel",
    "image": "images/waltons/sku-744199UO.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "744199UO",
      "url": "https://www.waltons.co.za/buy/rexel-colourhide-a5-notebookspiral-bound-200-pages-notebook-feint-ruled-perforated-sheets-removeable-bookmark-pastel-blue",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/744199UO/rexel-colourhide-a5-notebookspiral-bound-200-pages-notebook-feint-ruled-perforated-sheets-removeable-bookmark-pastel-blue-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "spiral-a5"
    ]
  },
  {
    "id": "waltons-302116",
    "category": "art",
    "name": "Waltons Primeline woodfree colour pencils",
    "summary": "12 colours · model WP54",
    "unit": "Set of 12 pencils",
    "specs": {
      "Type": "Coloured pencils",
      "Material": "Woodfree",
      "Pack size": "12",
      "Model": "WP54"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-302116.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "302116",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-woodfree-colour-pencils-wp54-set-of-12",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/302116/waltons-primeline-woodfree-colour-pencils-wp54-set-of-12-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "coloured-pencils"
    ]
  },
  {
    "id": "waltons-204448",
    "category": "art",
    "name": "Teddy assorted wax crayons",
    "summary": "12 colours",
    "unit": "Set of 12 crayons",
    "specs": {
      "Type": "Wax crayons",
      "Pack size": "12",
      "Colour": "Assorted"
    },
    "brand": "Teddy",
    "image": "images/waltons/sku-204448.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204448",
      "url": "https://www.waltons.co.za/buy/teddy-wax-crayons-assorted-set-of-12",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204448/teddy-wax-crayons-assorted-set-of-12-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "wax-crayons"
    ]
  },
  {
    "id": "waltons-103715",
    "category": "art",
    "name": "Croxley Create glue stick 21 g",
    "summary": "21 g · model ADH121",
    "unit": "Each",
    "specs": {
      "Type": "Glue stick",
      "Size": "21 g",
      "Model": "ADH121"
    },
    "brand": "Croxley",
    "image": "images/waltons/sku-103715.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "103715",
      "url": "https://www.waltons.co.za/buy/croxley-create-glue-stick-21gr-adh121-each",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/103715/croxley-create-glue-stick-21gr-adh121-each-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glue-stick"
    ]
  },
  {
    "id": "waltons-851347",
    "category": "ruler",
    "name": "Waltons Primeline clear ruler 30 cm",
    "summary": "30 cm · shatter resistant",
    "unit": "Each",
    "specs": {
      "Size": "30 cm",
      "Material": "Plastic",
      "Colour": "Clear",
      "Type": "Ruler"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-851347.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "851347",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-shatter-resistant-clear-ruler-30cm",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/851347/waltons-primeline-shatter-resistant-clear-ruler-30cm-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "ruler-30",
      "glenanda-37"
    ]
  },
  {
    "id": "waltons-204840",
    "category": "ruler",
    "name": "Oxford mathematics set",
    "summary": "Geometry and drawing tools",
    "unit": "Set",
    "specs": {
      "Type": "Mathematics set"
    },
    "brand": "Oxford",
    "image": "images/waltons/sku-204840.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204840",
      "url": "https://www.waltons.co.za/buy/oxford-math-set",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204840/oxford-math-set-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "geometry-set"
    ]
  },
  {
    "id": "waltons-741201",
    "category": "calc",
    "name": "Waltons Primeline desktop calculator WRR01",
    "summary": "12-digit display",
    "unit": "Each",
    "specs": {
      "Type": "Desktop calculator",
      "Digits": "12",
      "Model": "WRR01"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-741201.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "741201",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-12-digit-desktop-calculator-wrr01",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/741201/waltons-primeline-12-digit-desktop-calculator-wrr01-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "calculator-basic"
    ]
  },
  {
    "id": "waltons-204523",
    "category": "calc",
    "name": "Casio FX-82ZA Plus II scientific calculator",
    "summary": "FX-82ZA Plus II",
    "unit": "Each",
    "specs": {
      "Type": "Scientific calculator",
      "Model": "FX-82ZA Plus II"
    },
    "brand": "Casio",
    "image": "images/waltons/sku-204523.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204523",
      "url": "https://www.waltons.co.za/buy/casio-plus-new-generation-scientific-calculator-fx82za-plus-ll-each",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204523/casio-plus-new-generation-scientific-calculator-fx82za-plus-ll-each-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "calculator-scientific"
    ]
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
  },
  {
    "id": "waltons-84128404",
    "category": "files",
    "name": "Croxley A4 translucent blue 2-D-ring binder",
    "summary": "25 mm · blue PVC",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Ring size": "25 mm",
      "Rings": "2 D rings",
      "Material": "PVC",
      "Colour": "Blue",
      "Model": "JD831 / FIL831"
    },
    "brand": "Croxley",
    "image": "images/waltons/sku-84128404.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "84128404",
      "url": "https://www.waltons.co.za/buy/croxley-translucent-pvc-2-d-ringbinder-a4-25mm-jd831fil831-blue",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/84128404/croxley-translucent-pvc-2-d-ringbinder-a4-25mm-jd831fil831-blue-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-01"
    ]
  },
  {
    "id": "waltons-204634",
    "category": "files",
    "name": "Croxley A4 black trunk-board 2-ring binder",
    "summary": "25 mm · laminated trunk board",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Ring size": "25 mm",
      "Rings": "2",
      "Material": "Laminated trunk board",
      "Colour": "Black"
    },
    "brand": "Croxley",
    "image": "images/waltons/sku-204634.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204634",
      "url": "https://www.waltons.co.za/buy/croxley-2-ringbinder-laminated-trunk-board-a4-25mm-black",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204634/croxley-2-ringbinder-laminated-trunk-board-a4-25mm-black-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-02"
    ]
  },
  {
    "id": "waltons-87723514",
    "category": "files",
    "name": "Waltons Primeline A4 clear press-stud carry folder",
    "summary": "Clear polypropylene · CH201",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Colour": "Clear",
      "Material": "Polypropylene",
      "Closure": "Press stud",
      "Model": "CH201"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-87723514.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "87723514",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-a4-polypropylene-carry-folder-with-press-stud-ch201-each-clear",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/87723514/waltons-primeline-a4-polypropylene-carry-folder-with-press-stud-ch201-each-clear-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-04"
    ]
  },
  {
    "id": "waltons-57818502",
    "category": "files",
    "name": "Croxley A4 black polypropylene lever arch file",
    "summary": "A4 · black polypropylene",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Colour": "Black",
      "Material": "Polypropylene",
      "Type": "Lever arch file"
    },
    "brand": "Croxley",
    "image": "images/waltons/sku-57818502.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "57818502",
      "url": "https://www.waltons.co.za/buy/croxley-lever-arch-file-a4-polypropylene-black",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/57818502/croxley-lever-arch-file-a4-polypropylene-black-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-05"
    ]
  },
  {
    "id": "waltons-847267",
    "category": "files",
    "name": "Waltons Primeline A4 multipunched filing pockets",
    "summary": "60 micron · pack of 10",
    "unit": "Pack of 10 pockets",
    "specs": {
      "Size": "A4",
      "Thickness": "60 micron",
      "Quantity per pack": "10",
      "Type": "Multipunched filing pockets",
      "Model": "W45R"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-847267.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "847267",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-plastic-pocket-a4-multi-punched-60-micron-w45r-pack-of-10",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/847267/waltons-primeline-plastic-pocket-a4-multi-punched-60-micron-w45r-pack-of-10-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-06"
    ]
  },
  {
    "id": "waltons-84733714",
    "category": "files",
    "name": "Waltons Primeline A4 clear gusset presentation folder",
    "summary": "Clear polypropylene · gusset · W41",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Colour": "Clear",
      "Material": "Polypropylene",
      "Type": "Gusset presentation folder",
      "Model": "W41"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-84733714.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "84733714",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-a4-document-presentation-folder-with-gusset-w41-clear",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/84733714/waltons-primeline-a4-document-presentation-folder-with-gusset-w41-clear-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-07"
    ]
  },
  {
    "id": "waltons-261123",
    "category": "art",
    "name": "Amos glue stick 22 g",
    "summary": "22 g · each",
    "unit": "Each",
    "specs": {
      "Size": "22 g",
      "Type": "Glue stick"
    },
    "brand": "Amos",
    "image": "images/waltons/sku-261123.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "261123",
      "url": "https://www.waltons.co.za/buy/amos-glue-stick-22gr-each",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/261123/amos-glue-stick-22gr-each-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-08"
    ]
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
    "sourceDescription": "AMOS GLUE STICK 40G*BTS*",
    "image": "images/waltons/glenanda-09.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "261124",
      "url": "https://www.waltons.co.za/buy/amos-glue-stick-40gr",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/261124/amos-glue-stick-40gr-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Matched catalogue product; availability by quotation"
    }
  },
  {
    "id": "waltons-204542",
    "category": "pack",
    "name": "Bantex Mccasey 2 Pencil Case 30cm",
    "summary": "30 cm pencil case",
    "unit": "Each",
    "specs": {
      "Size": "30 cm",
      "Type": "Pencil case"
    },
    "brand": "Bantex",
    "image": "images/waltons/sku-204542.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204542",
      "url": "https://www.waltons.co.za/buy/bantex-mccasey-2-pencil-case-30cm",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204542/bantex-mccasey-2-pencil-case-30cm-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-10"
    ]
  },
  {
    "id": "waltons-847265",
    "category": "files",
    "name": "Bantex A4 CopySafe multipunched filing pocket",
    "summary": "A4 · CopySafe · single pocket",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Type": "CopySafe multipunched filing pocket",
      "Model": "2042",
      "Ordering quantity": "1 pocket"
    },
    "brand": "Bantex",
    "image": "images/waltons/sku-847265.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "847265",
      "url": "https://www.waltons.co.za/buy/bantex-copysafe-multi-punched-file-pockets-a4-2042-per-1",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/847265/bantex-copysafe-multi-punched-file-pockets-a4-2042-per-1-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-11"
    ]
  },
  {
    "id": "waltons-21111004",
    "category": "pens",
    "name": "BIC Crystal blue ballpoint pen",
    "summary": "Blue · capped ballpoint",
    "unit": "Each",
    "specs": {
      "Ink colour": "Blue",
      "Type": "Ballpoint pen",
      "Model": "Crystal"
    },
    "brand": "Bic",
    "image": "images/waltons/sku-21111004.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "21111004",
      "url": "https://www.waltons.co.za/buy/bic-crystal-ballpen-blue",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/21111004/bic-crystal-ballpen-blue-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-12"
    ]
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
      "Model": "Orange",
      "Point size": "0.8 mm"
    },
    "brand": "BIC",
    "sourceDescription": "BIC ORANGE FINE POINT BLUE PEN*BTS*",
    "image": "images/waltons/glenanda-13.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "21111404",
      "url": "https://www.waltons.co.za/buy/bic-orange-ballpen-blue",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/21111404/bic-orange-ballpen-blue-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Matched catalogue product; availability by quotation"
    }
  },
  {
    "id": "waltons-30399904",
    "category": "pack",
    "name": "Waltons Primeline Clear Front Colored 33cm Pencil Bag (Each) - Blue",
    "summary": "33 cm · clear front · blue",
    "unit": "Each",
    "specs": {
      "Size": "33 cm",
      "Colour": "Blue",
      "Material": "Polyester, PVC",
      "Closure": "Zip",
      "Compartments": "1"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-30399904.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "30399904",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-clear-front-colored-33cm-pencil-bag-each-blue",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/30399904/waltons-primeline-clear-front-colored-33cm-pencil-bag-each-blue-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-14"
    ]
  },
  {
    "id": "waltons-20498604",
    "category": "pack",
    "name": "Trefoil Denim Chairbag 44CM - Blue",
    "summary": "44 cm · blue denim",
    "unit": "Each",
    "specs": {
      "Size": "44 cm",
      "Colour": "Blue",
      "Material": "Denim",
      "Type": "Chair bag"
    },
    "brand": "Trefoil",
    "image": "images/waltons/sku-20498604.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "20498604",
      "url": "https://www.waltons.co.za/buy/trefoil-denim-chairbag-44cm-blue",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/20498604/trefoil-denim-chairbag-44cm-blue-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-15"
    ]
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
    "id": "waltons-72307902",
    "category": "pens",
    "name": "Monami SigmaFlo 220 black whiteboard marker",
    "summary": "2 mm bullet tip · black",
    "unit": "Each",
    "specs": {
      "Ink colour": "Black",
      "Tip": "Bullet",
      "Point size": "2 mm",
      "Type": "Whiteboard marker",
      "Model": "SigmaFlo 220"
    },
    "brand": "Monami",
    "image": "images/waltons/sku-72307902.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "72307902",
      "url": "https://www.waltons.co.za/buy/monami-sigmaflo-220-whiteboard-marker-bullet-each-black",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/72307902/monami-sigmaflo-220-whiteboard-marker-bullet-each-black-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-17"
    ]
  },
  {
    "id": "waltons-204665",
    "category": "files",
    "name": "Flip File Kangaroo A4 display book 10 pockets",
    "summary": "10 pockets · A4",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Pockets": "10",
      "Model": "BA11041",
      "Type": "Display book"
    },
    "brand": "Flip file",
    "image": "images/waltons/sku-204665.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204665",
      "url": "https://www.waltons.co.za/buy/flip-file-kangaroo-display-file-book-a4-10-pocket-ba11041",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204665/flip-file-kangaroo-display-file-book-a4-10-pocket-ba11041-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-18"
    ]
  },
  {
    "id": "waltons-204666",
    "category": "files",
    "name": "Flip File Kangaroo A4 display book 20 pockets",
    "summary": "20 pockets · A4",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Pockets": "20",
      "Model": "BA11042",
      "Type": "Display book"
    },
    "brand": "Flip file",
    "image": "images/waltons/sku-204666.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204666",
      "url": "https://www.waltons.co.za/buy/flip-file-kangaroo-display-file-book-a4-20-pocket-ba11042",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204666/flip-file-kangaroo-display-file-book-a4-20-pocket-ba11042-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-19"
    ]
  },
  {
    "id": "waltons-204669",
    "category": "files",
    "name": "Flip File Kangaroo A4 display book 30 pockets",
    "summary": "30 pockets · A4",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Pockets": "30",
      "Model": "BA11043",
      "Type": "Display book"
    },
    "brand": "Flip file",
    "image": "images/waltons/sku-204669.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204669",
      "url": "https://www.waltons.co.za/buy/flip-file-kangaroo-display-file-book-a4-30-pocket-ba11043",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204669/flip-file-kangaroo-display-file-book-a4-30-pocket-ba11043-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-20"
    ]
  },
  {
    "id": "waltons-131303",
    "category": "files",
    "name": "Waltons Primeline green felt blackboard duster",
    "summary": "150 × 40 mm · green felt",
    "unit": "Each",
    "specs": {
      "Size": "150 × 40 mm",
      "Material": "Green felt",
      "Type": "Blackboard duster"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-131303.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "131303",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-blackboard-duster-green-felt-standard-40mmx150mm",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/131303/waltons-primeline-blackboard-duster-green-felt-standard-40mmx150mm-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-21"
    ]
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
    "id": "waltons-207661",
    "category": "art",
    "name": "Croxley Create Aquarelle Colour Pencils Set of 12",
    "summary": "12 water-soluble colour pencils",
    "unit": "Set of 12 pencils",
    "specs": {
      "Count": "12",
      "Type": "Water-soluble colour pencils"
    },
    "brand": "Croxley",
    "image": "images/waltons/sku-207661.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "207661",
      "url": "https://www.waltons.co.za/buy/croxley-create-aquarelle-colour-pencils-set-of-12",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/207661/croxley-create-aquarelle-colour-pencils-set-of-12-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-23"
    ]
  },
  {
    "id": "waltons-205359",
    "category": "art",
    "name": "FABER CASTELL Pencil Crayons Full Size AHT120112E (Set 12)",
    "summary": "12 full-size colour pencils",
    "unit": "Set of 12 pencils",
    "specs": {
      "Count": "12",
      "Model": "AHT120112E",
      "Type": "Full-size colour pencils"
    },
    "brand": "Faber-Castell",
    "image": "images/waltons/sku-205359.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "205359",
      "url": "https://www.waltons.co.za/buy/faber-castell-pencil-crayons-full-size-aht120112e-set-12",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/205359/faber-castell-pencil-crayons-full-size-aht120112e-set-12-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-24"
    ]
  },
  {
    "id": "waltons-206710",
    "category": "art",
    "name": "Faber Castell Wax Crayons Triangular Box of 24 (Each)",
    "summary": "24 triangular wax crayons",
    "unit": "Set of 24 crayons",
    "specs": {
      "Count": "24",
      "Shape": "Triangular",
      "Type": "Wax crayons"
    },
    "brand": "Faber-Castell",
    "image": "images/waltons/sku-206710.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "206710",
      "url": "https://www.waltons.co.za/buy/faber-castell-wax-crayons-triangular-box-of-24-each",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/206710/faber-castell-wax-crayons-triangular-box-of-24-each-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-25"
    ]
  },
  {
    "id": "waltons-204843",
    "category": "ruler",
    "name": "Butterfly Flard Card Set of Flash Cards",
    "summary": "Flard flash-card set",
    "unit": "Set",
    "specs": {
      "Type": "Flard flash cards"
    },
    "brand": "Butterfly",
    "image": "images/waltons/sku-204843.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204843",
      "url": "https://www.waltons.co.za/buy/butterfly-flard-card-set-of-flash-cards",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204843/butterfly-flard-card-set-of-flash-cards-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-26"
    ]
  },
  {
    "id": "waltons-254304",
    "category": "files",
    "name": "Waltons Primeline foldback clips 32 mm",
    "summary": "32 mm · pack of 12",
    "unit": "Pack of 12 clips",
    "specs": {
      "Size": "32 mm",
      "Quantity per pack": "12",
      "Type": "Foldback clips",
      "Model": "No. 3"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-254304.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "254304",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-foldback-clip-32mm-no-3-pack-12",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/254304/waltons-primeline-foldback-clip-32mm-no-3-pack-12-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-27"
    ]
  },
  {
    "id": "waltons-254305",
    "category": "files",
    "name": "Waltons Primeline foldback clips 41 mm",
    "summary": "41 mm · pack of 12",
    "unit": "Pack of 12 clips",
    "specs": {
      "Size": "41 mm",
      "Quantity per pack": "12",
      "Type": "Foldback clips",
      "Model": "No. 4"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-254305.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "254305",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-foldback-clip-41mm-no-4-pack-12",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/254305/waltons-primeline-foldback-clip-41mm-no-4-pack-12-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-28"
    ]
  },
  {
    "id": "glenanda-29",
    "category": "pens",
    "name": "Goldfaber HB pencil",
    "summary": "HB · each",
    "unit": "Each",
    "specs": {
      "Grade": "HB",
      "Type": "Graphite pencil",
      "Model": "Goldfaber 1221"
    },
    "brand": "Goldfaber",
    "sourceDescription": "GOLDFABER PENCIL HB EACH*BTS*",
    "image": "images/waltons/glenanda-29.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "79312240",
      "url": "https://www.waltons.co.za/buy/faber-castell-goldfaber-graphite-pencil-hb",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/79312240/faber-castell-goldfaber-graphite-pencil-hb-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Matched catalogue product; availability by quotation"
    }
  },
  {
    "id": "waltons-303694",
    "category": "pack",
    "name": "Waltons Primeline Library Book Bag",
    "summary": "A4 · polyester · one compartment",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Material": "Polyester",
      "Compartments": "1",
      "Type": "Library book bag"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-303694.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "303694",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-library-book-bag",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/303694/waltons-primeline-library-book-bag-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-30"
    ]
  },
  {
    "id": "waltons-204556",
    "category": "pack",
    "name": "Waltons Primeline Boy 3 Division Pencil Bag",
    "summary": "Polyester · 3 zip compartments",
    "unit": "Each",
    "specs": {
      "Compartments": "3",
      "Material": "Polyester",
      "Closure": "Zip",
      "Design": "Football"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-204556.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204556",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-boy-3-division-pencil-bag",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204556/waltons-primeline-boy-3-division-pencil-bag-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-31"
    ]
  },
  {
    "id": "waltons-206529",
    "category": "ruler",
    "name": "Waltons Primeline Math Set",
    "summary": "Drawing instruments in a metal tin",
    "unit": "Set",
    "specs": {
      "Material": "Metal, Plastic",
      "Contents": "Compass, divider, pencil, sharpener, eraser, ruler, set squares, protractor and timetable",
      "Packaging": "Metal tin"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-206529.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "206529",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-math-set",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/206529/waltons-primeline-math-set-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-32"
    ]
  },
  {
    "id": "waltons-889233",
    "category": "files",
    "name": "Waltons Primeline Anti-Bacterial Hand Wipes -  40 Wipes FP-WALTALCO40S",
    "summary": "40 antibacterial hand wipes",
    "unit": "Pack of 40 wipes",
    "specs": {
      "Count": "40 wipes",
      "Type": "Anti-bacterial hand wipes",
      "Model": "FP-WALTALCO40S"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-889233.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "889233",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-anti-bacterial-hand-wipes-40-wipes-fp-waltalco40s",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/889233/waltons-primeline-anti-bacterial-hand-wipes-40-wipes-fp-waltalco40s-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-33"
    ]
  },
  {
    "id": "waltons-204873",
    "category": "art",
    "name": "Pentel Oil Pastels Box of 25",
    "summary": "25 oil pastels",
    "unit": "Set of 25 pastels",
    "specs": {
      "Count": "25",
      "Type": "Oil pastels"
    },
    "brand": "Pentel",
    "image": "images/waltons/sku-204873.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204873",
      "url": "https://www.waltons.co.za/buy/pentel-oil-pastels-box-of-25",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204873/pentel-oil-pastels-box-of-25-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-34"
    ]
  },
  {
    "id": "waltons-471137",
    "category": "pens",
    "name": "Waltons PrimeLine  Soft Touch Eraser 60mm",
    "summary": "60 × 22 mm · soft touch",
    "unit": "Each",
    "specs": {
      "Size": "60 × 22 mm",
      "Material": "PVC",
      "Type": "Soft touch eraser",
      "Dust free": "Yes"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-471137.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "471137",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-soft-touch-eraser-60mm",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/471137/waltons-primeline-soft-touch-eraser-60mm-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-35"
    ]
  },
  {
    "id": "waltons-206956",
    "category": "art",
    "name": "RGS Wooden Puzzle Set 48 - Walking With Dinosaurs",
    "summary": "48 pieces · wooden · dinosaurs",
    "unit": "Each puzzle",
    "specs": {
      "Pieces": "48",
      "Material": "Wood",
      "Design": "Walking With Dinosaurs"
    },
    "brand": "RGS",
    "image": "images/waltons/sku-206956.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "206956",
      "url": "https://www.waltons.co.za/buy/rgs-wooden-puzzle-set-48-walking-with-dinosaurs",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/206956/rgs-wooden-puzzle-set-48-walking-with-dinosaurs-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-36"
    ]
  },
  {
    "id": "waltons-206775",
    "category": "art",
    "name": "Maped Pulse Student Scissors Assorted 16cm",
    "summary": "16 cm · assorted colours",
    "unit": "Each",
    "specs": {
      "Size": "16 cm",
      "Type": "Student scissors",
      "Colour": "Assorted"
    },
    "brand": "Maped",
    "image": "images/waltons/sku-206775.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "206775",
      "url": "https://www.waltons.co.za/buy/maped-pulse-student-scissors-16cm",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/206775/maped-pulse-student-scissors-assorted-16cm-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-38"
    ]
  },
  {
    "id": "waltons-206145",
    "category": "art",
    "name": "Maped Pulse School Scissors 13cm",
    "summary": "13 cm · school scissors",
    "unit": "Each",
    "specs": {
      "Size": "13 cm",
      "Type": "School scissors"
    },
    "brand": "Maped",
    "image": "images/waltons/sku-206145.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "206145",
      "url": "https://www.waltons.co.za/buy/maped-pulse-school-scissors-13cm",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/206145/maped-pulse-school-scissors-13cm-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-39"
    ]
  },
  {
    "id": "waltons-204604",
    "category": "pens",
    "name": "Maped Shaker 2 Hole Sharpener",
    "summary": "2-hole container sharpener",
    "unit": "Each",
    "specs": {
      "Holes": "2",
      "Model": "Shaker",
      "Type": "Container sharpener"
    },
    "brand": "Maped",
    "image": "images/waltons/sku-204604.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204604",
      "url": "https://www.waltons.co.za/buy/maped-shaker-2-hole-sharpener",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204604/maped-shaker-2-hole-sharpener-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-40"
    ]
  },
  {
    "id": "waltons-302124",
    "category": "pens",
    "name": "Waltons Primeline Soft Touch Double Barrel Sharpener WP61",
    "summary": "2 holes · shavings container",
    "unit": "Each",
    "specs": {
      "Holes": "2",
      "Finish": "Soft touch",
      "Model": "WP61",
      "Shavings container": "Yes"
    },
    "brand": "Primeline",
    "image": "images/waltons/sku-302124.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "302124",
      "url": "https://www.waltons.co.za/buy/waltons-primeline-soft-touch-double-barrel-sharpener-wp61",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/302124/waltons-primeline-soft-touch-double-barrel-sharpener-wp61-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-41"
    ]
  },
  {
    "id": "waltons-204888",
    "category": "art",
    "name": "Teddy Play Dough Tubs of 4 - Made of Flour",
    "summary": "4 tubs · flour-based play dough",
    "unit": "Set of 4 tubs",
    "specs": {
      "Count": "4 tubs",
      "Type": "Flour-based play dough"
    },
    "brand": "Teddy",
    "image": "images/waltons/sku-204888.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204888",
      "url": "https://www.waltons.co.za/buy/teddy-play-dough-tubs-of-4-made-of-flour",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204888/teddy-play-dough-tubs-of-4-made-of-flour-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-42"
    ]
  },
  {
    "id": "waltons-207021",
    "category": "files",
    "name": "Twinsaver 2 Ply Soft Pack Tissues White Pack of 90",
    "summary": "90 tissues · white · 2 ply",
    "unit": "Pack of 90 tissues",
    "specs": {
      "Count": "90",
      "Colour": "White",
      "Ply": "2",
      "Type": "Facial tissues"
    },
    "brand": "Twinsaver",
    "image": "images/waltons/sku-207021.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "207021",
      "url": "https://www.waltons.co.za/buy/twinsaver-2-ply-soft-pack-tissues-white-pack-of-90",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/207021/twinsaver-2-ply-soft-pack-tissues-white-pack-of-90-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-43"
    ]
  },
  {
    "id": "waltons-204314",
    "category": "art",
    "name": "STAEDTLER NORIS WAX CRAYONS - SET 24",
    "summary": "24 wax crayons",
    "unit": "Set of 24 crayons",
    "specs": {
      "Count": "24",
      "Type": "Wax crayons",
      "Range": "Noris"
    },
    "brand": "Staedtler",
    "image": "images/waltons/sku-204314.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "204314",
      "url": "https://www.waltons.co.za/buy/staedtler-noris-wax-crayons-set-24",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/204314/staedtler-noris-wax-crayons-set-24-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-44"
    ]
  },
  {
    "id": "waltons-N00089",
    "category": "art",
    "name": "Croxley Create Wax Crayons Jumbo 9'S Cra1149",
    "summary": "9 jumbo wax crayons",
    "unit": "Set of 9 crayons",
    "specs": {
      "Count": "9",
      "Type": "Jumbo wax crayons",
      "Model": "CRA1149"
    },
    "brand": "Croxley",
    "image": "images/waltons/sku-N00089.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "N00089",
      "url": "https://www.waltons.co.za/buy/croxley-create-wax-crayons-jumbo-9s-cra1149",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/N00089/croxley-create-wax-crayons-jumbo-9s-cra1149-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Waltons replacement; availability by quotation"
    },
    "replacementFor": [
      "glenanda-45"
    ]
  },
  {
    "id": "glenanda-46",
    "category": "files",
    "name": "Parrot A4 writing white slate",
    "summary": "A4 · each",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Type": "Writing white slate",
      "Model": "BD1002A"
    },
    "brand": "Parrot",
    "sourceDescription": "WRITING WHITE SLATE A4 SIZE **PARROT BRAND",
    "image": "images/waltons/glenanda-46.webp",
    "imageType": "supplier product photograph",
    "supplierReference": {
      "name": "Waltons",
      "sku": "205707",
      "url": "https://www.waltons.co.za/buy/parrot-whiteboardwriting-slate-a4-bd1002a-single",
      "imageSourceUrl": "https://cdn1.waltons.co.za/product-images/2026/205707/parrot-whiteboardwriting-slate-a4-bd1002a-single-1024x1024.webp",
      "checkedOn": "2026-11-10",
      "matchStatus": "Matched catalogue product; availability by quotation"
    }
  }
];
const retiredProducts = [
  {
    "id": "paper-a4",
    "category": "paper",
    "name": "A4 photocopy paper",
    "summary": "80 gsm · white · 500 sheets",
    "unit": "Ream of 500 sheets",
    "specs": {
      "Size": "A4",
      "Weight": "80 gsm",
      "Colour": "White",
      "Sheets per ream": "500"
    },
    "brand": "To be confirmed",
    "image": "images/paper-a4-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-801215"
  },
  {
    "id": "paper-a3",
    "category": "paper",
    "name": "A3 photocopy paper",
    "summary": "80 gsm · white · 500 sheets",
    "unit": "Ream of 500 sheets",
    "specs": {
      "Size": "A3",
      "Weight": "80 gsm",
      "Colour": "White",
      "Sheets per ream": "500"
    },
    "brand": "To be confirmed",
    "image": "images/paper-a3-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-801224"
  },
  {
    "id": "exam-pad",
    "category": "books",
    "name": "A4 examination pad",
    "summary": "100 sheets · ruled",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Sheets": "100",
      "Ruling": "Ruled"
    },
    "brand": "To be confirmed",
    "image": "images/exam-pad-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-811436"
  },
  {
    "id": "pens-blue",
    "category": "pens",
    "name": "Blue ballpoint pens",
    "summary": "Medium tip · pack of 10",
    "unit": "Pack of 10 pens",
    "specs": {
      "Ink colour": "Blue",
      "Tip": "Medium",
      "Pens per pack": "10"
    },
    "brand": "To be confirmed",
    "image": "images/pens-blue-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-21924804"
  },
  {
    "id": "pens-black",
    "category": "pens",
    "name": "Black ballpoint pens",
    "summary": "Medium tip · pack of 10",
    "unit": "Pack of 10 pens",
    "specs": {
      "Ink colour": "Black",
      "Tip": "Medium",
      "Pens per pack": "10"
    },
    "brand": "To be confirmed",
    "image": "images/pens-black-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-21924802"
  },
  {
    "id": "pencils-hb",
    "category": "pens",
    "name": "HB graphite pencils",
    "summary": "HB grade · pack of 12",
    "unit": "Pack of 12 pencils",
    "specs": {
      "Grade": "HB",
      "Pencils per pack": "12"
    },
    "brand": "To be confirmed",
    "image": "images/pencils-hb-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-204363"
  },
  {
    "id": "highlighters",
    "category": "pens",
    "name": "Assorted highlighters",
    "summary": "Chisel tip · set of 4",
    "unit": "Set of 4",
    "specs": {
      "Tip": "Chisel",
      "Colours": "Assorted",
      "Markers per set": "4"
    },
    "brand": "To be confirmed",
    "image": "images/highlighters-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-723117"
  },
  {
    "id": "file-lever",
    "category": "files",
    "name": "A4 lever arch file",
    "summary": "70 mm spine · each",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Spine width": "70 mm",
      "Type": "Lever arch"
    },
    "brand": "To be confirmed",
    "image": "images/file-lever-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-578138"
  },
  {
    "id": "file-pocket",
    "category": "files",
    "name": "A4 display file",
    "summary": "30 pockets · each",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Pockets": "30",
      "Type": "Display file"
    },
    "brand": "To be confirmed",
    "image": "images/file-pocket-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-847207"
  },
  {
    "id": "folders",
    "category": "files",
    "name": "A4 document folders",
    "summary": "Manilla · pack of 10",
    "unit": "Pack of 10 folders",
    "specs": {
      "Size": "A4",
      "Material": "Manilla",
      "Folders per pack": "10"
    },
    "brand": "To be confirmed",
    "image": "images/folders-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-55000203"
  },
  {
    "id": "exercise-72",
    "category": "books",
    "name": "A4 exercise book",
    "summary": "72 pages · feint and margin",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Pages": "72",
      "Ruling": "Feint and margin"
    },
    "brand": "To be confirmed",
    "image": "images/exercise-72-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-204015"
  },
  {
    "id": "exercise-192",
    "category": "books",
    "name": "A4 hardcover notebook",
    "summary": "192 pages · ruled",
    "unit": "Each",
    "specs": {
      "Size": "A4",
      "Pages": "192",
      "Cover": "Hardcover",
      "Ruling": "Ruled"
    },
    "brand": "To be confirmed",
    "image": "images/exercise-192-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-111162"
  },
  {
    "id": "spiral-a5",
    "category": "books",
    "name": "A5 spiral notebook",
    "summary": "160 pages · ruled",
    "unit": "Each",
    "specs": {
      "Size": "A5",
      "Pages": "160",
      "Binding": "Spiral",
      "Ruling": "Ruled"
    },
    "brand": "To be confirmed",
    "image": "images/spiral-a5-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-744199UO"
  },
  {
    "id": "coloured-pencils",
    "category": "art",
    "name": "Coloured pencils",
    "summary": "12 colours · one set",
    "unit": "Set of 12",
    "specs": {
      "Colours": "12 assorted",
      "Type": "Colouring pencils"
    },
    "brand": "To be confirmed",
    "image": "images/coloured-pencils-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-302116"
  },
  {
    "id": "wax-crayons",
    "category": "art",
    "name": "Wax crayons",
    "summary": "12 colours · one set",
    "unit": "Set of 12",
    "specs": {
      "Colours": "12 assorted",
      "Type": "Wax crayons"
    },
    "brand": "To be confirmed",
    "image": "images/wax-crayons-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-204448"
  },
  {
    "id": "glue-stick",
    "category": "art",
    "name": "Glue stick",
    "summary": "20 g · each",
    "unit": "Each",
    "specs": {
      "Size": "20 g",
      "Type": "Glue stick"
    },
    "brand": "To be confirmed",
    "image": "images/glue-stick-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-103715"
  },
  {
    "id": "ruler-30",
    "category": "ruler",
    "name": "Clear plastic ruler",
    "summary": "30 cm · each",
    "unit": "Each",
    "specs": {
      "Length": "30 cm",
      "Material": "Clear plastic"
    },
    "brand": "To be confirmed",
    "image": "images/ruler-30-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-851347"
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
    "imageType": "generated illustrative image",
    "replacementId": "waltons-204840"
  },
  {
    "id": "calculator-basic",
    "category": "calc",
    "name": "Desktop calculator",
    "summary": "12-digit display · each",
    "unit": "Each",
    "specs": {
      "Display": "12 digits",
      "Type": "Desktop calculator"
    },
    "brand": "To be confirmed",
    "image": "images/calculator-basic-v1.webp",
    "imageType": "generated illustrative image",
    "replacementId": "waltons-741201"
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
    "imageType": "generated illustrative image",
    "replacementId": "waltons-204523"
  },
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
    "sourceDescription": "**DISC**A4 2 RING BINDER 25MM PVC BLUE",
    "replacementId": "waltons-84128404"
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
    "sourceDescription": "A4 2 RING BINDER 25MM BOARD TRUNK BIN-6000-01 *BTS*",
    "replacementId": "waltons-204634"
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
    "sourceDescription": "A4 80P EXAM PAD PUNCHED",
    "replacementId": "waltons-811436"
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
    "sourceDescription": "A4 CARRY FOLDER WITH STUD CLOSE PVC CLEAR 160MIC EACH",
    "replacementId": "waltons-87723514"
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
    "sourceDescription": "A4 LEVER ARCH FILE BLACK POLYPRO DONAU EACH *BTS*",
    "replacementId": "waltons-57818502"
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
    "sourceDescription": "A4 MULTIPUNCH POCKETS PP 40/50 MIC 10S GLASS CLEAR ANTI-STATIC",
    "replacementId": "waltons-847267"
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
    "sourceDescription": "A4 SECRETARIAL FOLDER CLEAR EACH",
    "replacementId": "waltons-84733714"
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
    "sourceDescription": "AMOS GLUE STICK 22G",
    "replacementId": "waltons-261123"
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
    "sourceDescription": "BANTEX MC2000/ PENFLEX RITEBOX PENCIL CASE LARGE 330 X 100 X 50MM *BTS*",
    "replacementId": "waltons-204542"
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
    "sourceDescription": "BANTEX MULTIPUNCH FILING POCKETS 10S 50MIC A4",
    "replacementId": "waltons-847265"
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
    "sourceDescription": "BIC CRYSTAL MEDIUM XTRA LIFE BALL PEN BLUE",
    "replacementId": "waltons-21111004"
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
    "sourceDescription": "BLUE PENCIL BAG (LONG) 33CM CLEAR",
    "replacementId": "waltons-30399904"
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
    "sourceDescription": "CHAIR BAG DENIM 44CM WITH POCKET *BTS*",
    "replacementId": "waltons-20498604"
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
    "sourceDescription": "DELI WHITEBOARD MARKER BULLET TIP BLACK 2 OR 1.8MM*BTS*",
    "replacementId": "waltons-72307902"
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
    "sourceDescription": "DISPLAY BOOK A4 10 POCKET 50MIC KANGAROO",
    "replacementId": "waltons-204665"
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
    "sourceDescription": "DISPLAY BOOK A4 20 POCKET 50MIC KANGAROO",
    "replacementId": "waltons-204666"
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
    "sourceDescription": "DISPLAY BOOK A4 30 POCKET 50MIC KANGAROO",
    "replacementId": "waltons-204669"
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
    "sourceDescription": "DUSTER CHALK BOARD GREEN FELT ECONOMICAL 150MM X 40MM WOODEN",
    "replacementId": "waltons-131303"
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
    "sourceDescription": "FABER-CASTELL / ADEL COLOURING PENCILS AQUARELLE 12S FULL LENGTH (AHT120212E)",
    "replacementId": "waltons-207661"
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
    "sourceDescription": "FABER-CASTELL COLOURING PENCILS 12S 7MM HEXAGONAL 175MM LENGTH*BTS*",
    "replacementId": "waltons-205359"
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
    "sourceDescription": "FABER-CASTELL WAX CRAYONS TRI GRIP 24S SLIM",
    "replacementId": "waltons-206710"
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
    "sourceDescription": "FLARD CARD / SPREIKAART (PRE-CUT) 0 - 1000",
    "replacementId": "waltons-204843"
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
    "sourceDescription": "FOLDBACK CLIPS 32MM BLACK EACH",
    "replacementId": "waltons-254304"
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
    "sourceDescription": "FOLDBACK CLIPS 41MM BLACK EACH",
    "replacementId": "waltons-254305"
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
    "sourceDescription": "LIBRARY BOOK BAG CANVAS SHORT HANDLE ZIP *BTS*",
    "replacementId": "waltons-303694"
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
    "sourceDescription": "MARLIN/NEXX POLYESTER PENCIL BAG 3 DIVISION",
    "replacementId": "waltons-204556"
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
    "sourceDescription": "MATH SET 11 PIECE CROXLEY EACH 3500",
    "replacementId": "waltons-206529"
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
    "sourceDescription": "NOVA ANTIBACTERIAL WET WIPES PACK 72 WIPES",
    "replacementId": "waltons-889233"
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
    "sourceDescription": "OFFICE USE DOMS** PENTEL OIL PASTELS 25S REGULAR 9MM DIA X 60MM LENGTH *BTS*",
    "replacementId": "waltons-204873"
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
    "sourceDescription": "PILOT EE102 PLASTIC ERASER LARGE 60MM X 20MM*BTS*",
    "replacementId": "waltons-471137"
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
    "sourceDescription": "PUZZLE WOODEN 48 PIECE EACH (ASSORTED DESIGNS)",
    "replacementId": "waltons-206956"
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
    "sourceDescription": "RULER 30CM ASSORTED COLOURS PLASTIC EACH (1CM & 0.5CM) DEANS*BTS*",
    "replacementId": "waltons-851347"
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
    "sourceDescription": "SCISSORS 165MM ORANGE HANDLE SCHOOL BLADE 1.5MM*BTS*",
    "replacementId": "waltons-206775"
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
    "sourceDescription": "SCISSORS MAPED 130MM RIGHT HANDED SCHOLASTIC METAL ROUND TIP (SCHOOL USE)*BTS*",
    "replacementId": "waltons-206145"
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
    "sourceDescription": "SHARPENER 2 HOLE PLASTIC BARREL MAPED SHAKER 534755 *BTS*",
    "replacementId": "waltons-204604"
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
    "sourceDescription": "SHARPENER 2 HOLE Y+POLKA CONTAINER EACH",
    "replacementId": "waltons-302124"
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
    "sourceDescription": "TEDDY DOUGH 4 X 100G KIT PLAY *BTS*",
    "replacementId": "waltons-204888"
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
    "sourceDescription": "TISSUES PACK OF 90S PILLOWY SOFT PACK. USE FOR PVT",
    "replacementId": "waltons-207021"
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
    "sourceDescription": "WAX CRAYONS A24 THIN 8MM ROUND THIN 24S (DALA)",
    "replacementId": "waltons-204314"
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
    "sourceDescription": "WAX CRAYONS C9 JUMBO 14MM ROUND THICK 9S BANTEX BKR972383*BTS*",
    "replacementId": "waltons-N00089"
  }
];
