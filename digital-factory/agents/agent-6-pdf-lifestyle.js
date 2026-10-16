const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const OUTPUT_DIR = path.join(
  'c:\\Users\\bahloul.a\\Downloads\\Ai studio\\achrafbah.github.io-main\\downloads\\planners'
);

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const THEMES = {
  ocean: {
    name: 'Ocean',
    primary: '#0284c7',
    secondary: '#0369a1',
    light: '#e0f2fe',
    soft: '#f0f9ff',
    border: '#bae6fd',
    text: '#0f172a',
    muted: '#64748b'
  },
  sage: {
    name: 'Sage',
    primary: '#0f9d58',
    secondary: '#0b8043',
    light: '#dcfce7',
    soft: '#f0fdf4',
    border: '#bbf7d0',
    text: '#0f172a',
    muted: '#64748b'
  },
  rose: {
    name: 'Rose',
    primary: '#e11d48',
    secondary: '#be123c',
    light: '#ffe4e6',
    soft: '#fff1f2',
    border: '#fecdd3',
    text: '#0f172a',
    muted: '#64748b'
  }
};

const PAGE_W = 595.28; // A4 width
const PAGE_H = 841.89; // A4 height
const MARGIN = 40;
const CONTENT_W = PAGE_W - MARGIN * 2;

function drawPageChrome(doc, theme, plannerTitle, pageTitle, pageSubtitle, pageNum, totalPages) {
  // Subtle outer frame
  doc
    .save()
    .lineWidth(0.75)
    .strokeColor(theme.border)
    .rect(24, 24, PAGE_W - 48, PAGE_H - 48)
    .stroke()
    .restore();

  // Header Banner
  doc
    .save()
    .fillColor(theme.primary)
    .roundedRect(MARGIN, 36, CONTENT_W, 44, 6)
    .fill()
    .restore();

  doc
    .font('Helvetica-Bold')
    .fontSize(15)
    .fillColor('#ffffff')
    .text(pageTitle.toUpperCase(), MARGIN + 16, 46, {
      width: CONTENT_W - 140,
      lineBreak: false
    });

  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor(theme.light)
    .text(pageSubtitle, MARGIN + 16, 64, {
      width: CONTENT_W - 140,
      lineBreak: false
    });

  // Theme / Planner Pill on top right
  doc
    .save()
    .fillColor(theme.secondary)
    .roundedRect(PAGE_W - MARGIN - 125, 45, 110, 24, 4)
    .fill()
    .restore();

  doc
    .font('Helvetica-Bold')
    .fontSize(7.5)
    .fillColor('#ffffff')
    .text(plannerTitle.toUpperCase(), PAGE_W - MARGIN - 120, 53, {
      width: 100,
      align: 'center',
      lineBreak: false
    });

  // Footer
  doc
    .save()
    .moveTo(MARGIN, PAGE_H - 46)
    .lineTo(PAGE_W - MARGIN, PAGE_H - 46)
    .lineWidth(0.6)
    .strokeColor(theme.border)
    .stroke()
    .restore();

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(theme.muted)
    .text(`${plannerTitle}  •  ${theme.name} Edition`, MARGIN, PAGE_H - 38, {
      width: 260,
      lineBreak: false
    });

  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(theme.primary)
    .text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN - 100, PAGE_H - 38, {
      width: 100,
      align: 'right',
      lineBreak: false
    });
}

function drawCoverPage(doc, theme, title, subtitle, features, totalPages) {
  // Full soft background
  doc
    .save()
    .fillColor(theme.soft)
    .rect(0, 0, PAGE_W, PAGE_H)
    .fill()
    .restore();

  // Top geometric accent bar
  doc
    .save()
    .fillColor(theme.primary)
    .rect(0, 0, PAGE_W, 240)
    .fill()
    .restore();

  // Decorative vector circles
  doc
    .save()
    .fillColor(theme.secondary)
    .circle(PAGE_W - 70, 70, 95)
    .fill()
    .restore();

  doc
    .save()
    .lineWidth(2)
    .strokeColor('#ffffff')
    .rect(36, 36, PAGE_W - 72, PAGE_H - 72)
    .stroke()
    .restore();

  // Edition Badge
  doc
    .save()
    .fillColor('#ffffff')
    .roundedRect(MARGIN + 20, 62, 160, 24, 12)
    .fill()
    .restore();

  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(theme.primary)
    .text(`${theme.name.toUpperCase()} EDITION  •  ${totalPages} PAGES`, MARGIN + 28, 69, {
      width: 144,
      align: 'center',
      lineBreak: false
    });

  // Main Title
  doc
    .font('Helvetica-Bold')
    .fontSize(28)
    .fillColor('#ffffff')
    .text(title.toUpperCase(), MARGIN + 20, 112, {
      width: CONTENT_W - 40,
      lineBreak: false
    });

  doc
    .font('Helvetica')
    .fontSize(12)
    .fillColor(theme.light)
    .text(subtitle, MARGIN + 20, 152, {
      width: CONTENT_W - 40,
      lineBreak: false
    });

  // Main Card
  const cardY = 275;
  doc
    .save()
    .fillColor('#ffffff')
    .roundedRect(MARGIN + 20, cardY, CONTENT_W - 40, 340, 10)
    .fill()
    .lineWidth(1)
    .strokeColor(theme.border)
    .roundedRect(MARGIN + 20, cardY, CONTENT_W - 40, 340, 10)
    .stroke()
    .restore();

  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .fillColor(theme.primary)
    .text('INCLUDED WORKSHEETS & SYSTEM MODULES', MARGIN + 44, cardY + 26, {
      width: CONTENT_W - 88,
      lineBreak: false
    });

  features.forEach((feat, idx) => {
    const fy = cardY + 62 + idx * 42;
    doc
      .save()
      .fillColor(theme.light)
      .roundedRect(MARGIN + 44, fy, CONTENT_W - 88, 32, 5)
      .fill()
      .restore();

    doc
      .save()
      .fillColor(theme.primary)
      .circle(MARGIN + 62, fy + 16, 8)
      .fill()
      .restore();

    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor('#ffffff')
      .text(String(idx + 1), MARGIN + 58, fy + 13, { width: 8, align: 'center', lineBreak: false });

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor(theme.text)
      .text(feat, MARGIN + 80, fy + 11, {
        width: CONTENT_W - 140,
        lineBreak: false
      });
  });

  // Ownership Box
  const ownY = 645;
  doc
    .save()
    .fillColor('#ffffff')
    .roundedRect(MARGIN + 20, ownY, CONTENT_W - 40, 115, 8)
    .fill()
    .lineWidth(1)
    .strokeColor(theme.border)
    .roundedRect(MARGIN + 20, ownY, CONTENT_W - 40, 115, 8)
    .stroke()
    .restore();

  doc
    .font('Helvetica-Bold')
    .fontSize(9.5)
    .fillColor(theme.primary)
    .text('THIS BINDER BELONGS TO:', MARGIN + 44, ownY + 18, { lineBreak: false });

  const fields = ['Owner / Family Name:', 'Target Dates / Year:', 'Primary Intention / Goal:'];
  fields.forEach((label, i) => {
    const ly = ownY + 42 + i * 22;
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(theme.muted)
      .text(label, MARGIN + 44, ly, { lineBreak: false });
    doc
      .save()
      .lineWidth(0.6)
      .strokeColor(theme.border)
      .moveTo(MARGIN + 170, ly + 10)
      .lineTo(PAGE_W - MARGIN - 44, ly + 10)
      .stroke()
      .restore();
  });

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(theme.muted)
    .text(`Page 1 of ${totalPages}  •  High-Resolution Vector Printable Planner`, MARGIN, PAGE_H - 32, {
      width: CONTENT_W,
      align: 'center',
      lineBreak: false
    });
}

function drawCheckbox(doc, x, y, size, strokeColor) {
  doc
    .save()
    .lineWidth(0.8)
    .strokeColor(strokeColor)
    .roundedRect(x, y, size, size, 2)
    .stroke()
    .restore();
}

function drawSectionHeader(doc, theme, x, y, w, title) {
  doc
    .save()
    .fillColor(theme.light)
    .roundedRect(x, y, w, 22, 4)
    .fill()
    .lineWidth(0.6)
    .strokeColor(theme.border)
    .roundedRect(x, y, w, 22, 4)
    .stroke()
    .restore();

  doc
    .font('Helvetica-Bold')
    .fontSize(9.5)
    .fillColor(theme.secondary)
    .text(title.toUpperCase(), x + 10, y + 6, {
      width: w - 20,
      lineBreak: false
    });
}

function drawTable(doc, theme, x, y, colWidths, headers, rowsCount, rowHeight, prefillCol0 = [], hasCheckbox = false) {
  const totalW = colWidths.reduce((a, b) => a + b, 0);

  // Header row
  doc
    .save()
    .fillColor(theme.primary)
    .rect(x, y, totalW, rowHeight)
    .fill()
    .restore();

  let cx = x;
  headers.forEach((h, i) => {
    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .fillColor('#ffffff')
      .text(h, cx + 6, y + (rowHeight - 9) / 2, {
        width: colWidths[i] - 12,
        lineBreak: false
      });
    cx += colWidths[i];
  });

  // Rows
  for (let r = 0; r < rowsCount; r++) {
    const ry = y + rowHeight * (r + 1);
    doc
      .save()
      .fillColor(r % 2 === 0 ? '#ffffff' : theme.soft)
      .rect(x, ry, totalW, rowHeight)
      .fill()
      .lineWidth(0.5)
      .strokeColor(theme.border)
      .rect(x, ry, totalW, rowHeight)
      .stroke()
      .restore();

    let rx = x;
    for (let c = 0; c < colWidths.length; c++) {
      if (c > 0) {
        doc
          .save()
          .lineWidth(0.4)
          .strokeColor(theme.border)
          .moveTo(rx, ry)
          .lineTo(rx, ry + rowHeight)
          .stroke()
          .restore();
      }
      if (c === 0) {
        let textOffset = 6;
        if (hasCheckbox) {
          drawCheckbox(doc, rx + 6, ry + (rowHeight - 10) / 2, 10, theme.primary);
          textOffset = 22;
        }
        if (prefillCol0[r]) {
          doc
            .font('Helvetica')
            .fontSize(8.2)
            .fillColor(theme.text)
            .text(prefillCol0[r], rx + textOffset, ry + (rowHeight - 8) / 2, {
              width: colWidths[0] - textOffset - 4,
              lineBreak: false
            });
        }
      }
      rx += colWidths[c];
    }
  }
  return y + rowHeight * (rowsCount + 1);
}

function drawFourQuadrantMatrix(doc, theme, yStart, boxes) {
  const gap = 14;
  const boxW = (CONTENT_W - gap) / 2;
  const boxH = 310;

  boxes.forEach((b, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const bx = MARGIN + col * (boxW + gap);
    const by = yStart + row * (boxH + gap);

    doc
      .save()
      .fillColor('#ffffff')
      .roundedRect(bx, by, boxW, boxH, 6)
      .fill()
      .lineWidth(0.8)
      .strokeColor(theme.border)
      .roundedRect(bx, by, boxW, boxH, 6)
      .stroke()
      .restore();

    doc
      .save()
      .fillColor(theme.primary)
      .roundedRect(bx, by, boxW, 24, 6)
      .fill()
      .restore();

    doc
      .font('Helvetica-Bold')
      .fontSize(9.5)
      .fillColor('#ffffff')
      .text(b.title.toUpperCase(), bx + 10, by + 7, {
        width: boxW - 20,
        lineBreak: false
      });

    const items = b.items || [];
    for (let i = 0; i < 12; i++) {
      const ly = by + 34 + i * 22;
      drawCheckbox(doc, bx + 10, ly, 10, theme.primary);
      if (items[i]) {
        doc
          .font('Helvetica')
          .fontSize(8.2)
          .fillColor(theme.text)
          .text(items[i], bx + 26, ly + 1, { width: boxW - 36, lineBreak: false });
      } else {
        doc
          .save()
          .lineWidth(0.4)
          .strokeColor(theme.border)
          .moveTo(bx + 26, ly + 10)
          .lineTo(bx + boxW - 10, ly + 10)
          .stroke()
          .restore();
      }
    }
  });
}

