// Supplied Glenanda Primary Grade R–7 workbook. Quantities are treated as per learner for this quote builder.
const schoolGradeLists = {
  "R": [
    {
      "key": "glenanda-43",
      "original": "TISSUES PACK OF 90S PILLOWY SOFT PACK. USE FOR PVT",
      "quantity": 4,
      "unit": "Pack of 90 tissues",
      "difference": "Twinsaver replaces Pillowy Soft. Both packs contain 90 tissues."
    },
    {
      "key": "glenanda-45",
      "original": "WAX CRAYONS C9 JUMBO 14MM ROUND THICK 9S BANTEX BKR972383*BTS*",
      "quantity": 1,
      "unit": "Set of 9 crayons",
      "difference": "Croxley jumbo crayons replace Bantex, set of nine. The requested 14 mm diameter is not confirmed."
    },
    {
      "key": "glenanda-09",
      "original": "AMOS GLUE STICK 40G*BTS*",
      "quantity": 4,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-36",
      "original": "PUZZLE WOODEN 48 PIECE EACH (ASSORTED DESIGNS)",
      "quantity": 1,
      "unit": "Each puzzle",
      "difference": "RGS wooden puzzle has 48 pieces and a dinosaur design; the list allows assorted designs."
    },
    {
      "key": "glenanda-30",
      "original": "LIBRARY BOOK BAG CANVAS SHORT HANDLE ZIP *BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Polyester replaces the requested canvas bag. Confirm the short handles and zip closure."
    },
    {
      "key": "glenanda-27",
      "original": "FOLDBACK CLIPS 32MM BLACK EACH",
      "quantity": 1,
      "unit": "Each",
      "difference": "Clips are sold in packs of 12 rather than individually. Whole-pack quantities and extras are shown."
    },
    {
      "key": "glenanda-21",
      "original": "DUSTER CHALK BOARD GREEN FELT ECONOMICAL 150MM X 40MM WOODEN",
      "quantity": 1,
      "unit": "Each",
      "difference": "The proposed duster is 150 × 40 mm with green felt. Confirm the wooden body."
    },
    {
      "key": "glenanda-39",
      "original": "SCISSORS MAPED 130MM RIGHT HANDED SCHOLASTIC METAL ROUND TIP (SCHOOL USE)*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Maped Pulse 13 cm scissors: confirm the right-handed, round-tip requirement."
    },
    {
      "key": "glenanda-04",
      "original": "A4 CARRY FOLDER WITH STUD CLOSE PVC CLEAR 160MIC EACH",
      "quantity": 1,
      "unit": "Each",
      "difference": "Polypropylene replaces the requested 160-micron PVC. Thickness is not confirmed."
    },
    {
      "key": "glenanda-42",
      "original": "TEDDY DOUGH 4 X 100G KIT PLAY *BTS*",
      "quantity": 1,
      "unit": "Kit of 4 × 100 g",
      "difference": "Four Teddy tubs are supplied as one set. The requested 100 g weight per tub is not confirmed."
    }
  ],
  "1": [
    {
      "key": "glenanda-31",
      "original": "MARLIN/NEXX POLYESTER PENCIL BAG 3 DIVISION",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline three-compartment polyester pencil bag replaces Marlin / Nexx."
    },
    {
      "key": "glenanda-16",
      "original": "CHAIR BAG DENIM 53.5CM WITH POCKET SPECIAL SIZE",
      "quantity": 1,
      "unit": "Each",
      "difference": "The special 53.5 cm chair bag is not sourced. Include as a sourcing request."
    },
    {
      "key": "glenanda-30",
      "original": "LIBRARY BOOK BAG CANVAS SHORT HANDLE ZIP *BTS*",
      "quantity": 2,
      "unit": "Each",
      "difference": "Polyester replaces the requested canvas bag. Confirm the short handles and zip closure."
    },
    {
      "key": "glenanda-34",
      "original": "OFFICE USE DOMS** PENTEL OIL PASTELS 25S REGULAR 9MM DIA X 60MM LENGTH *BTS*",
      "quantity": 1,
      "unit": "Set of 25 pastels",
      "difference": "Pentel oil pastels, set of 25. The requested 9 × 60 mm dimensions are not confirmed."
    },
    {
      "key": "glenanda-28",
      "original": "FOLDBACK CLIPS 41MM BLACK EACH",
      "quantity": 1,
      "unit": "Each",
      "difference": "Clips are sold in packs of 12 rather than individually. Whole-pack quantities and extras are shown."
    },
    {
      "key": "glenanda-43",
      "original": "TISSUES PACK OF 90S PILLOWY SOFT PACK. USE FOR PVT",
      "quantity": 4,
      "unit": "Pack of 90 tissues",
      "difference": "Twinsaver replaces Pillowy Soft. Both packs contain 90 tissues."
    },
    {
      "key": "glenanda-25",
      "original": "FABER-CASTELL WAX CRAYONS TRI GRIP 24S SLIM",
      "quantity": 1,
      "unit": "Set of 24 crayons",
      "difference": "Triangular wax crayons replace the requested slim Tri Grip version. Confirm the shape and thickness."
    },
    {
      "key": "glenanda-24",
      "original": "FABER-CASTELL COLOURING PENCILS 12S 7MM HEXAGONAL 175MM LENGTH*BTS*",
      "quantity": 1,
      "unit": "Set of 12 pencils",
      "difference": "Faber-Castell full-size pencils, set of 12. The requested 7 × 175 mm dimensions are not confirmed."
    },
    {
      "key": "glenanda-29",
      "original": "GOLDFABER PENCIL HB EACH*BTS*",
      "quantity": 10,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-08",
      "original": "AMOS GLUE STICK 22G",
      "quantity": 4,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-35",
      "original": "PILOT EE102 PLASTIC ERASER LARGE 60MM X 20MM*BTS*",
      "quantity": 4,
      "unit": "Each",
      "difference": "Primeline Soft Touch 60 mm eraser replaces Pilot EE102. Confirm the required width."
    },
    {
      "key": "glenanda-40",
      "original": "SHARPENER 2 HOLE PLASTIC BARREL MAPED SHAKER 534755 *BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Maped Shaker two-hole sharpener is proposed. Confirm the requested 534755 model."
    },
    {
      "key": "glenanda-37",
      "original": "RULER 30CM ASSORTED COLOURS PLASTIC EACH (1CM & 0.5CM) DEANS*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline clear 30 cm ruler replaces Deans assorted colours. Confirm the required markings."
    },
    {
      "key": "glenanda-39",
      "original": "SCISSORS MAPED 130MM RIGHT HANDED SCHOLASTIC METAL ROUND TIP (SCHOOL USE)*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Maped Pulse 13 cm scissors: confirm the right-handed, round-tip requirement."
    },
    {
      "key": "glenanda-07",
      "original": "A4 SECRETARIAL FOLDER CLEAR EACH",
      "quantity": 1,
      "unit": "Each",
      "difference": "A clear gusset presentation folder replaces the requested secretarial folder."
    },
    {
      "key": "glenanda-42",
      "original": "TEDDY DOUGH 4 X 100G KIT PLAY *BTS*",
      "quantity": 1,
      "unit": "Kit of 4 × 100 g",
      "difference": "Four Teddy tubs are supplied as one set. The requested 100 g weight per tub is not confirmed."
    },
    {
      "key": "glenanda-02",
      "original": "A4 2 RING BINDER 25MM BOARD TRUNK BIN-6000-01 *BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Croxley trunk-board binder replaces Board Trunk BIN-6000-01. Confirm the model change."
    },
    {
      "key": "glenanda-11",
      "original": "BANTEX MULTIPUNCH FILING POCKETS 10S 50MIC A4",
      "quantity": 1,
      "unit": "Pack of 10 pockets",
      "difference": "Bantex CopySafe pockets are sold individually. Ten pockets are required for each pack on the school list; confirm the thickness."
    }
  ],
  "2": [
    {
      "key": "glenanda-31",
      "original": "MARLIN/NEXX POLYESTER PENCIL BAG 3 DIVISION",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline three-compartment polyester pencil bag replaces Marlin / Nexx."
    },
    {
      "key": "glenanda-43",
      "original": "TISSUES PACK OF 90S PILLOWY SOFT PACK. USE FOR PVT",
      "quantity": 4,
      "unit": "Pack of 90 tissues",
      "difference": "Twinsaver replaces Pillowy Soft. Both packs contain 90 tissues."
    },
    {
      "key": "glenanda-29",
      "original": "GOLDFABER PENCIL HB EACH*BTS*",
      "quantity": 10,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-24",
      "original": "FABER-CASTELL COLOURING PENCILS 12S 7MM HEXAGONAL 175MM LENGTH*BTS*",
      "quantity": 2,
      "unit": "Set of 12 pencils",
      "difference": "Faber-Castell full-size pencils, set of 12. The requested 7 × 175 mm dimensions are not confirmed."
    },
    {
      "key": "glenanda-28",
      "original": "FOLDBACK CLIPS 41MM BLACK EACH",
      "quantity": 1,
      "unit": "Each",
      "difference": "Clips are sold in packs of 12 rather than individually. Whole-pack quantities and extras are shown."
    },
    {
      "key": "glenanda-17",
      "original": "DELI WHITEBOARD MARKER BULLET TIP BLACK 2 OR 1.8MM*BTS*",
      "quantity": 8,
      "unit": "Each",
      "difference": "Monami SigmaFlo black 2 mm whiteboard marker replaces Deli."
    },
    {
      "key": "glenanda-39",
      "original": "SCISSORS MAPED 130MM RIGHT HANDED SCHOLASTIC METAL ROUND TIP (SCHOOL USE)*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Maped Pulse 13 cm scissors: confirm the right-handed, round-tip requirement."
    },
    {
      "key": "glenanda-05",
      "original": "A4 LEVER ARCH FILE BLACK POLYPRO DONAU EACH *BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Croxley replaces Donau. A4 black polypropylene lever arch file."
    },
    {
      "key": "glenanda-46",
      "original": "WRITING WHITE SLATE A4 SIZE **PARROT BRAND",
      "quantity": 1,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-15",
      "original": "CHAIR BAG DENIM 44CM WITH POCKET *BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Trefoil denim chair bag is listed as 44 cm. Confirm the required fit and pocket."
    },
    {
      "key": "glenanda-09",
      "original": "AMOS GLUE STICK 40G*BTS*",
      "quantity": 4,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-26",
      "original": "FLARD CARD / SPREIKAART (PRE-CUT) 0 - 1000",
      "quantity": 1,
      "unit": "Set",
      "difference": "Butterfly flard cards are proposed. Confirm coverage of the requested 0–1000 number range."
    },
    {
      "key": "glenanda-22",
      "original": "DUSTER SMALL BOARD 50MM WOOD & GREEN FELT",
      "quantity": 1,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-37",
      "original": "RULER 30CM ASSORTED COLOURS PLASTIC EACH (1CM & 0.5CM) DEANS*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline clear 30 cm ruler replaces Deans assorted colours. Confirm the required markings."
    },
    {
      "key": "glenanda-35",
      "original": "PILOT EE102 PLASTIC ERASER LARGE 60MM X 20MM*BTS*",
      "quantity": 4,
      "unit": "Each",
      "difference": "Primeline Soft Touch 60 mm eraser replaces Pilot EE102. Confirm the required width."
    },
    {
      "key": "glenanda-44",
      "original": "WAX CRAYONS A24 THIN 8MM ROUND THIN 24S (DALA)",
      "quantity": 1,
      "unit": "Set of 24 crayons",
      "difference": "Staedtler Noris replaces Dala, set of 24. The requested 8 mm round shape is not confirmed."
    },
    {
      "key": "glenanda-41",
      "original": "SHARPENER 2 HOLE Y+POLKA CONTAINER EACH",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline WP61 two-hole container sharpener replaces Y+ Polka."
    },
    {
      "key": "glenanda-18",
      "original": "DISPLAY BOOK A4 10 POCKET 50MIC KANGAROO",
      "quantity": 1,
      "unit": "Each",
      "difference": "Kangaroo A4 10-pocket display book. The requested 50-micron pocket thickness is not confirmed."
    },
    {
      "key": "glenanda-34",
      "original": "OFFICE USE DOMS** PENTEL OIL PASTELS 25S REGULAR 9MM DIA X 60MM LENGTH *BTS*",
      "quantity": 1,
      "unit": "Set of 25 pastels",
      "difference": "Pentel oil pastels, set of 25. The requested 9 × 60 mm dimensions are not confirmed."
    }
  ],
  "3": [
    {
      "key": "glenanda-39",
      "original": "SCISSORS MAPED 130MM RIGHT HANDED SCHOLASTIC METAL ROUND TIP (SCHOOL USE)*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Maped Pulse 13 cm scissors: confirm the right-handed, round-tip requirement."
    },
    {
      "key": "glenanda-01",
      "original": "**DISC**A4 2 RING BINDER 25MM PVC BLUE",
      "quantity": 1,
      "unit": "Each",
      "difference": "Croxley A4 blue PVC binder replaces the discontinued entry. Two D-rings, 25 mm."
    },
    {
      "key": "glenanda-34",
      "original": "OFFICE USE DOMS** PENTEL OIL PASTELS 25S REGULAR 9MM DIA X 60MM LENGTH *BTS*",
      "quantity": 2,
      "unit": "Set of 25 pastels",
      "difference": "Pentel oil pastels, set of 25. The requested 9 × 60 mm dimensions are not confirmed."
    },
    {
      "key": "glenanda-46",
      "original": "WRITING WHITE SLATE A4 SIZE **PARROT BRAND",
      "quantity": 1,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-22",
      "original": "DUSTER SMALL BOARD 50MM WOOD & GREEN FELT",
      "quantity": 1,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-30",
      "original": "LIBRARY BOOK BAG CANVAS SHORT HANDLE ZIP *BTS*",
      "quantity": 2,
      "unit": "Each",
      "difference": "Polyester replaces the requested canvas bag. Confirm the short handles and zip closure."
    },
    {
      "key": "glenanda-31",
      "original": "MARLIN/NEXX POLYESTER PENCIL BAG 3 DIVISION",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline three-compartment polyester pencil bag replaces Marlin / Nexx."
    },
    {
      "key": "glenanda-43",
      "original": "TISSUES PACK OF 90S PILLOWY SOFT PACK. USE FOR PVT",
      "quantity": 4,
      "unit": "Pack of 90 tissues",
      "difference": "Twinsaver replaces Pillowy Soft. Both packs contain 90 tissues."
    },
    {
      "key": "glenanda-18",
      "original": "DISPLAY BOOK A4 10 POCKET 50MIC KANGAROO",
      "quantity": 1,
      "unit": "Each",
      "difference": "Kangaroo A4 10-pocket display book. The requested 50-micron pocket thickness is not confirmed."
    },
    {
      "key": "glenanda-09",
      "original": "AMOS GLUE STICK 40G*BTS*",
      "quantity": 2,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-35",
      "original": "PILOT EE102 PLASTIC ERASER LARGE 60MM X 20MM*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline Soft Touch 60 mm eraser replaces Pilot EE102. Confirm the required width."
    },
    {
      "key": "glenanda-29",
      "original": "GOLDFABER PENCIL HB EACH*BTS*",
      "quantity": 4,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-24",
      "original": "FABER-CASTELL COLOURING PENCILS 12S 7MM HEXAGONAL 175MM LENGTH*BTS*",
      "quantity": 1,
      "unit": "Set of 12 pencils",
      "difference": "Faber-Castell full-size pencils, set of 12. The requested 7 × 175 mm dimensions are not confirmed."
    },
    {
      "key": "glenanda-37",
      "original": "RULER 30CM ASSORTED COLOURS PLASTIC EACH (1CM & 0.5CM) DEANS*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline clear 30 cm ruler replaces Deans assorted colours. Confirm the required markings."
    },
    {
      "key": "glenanda-40",
      "original": "SHARPENER 2 HOLE PLASTIC BARREL MAPED SHAKER 534755 *BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Maped Shaker two-hole sharpener is proposed. Confirm the requested 534755 model."
    },
    {
      "key": "glenanda-17",
      "original": "DELI WHITEBOARD MARKER BULLET TIP BLACK 2 OR 1.8MM*BTS*",
      "quantity": 4,
      "unit": "Each",
      "difference": "Monami SigmaFlo black 2 mm whiteboard marker replaces Deli."
    },
    {
      "key": "glenanda-28",
      "original": "FOLDBACK CLIPS 41MM BLACK EACH",
      "quantity": 1,
      "unit": "Each",
      "difference": "Clips are sold in packs of 12 rather than individually. Whole-pack quantities and extras are shown."
    },
    {
      "key": "glenanda-06",
      "original": "A4 MULTIPUNCH POCKETS PP 40/50 MIC 10S GLASS CLEAR ANTI-STATIC",
      "quantity": 1,
      "unit": "Pack of 10 pockets",
      "difference": "Primeline pockets are 60 micron; the school list requests 40/50 micron. Both packs contain 10."
    },
    {
      "key": "glenanda-15",
      "original": "CHAIR BAG DENIM 44CM WITH POCKET *BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Trefoil denim chair bag is listed as 44 cm. Confirm the required fit and pocket."
    },
    {
      "key": "glenanda-33",
      "original": "NOVA ANTIBACTERIAL WET WIPES PACK 72 WIPES",
      "quantity": 2,
      "unit": "Pack of 72 wipes",
      "difference": "Primeline antibacterial wipes replace Nova. Packs contain 40 rather than 72; quantities are calculated by wipe count."
    }
  ],
  "4": [
    {
      "key": "glenanda-20",
      "original": "DISPLAY BOOK A4 30 POCKET 50MIC KANGAROO",
      "quantity": 1,
      "unit": "Each",
      "difference": "Kangaroo A4 30-pocket display book. The requested 50-micron pocket thickness is not confirmed."
    },
    {
      "key": "glenanda-03",
      "original": "A4 80P EXAM PAD PUNCHED",
      "quantity": 2,
      "unit": "Each",
      "difference": "The proposed pad has 100 pages; the school list specifies 80 pages."
    },
    {
      "key": "glenanda-24",
      "original": "FABER-CASTELL COLOURING PENCILS 12S 7MM HEXAGONAL 175MM LENGTH*BTS*",
      "quantity": 1,
      "unit": "Set of 12 pencils",
      "difference": "Faber-Castell full-size pencils, set of 12. The requested 7 × 175 mm dimensions are not confirmed."
    },
    {
      "key": "glenanda-35",
      "original": "PILOT EE102 PLASTIC ERASER LARGE 60MM X 20MM*BTS*",
      "quantity": 2,
      "unit": "Each",
      "difference": "Primeline Soft Touch 60 mm eraser replaces Pilot EE102. Confirm the required width."
    },
    {
      "key": "glenanda-13",
      "original": "BIC ORANGE FINE POINT BLUE PEN*BTS*",
      "quantity": 6,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-34",
      "original": "OFFICE USE DOMS** PENTEL OIL PASTELS 25S REGULAR 9MM DIA X 60MM LENGTH *BTS*",
      "quantity": 1,
      "unit": "Set of 25 pastels",
      "difference": "Pentel oil pastels, set of 25. The requested 9 × 60 mm dimensions are not confirmed."
    },
    {
      "key": "glenanda-29",
      "original": "GOLDFABER PENCIL HB EACH*BTS*",
      "quantity": 4,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-09",
      "original": "AMOS GLUE STICK 40G*BTS*",
      "quantity": 4,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-37",
      "original": "RULER 30CM ASSORTED COLOURS PLASTIC EACH (1CM & 0.5CM) DEANS*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline clear 30 cm ruler replaces Deans assorted colours. Confirm the required markings."
    },
    {
      "key": "glenanda-38",
      "original": "SCISSORS 165MM ORANGE HANDLE SCHOOL BLADE 1.5MM*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Maped 16 cm scissors replace the specified orange-handle 165 mm scissors. Blade thickness is not confirmed."
    },
    {
      "key": "glenanda-40",
      "original": "SHARPENER 2 HOLE PLASTIC BARREL MAPED SHAKER 534755 *BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Maped Shaker two-hole sharpener is proposed. Confirm the requested 534755 model."
    },
    {
      "key": "glenanda-43",
      "original": "TISSUES PACK OF 90S PILLOWY SOFT PACK. USE FOR PVT",
      "quantity": 4,
      "unit": "Pack of 90 tissues",
      "difference": "Twinsaver replaces Pillowy Soft. Both packs contain 90 tissues."
    },
    {
      "key": "glenanda-14",
      "original": "BLUE PENCIL BAG (LONG) 33CM CLEAR",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline blue clear-front 33 cm pencil bag replaces the unbranded clear bag."
    },
    {
      "key": "glenanda-18",
      "original": "DISPLAY BOOK A4 10 POCKET 50MIC KANGAROO",
      "quantity": 3,
      "unit": "Each",
      "difference": "Kangaroo A4 10-pocket display book. The requested 50-micron pocket thickness is not confirmed."
    }
  ],
  "5": [
    {
      "key": "glenanda-19",
      "original": "DISPLAY BOOK A4 20 POCKET 50MIC KANGAROO",
      "quantity": 3,
      "unit": "Each",
      "difference": "Kangaroo A4 20-pocket display book. The requested 50-micron pocket thickness is not confirmed."
    },
    {
      "key": "glenanda-03",
      "original": "A4 80P EXAM PAD PUNCHED",
      "quantity": 1,
      "unit": "Each",
      "difference": "The proposed pad has 100 pages; the school list specifies 80 pages."
    },
    {
      "key": "glenanda-23",
      "original": "FABER-CASTELL / ADEL COLOURING PENCILS AQUARELLE 12S FULL LENGTH (AHT120212E)",
      "quantity": 1,
      "unit": "Set of 12 pencils",
      "difference": "Croxley Aquarelle pencils replace Faber-Castell / Adel. Set of 12."
    },
    {
      "key": "glenanda-35",
      "original": "PILOT EE102 PLASTIC ERASER LARGE 60MM X 20MM*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline Soft Touch 60 mm eraser replaces Pilot EE102. Confirm the required width."
    },
    {
      "key": "glenanda-13",
      "original": "BIC ORANGE FINE POINT BLUE PEN*BTS*",
      "quantity": 4,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-29",
      "original": "GOLDFABER PENCIL HB EACH*BTS*",
      "quantity": 4,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-08",
      "original": "AMOS GLUE STICK 22G",
      "quantity": 4,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-37",
      "original": "RULER 30CM ASSORTED COLOURS PLASTIC EACH (1CM & 0.5CM) DEANS*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline clear 30 cm ruler replaces Deans assorted colours. Confirm the required markings."
    },
    {
      "key": "glenanda-38",
      "original": "SCISSORS 165MM ORANGE HANDLE SCHOOL BLADE 1.5MM*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Maped 16 cm scissors replace the specified orange-handle 165 mm scissors. Blade thickness is not confirmed."
    },
    {
      "key": "glenanda-40",
      "original": "SHARPENER 2 HOLE PLASTIC BARREL MAPED SHAKER 534755 *BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Maped Shaker two-hole sharpener is proposed. Confirm the requested 534755 model."
    },
    {
      "key": "glenanda-43",
      "original": "TISSUES PACK OF 90S PILLOWY SOFT PACK. USE FOR PVT",
      "quantity": 4,
      "unit": "Pack of 90 tissues",
      "difference": "Twinsaver replaces Pillowy Soft. Both packs contain 90 tissues."
    },
    {
      "key": "glenanda-10",
      "original": "BANTEX MC2000/ PENFLEX RITEBOX PENCIL CASE LARGE 330 X 100 X 50MM *BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Bantex McCasey 30 cm case replaces the specified 330 × 100 × 50 mm case. Confirm the size."
    },
    {
      "key": "glenanda-20",
      "original": "DISPLAY BOOK A4 30 POCKET 50MIC KANGAROO",
      "quantity": 1,
      "unit": "Each",
      "difference": "Kangaroo A4 30-pocket display book. The requested 50-micron pocket thickness is not confirmed."
    }
  ],
  "6": [
    {
      "key": "glenanda-19",
      "original": "DISPLAY BOOK A4 20 POCKET 50MIC KANGAROO",
      "quantity": 2,
      "unit": "Each",
      "difference": "Kangaroo A4 20-pocket display book. The requested 50-micron pocket thickness is not confirmed."
    },
    {
      "key": "glenanda-24",
      "original": "FABER-CASTELL COLOURING PENCILS 12S 7MM HEXAGONAL 175MM LENGTH*BTS*",
      "quantity": 1,
      "unit": "Set of 12 pencils",
      "difference": "Faber-Castell full-size pencils, set of 12. The requested 7 × 175 mm dimensions are not confirmed."
    },
    {
      "key": "glenanda-35",
      "original": "PILOT EE102 PLASTIC ERASER LARGE 60MM X 20MM*BTS*",
      "quantity": 2,
      "unit": "Each",
      "difference": "Primeline Soft Touch 60 mm eraser replaces Pilot EE102. Confirm the required width."
    },
    {
      "key": "glenanda-12",
      "original": "BIC CRYSTAL MEDIUM XTRA LIFE BALL PEN BLUE",
      "quantity": 4,
      "unit": "Each",
      "difference": "BIC Crystal blue pen is proposed. The Xtra Life medium model is not confirmed."
    },
    {
      "key": "glenanda-29",
      "original": "GOLDFABER PENCIL HB EACH*BTS*",
      "quantity": 4,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-08",
      "original": "AMOS GLUE STICK 22G",
      "quantity": 4,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-37",
      "original": "RULER 30CM ASSORTED COLOURS PLASTIC EACH (1CM & 0.5CM) DEANS*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline clear 30 cm ruler replaces Deans assorted colours. Confirm the required markings."
    },
    {
      "key": "glenanda-32",
      "original": "MATH SET 11 PIECE CROXLEY EACH 3500",
      "quantity": 1,
      "unit": "Set of 11 pieces",
      "difference": "Primeline mathematics set replaces Croxley 3500. Confirm the requested 11-piece contents."
    },
    {
      "key": "glenanda-38",
      "original": "SCISSORS 165MM ORANGE HANDLE SCHOOL BLADE 1.5MM*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Maped 16 cm scissors replace the specified orange-handle 165 mm scissors. Blade thickness is not confirmed."
    },
    {
      "key": "glenanda-40",
      "original": "SHARPENER 2 HOLE PLASTIC BARREL MAPED SHAKER 534755 *BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Maped Shaker two-hole sharpener is proposed. Confirm the requested 534755 model."
    },
    {
      "key": "glenanda-43",
      "original": "TISSUES PACK OF 90S PILLOWY SOFT PACK. USE FOR PVT",
      "quantity": 4,
      "unit": "Pack of 90 tissues",
      "difference": "Twinsaver replaces Pillowy Soft. Both packs contain 90 tissues."
    },
    {
      "key": "glenanda-10",
      "original": "BANTEX MC2000/ PENFLEX RITEBOX PENCIL CASE LARGE 330 X 100 X 50MM *BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Bantex McCasey 30 cm case replaces the specified 330 × 100 × 50 mm case. Confirm the size."
    },
    {
      "key": "glenanda-18",
      "original": "DISPLAY BOOK A4 10 POCKET 50MIC KANGAROO",
      "quantity": 2,
      "unit": "Each",
      "difference": "Kangaroo A4 10-pocket display book. The requested 50-micron pocket thickness is not confirmed."
    },
    {
      "key": "glenanda-03",
      "original": "A4 80P EXAM PAD PUNCHED",
      "quantity": 1,
      "unit": "Each",
      "difference": "The proposed pad has 100 pages; the school list specifies 80 pages."
    }
  ],
  "7": [
    {
      "key": "glenanda-19",
      "original": "DISPLAY BOOK A4 20 POCKET 50MIC KANGAROO",
      "quantity": 2,
      "unit": "Each",
      "difference": "Kangaroo A4 20-pocket display book. The requested 50-micron pocket thickness is not confirmed."
    },
    {
      "key": "glenanda-20",
      "original": "DISPLAY BOOK A4 30 POCKET 50MIC KANGAROO",
      "quantity": 2,
      "unit": "Each",
      "difference": "Kangaroo A4 30-pocket display book. The requested 50-micron pocket thickness is not confirmed."
    },
    {
      "key": "glenanda-03",
      "original": "A4 80P EXAM PAD PUNCHED",
      "quantity": 2,
      "unit": "Each",
      "difference": "The proposed pad has 100 pages; the school list specifies 80 pages."
    },
    {
      "key": "glenanda-24",
      "original": "FABER-CASTELL COLOURING PENCILS 12S 7MM HEXAGONAL 175MM LENGTH*BTS*",
      "quantity": 1,
      "unit": "Set of 12 pencils",
      "difference": "Faber-Castell full-size pencils, set of 12. The requested 7 × 175 mm dimensions are not confirmed."
    },
    {
      "key": "glenanda-35",
      "original": "PILOT EE102 PLASTIC ERASER LARGE 60MM X 20MM*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline Soft Touch 60 mm eraser replaces Pilot EE102. Confirm the required width."
    },
    {
      "key": "glenanda-13",
      "original": "BIC ORANGE FINE POINT BLUE PEN*BTS*",
      "quantity": 8,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-29",
      "original": "GOLDFABER PENCIL HB EACH*BTS*",
      "quantity": 4,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-09",
      "original": "AMOS GLUE STICK 40G*BTS*",
      "quantity": 5,
      "unit": "Each",
      "difference": ""
    },
    {
      "key": "glenanda-37",
      "original": "RULER 30CM ASSORTED COLOURS PLASTIC EACH (1CM & 0.5CM) DEANS*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Primeline clear 30 cm ruler replaces Deans assorted colours. Confirm the required markings."
    },
    {
      "key": "glenanda-32",
      "original": "MATH SET 11 PIECE CROXLEY EACH 3500",
      "quantity": 1,
      "unit": "Set of 11 pieces",
      "difference": "Primeline mathematics set replaces Croxley 3500. Confirm the requested 11-piece contents."
    },
    {
      "key": "glenanda-10",
      "original": "BANTEX MC2000/ PENFLEX RITEBOX PENCIL CASE LARGE 330 X 100 X 50MM *BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Bantex McCasey 30 cm case replaces the specified 330 × 100 × 50 mm case. Confirm the size."
    },
    {
      "key": "glenanda-43",
      "original": "TISSUES PACK OF 90S PILLOWY SOFT PACK. USE FOR PVT",
      "quantity": 4,
      "unit": "Pack of 90 tissues",
      "difference": "Twinsaver replaces Pillowy Soft. Both packs contain 90 tissues."
    },
    {
      "key": "glenanda-38",
      "original": "SCISSORS 165MM ORANGE HANDLE SCHOOL BLADE 1.5MM*BTS*",
      "quantity": 1,
      "unit": "Each",
      "difference": "Maped 16 cm scissors replace the specified orange-handle 165 mm scissors. Blade thickness is not confirmed."
    }
  ]
};
let schoolPicker={grade:'R',learners:1};
function schoolProduct(key){return products.find(p=>p.id===key)||products.find(p=>p.replacementFor?.includes(key))||products.find(p=>p.id===retiredProducts.find(p=>p.id===key)?.replacementId)}
function schoolConversion(key){return {'glenanda-27':{required:1,supplied:12,label:'clips'},'glenanda-28':{required:1,supplied:12,label:'clips'},'glenanda-11':{required:10,supplied:1,label:'pockets'},'glenanda-33':{required:72,supplied:40,label:'wipes'}}[key]||{required:1,supplied:1,label:''}}
function schoolPlan(grade,learners){if(!schoolGradeLists[grade]||!Number.isInteger(learners)||learners<1||learners>9999)return [];return schoolGradeLists[grade].map(line=>{const p=schoolProduct(line.key),factor=schoolConversion(line.key),needed=line.quantity*learners*factor.required,quantity=Math.ceil(needed/factor.supplied),extra=quantity*factor.supplied-needed;return {...line,perLearner:line.quantity,product:p,needed,quantity,extra,factor}})}
function schoolPackNote(line){if(line.factor.required===1&&line.factor.supplied===1)return '';return `${line.needed} ${line.factor.label} required; ${line.quantity} × ${line.product.unit.toLowerCase()}${line.extra?` supplies ${line.extra} extra ${line.factor.label}`:''}.`}
function schoolDisplayPackNote(line){if(line.factor.supplied===12)return `${line.needed} ${line.needed===1?'clip':'clips'} needed; minimum supply is ${line.quantity*12} clips (${line.quantity} ${line.quantity===1?'pack':'packs'}).`;if(line.key==='glenanda-11')return 'School list requests packs of 10; supplied individually. Confirm the pocket thickness.';if(line.key==='glenanda-33')return `${line.needed} wipes needed; supplied in packs of 40.`;return ''}
function validatedSchoolMeta(meta,productId){if(!meta||meta.school!=='glenanda-primary'||!schoolGradeLists[meta.grade]||!Number.isInteger(meta.learners)||meta.learners<1||meta.learners>9999||!schoolGradeLists[meta.grade].some(x=>x.key===meta.key))return null;if(productId&&schoolProduct(meta.key)?.id!==productId)return null;return {school:'glenanda-primary',grade:meta.grade,learners:meta.learners,key:meta.key}}
function schoolBasketDescription(p,meta,quantity){const line=schoolPlan(meta.grade,meta.learners).find(x=>x.key===meta.key);return `Glenanda Primary · Grade ${meta.grade} · ${meta.learners} learner${meta.learners===1?'':'s'} — ${p.name}. School requirement per learner: ${line.perLearner} × ${line.unit}; ${line.original}. ${line.difference?'Replacement reviewed: '+line.difference+' ':''}${quantity!==undefined&&quantity!==line.quantity?`Buyer-adjusted quote quantity: ${quantity} × ${p.unit}. Calculated school quantity: ${line.quantity} × ${p.unit}.`:schoolPackNote(line)}`.trim()}
function schoolGradeOrder(){return Object.keys(schoolGradeLists).sort((a,b)=>a==='R'?-1:b==='R'?1:Number(a)-Number(b))}
// Only schools with supplied item data are offered for selection.
const schoolDirectory=[{id:'glenanda-primary',name:'Glenanda Primary',location:'Johannesburg South, Gauteng',grades:'Grades R–7',status:'Supplied list · year not confirmed',source:'https://www.glenandaprimary.com/stationery-lists'}];
function schoolSelectedSchool(){const params=new URLSearchParams(location.hash.split('?')[1]||''),id=params.get('school');return schoolDirectory.find(s=>s.id===id)||(schoolSelectedGrade()?schoolDirectory[0]:null)}
function schoolFlowSteps(){return ''}
function schoolDirectorySection(){let recent='';try{const saved=JSON.parse(localStorage.getItem('lepetse-school-preference')||'null');if(saved&&saved.school==='glenanda-primary'&&Object.prototype.hasOwnProperty.call(schoolGradeLists,saved.grade))recent=`<p class="school-recent">Last viewed: Glenanda Primary · Grade ${esc(saved.grade)} <a href="${schoolGradeHref(saved.grade,'quote')}">Continue list</a></p>`}catch{}return `<section class="section school-directory"><div class="wrap">${schoolFlowSteps(0)}<h2>Select your school</h2><p class="school-directory-intro">Choose a school to see its available grade lists.</p>${recent}<div class="school-directory-results">${schoolDirectory.map(s=>`<a class="school-directory-card" href="#schools?school=${s.id}"><span><strong>${esc(s.name)}</strong><small>${esc(s.location)}</small><small>${esc(s.grades)} · ${esc(s.status)}</small></span><span class="school-directory-action">Select school</span></a>`).join('')}</div>${schoolUploadShortcut()}</div></section>`}
function schoolUploadShortcut(){return '<p class="school-upload-shortcut">School not listed? <a href="#upload?buyer=schools">Upload your stationery list</a>.</p>'}
function schoolSelectedGrade(){const grade=new URLSearchParams(location.hash.split('?')[1]||'').get('grade');return Object.prototype.hasOwnProperty.call(schoolGradeLists,grade)?grade:null}
function schoolGradeHref(grade,intent='view'){return '#schools?school=glenanda-primary&grade='+encodeURIComponent(grade)+(intent==='quote'?'&intent=quote':'')}
function schoolGradeCards(){return `<section class="school-grade-section school-grade-overview"><div class="wrap">${schoolFlowSteps(1)}<a class="text-link school-change" href="#schools">Change school</a><div class="school-grade-heading"><div><span class="eyebrow">Glenanda Primary · Johannesburg South, Gauteng</span><h2 id="school-grades-title" tabindex="-1">Select your grade</h2></div></div><div class="school-grade-grid">${schoolGradeOrder().map(grade=>`<a class="school-grade-card" href="${schoolGradeHref(grade,'quote')}" aria-label="View Grade ${esc(grade)} stationery list, ${schoolGradeLists[grade].length} items"><div class="school-grade-card-top"><h3>Grade ${esc(grade)}</h3><span>${schoolGradeLists[grade].length} items</span></div><span class="school-grade-card-arrow" aria-hidden="true">→</span></a>`).join('')}</div><p class="school-grade-overview-note">Based on the supplied school spreadsheet. Review the original requirements and proposed replacements before adding a list. Final prices are confirmed by quotation.</p></div></section>`}
let schoolLineChoices={};
function schoolChosenPlan(){return schoolPlan(schoolPicker.grade,schoolPicker.learners).filter(line=>schoolLineChoices[line.key]?.included!==false).map(line=>({...line,quantity:schoolLineChoices[line.key]?.quantity??line.quantity}))}
function schoolChosenValid(plan){return plan.length>0&&plan.every(line=>Number.isInteger(line.quantity)&&line.quantity>=1&&line.quantity<=999999)}
function refreshSchoolChoices(){schoolListAdded=false;$('#school-list-error').textContent='';const plan=schoolChosenPlan();$('#school-reviewed')&&( $('#school-reviewed').checked=false);renderSchoolSummary(plan);updateSchoolReviewState();}
let schoolListAdded=false,schoolSummaryObserver=null,schoolControlFeedbackTimer=null;
function stopSchoolSummaryObserver(){schoolSummaryObserver?.disconnect();schoolSummaryObserver=null;clearTimeout(schoolControlFeedbackTimer)}
function schoolEstimate(plan){let amountMinor=0,pricedCount=0;for(const line of plan){const price=priceReferences[line.product.id];if(price&&Number.isInteger(price.amountMinor)&&price.amountMinor>=0&&price.currency==='ZAR'){amountMinor+=line.quantity*price.amountMinor;pricedCount++}}return {amountMinor,pricedCount,missingCount:plan.length-pricedCount}}
function schoolMoney(amountMinor){return new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR'}).format(amountMinor/100)}
function schoolProductTitle(p){const name=cardName(p);return name===p.name?name:productBrand(p)+' '+name}
function schoolShortDifference(line){return {'glenanda-43':'Twinsaver replaces Pillowy Soft.','glenanda-45':'Different brand; 14 mm diameter unconfirmed.','glenanda-36':'Dinosaur design; 48 wooden pieces.','glenanda-30':'Polyester replaces canvas; handles and zip unconfirmed.','glenanda-27':'Sold in packs of 12.','glenanda-28':'Sold in packs of 12.','glenanda-21':'Wooden body unconfirmed.','glenanda-39':'Right-handed design and round tips unconfirmed.','glenanda-04':'Polypropylene replaces 160-micron PVC.','glenanda-42':'100 g per tub unconfirmed.'}[line.key]||line.difference}
function schoolListSection(){const grade=schoolSelectedGrade();if(!grade)return schoolGradeCards();if(schoolPicker.grade!==grade)schoolPicker={grade,learners:1};if(!Number.isInteger(schoolPicker.learners)||schoolPicker.learners<1||schoolPicker.learners>9999)schoolPicker.learners=1;return `<section class="school-grade-section school-grade-detail"><div class="wrap">${schoolFlowSteps(2)}<a class="school-all-grades text-link" href="#schools?school=glenanda-primary">← Glenanda Primary · All grades</a><form id="school-grade-form" class="school-detail-layout"><div class="school-detail-main"><div class="school-detail-top"><div><span class="eyebrow">Glenanda Primary</span><h1 id="school-grade-title" tabindex="-1">Grade ${esc(grade)} stationery list</h1></div><div class="school-grade-controls"><div class="field"><label for="school-grade">Grade</label><select id="school-grade">${schoolGradeOrder().map(g=>`<option value="${g}" ${grade===g?'selected':''}>Grade ${g}</option>`).join('')}</select></div><div class="field"><label for="school-learners">Learners</label><div class="school-learner-stepper"><button id="school-learners-minus" type="button" aria-label="Decrease learners">−</button><input id="school-learners" type="number" min="1" max="9999" step="1" value="${schoolPicker.learners}" aria-describedby="school-learner-error" aria-invalid="false" required><button id="school-learners-plus" type="button" aria-label="Increase learners">+</button></div><p id="school-learner-error" class="school-learner-error" role="alert"></p></div></div></div><p class="school-quantity-basis">School quantities are per learner. Quote quantities use whole ordering packs across all learners. <span id="school-control-status" class="school-control-status" role="status" aria-live="polite"></span></p><div id="school-list-results"></div></div><aside class="school-quote-summary" aria-label="Quote summary"><h2>Quote summary</h2><div id="school-quote-totals" aria-live="polite"></div><button class="btn dark" id="school-add-list" type="submit" disabled>Add list to quote</button><button class="school-review-jump text-link" id="school-review-jump" type="button">Review replacements</button><p class="school-summary-help">Retail references only. Delivery excluded; final price by quotation.</p><p class="error" id="school-list-error" role="alert"></p></aside></form></div></section>`}
function updateSchoolReviewState(){const valid=schoolChosenValid(schoolChosenPlan()),reviewed=$('#school-reviewed');$('#school-add-list').disabled=!valid||!!(reviewed&&!reviewed.checked)||schoolListAdded;const jump=$('#school-review-jump');if(valid&&reviewed?.checked)jump.textContent='Review completed — change';else if(valid){const count=schoolChosenPlan().filter(x=>x.difference||schoolPackNote(x)).length;jump.textContent=`Review ${count} items before adding`}}
function renderSchoolSummary(plan){const target=$('#school-quote-totals'),jump=$('#school-review-jump');if(!schoolChosenValid(plan)){target.innerHTML='<p>Select at least one item and enter whole quote quantities from 1 to 999,999.</p>';jump.hidden=true;return}const estimate=schoolEstimate(plan),reviewCount=plan.filter(x=>x.difference||schoolPackNote(x)).length;target.innerHTML=`<p class="school-summary-selection">Grade ${esc(schoolPicker.grade)} · ${plan.length} items · ${schoolPicker.learners} learner${schoolPicker.learners===1?'':'s'}</p><div class="school-estimate"><span>${estimate.missingCount?'Indicative priced-item subtotal':'Indicative supply total'}</span><strong>${estimate.pricedCount?esc(schoolMoney(estimate.amountMinor)):'Price by quotation'}</strong></div>${estimate.missingCount?`<p class="school-price-missing">${estimate.missingCount} item${estimate.missingCount===1?' needs':'s need'} pricing. This is not a complete total.</p>`:''}`;jump.hidden=!reviewCount;jump.textContent=schoolListAdded?'List added — view your basket':`Review ${reviewCount} item${reviewCount===1?'':'s'} before adding`;if(schoolListAdded)jump.hidden=true}
function renderSchoolRows(){schoolListAdded=false;schoolLineChoices={};const plan=schoolPlan(schoolPicker.grade,schoolPicker.learners),target=$('#school-list-results');if(!plan.length){target.innerHTML='';renderSchoolSummary(plan);updateSchoolReviewState();return}const needsReview=plan.some(x=>x.difference||schoolPackNote(x));target.innerHTML=`<p class="school-list-count">${plan.length} items · Select items to include. Quote quantities are ordering units.</p><p class="school-selection-help">Changing the grade or learner count resets your item choices and quantities.</p><div class="school-list-table-wrap"><table class="school-list-table"><thead><tr><th scope="col">Select items · Product and review notes</th><th scope="col">Per learner</th><th scope="col">Quote quantity</th></tr></thead><tbody>${plan.map(line=>`<tr data-school-row="${esc(line.key)}"><td><label class="school-item-select"><input type="checkbox" data-school-include="${esc(line.key)}" aria-label="Include ${esc(schoolProductTitle(line.product))}" checked></label><div class="school-product-cell">${line.product.image?`<img src="${esc(line.product.image)}" alt="" width="40" height="40" loading="lazy">`:''}<div><a href="#product-${line.product.id}?mode=quote" title="${esc(line.product.name)}">${esc(schoolProductTitle(line.product))}</a>${line.difference&&!['glenanda-27','glenanda-28','glenanda-11'].includes(line.key)?`<p class="school-difference"><strong>Review:</strong> ${esc(schoolShortDifference(line))}</p>`:''}<details><summary>Details</summary><p><strong>School specification:</strong> ${esc(line.original)}</p><p><strong>Proposed product:</strong> ${esc(line.product.summary)}</p></details></div></div></td><td>${line.perLearner} × ${esc(line.unit)}</td><td><div class="school-edit-quantity"><input type="number" min="1" max="999999" step="1" value="${line.quantity}" data-school-quantity="${esc(line.key)}" aria-label="Quote quantity for ${esc(schoolProductTitle(line.product))}" required><span>× ${esc(line.product.unit)}</span></div><p class="school-default-quantity" data-school-default="${esc(line.key)}" hidden>Calculated: ${line.quantity} × ${esc(line.product.unit)}</p><p class="school-quantity-error" data-school-error="${esc(line.key)}" role="alert"></p>${schoolDisplayPackNote(line)?`<p class="school-pack-note">${esc(schoolDisplayPackNote(line))}</p>`:''}</td></tr>`).join('')}</tbody></table></div>${needsReview?'<label class="school-review"><input id="school-reviewed" type="checkbox" required><span>I have reviewed the replacement differences and whole-pack quantities shown above.</span></label>':''}`;document.querySelectorAll('[data-school-include]').forEach(input=>input.onchange=()=>{const key=input.dataset.schoolInclude;schoolLineChoices[key]={...schoolLineChoices[key],included:input.checked};const row=input.closest('tr'),quantity=row.querySelector('[data-school-quantity]');quantity.disabled=!input.checked;row.classList.toggle('school-item-excluded',!input.checked);refreshSchoolChoices()});document.querySelectorAll('[data-school-quantity]').forEach(input=>input.oninput=()=>{const key=input.dataset.schoolQuantity,value=input.valueAsNumber,valid=Number.isInteger(value)&&value>=1&&value<=999999;schoolLineChoices[key]={...schoolLineChoices[key],quantity:value};input.closest('tr').querySelector('[data-school-default]').hidden=value===schoolPlan(schoolPicker.grade,schoolPicker.learners).find(line=>line.key===key).quantity;input.setAttribute('aria-invalid',String(!valid));input.closest('tr').querySelector('[data-school-error]').textContent=valid?'':'Enter a whole quantity from 1 to 999,999.';refreshSchoolChoices()});renderSchoolSummary(plan);$('#school-reviewed')?.addEventListener('change',updateSchoolReviewState);updateSchoolReviewState()}
function adjustedSchoolLearners(value,delta){if(!Number.isFinite(value))return 1;return Math.max(1,Math.min(9999,Math.trunc(value)+delta))}
function updateSchoolLearnerButtons(){const input=$('#school-learners'),value=input.valueAsNumber;$('#school-learners-minus').disabled=Number.isInteger(value)&&value<=1;$('#school-learners-plus').disabled=Number.isInteger(value)&&value>=9999}
function applySchoolLearners(){const input=$('#school-learners'),value=input.valueAsNumber,valid=input.checkValidity()&&Number.isInteger(value)&&value>=1&&value<=9999;schoolPicker.learners=value;input.setAttribute('aria-invalid',String(!valid));$('#school-learner-error').textContent=valid?'':'Enter a whole number from 1 to 9,999.';$('#school-list-error').textContent='';renderSchoolRows();updateSchoolLearnerButtons();clearTimeout(schoolControlFeedbackTimer);const status=$('#school-control-status');status.textContent=valid?`Updated for ${value} learner${value===1?'':'s'}.`:'';if(valid)schoolControlFeedbackTimer=setTimeout(()=>{if(status.isConnected)status.textContent=''},2500)}
function bindSchoolLists(){stopSchoolSummaryObserver();if(!$('#school-grade-form'))return;try{localStorage.setItem('lepetse-school-preference',JSON.stringify({school:'glenanda-primary',grade:schoolSelectedGrade()}))}catch{}renderSchoolRows();updateSchoolLearnerButtons();const summary=$('.school-quote-summary');schoolSummaryObserver=new ResizeObserver(()=>document.documentElement.style.setProperty('--school-summary-height',summary.offsetHeight+'px'));schoolSummaryObserver.observe(summary);$('#school-review-jump').onclick=()=>{const review=$('.school-review');review?.scrollIntoView({block:'center',behavior:'auto'});$('#school-reviewed')?.focus({preventScroll:true})};const quoteIntent=new URLSearchParams(location.hash.split('?')[1]||'').get('intent')==='quote';requestAnimationFrame(()=>{const target=$(quoteIntent?'#school-learners':'#school-grade-title');target?.focus({preventScroll:true});$('.school-all-grades')?.scrollIntoView({block:'start',behavior:'auto'})});$('#school-grade').onchange=e=>{schoolPicker.grade=e.target.value;location.hash=schoolGradeHref(e.target.value,quoteIntent?'quote':'view')};$('#school-learners').oninput=applySchoolLearners;for(const [id,delta]of [['#school-learners-minus',-1],['#school-learners-plus',1]])$(id).onclick=()=>{const input=$('#school-learners');input.value=adjustedSchoolLearners(input.valueAsNumber,delta);applySchoolLearners()};$('#school-grade-form').onsubmit=e=>{e.preventDefault();const plan=schoolChosenPlan();if(!schoolChosenValid(plan))return;const reviewed=$('#school-reviewed');if(reviewed&&!reviewed.checked){reviewed.reportValidity();return}if(plan.some(x=>!x.product||x.quantity>999999)||items.length+plan.length>250){$('#school-list-error').textContent='This list exceeds the quote basket limit. Reduce the learner count or start a separate enquiry.';return}for(const line of plan){const school={school:'glenanda-primary',grade:schoolPicker.grade,learners:schoolPicker.learners,key:line.key};items.push({productId:line.product.id,quantity:line.quantity,unit:line.product.unit,description:schoolBasketDescription(line.product,school,line.quantity),school})}formData.buyerType='School / education';updateCount();schoolListAdded=true;updateSchoolReviewState();renderSchoolSummary(plan);const d=$('#basket-dialog');d.innerHTML=`<h2 id="basket-dialog-title">Grade ${esc(schoolPicker.grade)} list added</h2><p>Added ${plan.length} item lines for ${schoolPicker.learners} learner${schoolPicker.learners===1?'':'s'}. Product quantities use the ordering units shown in the list.</p><div class="dialog-actions"><button class="btn outline" id="school-continue" type="button">Continue browsing</button><a class="btn dark" id="school-view-basket" href="#basket">View basket</a></div>`;d.showModal();$('#school-continue').onclick=()=>d.close();$('#school-view-basket').onclick=()=>d.close();$('#school-view-basket').focus()}}
