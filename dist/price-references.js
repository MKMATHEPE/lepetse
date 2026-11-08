// Researched retail benchmarks. Not Lepetse selling prices or stock commitments.
const priceReferences = {
  "paper-a4": {
    "amountMinor": 6900,
    "currency": "ZAR",
    "retailer": "Waltons",
    "sourceUrl": "https://www.waltons.co.za/shop/office-supplies/paper/a4a3-copy-printer-paper",
    "referenceProduct": "Multioffice A4 80 gsm white, 500 sheets",
    "basis": "Comparable brand; catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "paper-a3": {
    "amountMinor": 24199,
    "currency": "ZAR",
    "retailer": "Waltons",
    "sourceUrl": "https://www.waltons.co.za/shop/office-supplies/paper/a4a3-copy-printer-paper",
    "referenceProduct": "Mondi Rotatrim A3 80 gsm white, 500 sheets",
    "basis": "Comparable brand; catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "exam-pad": {
    "amountMinor": 1670,
    "currency": "ZAR",
    "retailer": "Penfile",
    "sourceUrl": "https://www.penfile.co.za/shop/books-pads/exam-pads-legal-pads/treeline-a4-exam-pad-punched-100-sheet/",
    "referenceProduct": "Treeline A4 punched examination pad, 100 sheets",
    "basis": "Comparable ruled pad; catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "pens-blue": {
    "amountMinor": 2760,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?limit=40&page=1&path=82_83&rt=product%2Fcategory&sort=name-ASC",
    "referenceProduct": "Croxley Create medium blue ballpoint pen, each",
    "basis": "Calculated reference: 10 × R2.76 single pens. Not a retailer quote for a 10-pack.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "pens-black": {
    "amountMinor": 2760,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?limit=40&page=1&path=82_83&rt=product%2Fcategory&sort=name-ASC",
    "referenceProduct": "Croxley Create medium black ballpoint pen, each",
    "basis": "Calculated reference: 10 × R2.76 single pens. Not a retailer quote for a 10-pack.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "pencils-hb": {
    "amountMinor": 3450,
    "currency": "ZAR",
    "retailer": "Waltons",
    "sourceUrl": "https://www.waltons.co.za/buy/waltons-primeline-pencil-hb-box-of-12",
    "referenceProduct": "Waltons Primeline HB pencils, box of 12",
    "basis": "Comparable brand; grade and pack quantity match. Catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "highlighters": {
    "amountMinor": 2420,
    "currency": "ZAR",
    "retailer": "Penfile",
    "sourceUrl": "https://www.penfile.co.za/product-category/writing-correction/highlighters/page/2/",
    "referenceProduct": "Collosso Slim chisel-tip assorted highlighters, wallet of 4",
    "basis": "Comparable product; catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "file-lever": {
    "amountMinor": 2990,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?rt=product/category&path=84_115",
    "referenceProduct": "Croxley Everyday A4 board lever arch file, 70 mm, each",
    "basis": "Comparable product; catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "file-pocket": {
    "amountMinor": 4255,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?rt=product/category&path=84_117",
    "referenceProduct": "Flip File A4 display book, 30 pockets",
    "basis": "Comparable brand; catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "folders": {
    "amountMinor": 2300,
    "currency": "ZAR",
    "retailer": "Statesman",
    "sourceUrl": "https://statesman.co.za/folders/",
    "referenceProduct": "Statesman green manilla folders, pack of 100",
    "basis": "Calculated reference: R229.99 ÷ 100 × 10 = R23.00 rounded. Retail pack is 100; A4 dimensions need confirmation.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "exercise-72": {
    "amountMinor": 595,
    "currency": "ZAR",
    "retailer": "Woolworths",
    "sourceUrl": "https://www.woolworths.co.za/prod/_/A-6009101823499",
    "referenceProduct": "A4 exercise book, 72 pages, feint and margin",
    "basis": "Comparable product; catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "exercise-192": {
    "amountMinor": 2139,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?rt=product/category&path=65_75",
    "referenceProduct": "Croxley JD161 A4 hardcover counter book, 192 pages, feint and margin",
    "basis": "Comparable ruled book; catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "spiral-a5": {
    "amountMinor": 3999,
    "currency": "ZAR",
    "retailer": "Perkal Gifts",
    "sourceUrl": "https://www.pgifts.co.za/product/a5-hardcover-spiral-bound-notebook-160-lined-pages-many-colours/",
    "referenceProduct": "A5 hardcover spiral notebook, 160 lined pages",
    "basis": "Comparable product; catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "coloured-pencils": {
    "amountMinor": 1800,
    "currency": "ZAR",
    "retailer": "Techpro",
    "sourceUrl": "https://techproshop.co.za/product-brand/deli/",
    "referenceProduct": "Deli EC113-12 assorted colour pencils, set of 12",
    "basis": "Comparable product; catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "wax-crayons": {
    "amountMinor": 1999,
    "currency": "ZAR",
    "retailer": "Woolworths",
    "sourceUrl": "https://www.woolworths.co.za/prod/_/A-6009182305914",
    "referenceProduct": "Woolworths wax crayons, 12 colours",
    "basis": "Comparable product; catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "ruler-30": {
    "amountMinor": 500,
    "currency": "ZAR",
    "retailer": "Techpro",
    "sourceUrl": "https://techproshop.co.za/product-brand/deli/",
    "referenceProduct": "Deli E6230 transparent ruler, 30 cm",
    "basis": "Comparable product; catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "calculator-basic": {
    "amountMinor": 11500,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?rt=product/category&path=77_103",
    "referenceProduct": "Meeco MC221 12-digit desktop calculator",
    "basis": "Comparable model; catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-03": {
    "amountMinor": 1599,
    "currency": "ZAR",
    "retailer": "PNA",
    "sourceUrl": "https://www.pna.co.za/product-category/stationery/school-books/exam-pads/",
    "referenceProduct": "PNA punched A4 exam pad, 80 pages",
    "basis": "Comparable brand; catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-08": {
    "amountMinor": 1886,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?rt=product/category&path=71_72",
    "referenceProduct": "Amos glue stick, 22 g, each",
    "basis": "Brand, size and unit match.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-09": {
    "amountMinor": 2576,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?rt=product/category&path=71_72",
    "referenceProduct": "Amos glue stick, 40 g, each",
    "basis": "Brand, size and unit match.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-11": {
    "amountMinor": 1715,
    "currency": "ZAR",
    "retailer": "Forms Media Independent Africa",
    "sourceUrl": "https://fmia.co.za/product-category/files-folders/filing-pockets/",
    "referenceProduct": "Bantex B2021 A4 filing pockets, 50 micron, pack of 10",
    "basis": "Brand, size and pack quantity match.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-12": {
    "amountMinor": 644,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?limit=40&page=1&path=82_83&rt=product%2Fcategory&sort=name-ASC",
    "referenceProduct": "BIC Crystal Xtra Life medium blue ballpoint pen, each",
    "basis": "Brand, colour, tip and unit match.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-13": {
    "amountMinor": 667,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?limit=40&page=1&path=82_83&rt=product%2Fcategory&sort=name-ASC",
    "referenceProduct": "BIC Orange fine blue pen, each",
    "basis": "Brand, colour, tip and unit match.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-15": {
    "amountMinor": 6900,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?rt=product/category&path=77_108",
    "referenceProduct": "Denim chair bag with pocket, 440 mm",
    "basis": "Size and material match; trim colour subject to confirmation.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-18": {
    "amountMinor": 1932,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?rt=product/category&path=84_117",
    "referenceProduct": "Kangaroo / Flip File A4 softcover display book, 10 pockets",
    "basis": "A4, pocket count and unit match; verify micron specification.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-19": {
    "amountMinor": 2990,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?rt=product/category&path=84_117",
    "referenceProduct": "Kangaroo / Flip File A4 softcover display book, 20 pockets",
    "basis": "A4, pocket count and unit match; verify micron specification.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-20": {
    "amountMinor": 4255,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?rt=product/category&path=84_117",
    "referenceProduct": "Kangaroo / Flip File A4 softcover display book, 30 pockets",
    "basis": "A4, pocket count and unit match; verify micron specification.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-21": {
    "amountMinor": 1898,
    "currency": "ZAR",
    "retailer": "Stationery Net",
    "sourceUrl": "https://stationerynet.co.za/collections/erasers",
    "referenceProduct": "Green felt chalkboard duster, 150 mm",
    "basis": "Comparable size; confirm 40 mm width and wooden construction.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-25": {
    "amountMinor": 9500,
    "currency": "ZAR",
    "retailer": "Office National",
    "sourceUrl": "https://www.officenational.co.za/education/education/arts-crafts/crayons",
    "referenceProduct": "Faber-Castell triangular wax crayons, 24 pack, FCA120092",
    "basis": "Brand and pack quantity match; confirm slim Tri Grip variant.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-27": {
    "amountMinor": 154,
    "currency": "ZAR",
    "retailer": "GR Pym Office National",
    "sourceUrl": "https://grpym.officenational.co.za/stationery/office-supplies-desk-accessories/clips-pins/foldback-clips",
    "referenceProduct": "Black foldback clips, 32 mm, pack of 12",
    "basis": "Calculated single-clip reference: R18.50 ÷ 12 = R1.54 rounded. Retailer sells a 12-pack.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-28": {
    "amountMinor": 267,
    "currency": "ZAR",
    "retailer": "GR Pym Office National",
    "sourceUrl": "https://grpym.officenational.co.za/stationery/office-supplies-desk-accessories/clips-pins/foldback-clips",
    "referenceProduct": "Black foldback clips, 41 mm, pack of 12",
    "basis": "Calculated single-clip reference: R32.00 ÷ 12 = R2.67 rounded. Retailer sells a 12-pack.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-29": {
    "amountMinor": 1295,
    "currency": "ZAR",
    "retailer": "Waltons",
    "sourceUrl": "https://www.waltons.co.za/buy/faber-castell-goldfaber-graphite-pencil-hb",
    "referenceProduct": "Faber-Castell Goldfaber HB pencil, each",
    "basis": "Brand, grade and unit match.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-34": {
    "amountMinor": 7200,
    "currency": "ZAR",
    "retailer": "Waltons",
    "sourceUrl": "https://www.waltons.co.za/buy/pentel-oil-pastels-box-of-25",
    "referenceProduct": "Pentel oil pastels, box of 25",
    "basis": "Reference uses Pentel alternative; exact brand remains to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-35": {
    "amountMinor": 1140,
    "currency": "ZAR",
    "retailer": "Penfile",
    "sourceUrl": "https://www.penfile.co.za/product-category/writing-correction/erasers/",
    "referenceProduct": "Pilot EE102 large plastic eraser, each",
    "basis": "Brand, model and unit match.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-39": {
    "amountMinor": 1450,
    "currency": "ZAR",
    "retailer": "Waltons Back To School",
    "sourceUrl": "https://www.backtoschool.co.za/brand/maped",
    "referenceProduct": "Maped Pulse school scissors, 13 cm",
    "basis": "Comparable school scissors; confirm scholastic model, handedness and tip.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-40": {
    "amountMinor": 2369,
    "currency": "ZAR",
    "retailer": "Align Stationers",
    "sourceUrl": "https://alignstationers.co.za/index.php?manufacturer_id=67&rt=product%2Fmanufacturer",
    "referenceProduct": "Maped Shaker two-hole container sharpener, each",
    "basis": "Brand, type and unit match; confirm product code.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-42": {
    "amountMinor": 4200,
    "currency": "ZAR",
    "retailer": "MCS Office National",
    "sourceUrl": "https://mcsofficesupplies.co.za/teddy-dough-clay-4x100g",
    "referenceProduct": "Teddy dough kit, 4 × 100 g",
    "basis": "Brand, weights and kit quantity match.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-44": {
    "amountMinor": 2790,
    "currency": "ZAR",
    "retailer": "Chamberlain",
    "sourceUrl": "https://www.chamberlains.co.za/dala-a24-wax-crayons-tedc-a24-1088272",
    "referenceProduct": "Dala A24 wax crayons, 24 assorted colours",
    "basis": "Brand, model and pack count match.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glenanda-45": {
    "amountMinor": 3680,
    "currency": "ZAR",
    "retailer": "Office National",
    "sourceUrl": "https://www.officenational.co.za/education/education/arts-crafts/crayons",
    "referenceProduct": "Bantex BKR972383 jumbo wax crayons, 14 mm, 9 pack",
    "basis": "Brand, model, diameter and pack quantity match.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  },
  "glue-stick": {
    "amountMinor": 1799,
    "currency": "ZAR",
    "retailer": "Country Cottage Products",
    "sourceUrl": "https://countrycottageproducts.co.za/online-store/stationery-supplies-school-offfice/adhesives-glue-tape-bubble-wrap/glue-sticks",
    "referenceProduct": "Marlin non-toxic glue stick, 20 g, each",
    "basis": "Comparable brand; size and unit match. Catalogue brand to be confirmed.",
    "checkedOn": "2026-11-08",
    "taxBasis": "Retail price as displayed by the source; confirm applicable VAT in the final quotation."
  }
};