function drawNotesBlock(doc, theme, x, y, w, h, title) {
  drawSectionHeader(doc, theme, x, y, w, title);
  doc
    .save()
    .fillColor('#ffffff')
    .lineWidth(0.6)
    .strokeColor(theme.border)
    .roundedRect(x, y + 26, w, h - 26, 4)
    .fillAndStroke()
    .restore();

  const lines = Math.floor((h - 40) / 20);
  for (let i = 0; i < lines; i++) {
    const ly = y + 46 + i * 20;
    doc
      .save()
      .lineWidth(0.4)
      .strokeColor(theme.border)
      .moveTo(x + 10, ly)
      .lineTo(x + w - 10, ly)
      .stroke()
      .restore();
  }
}

// ============================================================================
// 1. HOME DECLUTTER BINDER (16 Pages)
// ============================================================================
function buildHomeDeclutterBinder(themeKey) {
  const theme = THEMES[themeKey];
  const totalPages = 16;
  const filePath = path.join(OUTPUT_DIR, `Home-Declutter-Binder_${themeKey}.pdf`);
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: true });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const plannerTitle = 'Home Declutter Binder';

  // Page 1: Cover
  drawCoverPage(
    doc,
    theme,
    'Home Declutter Binder',
    'Room-by-Room KonMari Declutter Checklists, Sorting Matrix & Seasonal Maintenance',
    [
      'Master Declutter Vision & KonMari Category Roadmap',
      'Kitchen, Pantry, Wardrobe & Closet Deep-Purge Checklists',
      'Living Room, Bedrooms, Bathrooms & Kids Toy Declutter',
      'Garage, Attic, Tool Shed & Digital Life Declutter Trackers',
      'Keep / Donate / Sell / Trash Sorting Matrices & Resale Log',
      'Seasonal Home Maintenance & 30-Day Quick Declutter Sprint'
    ],
    totalPages
  );

  const pageSpecs = [
    {
      title: 'Declutter Vision & KonMari Order',
      sub: 'Set clear intentions and follow the 5-stage category order',
      type: 'table',
      headers: ['KonMari Stage / Zone', 'Target Date', 'Current State (1-5)', 'Completion Status', 'Reward / Outcome'],
      widths: [175, 75, 90, 85, 90],
      rows: [
        '1. Clothing & Footwear',
        '2. Books, Magazines & Manuals',
        '3. Papers, Bills & Contracts',
        '4. Komono: Kitchen & Dining',
        '5. Komono: Bath & Linen',
        '6. Komono: Garage & Utility',
        '7. Komono: Digital & Cables',
        '8. Sentimental Items & Photos',
        '9. Kids Toys & School Memorabilia',
        '10. Seasonal & Holiday Decor'
      ]
    },
    {
      title: 'Kitchen & Pantry Declutter Checklist',
      sub: 'Clear countertops, expired pantry staples, and duplicate cookware',
      type: 'quad',
      boxes: [
        {
          title: 'Pantry & Dry Goods',
          items: [
            'Check expiration dates on all cans & jars',
            'Consolidate open grain, pasta & flour bags',
            'Discard stale spices & oxidized cooking oils',
            'Wipe pantry shelves & label clear bins',
            'Purge novelty sauces & unused condiments',
            'Organize baking supplies in one zone'
          ]
        },
        {
          title: 'Cookware & Small Appliances',
          items: [
            'Purge scratched non-stick pans & warped lids',
            'Donate single-use appliances unused in 1 yr',
            'Match food storage containers with lids',
            'Declutter chipped mugs, glasses & plates',
            'Sort baking sheets, muffin tins & racks',
            'Clear duplicate spatulas, whisks & peelers'
          ]
        },
        {
          title: 'Fridge & Freezer Reset',
          items: [
            'Toss freezer-burned meats & mystery containers',
            'Wipe fridge drawers & door condiment shelves',
            'Group dairy, produce & meal-prep items',
            'Clean magnetic clutter off fridge exterior'
          ]
        },
        {
          title: 'Under-Sink & Cleaning Caddy',
          items: [
            'Discard dried sponges & empty spray bottles',
            'Consolidate dish pods, trash bags & cloths',
            'Check under-sink pipe area for moisture',
            'Restock daily microfiber towels'
          ]
        }
      ]
    },
    {
      title: 'Wardrobe & Closet KonMari Checklist',
      sub: 'Keep only garments that fit well, feel great, and spark joy',
      type: 'quad',
      boxes: [
        {
          title: 'Tops, Dresses & Outerwear',
          items: [
            'Gather every shirt, blouse & sweater in one pile',
            'Donate items that no longer fit comfortably',
            'Remove stained, pilled or damaged tops',
            'Sort coats, blazers & seasonal jackets',
            'Organize hanging clothes by category & color',
            'File-fold knitwear & tees vertically in drawers'
          ]
        },
        {
          title: 'Bottoms, Shoes & Bags',
          items: [
            'Evaluate jeans, trousers, skirts & shorts',
            'Inspect shoes for worn soles or discomfort',
            'Empty & dust handbags, backpacks & totes',
            'Donate formalwear worn only once years ago',
            'Clean shoe rack & add cedar blocks',
            'Store off-season boots in labeled boxes'
          ]
        },
        {
          title: 'Basics, Lounge & Activewear',
          items: [
            'Toss stretched socks & mismatched pairs',
            'Replace worn undergarments & sleepwear',
            'Declutter excess gym tees & leggings',
            'Check swimwear & vacation accessories'
          ]
        },
        {
          title: 'Jewelry, Scarves & Accessories',
          items: [
            'Untangle necklaces & polish tarnished pieces',
            'Sort belts, hats, gloves & sunglasses',
            'Set aside heirloom repairs needed',
            'Create a capsule wardrobe checklist'
          ]
        }
      ]
    },
    {
      title: 'Living Room, Dining & Entryway',
      sub: 'Create calm, welcoming shared spaces free of surface clutter',
      type: 'quad',
      boxes: [
        {
          title: 'Entryway & Mudroom',
          items: [
            'Limit shoes at door to 2 pairs per person',
            'Set up key bowl & incoming mail sorter',
            'Declutter broken umbrellas & spare totes',
            'Clear coat hooks of off-season jackets',
            'Sweep & sanitize welcome mat area'
          ]
        },
        {
          title: 'Living & Family Room',
          items: [
            'Clear coffee table & side table surfaces',
            'Donate unread books & old magazines',
            'Corral remote controls & hide TV cables',
            'Wash throw pillow covers & cozy blankets',
            'Declutter board games with missing pieces'
          ]
        },
        {
          title: 'Dining Room & Sideboard',
          items: [
            'Clear dining table of paperwork & laptops',
            'Sort table linens, placemats & napkins',
            'Audit special-occasion serving platters',
            'Declutter half-burned candles & decor'
          ]
        },
        {
          title: 'Bookshelves & Media Console',
          items: [
            'Keep only favorite books to re-read',
            'Recycle old DVDs, CDs & game boxes',
            'Leave 30% open breathing space on shelves',
            'Dust frames & rotate family photos'
          ]
        }
      ]
    },
    {
      title: 'Bedrooms, Bathrooms & Linen Closet',
      sub: 'Transform sleeping and self-care spaces into restful sanctuaries',
      type: 'quad',
      boxes: [
        {
          title: 'Primary & Guest Bedrooms',
          items: [
            'Clear nightstands to lamp, book & water glass',
            'Remove under-bed clutter & dusty boxes',
            'Rotate & vacuum mattress surface',
            'Keep maksimum 2 sheet sets per bed',
            'Declutter decorative pillows that crowd floor'
          ]
        },
        {
          title: 'Bathroom Vanity & Cabinets',
          items: [
            'Toss expired skincare, sunscreen & makeup',
            'Dispose of expired medications safely',
            'Discard stretched hair ties & old brushes',
            'Group daily essentials in easy-clean tray',
            'Purge hotel sample bottles & unused lotions'
          ]
        },
        {
          title: 'Linen Closet & Laundry Room',
          items: [
            'Donate frayed bath towels & washcloths',
            'Fold sheet sets inside matching pillowcase',
            'Consolidate laundry detergents & stain sticks',
            'Clean dryer lint trap & sorting hampers'
          ]
        },
        {
          title: 'First Aid & Wellness Kit',
          items: [
            'Check thermometer batteries & bandages',
            'Restock antiseptic wipes & pain relievers',
            'Label family allergy & emergency meds',
            'Store kit in cool, dry, accessible spot'
          ]
        }
      ]
    },
    {
      title: 'Kids Rooms, Toys & Study Zone',
      sub: 'Simplify toy rotation, art supplies, and school keepsakes',
      type: 'quad',
      boxes: [
        {
          title: 'Toys, Games & Puzzles',
          items: [
            'Discard broken plastic toys & happy-meal trinkets',
            'Donate outgrown baby/toddler developmental toys',
            'Verify puzzles & board games have all pieces',
            'Set up a 20-toy rotation bin in storage',
            'Label picture bins for independent cleanup'
          ]
        },
        {
          title: 'Art, Craft & School Supplies',
          items: [
            'Test all markers, pens & dried playdough',
            'Sort crayons, glue sticks & safety scissors',
            'Create an active homework caddy',
            'Recycle old workbooks & scratch paper',
            'Display top 5 artworks; photograph the rest'
          ]
        },
        {
          title: 'Kids Clothing & Gear',
          items: [
            'Remove outgrown clothes & small shoes',
            'Label hand-me-down bins by size & season',
            'Check sports uniforms, shin guards & helmets',
            'Declutter outgrown strollers & car seats'
          ]
        },
        {
          title: 'Keepsake Memory Box (1 Per Child)',
          items: [
            'Select only most treasured certificates & crafts',
            'Label grade level and date on back of items',
            'Store baby blanket / first shoes in acid-free box',
            'Digitize bulky school projects'
          ]
        }
      ]
    },
    {
      title: 'Garage, Attic, Basement & Utility',
      sub: 'Reclaim storage zones, tool benches, and seasonal bins',
      type: 'quad',
      boxes: [
        {
          title: 'Garage Floor & Workbench',
          items: [
            'Sweep bays & clear floor pathways first',
            'Sort nails, screws & hand tools into pegboard',
            'Return borrowed tools or donate duplicates',
            'Dispose of old paint cans, oil & chemicals safely',
            'Check tire inflators, jumper cables & Car Kit'
          ]
        },
        {
          title: 'Outdoor, Garden & Sports Gear',
          items: [
            'Inspect bikes, scooters & camping tents',
            'Discard cracked flower pots & rusted garden tools',
            'Hang rakes, shovels & hoses on wall hooks',
            'Donate unused golf clubs, skates or balls',
            'Clean patio cushions & grill accessories'
          ]
        },
        {
          title: 'Holiday & Seasonal Storage',
          items: [
            'Test string lights before packing away',
            'Donate holiday decor not used in 2 seasons',
            'Use uniform weather-tight clear bins',
            'Place bold content labels on front & side'
          ]
        },
        {
          title: 'Attic & Basement Archives',
          items: [
            'Inspect for moisture, pests or insulation gaps',
            'Purge empty cardboard shipping boxes',
            'Keep clear 36-inch clearance around furnace/water heater',
            'Inventory long-term storage bins'
          ]
        }
      ]
    },
    {
      title: 'Paperwork & Home Office Declutter',
      sub: 'Eliminate paper piles, shred outdated records, and streamline filing',
      type: 'quad',
      boxes: [
        {
          title: 'Action & Incoming Paper Tray',
          items: [
            'Recycle junk mail & catalogs immediately',
            'Process unpaid bills & calendar invites weekly',
            'Shred credit offers & documents with personal IDs',
            'Clear desktop to computer, notepad & pen cup',
            'Recycle appliances manuals available online'
          ]
        },
        {
          title: 'Permanent Filing Categories',
          items: [
            'Vital IDs: Birth/Marriage certs, Passports, Deeds',
            'Tax Returns & supporting receipts (keep 7 yrs)',
            'Active Insurance policies & Home Warranties',
            'Medical records & vaccination histories',
            'Vehicle titles & service logs'
          ]
        },
        {
          title: 'Office Supplies & Cables',
          items: [
            'Test all pens & markers; toss dry ones',
            'Discard mystery USB cords & obsolete chargers',
            'Velcro-tie and label active charging cables',
            'Donate extra notebooks, binders & folders'
          ]
        },
        {
          title: 'Sentimental Letters & Photos',
          items: [
            'Remove blurred or duplicate printed photos',
            'Store favorite greeting cards in one keepsake box',
            'Scan fragile family photographs to cloud backup',
            'Label photo albums by decade'
          ]
        }
      ]
    },
    {
      title: 'Digital Life Declutter Checklist',
      sub: 'Organize devices, cloud storage, email inboxes, and subscriptions',
      type: 'quad',
      boxes: [
        {
          title: 'Computer Desktop & Files',
          items: [
            'Clear computer desktop to zero loose files',
            'Empty Downloads folder & Recycle Bin',
            'Organize cloud folders by Year & Category',
            'Uninstall unused applications & browser extensions',
            'Run full backup to external drive & cloud'
          ]
        },
        {
          title: 'Smartphone & Photo Library',
          items: [
            'Delete accidental screenshots & duplicate photos',
            'Delete apps not opened in the last 60 days',
            'Turn off non-essential push notifications',
            'Clear cached podcasts & offline video downloads',
            'Organize home screen into 1 clean page'
          ]
        },
        {
          title: 'Email Inbox Zero Reset',
          items: [
            'Unsubscribe from 20+ marketing newsletters',
            'Create filters for receipts & bills',
            'Archive emails older than 90 days',
            'Reply to or schedule starred action emails'
          ]
        },
        {
          title: 'Passwords & Subscriptions',
          items: [
            'Audit recurring streaming & app subscriptions',
            'Update weak passwords in password manager',
            'Enable 2-Factor Authentication on banking/email',
            'Close dormant online shopping accounts'
          ]
        }
      ]
    },
    {
      title: 'Keep / Donate / Sell / Trash Matrix',
      sub: 'Room-by-room sorting decision worksheet for rapid decluttering',
      type: 'quad',
      boxes: [
        { title: 'KEEP (Belongs in Designated Home)', items: [] },
        { title: 'DONATE (Good Condition — Bless Others)', items: [] },
        { title: 'SELL (High Value — List Within 7 Days)', items: [] },
        { title: 'TRASH / RECYCLE (Broken or Expired)', items: [] }
      ]
    },
    {
      title: 'Donation Drop-Off & Tax Deduction Log',
      sub: 'Track charitable item donations, organizations, and estimated value',
      type: 'table',
      headers: ['Date', 'Charity / Organization', 'Items Donated (Bags / Boxes)', 'Condition', 'Est. Value'],
      widths: [70, 145, 155, 70, 75],
      rows: Array(16).fill('')
    },
    {
      title: 'Declutter Resale & Marketplace Tracker',
      sub: 'Turn high-value clutter into cash with a clear listing deadline',
      type: 'table',
      headers: ['Item Description', 'Platform', 'Listed Price', 'Sold Price', 'Donate If Unsold By'],
      widths: [170, 85, 80, 80, 100],
      rows: Array(16).fill('')
    },
    {
      title: 'Spring & Summer Home Maintenance',
      sub: 'Preventative seasonal upkeep checklist for a safe, efficient home',
      type: 'quad',
      boxes: [
        {
          title: 'Spring Exterior & Roof',
          items: [
            'Clean gutters & downspouts of winter debris',
            'Inspect roof shingles & chimney flashing',
            'Power-wash siding, deck & driveway',
            'Service lawnmower & garden irrigation',
            'Check window screens for tears'
          ]
        },
        {
          title: 'Spring Interior & HVAC',
          items: [
            'Replace HVAC air filter & schedule AC tune-up',
            'Test all smoke & carbon monoxide detectors',
            'Flush water heater tank to remove sediment',
            'Deep clean windows, tracks & blinds',
            'Vacuum refrigerator coils & dryer vent duct'
          ]
        },
        {
          title: 'Summer Exterior & Yard',
          items: [
            'Trim tree branches away from roof & power lines',
            'Seal wood deck or reseal exterior caulking',
            'Inspect outdoor faucets & garden hoses',
            'Check garage door auto-reverse safety sensor'
          ]
        },
        {
          title: 'Summer Interior Comfort',
          items: [
            'Reverse ceiling fans to spin counterclockwise',
            'Clean range hood grease filter & dishwasher trap',
            'Inspect basement dehumidifier & sump pump',
            'Clean garbage disposal & sanitize trash bins'
          ]
        }
      ]
    },
    {
      title: 'Autumn & Winter Home Maintenance',
      sub: 'Cold-weather preparation, heating safety, and storm readiness',
      type: 'quad',
      boxes: [
        {
          title: 'Autumn Exterior Prep',
          items: [
            'Shut off & drain exterior hose bibs before freeze',
            'Clean fallen leaves from gutters & drains',
            'Store or cover patio furniture & BBQ grill',
            'Seal gaps around doors & windows with weatherstrip',
            'Aerate lawn & plant spring bulbs'
          ]
        },
        {
          title: 'Autumn Heating & Safety',
          items: [
            'Service furnace / boiler & replace air filter',
            'Have fireplace & chimney professionally swept',
            'Replace batteries in smoke & CO alarms',
            'Check fire extinguishers pressure gauges',
            'Stock winter emergency kit & rock salt'
          ]
        },
        {
          title: 'Winter Interior Upkeep',
          items: [
            'Switch ceiling fans to clockwise (low speed)',
            'Insulate exposed water pipes in unheated areas',
            'Clean humidifier & descale showerheads',
            'Test GFCI outlets in kitchen & bathrooms'
          ]
        },
        {
          title: 'Annual Home Audit',
          items: [
            'Review homeowners insurance coverage',
            'Update home inventory photos & serial numbers',
            'Deep clean oven, carpets & upholstery',
            'Touch up interior wall paint & scuffs'
          ]
        }
      ]
    },
    {
      title: '30-Day Quick Declutter Challenge',
      sub: 'Eliminate 15 minutes of clutter every day for an effortless reset',
      type: 'table',
      headers: ['Day / Micro-Zone Challenge', 'Done', 'Day / Micro-Zone Challenge', 'Done'],
      widths: [215, 42, 216, 42],
      rows: [
        'Day 1: Kitchen junk drawer',
        'Day 2: Bathroom medicine cabinet',
        'Day 3: Purse, wallet & daily backpack',
        'Day 4: Car glovebox & trunk',
        'Day 5: Fridge shelves & condiments',
        'Day 6: Sock & undergarment drawer',
        'Day 7: Nightstand surface & drawer',
        'Day 8: Coffee mugs & water bottles',
        'Day 9: Tupperware & food lids',
        'Day 10: Under kitchen sink',
        'Day 11: Shoes by the front door',
        'Day 12: Spice rack & pantry oils',
        'Day 13: Bath towels & washcloths',
        'Day 14: Makeup & skincare bag',
        'Day 15: Phone apps & screenshots'
      ]
    }
  ];

  pageSpecs.forEach((spec, i) => {
    doc.addPage({ size: 'A4', margin: 0 });
    drawPageChrome(doc, theme, plannerTitle, spec.title, spec.sub, i + 2, totalPages);

    if (spec.type === 'table') {
      drawTable(doc, theme, MARGIN, 96, spec.widths, spec.headers, spec.rows.length, 28, spec.rows, true);
      drawNotesBlock(doc, theme, MARGIN, 96 + (spec.rows.length + 1) * 28 + 18, CONTENT_W, PAGE_H - 60 - (96 + (spec.rows.length + 1) * 28 + 18), 'Room Reflections & Action Notes');
    } else if (spec.type === 'quad') {
      drawFourQuadrantMatrix(doc, theme, 96, spec.boxes);
      drawNotesBlock(doc, theme, MARGIN, 738, CONTENT_W, 50, 'Target Completion Date & Priority Notes');
    }
  });

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// ============================================================================
// 2. ULTIMATE TRAVEL PLANNER (18 Pages)
// ============================================================================
function buildUltimateTravelPlanner(themeKey) {
  const theme = THEMES[themeKey];
  const totalPages = 18;
  const filePath = path.join(OUTPUT_DIR, `Ultimate-Travel-Planner_${themeKey}.pdf`);
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: true });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const plannerTitle = 'Ultimate Travel Planner';

  drawCoverPage(
    doc,
    theme,
    'Ultimate Travel Planner',
    'Flight & Hotel Organizer, Day-by-Day Sightseeing Itinerary, Packing & Currency Log',
    [
      'Trip Overview, Destination Research & Pre-Departure Countdown',
      'Flight, Train, Car Rental & Hotel Accommodation Organizers',
      'Categorized Master Packing Checklists & Carry-On Essentials',
      '7-Day Detailed Morning / Afternoon / Evening Sightseeing Itineraries',
      'Multi-Currency Trip Budget, Expense Tracker & Souvenir Planner',
      'Travel Insurance, Embassy Contacts & Post-Trip Memory Journal'
    ],
    totalPages
  );

  const pageSpecs = [
    {
      title: 'Trip Overview & Bucket List Goals',
      sub: 'Destination essentials, weather forecast, visa requirements & top must-sees',
      type: 'table',
      headers: ['Trip Element / Requirement', 'Details / Confirmation Info', 'Status', 'Notes / Deadlines'],
      widths: [155, 165, 75, 120],
      rows: [
        'Primary Destination(s) & Cities',
        'Departure & Return Dates',
        'Passport Validity (6+ Months)',
        'Visa / ETIAS / Entry Forms',
        'Travel Insurance Policy #',
        'Local Currency & Exchange Rate',
        'Vaccinations & Travel Meds',
        'eSIM / International Roaming Plan',
        'Power Plug Adapter Type',
        'Airport Transfer Arrangement',
        'Pet / Plant / Home Sitter',
        'Bank Travel Notice Submitted'
      ]
    },
    {
      title: 'Pre-Departure Countdown Checklist',
      sub: 'Timeline checklist from 60 days out to departure morning',
      type: 'quad',
      boxes: [
        {
          title: '60–30 Days Before Departure',
          items: [
            'Verify passport expiration & visa rules',
            'Book flights, seat selection & baggage',
            'Reserve hotels / Airbnb accommodations',
            'Purchase comprehensive travel insurance',
            'Book popular museum / tour tickets early',
            'Request time off work & arrange coverage'
          ]
        },
        {
          title: '14–7 Days Before Departure',
          items: [
            'Refill prescriptions & pack travel first-aid kit',
            'Order local currency & notify credit card banks',
            'Download offline maps, translation & airline apps',
            'Print physical copies of passports & bookings',
            'Confirm pet boarding / house-sitting instructions',
            'Check weather forecast & finalize outfits'
          ]
        },
        {
          title: '48–24 Hours Before Departure',
          items: [
            'Check in online for flight & save boarding passes',
            'Charge power banks, camera & headphones',
            'Weigh checked luggage & attach luggage tags',
            'Empty perishable food from refrigerator'
          ]
        },
        {
          title: 'Departure Morning Walk-Through',
          items: [
            'Unplug small appliances & adjust thermostat',
            'Take out trash & run dishwasher',
            'Lock all windows, patio doors & deadbolts',
            'Verify Passports, Wallet, Phone & Boarding Pass'
          ]
        }
      ]
    },
    {
      title: 'Flight & Transit Booking Organizer',
      sub: 'Outbound, connecting, return flights, trains, and ground transfers',
      type: 'table',
      headers: ['Leg / Date', 'Airline / Train #', 'Departs (City/Time)', 'Arrives (City/Time)', 'Conf # / Seat / Baggage'],
      widths: [80, 95, 110, 110, 120],
      rows: [
        'Outbound Leg 1',
        'Outbound Leg 2',
        'Airport Transfer',
        'Inter-City Transit 1',
        'Inter-City Transit 2',
        'Inter-City Transit 3',
        'Car Rental / Ferry',
        'Return Transfer',
        'Return Flight Leg 1',
        'Return Flight Leg 2',
        'Home Airport Pickup',
        'Backup / Lounge Info'
      ]
    },
    {
      title: 'Hotel & Accommodation Organizer',
      sub: 'Check-in times, addresses, booking references, and cancellation deadlines',
      type: 'table',
      headers: ['Check-In / Out', 'Hotel / Airbnb Name & Address', 'Conf #', 'Check-In/Out Time', 'Cost / Paid?'],
      widths: [90, 185, 75, 85, 80],
      rows: [
        'Night 1–2',
        'Night 3–4',
        'Night 5–6',
        'Night 7–8',
        'Night 9–10',
        'Night 11–12',
        'Night 13–14',
        'Pre-Flight Hotel',
        'Stopover Hotel',
        'Alternate Option 1',
        'Alternate Option 2',
        'Special Requests'
      ]
    },
    {
      title: 'Categorized Packing Checklist — Apparel & Tech',
      sub: 'Everything needed for clothing, footwear, electronics, and travel documents',
      type: 'quad',
      boxes: [
        {
          title: 'Clothing & Layering',
          items: [
            'Tops, T-shirts & breathable shirts',
            'Sweaters, cardigan or fleece layer',
            'Pants, jeans, shorts & skirts',
            'Evening / restaurant dress outfit',
            'Sleepwear, undergarments & socks',
            'Rain jacket / packable windbreaker'
          ]
        },
        {
          title: 'Footwear & Accessories',
          items: [
            'Broken-in walking sneakers',
            'Dress shoes or comfortable sandals',
            'Sunglasses, sun hat & foldable umbrella',
            'Belt, scarf & travel jewelry case',
            'Swimwear, cover-up & microfiber towel',
            'Laundry bag & stain remover pen'
          ]
        },
        {
          title: 'Electronics & Gear',
          items: [
            'Smartphone + fast wall charger',
            'Portable power bank + charging cables',
            'Universal international plug adapter',
            'Noise-canceling headphones / earbuds'
          ]
        },
        {
          title: 'Documents & Money',
          items: [
            'Passport + 2 printed color photocopies',
            'Driver license & International Driving Permit',
            '2 Credit cards (no foreign transaction fee)',
            'Local cash currency + emergency USD/EUR'
          ]
        }
      ]
    },
    {
      title: 'Packing Checklist — Toiletries, Meds & Carry-On',
      sub: 'TSA-compliant liquids, travel pharmacy, and in-flight comfort essentials',
      type: 'quad',
      boxes: [
        {
          title: 'Toiletries & Personal Care',
          items: [
            'Toothbrush, toothpaste & dental floss',
            'Deodorant, shampoo & body wash (<=100ml)',
            'Facial cleanser, moisturizer & lip balm',
            'Broad-spectrum SPF 50 sunscreen',
            'Razor, nail clippers & tweezers',
            'Hairbrush, styling tools & hair ties'
          ]
        },
        {
          title: 'Travel Pharmacy & First Aid',
          items: [
            'Daily prescription meds in original bottles',
            'Pain relievers (Ibuprofen / Paracetamol)',
            'Motion sickness & digestive relief tablets',
            'Antihistamines & electrolyte hydration packets',
            'Blister bandages & antiseptic wipes',
            'Insect repellent & hydrocortisone cream'
          ]
        },
        {
          title: 'Personal Item / In-Flight Bag',
          items: [
            'Neck pillow, eye mask & earplugs',
            'Refillable collapsible water bottle',
            'Sanitizing wipes & hand sanitizer',
            'Pen for customs forms + small notebook'
          ]
        },
        {
          title: 'Daypack / Sightseeing Bag',
          items: [
            'Anti-theft crossbody or daypack',
            'Compact camera & spare SD card',
            'High-protein travel snacks',
            'Hotel business card with local address'
          ]
        }
      ]
    }
  ];

  // Add Days 1-7 Sightseeing Itinerary Pages (7 pages)
  for (let d = 1; d <= 7; d++) {
    pageSpecs.push({
      title: `Day ${d} Sightseeing Itinerary & Schedule`,
      sub: `Hourly sightseeing plan, reservations, transit routes, and dining spots for Day ${d}`,
      type: 'table',
      headers: ['Time Slot', 'Activity / Landmark / Reservation', 'Location / Metro Stop', 'Ticket / Booking #', 'Est. Cost'],
      widths: [75, 175, 115, 80, 70],
      rows: [
        '07:30 Breakfast',
        '09:00 Morning 1',
        '10:30 Morning 2',
        '12:30 Lunch Spot',
        '14:00 Afternoon 1',
        '15:30 Afternoon 2',
        '17:00 Golden Hour',
        '19:00 Dinner Res.',
        '21:00 Evening Walk',
        'Transit / Pass Info',
        'Must-Try Local Dish',
        'Weather / Outfit'
      ]
    });
  }

  // Remaining 4 pages to reach 18 total
  pageSpecs.push(
    {
      title: 'Trip Budget & Multi-Currency Expense Log (Part 1)',
      sub: 'Track daily spending in local currency and home currency',
      type: 'table',
      headers: ['Date', 'Category', 'Merchant / Expense Description', 'Pay Method', 'Local Amt', 'Home Amt'],
      widths: [60, 80, 165, 65, 72, 73],
      rows: Array(15).fill('')
    },
    {
      title: 'Trip Budget & Multi-Currency Expense Log (Part 2)',
      sub: 'Continued expense tracking and category budget vs. actual summary',
      type: 'table',
      headers: ['Date', 'Category', 'Merchant / Expense Description', 'Pay Method', 'Local Amt', 'Home Amt'],
      widths: [60, 80, 165, 65, 72, 73],
      rows: Array(15).fill('')
    },
    {
      title: 'Souvenir, Gift & Tax-Free Shopping Tracker',
      sub: 'Plan gifts for loved ones, customs allowances, and VAT refund forms',
      type: 'table',
      headers: ['Recipient / Self', 'Gift / Souvenir Idea', 'Shop / Market', 'Budget', 'Actual Cost', 'VAT Form?'],
      widths: [95, 135, 105, 60, 60, 60],
      rows: Array(14).fill('')
    },
    {
      title: 'Emergency Contacts, Embassy & Trip Memories',
      sub: 'Critical safety numbers, medical info, and favorite trip highlights',
      type: 'quad',
      boxes: [
        {
          title: 'Emergency & Embassy Contacts',
          items: [
            'Local Emergency (Police / Ambulance):',
            'Home Country Embassy Phone & Address:',
            'Travel Insurance 24/7 Assistance Hotline:',
            'Airline Customer Service:',
            'Lost Credit Card International Line:',
            'Emergency Contact at Home:'
          ]
        },
        {
          title: 'Traveler Medical & ID Reference',
          items: [
            'Traveler 1 Passport # & Issue Date:',
            'Traveler 2 Passport # & Issue Date:',
            'Blood Types & Drug Allergies:',
            'Travel Insurance Policy #:',
            'Cloud Folder Link for ID Scans:',
            'Hotel Safe Combination Reminder:'
          ]
        },
        {
          title: 'Top 4 Unforgettable Moments',
          items: [
            '1. Best View / Landmark:',
            '2. Best Meal / Cafe Discovery:',
            '3. Favorite Cultural Experience:',
            '4. Funniest / Most Surprising Moment:'
          ]
        },
        {
          title: 'Next Trip Inspiration & Notes',
          items: [
            'Places to revisit next time:',
            'Packing items we did not need:',
            'Packing items we wished we brought:',
            'Dream destination for our next trip:'
          ]
        }
      ]
    }
  );

  pageSpecs.forEach((spec, i) => {
    doc.addPage({ size: 'A4', margin: 0 });
    drawPageChrome(doc, theme, plannerTitle, spec.title, spec.sub, i + 2, totalPages);

    if (spec.type === 'table') {
      const endY = drawTable(doc, theme, MARGIN, 96, spec.widths, spec.headers, spec.rows.length, 28, spec.rows, false);
      drawNotesBlock(doc, theme, MARGIN, endY + 16, CONTENT_W, PAGE_H - 60 - (endY + 16), 'Notes, Addresses & Travel Tips');
    } else if (spec.type === 'quad') {
      drawFourQuadrantMatrix(doc, theme, 96, spec.boxes);
      drawNotesBlock(doc, theme, MARGIN, 738, CONTENT_W, 50, 'Traveler Reminders & Confirmation Notes');
    }
  });

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// ============================================================================
// 3. FAMILY COMMAND CENTER (16 Pages)
// ============================================================================
function buildFamilyCommandCenter(themeKey) {
  const theme = THEMES[themeKey];
  const totalPages = 16;
  const filePath = path.join(OUTPUT_DIR, `Family-Command-Center_${themeKey}.pdf`);
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: true });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const plannerTitle = 'Family Command Center';

  drawCoverPage(
    doc,
    theme,
    'Family Command Center',
    'Emergency Contacts, Medical Records, Kids Timetable, Chore Chart & Home Inventory',
    [
      'Emergency Contacts, First Responders & Neighbor Directory',
      'Family Medical Profiles, Vaccination & Prescription Trackers',
      'Kids School Timetable, Extracurricular & Carpool Schedule',
      'Weekly Chore Responsibility Matrix & Star Reward Chart',
      'Family Meal Planner, Grocery Staples & Babysitter Instructions',
      'Home Asset Inventory, Appliance Warranties & Pet Care Log'
    ],
    totalPages
  );

  const pageSpecs = [
    {
      title: 'Emergency Contacts & First Responders',
      sub: 'Post on the refrigerator or family bulletin board for instant access',
      type: 'table',
      headers: ['Role / Service', 'Contact / Organization Name', 'Primary Phone', 'Secondary / Address / Notes'],
      widths: [120, 140, 105, 150],
      rows: [
        'Emergency Services',
        'Poison Control Center',
        'Parent / Guardian 1',
        'Parent / Guardian 2',
        'Nearest Emergency Room',
        'Family Pediatrician',
        'Family Doctor / Dentist',
        'Nearest Relative (Local)',
        'Out-of-State Contact',
        'Trusted Neighbor 1',
        'Trusted Neighbor 2',
        'Electric / Gas / Water Emergency'
      ]
    },
    {
      title: 'Family Medical & Insurance Profiles',
      sub: 'Health insurance IDs, blood types, allergies, and chronic conditions',
      type: 'table',
      headers: ['Family Member', 'DOB / Blood Type', 'Insurance Policy / Group #', 'Allergies / Conditions', 'Primary Doctor'],
      widths: [95, 80, 120, 125, 95],
      rows: [
        'Member 1:',
        'Member 2:',
        'Member 3:',
        'Member 4:',
        'Member 5:',
        'Member 6:',
        'Dental Plan:',
        'Vision Plan:',
        'Preferred Pharmacy:',
        'Urgent Care Clinic:',
        'Hospital Preference:',
        'Medical Portal Info:'
      ]
    },
    {
      title: 'Immunization, Medication & Checkup Log',
      sub: 'Track annual physicals, dental cleanings, vision exams, and prescriptions',
      type: 'table',
      headers: ['Date', 'Family Member', 'Visit Type / Vaccine / Medication', 'Dosage / Result', 'Next Due Date'],
      widths: [65, 95, 165, 100, 90],
      rows: Array(15).fill('')
    },
    {
      title: 'Kids School & Extracurricular Timetable',
      sub: 'Weekly class schedule, sports practices, music lessons, and carpool duties',
      type: 'table',
      headers: ['Time / Period', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday / Weekend'],
      widths: [75, 88, 88, 88, 88, 88],
      rows: [
        '07:30 Drop-off',
        '08:30 Morning',
        '10:30 Mid-Day',
        '12:30 Lunch',
        '14:30 Dismissal',
        '15:30 Activity 1',
        '16:30 Activity 2',
        '17:30 Carpool',
        '18:30 Homework',
        '20:00 Bedtime',
        'Uniform / Gear',
        'Library / Forms'
      ]
    },
    {
      title: 'School Contacts, Teachers & Key Dates',
      sub: 'Teacher emails, school portals, parent-teacher conferences, and holidays',
      type: 'table',
      headers: ['Child Name', 'School / Grade / Room', 'Teacher / Coach Name', 'Email / Portal Login', 'Key Dates / Events'],
      widths: [85, 100, 105, 115, 110],
      rows: Array(14).fill('')
    },
    {
      title: 'Weekly Chore & Reward Chart',
      sub: 'Build daily responsibility habits and celebrate weekly star milestones',
      type: 'table',
      headers: ['Daily / Weekly Chore', 'Assigned To', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'Pts'],
      widths: [185, 90, 28, 28, 28, 28, 28, 28, 28, 44],
      rows: [
        'Make bed & tidy bedroom floor',
        'Brush teeth & morning hygiene',
        'Pack school backpack & water bottle',
        'Clear dishes & load dishwasher',
        'Wipe dining table & kitchen counters',
        'Feed pets & refresh water bowl',
        'Complete homework & 20m reading',
        'Put dirty clothes in laundry hamper',
        'Fold & put away clean laundry',
        'Take out kitchen trash & recycling',
        'Water indoor / garden plants',
        'Vacuum living room / sweep porch',
        'Organize shoes & entryway hooks',
        'Weekly toy & bookshelf reset'
      ]
    },
    {
      title: 'Weekly Family Meal & Grocery Planner',
      sub: 'Plan nutritious family dinners and build an organized shopping list',
      type: 'table',
      headers: ['Day of Week', 'Breakfast & School Lunch', 'Family Dinner Menu', 'Prep / Defrost Needed', 'Grocery Staples Needed'],
      widths: [75, 115, 125, 95, 105],
      rows: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
        'Healthy Snacks',
        'Produce & Fruit',
        'Proteins & Dairy',
        'Pantry & Grains',
        'Household Items'
      ]
    },
    {
      title: 'Pantry & Freezer Staples Inventory',
      sub: 'Track bulk household supplies, freezer meals, and restock thresholds',
      type: 'table',
      headers: ['Staple Item / Category', 'Location', 'Qty on Hand', 'Min Qty', 'Expiration Date', 'Restock?'],
      widths: [165, 85, 70, 65, 75, 55],
      rows: Array(15).fill('')
    },
    {
      title: 'Babysitter & Caregiver Instruction Sheet',
      sub: 'Everything a sitter needs: routines, Wi-Fi, house rules, and emergency instructions',
      type: 'quad',
      boxes: [
        {
          title: 'Where We Are & Contact Info',
          items: [
            'Parents Destination / Restaurant:',
            'Parent 1 Cell:',
            'Parent 2 Cell:',
            'Expected Return Time:',
            'Home Street Address & Cross Street:',
            'Trusted Neighbor Name & Phone:'
          ]
        },
        {
          title: 'Kids Routine & Bedtime Rules',
          items: [
            'Dinner / Approved Snacks:',
            'Allergies (STRICTLY AVOID):',
            'Screen Time Rules & Allowed Shows:',
            'Bath & Pajama Time:',
            'Bedtime Story & Lights Out Time:',
            'Comfort Items / Nightlight Info:'
          ]
        },
        {
          title: 'Home Wi-Fi & Safety Info',
          items: [
            'Wi-Fi Network & Password:',
            'Security Alarm Code / Lock Rules:',
            'First Aid Kit & Fire Extinguisher Location:',
            'Flashlight & Circuit Breaker Location:'
          ]
        },
        {
          title: 'Sitter Notes While We Were Out',
          items: [
            'Phone calls or deliveries received:',
            'Meals / snacks eaten well:',
            'Time kids fell asleep:',
            'Anything parents should know:'
          ]
        }
      ]
    },
    {
      title: 'Pet Care, Vet & Feeding Schedule',
      sub: 'Complete health, vaccination, microchip, and daily feeding guide for family pets',
      type: 'table',
      headers: ['Pet Name / Breed', 'Microchip / License #', 'Vet Clinic & Phone', 'Feeding Schedule & Brand', 'Meds / Flea / Heartworm'],
      widths: [95, 95, 105, 115, 105],
      rows: [
        'Pet 1 Profile',
        'Pet 2 Profile',
        'Morning Routine',
        'Evening Routine',
        'Rabies Vaccine',
        'DHPP / FVRCP',
        'Bordetella',
        'Flea & Tick Prevent',
        'Heartworm Prevent',
        'Groomer Contact',
        'Pet Insurance #',
        'Emergency Vet 24/7'
      ]
    },
    {
      title: 'Home Inventory Log — Living, Kitchen & Tech',
      sub: 'Document high-value household items and serial numbers for insurance protection',
      type: 'table',
      headers: ['Room / Item Description', 'Brand & Model', 'Serial Number', 'Purchase Date', 'Purchase Price', 'Receipt?'],
      widths: [135, 105, 95, 65, 65, 50],
      rows: Array(15).fill('')
    },
    {
      title: 'Home Inventory Log — Bedrooms, Jewelry & Garage',
      sub: 'Continued asset protection record for furniture, tools, bikes, and valuables',
      type: 'table',
      headers: ['Room / Item Description', 'Brand & Model', 'Serial Number', 'Purchase Date', 'Purchase Price', 'Receipt?'],
      widths: [135, 105, 95, 65, 65, 50],
      rows: Array(15).fill('')
    },
    {
      title: 'Appliance Manuals, Warranties & Contractors',
      sub: 'Keep model numbers, warranty expirations, and trusted repair technicians in one place',
      type: 'table',
      headers: ['Appliance / Home System', 'Brand & Model #', 'Install Date', 'Warranty Exp.', 'Trusted Technician & Phone'],
      widths: [120, 110, 68, 72, 145],
      rows: [
        'HVAC / Furnace / AC',
        'Water Heater',
        'Refrigerator / Freezer',
        'Dishwasher',
        'Oven / Range / Hood',
        'Washing Machine',
        'Clothes Dryer',
        'Garage Door Opener',
        'Roof / Solar Panels',
        'Plumber (Preferred)',
        'Electrician (Preferred)',
        'Handyman / Locksmith'
      ]
    },
    {
      title: 'Household Utilities & Subscriptions Directory',
      sub: 'Track monthly household bills, account numbers, autopay status, and due dates',
      type: 'table',
      headers: ['Utility / Service', 'Provider Name', 'Account #', 'Due Date', 'Avg Monthly Cost', 'Auto-Pay?'],
      widths: [110, 115, 95, 60, 80, 55],
      rows: [
        'Mortgage / Rent',
        'Property Tax / HOA',
        'Homeowners Insurance',
        'Electricity',
        'Natural Gas / Heating',
        'Water & Sewer',
        'Trash & Recycling',
        'High-Speed Internet',
        'Mobile Family Plan',
        'Home Security System',
        'Streaming Services',
        'Cloud Backup / Software'
      ]
    },
    {
      title: 'Family Birthdays, Anniversaries & Traditions',
      sub: 'Never miss an important celebration, milestone, or annual family ritual',
      type: 'quad',
      boxes: [
        {
          title: 'Jan – Mar Birthdays & Events',
          items: []
        },
        {
          title: 'Apr – Jun Birthdays & Events',
          items: []
        },
        {
          title: 'Jul – Sep Birthdays & Events',
          items: []
        },
        {
          title: 'Oct – Dec Birthdays & Events',
          items: []
        }
      ]
    }
  ];

  pageSpecs.forEach((spec, i) => {
    doc.addPage({ size: 'A4', margin: 0 });
    drawPageChrome(doc, theme, plannerTitle, spec.title, spec.sub, i + 2, totalPages);

    if (spec.type === 'table') {
      const endY = drawTable(doc, theme, MARGIN, 96, spec.widths, spec.headers, spec.rows.length, 28, spec.rows, false);
      drawNotesBlock(doc, theme, MARGIN, endY + 16, CONTENT_W, PAGE_H - 60 - (endY + 16), 'Family Command Center Notes');
    } else if (spec.type === 'quad') {
      drawFourQuadrantMatrix(doc, theme, 96, spec.boxes);
      drawNotesBlock(doc, theme, MARGIN, 738, CONTENT_W, 50, 'Household Reminders');
    }
  });

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// ============================================================================
// 4. WEDDING MASTER PLANNER (24 Pages)
// ============================================================================
function buildWeddingMasterPlanner(themeKey) {
  const theme = THEMES[themeKey];
  const totalPages = 24;
  const filePath = path.join(OUTPUT_DIR, `Wedding-Master-Planner_${themeKey}.pdf`);
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: true });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const plannerTitle = 'Wedding Master Planner';

  drawCoverPage(
    doc,
    theme,
    'Wedding Master Planner',
    '12-Month Countdown, Vendor Comparison, Payment Schedule, Guest RSVP & Seating',
    [
      'Wedding Vision, Style Palette & Complete 12-Month Countdown Checklist',
      'Master Wedding Budget Breakdown & Vendor Payment Milestone Tracker',
      'Venue, Catering, Photographer, Florist & Entertainment Comparisons',
      'Bridal Party Directory, Attire Fittings & Beauty Trial Schedules',
      'Comprehensive Guest List, RSVP, Meal Choice & Gift Thank-You Log',
      'Ceremony Processional, Reception Seating Chart & Wedding Day Timeline'
    ],
    totalPages
  );

  const pageSpecs = [
    {
      title: 'Wedding Vision, Palette & VIP Directory',
      sub: 'Define your wedding aesthetic, top priorities, and core wedding party roles',
      type: 'quad',
      boxes: [
        {
          title: 'Core Wedding Details',
          items: [
            'Partner 1 & Partner 2 Names:',
            'Proposed Wedding Date(s):',
            'Target Guest Count & Overall Budget:',
            'Ceremony Location / Style:',
            'Reception Location / Vibe:',
            'Wedding Color Palette (3-4 Shades):'
          ]
        },
        {
          title: 'Top 3 Must-Have Priorities',
          items: [
            'Priority #1 (e.g., Photography / Food):',
            'Priority #2 (e.g., Venue / Live Music):',
            'Priority #3 (e.g., Guest Experience):',
            'Things We Are Happy to Skip:',
            'Signature Cocktail / Menu Idea:',
            'First Dance Song Idea:'
          ]
        },
        {
          title: 'Partner 1 Attendants / VIPs',
          items: [
            'Maid/Matron/Best Person of Honor:',
            'Attendant 2:',
            'Attendant 3:',
            'Attendant 4:'
          ]
        },
        {
          title: 'Partner 2 Attendants / Ceremony Roles',
          items: [
            'Best Person / Honor Attendant:',
            'Attendant 2:',
            'Officiant & Readers:',
            'Ring Bearer & Flower Child:'
          ]
        }
      ]
    },
    {
      title: '12-Month Wedding Countdown (12 to 6 Months)',
      sub: 'Step-by-step planning milestones for the first half of your engagement',
      type: 'quad',
      boxes: [
        {
          title: '12–10 Months Out',
          items: [
            'Determine overall wedding budget & contributors',
            'Draft initial guest list & target headcount',
            'Tour & book Ceremony and Reception venues',
            'Hire Wedding Planner or Day-Of Coordinator',
            'Book Photographer & Videographer',
            'Insure engagement ring & celebrate!'
          ]
        },
        {
          title: '9–8 Months Out',
          items: [
            'Book Caterer, Bartending & Rental company',
            'Hire Band / DJ & Ceremony Musicians',
            'Book Florist & Lighting / Decor specialist',
            'Shop for & order Wedding Dress / Attire',
            'Reserve hotel room blocks for out-of-town guests',
            'Launch wedding website & gift registry'
          ]
        },
        {
          title: '7 Months Out',
          items: [
            'Send Save-the-Date cards / digital notices',
            'Book Officiant & discuss ceremony structure',
            'Select wedding party attire & ordering deadlines',
            'Book Hair & Makeup artists + schedule trials'
          ]
        },
        {
          title: '6 Months Out',
          items: [
            'Attend catering tasting & finalize menu style',
            'Order wedding cake / dessert table',
            'Book guest transportation & couple getaway car',
            'Plan & book honeymoon flights & resorts'
          ]
        }
      ]
    },
    {
      title: '12-Month Wedding Countdown (5 Months to Wedding Day)',
      sub: 'Final preparations, fittings, marriage license, and wedding week checklist',
      type: 'quad',
      boxes: [
        {
          title: '5–4 Months Out',
          items: [
            'Order formal wedding invitations & stationery',
            'Purchase wedding bands & custom engraving',
            'Book rehearsal dinner venue & menu',
            'Schedule first dress / suit tailoring fitting',
            'Finalize floral recipe & centerpiece mockups',
            'Purchase wedding shoes & undergarments'
          ]
        },
        {
          title: '3–2 Months Out',
          items: [
            'Mail wedding invitations (8–10 weeks out)',
            'Apply for Marriage License (check local window)',
            'Write personal vows & select ceremony readings',
            'Submit song requests & do-not-play list to DJ',
            'Purchase wedding party gifts & guest favors',
            'Finalize day-of timeline with coordinator'
          ]
        },
        {
          title: '1 Month to 2 Weeks Out',
          items: [
            'Follow up with unconfirmed RSVPs',
            'Finalize Reception Seating Chart & place cards',
            'Send final headcount & dietary list to caterer',
            'Complete final dress fitting & steam attire'
          ]
        },
        {
          title: 'Wedding Week & Night Before',
          items: [
            'Prepare vendor final payments & tip envelopes',
            'Pack wedding day emergency kit & overnight bag',
            'Deliver welcome bags to guest hotels',
            'Attend ceremony rehearsal & get 8 hrs sleep!'
          ]
        }
      ]
    },
    {
      title: 'Wedding Master Budget Breakdown',
      sub: 'Compare estimated vs. actual costs across every wedding category',
      type: 'table',
      headers: ['Category / Expense Item', 'Target %', 'Estimated Cost', 'Actual Cost', 'Deposit Paid', 'Balance Due'],
      widths: [165, 55, 75, 75, 75, 70],
      rows: [
        'Venue Rental & Ceremony Fee',
        'Catering (Food & Service)',
        'Bar, Beverages & Bartenders',
        'Photography & Videography',
        'Wedding Planner / Coordinator',
        'Flowers, Bouquets & Decor',
        'Band / DJ / Sound & Lighting',
        'Wedding Cake & Desserts',
        'Wedding Attire & Alterations',
        'Hair, Makeup & Grooming',
        'Invitations, Signage & Postage',
        'Wedding Rings & Marriage License',
        'Transportation & Hotel Blocks',
        'Officiant, Gifts & Gratuities',
        '5% Contingency Buffer'
      ]
    },
    {
      title: 'Vendor Payment & Deposit Schedule',
      sub: 'Track contract signatures, deposits, installment dates, and tip envelopes',
      type: 'table',
      headers: ['Vendor Category & Name', 'Total Contract', 'Deposit Paid', '2nd Installment', 'Final Balance & Due Date', 'Tip Env'],
      widths: [140, 75, 75, 75, 105, 45],
      rows: Array(15).fill('')
    },
    {
      title: 'Venue & Catering Comparison Matrix',
      sub: 'Side-by-side comparison of top ceremony/reception venues and catering packages',
      type: 'table',
      headers: ['Comparison Criteria', 'Venue / Caterer Option A', 'Venue / Caterer Option B', 'Venue / Caterer Option C'],
      widths: [140, 125, 125, 125],
      rows: [
        'Name, Contact & Website',
        'Available Dates & Capacity',
        'Site Rental Fee & Hours Included',
        'Rain Backup Plan (Indoor Space)',
        'Tables, Chairs & Linens Included?',
        'Food Cost Per Person (Plated/Buffet)',
        'Bar Package Cost Per Person',
        'Cake Cutting & Corkage Fees',
        'Service Charge % & Tax %',
        'Setup & Breakdown Window',
        'Parking / Valet / Accessibility',
        'Overall Rating (1–10)'
      ]
    },
    {
      title: 'Photographer, Videographer & Music Comparison',
      sub: 'Evaluate coverage hours, second shooters, turnaround times, and entertainment',
      type: 'table',
      headers: ['Comparison Criteria', 'Photo / Video Option A', 'Photo / Video Option B', 'DJ / Band Option'],
      widths: [140, 125, 125, 125],
      rows: [
        'Company / Artist Name',
        'Package Price & Hours Included',
        'Second Shooter Included?',
        'Engagement Session Included?',
        'High-Res Digital Gallery & Rights',
        'Highlight Film / Full Ceremony Edit',
        'Ceremony Mic & Lapel Audio Setup',
        'Cocktail Hour Sound System',
        'Reception MC & Dance Floor Lighting',
        'Overtime Hourly Rate',
        'Backup Equipment & Liability Ins.',
        'Overall Fit & Vibe (1–10)'
      ]
    },
    {
      title: 'Florist, Decor & Rentals Planner',
      sub: 'Itemize personal flowers, ceremony installation, table centerpieces, and rentals',
      type: 'table',
      headers: ['Floral / Rental Item', 'Quantity', 'Color / Flower Variety / Style', 'Unit Cost', 'Total Cost', 'Reuse at Rec?'],
      widths: [145, 55, 155, 55, 55, 50],
      rows: [
        'Primary Bridal Bouquet(s)',
        'Bridesmaid Bouquets',
        'Boutonnieres & Corsages',
        'Ceremony Arch / Chuppah',
        'Aisle Chairs / Petal Toss',
        'Welcome Sign & Seating Chart',
        'Cocktail Highboy Florals',
        'Sweetheart / Head Table',
        'Guest Table Centerpieces (Low/Tall)',
        'Candles, Votives & Runners',
        'Cake Flowers & Bar Arrangement',
        'Specialty Chairs / Lounge Rentals'
      ]
    },
    {
      title: 'Attire, Fittings & Beauty Schedule',
      sub: 'Track dress/suit alterations, accessories, and wedding morning hair & makeup slots',
      type: 'table',
      headers: ['Event / Fitting / Beauty Slot', 'Date & Time', 'Person / Role', 'Stylist / Tailor', 'Items to Bring / Notes'],
      widths: [130, 85, 95, 95, 110],
      rows: [
        '1st Dress / Suit Fitting',
        '2nd Dress / Suit Fitting',
        'Final Fitting & Pickup',
        'Hair & Makeup Trial',
        '07:30 AM Wedding Day Slot 1',
        '08:15 AM Wedding Day Slot 2',
        '09:00 AM Wedding Day Slot 3',
        '09:45 AM Wedding Day Slot 4',
        '10:30 AM Bride Hair & Makeup',
        '11:30 AM Final Touch-Ups',
        'Veil / Accessories Steaming',
        'Groom & Groomsmen Dressing'
      ]
    },
    {
      title: 'Guest List, RSVP & Dietary Tracker (Guests 1–16)',
      sub: 'Track invitations sent, RSVPs, meal selections, dietary restrictions, and table numbers',
      type: 'table',
      headers: ['#', 'Guest / Household Name', 'Invited', 'RSVP (Y/N)', 'Meal Choice & Dietary', 'Table #', 'Gift / Thank You'],
      widths: [25, 150, 45, 55, 115, 45, 80],
      rows: Array.from({ length: 16 }, (_, idx) => `${idx + 1}`)
    },
    {
      title: 'Guest List, RSVP & Dietary Tracker (Guests 17–32)',
      sub: 'Continued guest tracking for invitations, meal counts, and thank-you notes',
      type: 'table',
      headers: ['#', 'Guest / Household Name', 'Invited', 'RSVP (Y/N)', 'Meal Choice & Dietary', 'Table #', 'Gift / Thank You'],
      widths: [25, 150, 45, 55, 115, 45, 80],
      rows: Array.from({ length: 16 }, (_, idx) => `${idx + 17}`)
    },
    {
      title: 'Guest List, RSVP & Dietary Tracker (Guests 33–48)',
      sub: 'Continued guest tracking for invitations, meal counts, and thank-you notes',
      type: 'table',
      headers: ['#', 'Guest / Household Name', 'Invited', 'RSVP (Y/N)', 'Meal Choice & Dietary', 'Table #', 'Gift / Thank You'],
      widths: [25, 150, 45, 55, 115, 45, 80],
      rows: Array.from({ length: 16 }, (_, idx) => `${idx + 33}`)
    },
    {
      title: 'Guest List, RSVP & Dietary Tracker (Guests 49–64)',
      sub: 'Continued guest tracking for invitations, meal counts, and thank-you notes',
      type: 'table',
      headers: ['#', 'Guest / Household Name', 'Invited', 'RSVP (Y/N)', 'Meal Choice & Dietary', 'Table #', 'Gift / Thank You'],
      widths: [25, 150, 45, 55, 115, 45, 80],
      rows: Array.from({ length: 16 }, (_, idx) => `${idx + 49}`)
    },
    {
      title: 'Ceremony Processional, Readings & Music Cues',
      sub: 'Order of entrance, musical selections, readings, vows, and recessional',
      type: 'table',
      headers: ['Ceremony Moment', 'Participants / Speakers', 'Song Title & Artist / Cue', 'Duration / Notes'],
      widths: [120, 135, 150, 110],
      rows: [
        'Guest Seating Prelude',
        'Parents & Grandparents Entrance',
        'Wedding Party Processional',
        'Ring Bearer & Flower Child',
        'Primary Partner Entrance',
        'Officiant Welcome & Opening',
        'Reading #1',
        'Reading #2',
        'Exchange of Vows',
        'Exchange of Rings',
        'Pronouncement & Kiss',
        'Recessional Celebration Song'
      ]
    },
    {
      title: 'Must-Have Photography Shot List',
      sub: 'Share with your photographer and designate a family wrangler for portraits',
      type: 'quad',
      boxes: [
        {
          title: 'Getting Ready & Flat-Lay Details',
          items: [
            'Invitation suite, rings & vow books flat-lay',
            'Wedding dress / suit hanging & shoes',
            'Putting on jewelry, veil, watch & boutonniere',
            'First look with parents & wedding party',
            'Couple Private First Look & reaction'
          ]
        },
        {
          title: 'Family Formal Combinations',
          items: [
            'Couple + Partner 1 Immediate Family',
            'Couple + Partner 1 Grandparents & Siblings',
            'Couple + Partner 2 Immediate Family',
            'Couple + Partner 2 Grandparents & Siblings',
            'Couple + Both Sets of Parents Together'
          ]
        },
        {
          title: 'Wedding Party & Couple Portraits',
          items: [
            'Full Wedding Party (Formal & Candid)',
            'Couple with Bridesmaids / Honor Attendants',
            'Couple with Groomsmen / Honor Attendants',
            'Golden hour sunset couple portraits'
          ]
        },
        {
          title: 'Ceremony & Reception Moments',
          items: [
            'Walking down aisle & partner reaction',
            'Vows, ring exchange & recessional confetti',
            'Room reveal before guests enter reception',
            'First dance, parent dances, toasts & cake cut'
          ]
        }
      ]
    },
    {
      title: 'Reception Seating Chart (Head Table & Tables 1–3)',
      sub: 'Assign guests thoughtfully by group compatibility and accessibility',
      type: 'quad',
      boxes: [
        { title: 'Sweetheart / Head Table', items: [] },
        { title: 'Table 1 (Immediate Family A)', items: [] },
        { title: 'Table 2 (Immediate Family B)', items: [] },
        { title: 'Table 3 (Extended Family)', items: [] }
      ]
    },
    {
      title: 'Reception Seating Chart (Tables 4–7)',
      sub: 'Assign up to 10–12 guests per table and note highchairs or dietary needs',
      type: 'quad',
      boxes: [
        { title: 'Table 4', items: [] },
        { title: 'Table 5', items: [] },
        { title: 'Table 6', items: [] },
        { title: 'Table 7', items: [] }
      ]
    },
    {
      title: 'Reception Seating Chart (Tables 8–11)',
      sub: 'Assign up to 10–12 guests per table and note highchairs or dietary needs',
      type: 'quad',
      boxes: [
        { title: 'Table 8', items: [] },
        { title: 'Table 9', items: [] },
        { title: 'Table 10', items: [] },
        { title: 'Table 11', items: [] }
      ]
    },
    {
      title: 'Wedding Day Master Run-of-Show (Morning & Ceremony)',
      sub: 'Minute-by-minute schedule for vendors, wedding party, and coordinator',
      type: 'table',
      headers: ['Time', 'Event / Milestone', 'Location', 'Who Is Involved', 'Lead / Notes'],
      widths: [70, 165, 95, 100, 85],
      rows: [
        '08:00 AM',
        '09:30 AM',
        '11:00 AM',
        '12:30 PM',
        '01:30 PM',
        '02:00 PM',
        '02:30 PM',
        '03:15 PM',
        '04:00 PM',
        '04:30 PM',
        '04:45 PM',
        '05:00 PM'
      ]
    },
    {
      title: 'Wedding Day Master Run-of-Show (Reception & Send-Off)',
      sub: 'Cocktail hour, grand entrance, dinner service, speeches, dancing, and exit',
      type: 'table',
      headers: ['Time', 'Reception Milestone', 'Music / Cue', 'Vendor Lead', 'Special Notes'],
      widths: [70, 165, 95, 100, 85],
      rows: [
        '05:30 PM Cocktail Hr',
        '06:30 PM Guests Seated',
        '06:45 PM Grand Entrance',
        '06:50 PM First Dance',
        '07:00 PM Welcome Toast',
        '07:15 PM Dinner Service',
        '08:00 PM Best Speeches',
        '08:20 PM Parent Dances',
        '08:30 PM Cake Cutting',
        '08:45 PM Open Dance Floor',
        '10:00 PM Late-Night Snack',
        '10:55 PM Grand Send-Off'
      ]
    },
    {
      title: 'Wedding Day Emergency Kit & Decor Box Checklist',
      sub: 'Pack everything needed for ceremony decor setup and last-minute fixes',
      type: 'quad',
      boxes: [
        {
          title: 'Bride & Groom Emergency Kit',
          items: [
            'Mini sewing kit, safety pins & fashion tape',
            'Stain remover pen, chalk & lint roller',
            'Blister bandages, pain relievers & antacids',
            'Mints, straws, blotting papers & lipstick',
            'Clear nail polish, bobby pins & hairspray',
            'Portable phone charger & tissues'
          ]
        },
        {
          title: 'Ceremony Decor & Legal Items',
          items: [
            'Marriage License & Officiant folder',
            'All 3 Wedding Rings + ring box',
            'Printed Vow Books for both partners',
            'Reserved seating signs for front rows',
            'Programs, unity candle / sand & tissues'
          ]
        },
        {
          title: 'Reception Decor Box (For Coordinator)',
          items: [
            'Welcome sign, easel & seating chart',
            'Table numbers, place cards & menus',
            'Card box, guestbook & metallic pens',
            'Cake knife, server & cake topper'
          ]
        },
        {
          title: 'End-of-Night Take-Home Assignments',
          items: [
            'Who takes cards & gifts home:',
            'Who takes top tier of cake & florals:',
            'Who returns rental tuxedos / decor:',
            'Couple honeymoon bags & passports:'
          ]
        }
      ]
    },
    {
      title: 'Wedding Gift & Thank-You Card Tracker',
      sub: 'Record shower and wedding gifts promptly to personalize your thank-you notes',
      type: 'table',
      headers: ['Guest Name(s)', 'Event (Shower/Wedding)', 'Gift Description or Amount', 'Date Rec.', 'Thank-You Sent?'],
      widths: [130, 95, 155, 65, 70],
      rows: Array(15).fill('')
    },
    {
      title: 'Post-Wedding Checklist & Name Change Guide',
      sub: 'Wrap up vendor reviews, preservation, and legal document updates after the big day',
      type: 'quad',
      boxes: [
        {
          title: 'Within 1–2 Weeks Post-Wedding',
          items: [
            'Ensure signed marriage license is filed',
            'Confirm all rental items were returned',
            'Drop off wedding gown for cleaning/preservation',
            'Deposit gift checks & update registry completion',
            'Back up guest photos & social media memories'
          ]
        },
        {
          title: 'Within 1–3 Months Post-Wedding',
          items: [
            'Mail all handwritten thank-you cards',
            'Write 5-star reviews for favorite vendors',
            'Select photos for printed wedding album',
            'Order certified copies of Marriage Certificate'
          ]
        },
        {
          title: 'Legal Name Change Sequence (If Applicable)',
          items: [
            '1. Social Security / National ID Office',
            '2. Driver License / State ID Card',
            '3. Passport & Global Entry / TSA PreCheck',
            '4. Bank Accounts, Credit Cards & Payroll'
          ]
        },
        {
          title: 'Joint Household & Financial Updates',
          items: [
            'Update beneficiaries on 401(k) & Life Insurance',
            'Combine Auto, Home/Renters & Health Insurance',
            'Set up joint savings & anniversary fund',
            'Frame favorite wedding portrait at home!'
          ]
        }
      ]
    }
  ];

  pageSpecs.forEach((spec, i) => {
    doc.addPage({ size: 'A4', margin: 0 });
    drawPageChrome(doc, theme, plannerTitle, spec.title, spec.sub, i + 2, totalPages);

    if (spec.type === 'table') {
      const endY = drawTable(doc, theme, MARGIN, 96, spec.widths, spec.headers, spec.rows.length, 28, spec.rows, false);
      drawNotesBlock(doc, theme, MARGIN, endY + 16, CONTENT_W, PAGE_H - 60 - (endY + 16), 'Wedding Planning Notes');
    } else if (spec.type === 'quad') {
      drawFourQuadrantMatrix(doc, theme, 96, spec.boxes);
      drawNotesBlock(doc, theme, MARGIN, 738, CONTENT_W, 50, 'Coordinator & Family Reminders');
    }
  });

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// ============================================================================
// 5. SPIRITUAL REFLECTION PLANNER (30 Pages)
// ============================================================================
function drawTwoDaySpiritualSpread(doc, theme, dayA, dayB) {
  const halfH = 328;
  [dayA, dayB].forEach((dayNum, idx) => {
    const baseY = 94 + idx * (halfH + 14);

    // Outer container for Day
    doc
      .save()
      .fillColor('#ffffff')
      .roundedRect(MARGIN, baseY, CONTENT_W, halfH, 6)
      .fill()
      .lineWidth(0.8)
      .strokeColor(theme.border)
      .roundedRect(MARGIN, baseY, CONTENT_W, halfH, 6)
      .stroke()
      .restore();

    // Day Header Bar
    doc
      .save()
      .fillColor(theme.primary)
      .roundedRect(MARGIN, baseY, CONTENT_W, 24, 6)
      .fill()
      .restore();

    doc
      .font('Helvetica-Bold')
      .fontSize(9.5)
      .fillColor('#ffffff')
      .text(`DAY ${dayNum}  •  DAILY SPIRITUAL & MINDFULNESS REFLECTION`, MARGIN + 12, baseY + 7, {
        width: 340,
        lineBreak: false
      });

    doc
      .font('Helvetica')
      .fontSize(8.5)
      .fillColor(theme.light)
      .text('Date: ______________________', PAGE_W - MARGIN - 150, baseY + 7, {
        width: 140,
        align: 'right',
        lineBreak: false
      });

    // Left Column: Daily Prayers & Sunnah / Spiritual Habits
    const leftX = MARGIN + 12;
    const leftW = 235;
    const rightX = MARGIN + 260;
    const rightW = CONTENT_W - 272;

    drawSectionHeader(doc, theme, leftX, baseY + 32, leftW, 'Daily Prayers & Worship Checkboxes');

    const prayers = [
      'Fajr / Dawn Prayer (On Time + Sunnah)',
      'Dhuhr / Midday Prayer (On Time + Sunnah)',
      'Asr / Afternoon Prayer (On Time)',
      'Maghrib / Sunset Prayer (On Time + Sunnah)',
      'Isha / Night Prayer (+ Qiyam / Taraweeh)',
      'Morning & Evening Adhkar / Remembrance',
      'Quran / Scripture Reading & Contemplation',
      'Daily Sadaqah / Act of Kindness & Service'
    ];

    prayers.forEach((p, pi) => {
      const py = baseY + 62 + pi * 20;
      drawCheckbox(doc, leftX + 6, py, 10, theme.primary);
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(theme.text)
        .text(p, leftX + 22, py + 1, { width: leftW - 28, lineBreak: false });
    });

    // Bottom Left: Quran / Scripture & Charity mini-box
    drawSectionHeader(doc, theme, leftX, baseY + 228, leftW, 'Scripture & Sadaqah Log');
    const logLines = [
      'Surah / Passage Read:',
      'Pages / Juz Completed:',
      'Sadaqah / Good Deed:'
    ];
    logLines.forEach((lbl, li) => {
      const ly = baseY + 258 + li * 21;
      doc
        .font('Helvetica-Bold')
        .fontSize(7.8)
        .fillColor(theme.muted)
        .text(lbl, leftX + 6, ly, { lineBreak: false });
      doc
        .save()
        .lineWidth(0.4)
        .strokeColor(theme.border)
        .moveTo(leftX + 105, ly + 9)
        .lineTo(leftX + leftW - 6, ly + 9)
        .stroke()
        .restore();
    });

    // Right Column: Verse Reflection, Dua & Gratitude
    drawSectionHeader(doc, theme, rightX, baseY + 32, rightW, 'Key Verse / Gem & Heart Reflection');
    for (let i = 0; i < 4; i++) {
      const ly = baseY + 72 + i * 21;
      doc
        .save()
        .lineWidth(0.4)
        .strokeColor(theme.border)
        .moveTo(rightX + 6, ly)
        .lineTo(rightX + rightW - 6, ly)
        .stroke()
        .restore();
    }

    drawSectionHeader(doc, theme, rightX, baseY + 148, rightW, 'Personal Duas & Supplications');
    for (let i = 0; i < 3; i++) {
      const ly = baseY + 188 + i * 21;
      doc
        .save()
        .lineWidth(0.4)
        .strokeColor(theme.border)
        .moveTo(rightX + 6, ly)
        .lineTo(rightX + rightW - 6, ly)
        .stroke()
        .restore();
    }

    drawSectionHeader(doc, theme, rightX, baseY + 242, rightW, '3 Blessings I Am Grateful For Today');
    for (let i = 0; i < 3; i++) {
      const ly = baseY + 272 + i * 18;
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor(theme.primary)
        .text(`${i + 1}.`, rightX + 6, ly, { lineBreak: false });
      doc
        .save()
        .lineWidth(0.4)
        .strokeColor(theme.border)
        .moveTo(rightX + 20, ly + 9)
        .lineTo(rightX + rightW - 6, ly + 9)
        .stroke()
        .restore();
    }
  });
}

function buildSpiritualReflectionPlanner(themeKey) {
  const theme = THEMES[themeKey];
  const totalPages = 30;
  const filePath = path.join(OUTPUT_DIR, `Spiritual-Reflection-Planner_${themeKey}.pdf`);
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: true });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const plannerTitle = 'Spiritual Reflection Planner';

  // Page 1: Cover
  drawCoverPage(
    doc,
    theme,
    'Spiritual Reflection Planner',
    '30-Day Spiritual & Ramadan Journal: Prayers, Scripture Log, Sadaqah, Duas & Gratitude',
    [
      '30-Day Spiritual Intentions, Heart Reset & Habit Commitments',
      '30-Day Prayer, Dhikr & Worship Consistency Matrix',
      '30-Part Quran / Scripture Reading & Tadabbur Completion Log',
      'Charity, Zakat & Daily Sadaqah Impact Tracker',
      'Complete Days 1–30 Guided Daily Spiritual Reflection Spreads',
      'Last 10 Nights / Peak Worship Planner & Post-30-Day Heart Review'
    ],
    totalPages
  );

  const introPages = [
    {
      title: '30-Day Spiritual Intentions & Heart Reset',
      sub: 'Purify your intention (Niyyah) and define measurable spiritual goals for the month',
      type: 'quad',
      boxes: [
        {
          title: 'Prayer & Worship Commitments',
          items: [
            'Pray all 5 daily obligatory prayers on time',
            'Commit to Sunnah Rawatib & Witr prayers',
            'Establish Qiyam / Tahajjud night prayer habit',
            'Guard morning & evening Adhkar daily',
            'Spend 10 quiet minutes in Istighfar & Dhikr'
          ]
        },
        {
          title: 'Quran / Scripture & Knowledge Goals',
          items: [
            'Daily recitation target (Pages / Juz per day):',
            'Daily translation & Tafsir reflection (15 mins)',
            'Memorize or review selected Surahs / passages',
            'Listen to 1 beneficial spiritual lecture weekly',
            'Apply 1 verse directly to my character each day'
          ]
        },
        {
          title: 'Character, Family & Tongue Guarding',
          items: [
            'Abstain from gossip, complaining & harsh speech',
            'Practice patience & gentleness with family',
            'Limit idle social media scrolling to < 20 mins',
            'Reconnect with relatives & forgive past hurts'
          ]
        },
        {
          title: 'Charity, Generosity & Community',
          items: [
            'Give Sadaqah daily (even a small automated amount)',
            'Calculate & distribute annual Zakat obligations',
            'Feed others / sponsor meals or community care',
            'Volunteer time & skills to help someone in need'
          ]
        }
      ]
    },
    {
      title: '30-Day Prayer & Spiritual Habit Tracker (Days 1–15)',
      sub: 'Check off each daily act of worship to maintain steady momentum (First 15 Days)',
      type: 'table',
      headers: ['Day', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Sunnah/Qiyam', 'Adhkar', 'Scripture', 'Sadaqah'],
      widths: [45, 45, 48, 45, 55, 45, 65, 52, 60, 55],
      rows: Array.from({ length: 15 }, (_, i) => `Day ${i + 1}`)
    },
    {
      title: '30-Day Prayer & Spiritual Habit Tracker (Days 16–30)',
      sub: 'Check off each daily act of worship to finish the month strong (Days 16–30)',
      type: 'table',
      headers: ['Day', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Sunnah/Qiyam', 'Adhkar', 'Scripture', 'Sadaqah'],
      widths: [45, 45, 48, 45, 55, 45, 65, 52, 60, 55],
      rows: Array.from({ length: 15 }, (_, i) => `Day ${i + 16}`)
    },
    {
      title: 'Quran / Scripture 30-Part Reading Log (Parts 1–15)',
      sub: 'Track daily Juz / Chapter completion and record the verse that touched your heart most',
      type: 'table',
      headers: ['Part / Juz', 'Surah / Passage Range', 'Recited', 'Tafsir/Meaning', 'Key Verse & Personal Takeaway'],
      widths: [58, 125, 52, 68, 212],
      rows: Array.from({ length: 15 }, (_, i) => `Part / Juz ${i + 1}`)
    },
    {
      title: 'Quran / Scripture 30-Part Reading Log (Parts 16–30)',
      sub: 'Complete your 30-part reading journey with mindful reflection',
      type: 'table',
      headers: ['Part / Juz', 'Surah / Passage Range', 'Recited', 'Tafsir/Meaning', 'Key Verse & Personal Takeaway'],
      widths: [58, 125, 52, 68, 212],
      rows: Array.from({ length: 15 }, (_, i) => `Part / Juz ${i + 16}`)
    },
    {
      title: 'Charity, Zakat & Sadaqah Impact Tracker',
      sub: 'Plan and record charitable giving, Zakat calculations, and acts of kindness',
      type: 'table',
      headers: ['Date / Day', 'Type (Sadaqah / Zakat / Gift)', 'Cause / Recipient', 'Amount / Action', 'Intention / Dua'],
      widths: [68, 125, 130, 82, 110],
      rows: Array(15).fill('')
    },
    {
      title: 'Master Dua & Supplication List',
      sub: 'Organize your heartfelt prayers so you never forget what to ask for in prostration',
      type: 'quad',
      boxes: [
        {
          title: 'Faith, Steadfastness & Hereafter',
          items: [
            'Steadfast heart upon truth & guidance',
            'Forgiveness, mercy & protection from trials',
            'Sincerity (Ikhlas) in every word and deed',
            'Acceptance of prayers, fasting & charity',
            'Peaceful ending & highest level of Paradise'
          ]
        },
        {
          title: 'Parents, Spouse, Children & Family',
          items: [
            'Mercy, health & long life for parents',
            'Love, tranquility & righteousness in marriage/home',
            'Protection & strong faith for children/youth',
            'Healing for every sick family member',
            'Unity, barakah & reconciliation among relatives'
          ]
        },
        {
          title: 'Health, Rizq (Provision) & Purpose',
          items: [
            'Halal, abundant & blessed sustenance (Rizq)',
            'Freedom from debt, anxiety & overwhelm',
            'Clarity and excellence in work & studies',
            'Energy, sound health & beneficial knowledge'
          ]
        },
        {
          title: 'Ummah, Humanity & Oppressed',
          items: [
            'Relief, justice & safety for the oppressed worldwide',
            'Food, shelter & comfort for refugees & orphans',
            'Righteous leadership & peace in our communities',
            'Gratitude in ease and patience in hardship'
          ]
        }
      ]
    },
    {
      title: 'Weekly Sunnah, Wellness & Fasting Planner',
      sub: 'Nourish body and soul with wholesome Suhoor/Iftar meals, hydration, and rest',
      type: 'table',
      headers: ['Focus Area', 'Week 1 Plan', 'Week 2 Plan', 'Week 3 Plan', 'Week 4 Plan'],
      widths: [115, 100, 100, 100, 100],
      rows: [
        'Suhoor / Morning Fuel',
        'Iftar / Evening Meal',
        'Hydration Target (8 Cups)',
        'Sunnah Foods Included',
        'Physical Movement / Walk',
        'Sleep & Nap Schedule',
        'Screen Detox Window',
        'Family Gathering / Iftar',
        'Mosque / Community Visit',
        'Character Trait of Week',
        'Surah / Dua of Week',
        'Weekly Gratitude Highlight'
      ]
    }
  ];

  // Pages 2–9 (8 pages)
  introPages.forEach((spec, idx) => {
    doc.addPage({ size: 'A4', margin: 0 });
    drawPageChrome(doc, theme, plannerTitle, spec.title, spec.sub, idx + 2, totalPages);
    if (spec.type === 'table') {
      const endY = drawTable(doc, theme, MARGIN, 96, spec.widths, spec.headers, spec.rows.length, 28, spec.rows, false);
      drawNotesBlock(doc, theme, MARGIN, endY + 16, CONTENT_W, PAGE_H - 60 - (endY + 16), 'Spiritual Reflections & Notes');
    } else if (spec.type === 'quad') {
      drawFourQuadrantMatrix(doc, theme, 96, spec.boxes);
      drawNotesBlock(doc, theme, MARGIN, 738, CONTENT_W, 50, 'Personal Intention Statement');
    }
  });

  // Pages 10–24 (15 pages): Days 1–30 Daily Reflection Spreads (2 days per page)
  for (let p = 0; p < 15; p++) {
    const dayA = p * 2 + 1;
    const dayB = p * 2 + 2;
    const pageNum = 10 + p;
    doc.addPage({ size: 'A4', margin: 0 });
    drawPageChrome(
      doc,
      theme,
      plannerTitle,
      `30-Day Reflection Journal  •  Days ${dayA} & ${dayB}`,
      'Daily prayers, scripture reading log, sadaqah, heartfelt duas & gratitude notes',
      pageNum,
      totalPages
    );
    drawTwoDaySpiritualSpread(doc, theme, dayA, dayB);
  }

  // Pages 25–30 (6 pages): Final Ashra / Peak Worship, Eid/Celebration & Post-30-Day Review
  const closingPages = [
    {
      title: 'Week 1 & Week 2 Spiritual Check-In Review',
      sub: 'Pause at the halfway mark to celebrate consistency and recalibrate your energy',
      type: 'quad',
      boxes: [
        {
          title: 'Week 1 Wins & Spiritual Highs',
          items: [
            'Most peaceful prayer this week:',
            'Verse or reminder that impacted me:',
            'Habit I stayed most consistent with:',
            'Obstacle I overcame:'
          ]
        },
        {
          title: 'Week 2 Wins & Spiritual Highs',
          items: [
            'Most peaceful prayer this week:',
            'Verse or reminder that impacted me:',
            'Habit I stayed most consistent with:',
            'Adjustment for the second half:'
          ]
        },
        {
          title: 'Mid-Month Heart Audit',
          items: [
            'How is my focus (Khushu) in prayer?',
            'Have I guarded my tongue and patience?',
            'Am I getting enough rest to worship well?',
            'One distraction I will eliminate today:'
          ]
        },
        {
          title: 'Renewed Intentions for Days 16–30',
          items: []
        }
      ]
    },
    {
      title: 'Last 10 Nights / Peak Worship Tracker',
      sub: 'Maximize the blessed final nights (especially odd nights 21, 23, 25, 27, 29)',
      type: 'table',
      headers: ['Night', 'Isha & Fajr in Jamah', 'Qiyam / Tahajjud', 'Quran & Tafsir', 'Nightly Sadaqah', 'Laylatul Qadr Forgiveness Dua'],
      widths: [55, 95, 90, 90, 85, 100],
      rows: [
        'Night 21 (Odd)',
        'Night 22',
        'Night 23 (Odd)',
        'Night 24',
        'Night 25 (Odd)',
        'Night 26',
        'Night 27 (Odd)',
        'Night 28',
        'Night 29 (Odd)',
        'Night 30',
        'I’tikaf / Retreat',
        'Zakat al-Fitr Paid'
      ]
    },
    {
      title: '99 Names / Divine Attributes Reflection Log',
      sub: 'Contemplate the Divine Names and call upon God through them in your daily life',
      type: 'table',
      headers: ['Divine Name / Attribute', 'Meaning', 'How It Manifests in My Life', 'How I Can Live & Pray With This Name'],
      widths: [115, 105, 145, 150],
      rows: [
        'Ar-Rahman (The Entirely Merciful)',
        'Ar-Rahim (The Especially Merciful)',
        'Al-Malik (The Sovereign)',
        'As-Salam (The Source of Peace)',
        'Al-Ghaffar (The Constant Forgiver)',
        'Ar-Razzaq (The Total Provider)',
        'Al-Fattah (The Opener of Ways)',
        'Al-Alim (The All-Knowing)',
        'As-Sami (The All-Hearing)',
        'Al-Basir (The All-Seeing)',
        'Al-Latif (The Subtle & Kind)',
        'Al-Wadud (The Most Loving)',
        'Ash-Shakur (The Appreciative)',
        'Al-Mujib (The Responder to Prayer)'
      ]
    },
    {
      title: 'Gratitude & Answered Prayers Archive',
      sub: 'Record moments of grace, unexpected doors opened, and answered supplications',
      type: 'table',
      headers: ['Date', 'Blessing / Answered Dua / Moment of Peace', 'What It Taught Me About Trust & Patience'],
      widths: [75, 225, 215],
      rows: Array(15).fill('')
    },
    {
      title: 'Eid / Celebration & Hospitality Planner',
      sub: 'Prepare gifts, charity before prayer, family visits, and festive menus with ease',
      type: 'quad',
      boxes: [
        {
          title: 'Pre-Celebration Checklist',
          items: [
            'Pay Zakat al-Fitr before celebration prayer',
            'Prepare washed & pressed festive attire',
            'Decorate home & wrap gifts / Eidi envelopes',
            'Confirm prayer time & location with family',
            'Prepare sweet breakfast dates & hospitality tray'
          ]
        },
        {
          title: 'Gifts & Eidi Envelope Tracker',
          items: [
            'Parents & Elders:',
            'Spouse / Partner:',
            'Children, Nieces & Nephews:',
            'Neighbors & Community Workers:'
          ]
        },
        {
          title: 'Festive Menu & Hosting Plan',
          items: [
            'Morning Breakfast & Coffee:',
            'Main Celebration Lunch / Dinner:',
            'Desserts & Pastries:',
            'Dishes to Share with Neighbors:'
          ]
        },
        {
          title: 'Family Visits & Calls to Make',
          items: []
        }
      ]
    },
    {
      title: 'Post-30-Day Spiritual Continuation Plan',
      sub: 'Carry the light and discipline of these 30 days into the rest of your year',
      type: 'quad',
      boxes: [
        {
          title: 'Top 3 Habits I Will Never Drop',
          items: [
            '1. Daily Prayer Commitment:',
            '2. Daily Quran / Scripture Minimum:',
            '3. Daily Dhikr & Gratitude Habit:',
            'Weekly Check-In Day:'
          ]
        },
        {
          title: 'Voluntary Fasting & Worship Plan',
          items: [
            '6 Days of Shawwal Fasting Tracker',
            'Mondays & Thursdays Voluntary Fast',
            'White Days (13th, 14th, 15th of Lunar Month)',
            'Friday Surah Al-Kahf & Salawat Routine'
          ]
        },
        {
          title: 'Biggest Heart Transformations',
          items: [
            'What changed in my relationship with prayer:',
            'What changed in my relationship with Quran:',
            'A negative habit I successfully left behind:',
            'What I am most grateful for after 30 days:'
          ]
        },
        {
          title: 'Letter to My Future Self',
          items: []
        }
      ]
    }
  ];

  closingPages.forEach((spec, idx) => {
    const pageNum = 25 + idx;
    doc.addPage({ size: 'A4', margin: 0 });
    drawPageChrome(doc, theme, plannerTitle, spec.title, spec.sub, pageNum, totalPages);
    if (spec.type === 'table') {
      const endY = drawTable(doc, theme, MARGIN, 96, spec.widths, spec.headers, spec.rows.length, 28, spec.rows, false);
      drawNotesBlock(doc, theme, MARGIN, endY + 16, CONTENT_W, PAGE_H - 60 - (endY + 16), 'Heart Reflections & Notes');
    } else if (spec.type === 'quad') {
      drawFourQuadrantMatrix(doc, theme, 96, spec.boxes);
      drawNotesBlock(doc, theme, MARGIN, 738, CONTENT_W, 50, 'Closing Prayer & Commitment');
    }
  });

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

async function generateAll() {
  const themeKeys = Object.keys(THEMES);
  const generated = [];

  for (const tk of themeKeys) {
    generated.push(await buildHomeDeclutterBinder(tk));
    generated.push(await buildUltimateTravelPlanner(tk));
    generated.push(await buildFamilyCommandCenter(tk));
    generated.push(await buildWeddingMasterPlanner(tk));
    generated.push(await buildSpiritualReflectionPlanner(tk));
  }

  console.log(`Successfully generated ${generated.length} lifestyle PDF planners:`);
  generated.forEach((fp) => {
    const stats = fs.statSync(fp);
    console.log(` - ${path.basename(fp)} (${(stats.size / 1024).toFixed(1)} KB)`);
  });
}

generateAll().catch((err) => {
  console.error('Error generating lifestyle PDF planners:', err);
  process.exit(1);
});
