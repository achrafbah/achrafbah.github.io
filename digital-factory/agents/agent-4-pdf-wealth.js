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
    name: 'ocean',
    label: 'OCEAN EDITION',
    primary: '#0284c7',
    primaryDark: '#0369a1',
    primaryLight: '#e0f2fe',
    accent: '#38bdf8',
    surface: '#f8fafc',
    border: '#cbd5e1',
    text: '#0f172a',
    muted: '#64748b'
  },
  sage: {
    name: 'sage',
    label: 'SAGE EDITION',
    primary: '#0f9d58',
    primaryDark: '#0b8043',
    primaryLight: '#e6f4ea',
    accent: '#34a853',
    surface: '#f8faf9',
    border: '#cbd5e1',
    text: '#0f172a',
    muted: '#64748b'
  },
  rose: {
    name: 'rose',
    label: 'ROSE EDITION',
    primary: '#e11d48',
    primaryDark: '#be123c',
    primaryLight: '#ffe4e6',
    accent: '#fb7185',
    surface: '#fffbfc',
    border: '#cbd5e1',
    text: '#0f172a',
    muted: '#64748b'
  }
};

// Vector UI Helpers
function drawPageChrome(doc, theme, plannerTitle, pageTitle, pageNum, totalPages) {
  // Top header accent strip
  doc.rect(0, 0, 612, 8).fill(theme.primary);

  // Header Banner
  doc.rect(36, 22, 540, 40).fill(theme.surface).stroke(theme.border);
  doc.rect(36, 22, 6, 40).fill(theme.primary);

  doc
    .font('Helvetica-Bold')
    .fontSize(13)
    .fillColor(theme.text)
    .text(pageTitle.toUpperCase(), 52, 31, { width: 350, lineBreak: false });

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(theme.muted)
    .text(plannerTitle + '  |  ' + theme.label, 52, 47, { width: 350, lineBreak: false });

  // Date / Period Box in header right
  doc.roundedRect(435, 29, 130, 26, 3).fill('#ffffff').stroke(theme.border);
  doc
    .font('Helvetica-Bold')
    .fontSize(7.5)
    .fillColor(theme.muted)
    .text('DATE / PERIOD:', 442, 38, { lineBreak: false });

  // Footer
  doc
    .moveTo(36, 752)
    .lineTo(576, 752)
    .lineWidth(0.75)
    .strokeColor(theme.border)
    .stroke();

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(theme.muted)
    .text('Personal Finance, Side Hustle & Wealth Systems', 36, 760, { lineBreak: false });

  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(theme.primaryDark)
    .text(`Page ${pageNum} of ${totalPages}`, 476, 760, { width: 100, align: 'right', lineBreak: false });
}

function drawCoverPage(doc, theme, title, subtitle, tagline, totalPages, pillars) {
  // Full background border accent
  doc.rect(0, 0, 612, 792).fill('#ffffff');
  doc.rect(0, 0, 24, 792).fill(theme.primary);
  doc.rect(24, 0, 6, 792).fill(theme.accent);

  // Top badge
  doc.roundedRect(64, 64, 175, 24, 12).fill(theme.primaryLight);
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(theme.primaryDark)
    .text(`WEALTH ARCHITECT  •  ${theme.label}`, 78, 72, { lineBreak: false });

  // Main Title
  doc
    .font('Helvetica-Bold')
    .fontSize(30)
    .fillColor(theme.text)
    .text(title, 64, 118, { width: 470 });

  const afterTitleY = doc.y + 8;
  doc
    .font('Helvetica')
    .fontSize(13)
    .fillColor(theme.muted)
    .text(subtitle, 64, afterTitleY, { width: 460 });

  // Decorative divider
  doc.rect(64, afterTitleY + 42, 90, 4).fill(theme.primary);

  // Executive Overview Box
  const cardY = afterTitleY + 68;
  doc.roundedRect(64, cardY, 480, 210, 6).fill(theme.surface).stroke(theme.border);
  doc.rect(64, cardY, 480, 28).fill(theme.primary);
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('#ffffff')
    .text('FRAMEWORK PILLARS & INCLUDED MODULES', 78, cardY + 9, { lineBreak: false });

  pillars.forEach((p, idx) => {
    const py = cardY + 42 + idx * 32;
    doc.circle(84, py + 6, 5).fill(theme.primaryLight).stroke(theme.primary);
    doc.circle(84, py + 6, 2).fill(theme.primary);
    doc
      .font('Helvetica-Bold')
      .fontSize(9.5)
      .fillColor(theme.text)
      .text(p.title, 98, py + 1, { lineBreak: false });
    doc
      .font('Helvetica')
      .fontSize(8.5)
      .fillColor(theme.muted)
      .text(p.desc, 98, py + 13, { width: 430, lineBreak: false });
  });

  // Owner / Goal Metadata Card
  const metaY = 530;
  doc.roundedRect(64, metaY, 480, 155, 6).fill('#ffffff').stroke(theme.border);
  doc
    .font('Helvetica-Bold')
    .fontSize(9.5)
    .fillColor(theme.primaryDark)
    .text('PLANNER OWNERSHIP & PRIMARY WEALTH COMMITMENT', 80, metaY + 16, { lineBreak: false });

  const fields = [
    'OWNER / HOUSEHOLD NAME:',
    'START DATE & TARGET CYCLE:',
    'PRIMARY #1 FINANCIAL GOAL:',
    'REWARD WHEN TARGET IS HIT:'
  ];

  fields.forEach((f, i) => {
    const fy = metaY + 42 + i * 26;
    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .fillColor(theme.muted)
      .text(f, 80, fy, { lineBreak: false });
    doc
      .moveTo(230, fy + 10)
      .lineTo(525, fy + 10)
      .lineWidth(0.75)
      .strokeColor(theme.border)
      .stroke();
  });

  // Footer
  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor(theme.muted)
    .text(`${tagline}  •  ${totalPages}-Page Vector Printable & Digital Edition`, 64, 745, {
      lineBreak: false
    });
}

function drawKpiRow(doc, theme, x, y, width, cards) {
  const gap = 10;
  const cardW = (width - gap * (cards.length - 1)) / cards.length;
  cards.forEach((c, idx) => {
    const cx = x + idx * (cardW + gap);
    doc.roundedRect(cx, y, cardW, 50, 4).fill(theme.surface).stroke(theme.border);
    doc.rect(cx, y, cardW, 4).fill(idx % 2 === 0 ? theme.primary : theme.accent);
    doc
      .font('Helvetica-Bold')
      .fontSize(7.5)
      .fillColor(theme.muted)
      .text(c.label.toUpperCase(), cx + 8, y + 10, { width: cardW - 16, lineBreak: false });
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .fillColor(theme.text)
      .text(c.placeholder || '$ ____________', cx + 8, y + 27, { width: cardW - 16, lineBreak: false });
  });
  return y + 60;
}

function drawTable(doc, theme, x, y, columns, rowsCount, rowHeight = 20, options = {}) {
  const totalW = columns.reduce((acc, c) => acc + c.width, 0);
  // Header
  doc.rect(x, y, totalW, 22).fill(theme.primary);
  let colX = x;
  columns.forEach((col) => {
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor('#ffffff')
      .text(col.header, colX + 6, y + 7, {
        width: col.width - 12,
        align: col.align || 'left',
        lineBreak: false
      });
    colX += col.width;
  });

  let curY = y + 22;
  for (let r = 0; r < rowsCount; r++) {
    const bg = r % 2 === 1 ? theme.surface : '#ffffff';
    doc.rect(x, curY, totalW, rowHeight).fill(bg).stroke(theme.border);

    let cellX = x;
    columns.forEach((col, cIdx) => {
      if (cIdx > 0) {
        doc
          .moveTo(cellX, curY)
          .lineTo(cellX, curY + rowHeight)
          .lineWidth(0.5)
          .strokeColor(theme.border)
          .stroke();
      }
      if (col.type === 'checkbox') {
        doc
          .roundedRect(cellX + col.width / 2 - 5, curY + rowHeight / 2 - 5, 10, 10, 2)
          .lineWidth(0.8)
          .strokeColor(theme.primary)
          .stroke();
      } else if (col.type === 'progress') {
        const barW = col.width - 16;
        doc
          .roundedRect(cellX + 8, curY + rowHeight / 2 - 4, barW, 8, 4)
          .fill('#ffffff')
          .stroke(theme.border);
        for (let tick = 1; tick < 4; tick++) {
          doc
            .moveTo(cellX + 8 + (barW * tick) / 4, curY + rowHeight / 2 - 4)
            .lineTo(cellX + 8 + (barW * tick) / 4, curY + rowHeight / 2 + 4)
            .lineWidth(0.4)
            .strokeColor(theme.border)
            .stroke();
        }
      } else if (options.prefill && options.prefill[r] && options.prefill[r][cIdx]) {
        doc
          .font('Helvetica')
          .fontSize(8)
          .fillColor(theme.text)
          .text(options.prefill[r][cIdx], cellX + 6, curY + (rowHeight - 8) / 2, {
            width: col.width - 12,
            align: col.align || 'left',
            lineBreak: false
          });
      }
      cellX += col.width;
    });
    curY += rowHeight;
  }

  if (options.showTotal) {
    doc.rect(x, curY, totalW, 22).fill(theme.primaryLight).stroke(theme.primary);
    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .fillColor(theme.primaryDark)
      .text(options.totalLabel || 'TOTAL', x + 8, curY + 7, { lineBreak: false });
    curY += 22;
  }

  return curY + 10;
}

function drawZeroBalanceCheckBar(doc, theme, x, y, width) {
  doc.roundedRect(x, y, width, 46, 5).fill(theme.primaryLight).stroke(theme.primary);
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(theme.primaryDark)
    .text('ZERO-BASED EQUATION CHECK:  TOTAL INCOME  -  TOTAL OUTFLOWS  =  $0.00', x + 12, y + 8, {
      lineBreak: false
    });
  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor(theme.text)
    .text(
      'Income: $___________   -   Outflows (Bills + Envelopes + Sinking + Debt/Invest): $___________   =   Unassigned: $ 0.00',
      x + 12,
      y + 25,
      { lineBreak: false }
    );
  return y + 56;
}

function drawThermometer(doc, theme, x, y, width, height, title) {
  doc.roundedRect(x, y, width, height, 6).fill(theme.surface).stroke(theme.border);
  doc.rect(x, y, width, 24).fill(theme.primary);
  doc
    .font('Helvetica-Bold')
    .fontSize(8.5)
    .fillColor('#ffffff')
    .text(title, x + 10, y + 8, { lineBreak: false });

  const milestones = ['100% PAID OFF!', '75% Milestone', '50% Halfway', '25% Momentum', '0% Starting Line'];
  const barX = x + 28;
  const barTop = y + 40;
  const barH = height - 60;
  doc.roundedRect(barX, barTop, 26, barH, 13).fill('#ffffff').stroke(theme.primary);

  milestones.forEach((m, idx) => {
    const my = barTop + (idx * (barH - 16)) / (milestones.length - 1);
    doc
      .moveTo(barX, my + 6)
      .lineTo(barX + 26, my + 6)
      .lineWidth(0.75)
      .strokeColor(theme.primary)
      .stroke();
    doc
      .font('Helvetica-Bold')
      .fontSize(7.5)
      .fillColor(theme.text)
      .text(m, barX + 36, my + 2, { lineBreak: false });
    doc
      .font('Helvetica')
      .fontSize(7)
      .fillColor(theme.muted)
      .text('Date: ________  Bal: $________', barX + 108, my + 2, { lineBreak: false });
  });
}

// ============================================================================
// 1. ZERO-BASED BUDGET BINDER (16 Pages)
// ============================================================================
function buildZeroBasedBudgetBinder(theme) {
  const filename = path.join(OUTPUT_DIR, `Zero-Based-Budget-Binder_${theme.name}.pdf`);
  const doc = new PDFDocument({ size: 'LETTER', margin: 0, bufferPages: true });
  const stream = fs.createWriteStream(filename);
  doc.pipe(stream);

  const TOTAL = 16;
  const TITLE = 'Zero-Based Budget Binder';

  // Page 1: Cover
  drawCoverPage(
    doc,
    theme,
    'ZERO-BASED BUDGET BINDER',
    'Every Dollar Assigned Framework: Income Sources, Fixed Bills, Variable Cash Envelopes, Sinking Funds & Zero-Balance Check',
    'Complete 16-Page Financial Architecture',
    TOTAL,
    [
      {
        title: '1. Every Dollar Assigned Architecture',
        desc: 'Give every single dollar a deliberate job before the month begins so zero money leaks to impulse.'
      },
      {
        title: '2. Multi-Stream Income & Paycheck Allocation',
        desc: 'Map W-2 paychecks, side hustle payouts, dividends, and irregular income streams with clarity.'
      },
      {
        title: '3. Fixed Bills & Variable Cash Envelopes',
        desc: 'Separate non-negotiable fixed overheads from controllable daily variable envelope categories.'
      },
      {
        title: '4. Sinking Funds & Zero-Balance Verification',
        desc: 'Fund future expenses monthly and verify Income minus Outflows equals exactly $0.00.'
      },
      {
        title: '5. Weekly Check-Ins & End-of-Month Audit',
        desc: 'Track real-time burn rate every 7 days and reconcile variances for continuous wealth compounding.'
      }
    ]
  );

  const pageSpecs = [
    {
      title: 'Annual Zero-Based Financial Master Map',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Projected Annual Income' },
          { label: 'Annual Fixed Overhead' },
          { label: 'Annual Savings & Sinking' },
          { label: 'Target Net Worth Delta' }
        ]);
        y = drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'MONTH', width: 90 },
            { header: 'EST. INCOME', width: 90 },
            { header: 'FIXED BILLS', width: 90 },
            { header: 'ENVELOPES', width: 90 },
            { header: 'SINKING / INVEST', width: 95 },
            { header: 'ZERO CHECK', width: 85, type: 'checkbox' }
          ],
          12,
          22,
          {
            showTotal: true,
            totalLabel: 'ANNUAL CUMULATIVE TOTALS',
            prefill: [
              ['January'],
              ['February'],
              ['March'],
              ['April'],
              ['May'],
              ['June'],
              ['July'],
              ['August'],
              ['September'],
              ['October'],
              ['November'],
              ['December']
            ]
          }
        );
        drawZeroBalanceCheckBar(doc, theme, 36, y + 6, 540);
      }
    },
    {
      title: 'Income Sources & Paycheck Breakdown Matrix',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Primary W-2 / Salary' },
          { label: 'Partner / 2nd Stream' },
          { label: 'Side Hustle / Freelance' },
          { label: 'Total Monthly Inflow' }
        ]);
        y = drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'PAY DATE', width: 75 },
            { header: 'INCOME SOURCE / PAYER', width: 175 },
            { header: 'GROSS PAY', width: 85 },
            { header: 'TAX / DEDUCT', width: 85 },
            { header: 'NET DEPOSIT', width: 120 }
          ],
          10,
          21,
          { showTotal: true, totalLabel: 'TOTAL MONTHLY NET INCOME (ASSIGN TO $0.00)' }
        );
        drawTable(
          doc,
          theme,
          36,
          y + 8,
          [
            { header: 'IRREGULAR / BONUS / DIVIDEND SOURCE', width: 250 },
            { header: 'EXPECTED DATE', width: 110 },
            { header: 'NET AMOUNT', width: 100 },
            { header: 'ASSIGNED BUCKET', width: 80 }
          ],
          6,
          21,
          { showTotal: true, totalLabel: 'TOTAL VARIABLE INFLOWS' }
        );
      }
    },
    {
      title: 'Monthly Master Zero-Based Budget Command',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Total Net Income (+)' },
          { label: 'Total Planned Outflow (-)' },
          { label: 'Total Actual Outflow (-)' },
          { label: 'Unassigned Balance ($0)', placeholder: '$ 0.00' }
        ]);
        y = drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'MASTER CATEGORY BUCKET', width: 190 },
            { header: '% TARGET', width: 70 },
            { header: 'BUDGETED ($)', width: 95 },
            { header: 'ACTUAL ($)', width: 95 },
            { header: 'VARIANCE ($)', width: 90 }
          ],
          12,
          20,
          {
            showTotal: true,
            totalLabel: 'TOTAL MONTHLY ALLOCATION',
            prefill: [
              ['1. Housing & Utilities (Fixed)', '25-30%'],
              ['2. Transportation & Auto (Fixed)', '10-12%'],
              ['3. Insurance & Healthcare (Fixed)', '5-10%'],
              ['4. Groceries & Household (Envelope)', '10-12%'],
              ['5. Dining & Lifestyle (Envelope)', '5-8%'],
              ['6. Personal Care & Kids (Envelope)', '5%'],
              ['7. Sinking Funds (Future Buckets)', '8-10%'],
              ['8. High-Interest Debt Paydown', '10-15%'],
              ['9. Emergency Fund Reserve', '5-10%'],
              ['10. Retirement & Index Investing', '15%+'],
              ['11. Giving & Charity', '5-10%'],
              ['12. Buffer / Miscellaneous Roll-over', '1-2%']
            ]
          }
        );
        drawZeroBalanceCheckBar(doc, theme, 36, y + 4, 540);
      }
    },
    {
      title: 'Fixed Bills & Non-Negotiable Overheads',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: '1st-15th Fixed Bills' },
          { label: '16th-31st Fixed Bills' },
          { label: 'Autopay Verified Count' },
          { label: 'Total Fixed Bills' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'BILL / VENDOR NAME', width: 175 },
            { header: 'DUE DAY', width: 60 },
            { header: 'AUTOPAY', width: 60, type: 'checkbox' },
            { header: 'BUDGETED', width: 90 },
            { header: 'ACTUAL PAID', width: 90 },
            { header: 'PAID', width: 65, type: 'checkbox' }
          ],
          22,
          21,
          {
            showTotal: true,
            totalLabel: 'TOTAL FIXED BILLS OVERHEAD',
            prefill: [
              ['Mortgage / Rent Payment'],
              ['Electric & Gas Utility'],
              ['Water, Sewer & Trash'],
              ['High-Speed Fiber Internet'],
              ['Mobile Phone Plan'],
              ['Auto Insurance Policy'],
              ['Health / Term Life Insurance'],
              ['Childcare / Tuition'],
              ['Gym / Fitness Membership'],
              ['Cloud Storage / Core Software']
            ]
          }
        );
      }
    },
    {
      title: 'Subscription & Recurring Charge Audit',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Active Subscriptions' },
          { label: 'Monthly Burn Rate' },
          { label: 'Annualized Drain (x12)' },
          { label: 'Reclaimed via Cancels' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'SUBSCRIPTION / APP SERVICE', width: 170 },
            { header: 'CYCLE', width: 65 },
            { header: 'COST / MO', width: 75 },
            { header: 'ANNUAL COST', width: 85 },
            { header: 'VALUE (1-5)', width: 70 },
            { header: 'CANCEL?', width: 75, type: 'checkbox' }
          ],
          22,
          21,
          { showTotal: true, totalLabel: 'TOTAL RECURRING SUBSCRIPTION COMMITMENT' }
        );
      }
    },
    {
      title: 'Variable Cash Envelopes: Master Allocation',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Total Envelope Funding' },
          { label: 'Total Spent Month-to-Date' },
          { label: 'Remaining Envelope Cash' },
          { label: 'Rollover to Sinking/Debt' }
        ]);
        y = drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'CASH ENVELOPE CATEGORY', width: 165 },
            { header: 'STARTING ($)', width: 85 },
            { header: 'SPENT ($)', width: 85 },
            { header: 'REMAINING ($)', width: 85 },
            { header: 'BURN RATE PROGRESS', width: 120, type: 'progress' }
          ],
          14,
          23,
          {
            showTotal: true,
            totalLabel: 'TOTAL VARIABLE CASH ENVELOPES',
            prefill: [
              ['Groceries & Supermarket'],
              ['Household & Cleaning Supplies'],
              ['Fuel, Transit & Parking'],
              ['Restaurants & Takeout'],
              ['Coffee Shops & Quick Treats'],
              ['Personal Care & Grooming'],
              ['Clothing & Apparel'],
              ['Kids Activities & Allowances'],
              ['Pet Food & Vet Care'],
              ['Entertainment & Date Nights'],
              ['Health, Pharmacy & Vitamins'],
              ['Gifts & Hospitality'],
              ['Fun Money — Partner A'],
              ['Fun Money — Partner B']
            ]
          }
        );
        drawZeroBalanceCheckBar(doc, theme, 36, y + 6, 540);
      }
    },
    {
      title: 'Variable Cash Envelopes: Daily Burn Ledger',
      render: () => {
        const envBoxes = [
          'ENVELOPE 1: GROCERIES & SUPERMARKET',
          'ENVELOPE 2: DINING OUT & COFFEE',
          'ENVELOPE 3: FUEL & COMMUTE',
          'ENVELOPE 4: PERSONAL / FUN MONEY'
        ];
        envBoxes.forEach((boxTitle, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const bx = 36 + col * 276;
          const by = 78 + row * 330;
          doc.roundedRect(bx, by, 264, 316, 4).fill('#ffffff').stroke(theme.border);
          doc.rect(bx, by, 264, 22).fill(theme.primary);
          doc
            .font('Helvetica-Bold')
            .fontSize(8)
            .fillColor('#ffffff')
            .text(boxTitle, bx + 8, by + 7, { lineBreak: false });
          doc
            .font('Helvetica-Bold')
            .fontSize(7.5)
            .fillColor(theme.primaryDark)
            .text('Starting Budget: $___________', bx + 8, by + 28, { lineBreak: false });

          drawTable(
            doc,
            theme,
            bx + 6,
            by + 42,
            [
              { header: 'DATE', width: 45 },
              { header: 'MERCHANT / ITEM', width: 115 },
              { header: 'SPENT', width: 46 },
              { header: 'BAL', width: 46 }
            ],
            11,
            21
          );
        });
      }
    },
    {
      title: 'Sinking Funds & Future Expense Buckets',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Monthly Sinking Deposit' },
          { label: 'Total Sinking Balance' },
          { label: 'Upcoming 90-Day Expense' },
          { label: 'HYSA Interest Earned' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'SINKING FUND BUCKET', width: 155 },
            { header: 'TARGET ($)', width: 75 },
            { header: 'START BAL', width: 75 },
            { header: '+ ADDED', width: 75 },
            { header: '- SPENT', width: 75 },
            { header: 'END BAL', width: 85 }
          ],
          20,
          22,
          {
            showTotal: true,
            totalLabel: 'TOTAL SINKING FUNDS ALLOCATION',
            prefill: [
              ['Car Maintenance & Tires'],
              ['Annual Auto Registration / Ins.'],
              ['Home Repairs & Appliances'],
              ['Medical, Dental & Optical'],
              ['Holiday & Christmas Gifts'],
              ['Birthdays & Anniversaries'],
              ['Annual Software / Prime / Memberships'],
              ['Vacation & Travel Fund'],
              ['Back-to-School & Kids Gear'],
              ['Property / Quarterly Taxes'],
              ['Veterinary Emergency Buffer'],
              ['Tech Replacement (Laptop/Phone)']
            ]
          }
        );
      }
    },
    {
      title: 'Debt Paydown & Wealth Investing Allocation',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Extra Debt Snowball ($)' },
          { label: 'Emergency Fund Add ($)' },
          { label: 'Retirement / 401k / IRA' },
          { label: 'Taxable Brokerage ($)' }
        ]);
        y = drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'WEALTH / SAVINGS / INVESTMENT VEHICLE', width: 210 },
            { header: 'ACCOUNT', width: 95 },
            { header: 'PLANNED ($)', width: 85 },
            { header: 'ACTUAL ($)', width: 85 },
            { header: 'DONE', width: 65, type: 'checkbox' }
          ],
          10,
          21,
          {
            showTotal: true,
            totalLabel: 'TOTAL WEALTH BUILDING TRANSFERS',
            prefill: [
              ['High-Yield Emergency Reserve (3-6 Mo)'],
              ['Roth IRA / Backdoor Roth Contribution'],
              ['401(k) / 403(b) Employer Match + Extra'],
              ['HSA Triple-Tax-Advantaged Account'],
              ['Low-Cost S&P 500 / Total Market Index'],
              ['529 Education / Custodial UTMA']
            ]
          }
        );
        drawTable(
          doc,
          theme,
          36,
          y + 8,
          [
            { header: 'CREDITOR / DEBT ACCOUNT', width: 210 },
            { header: 'MIN PAYMENT', width: 95 },
            { header: 'EXTRA SNOWBALL', width: 85 },
            { header: 'NEW BALANCE', width: 85 },
            { header: 'PAID', width: 65, type: 'checkbox' }
          ],
          8,
          21,
          { showTotal: true, totalLabel: 'TOTAL DEBT ELIMINATION PAYMENTS' }
        );
      }
    },
    {
      title: 'Paycheck #1 & #2 Zero-Balance Split Worksheet',
      render: () => {
        [0, 1].forEach((idx) => {
          const bx = 36 + idx * 276;
          const by = 74;
          doc.roundedRect(bx, by, 264, 595, 4).fill('#ffffff').stroke(theme.border);
          doc.rect(bx, by, 264, 24).fill(theme.primary);
          doc
            .font('Helvetica-Bold')
            .fontSize(8.5)
            .fillColor('#ffffff')
            .text(`PAYCHECK #${idx + 1} ALLOCATION SHEET`, bx + 10, by + 8, { lineBreak: false });
          doc
            .font('Helvetica-Bold')
            .fontSize(8)
            .fillColor(theme.text)
            .text('Pay Date: __________   Net Deposit: $___________', bx + 10, by + 32, { lineBreak: false });

          drawTable(
            doc,
            theme,
            bx + 6,
            by + 48,
            [
              { header: 'ASSIGNED JOB / BILL / ENVELOPE', width: 152 },
              { header: 'AMOUNT', width: 60 },
              { header: 'DONE', width: 40, type: 'checkbox' }
            ],
            22,
            21,
            { showTotal: true, totalLabel: 'UNASSIGNED = $0.00' }
          );
        });
        drawZeroBalanceCheckBar(doc, theme, 36, 682, 540);
      }
    },
    {
      title: 'Paycheck #3, #4 & Side Hustle Split Worksheet',
      render: () => {
        [0, 1].forEach((idx) => {
          const bx = 36 + idx * 276;
          const by = 74;
          const label = idx === 0 ? 'PAYCHECK #3 ALLOCATION SHEET' : 'PAYCHECK #4 / SIDE HUSTLE SHEET';
          doc.roundedRect(bx, by, 264, 595, 4).fill('#ffffff').stroke(theme.border);
          doc.rect(bx, by, 264, 24).fill(theme.primary);
          doc
            .font('Helvetica-Bold')
            .fontSize(8.5)
            .fillColor('#ffffff')
            .text(label, bx + 10, by + 8, { lineBreak: false });
          doc
            .font('Helvetica-Bold')
            .fontSize(8)
            .fillColor(theme.text)
            .text('Pay Date: __________   Net Deposit: $___________', bx + 10, by + 32, { lineBreak: false });

          drawTable(
            doc,
            theme,
            bx + 6,
            by + 48,
            [
              { header: 'ASSIGNED JOB / BILL / ENVELOPE', width: 152 },
              { header: 'AMOUNT', width: 60 },
              { header: 'DONE', width: 40, type: 'checkbox' }
            ],
            22,
            21,
            { showTotal: true, totalLabel: 'UNASSIGNED = $0.00' }
          );
        });
        drawZeroBalanceCheckBar(doc, theme, 36, 682, 540);
      }
    },
    {
      title: 'Weekly Expense Ledger: Weeks 1 & 2',
      render: () => {
        let y = drawTable(
          doc,
          theme,
          36,
          74,
          [
            { header: 'DATE', width: 60 },
            { header: 'WEEK 1 — MERCHANT / DESCRIPTION', width: 225 },
            { header: 'ENVELOPE / CATEGORY', width: 130 },
            { header: 'AMOUNT ($)', width: 75 },
            { header: 'TRACKED', width: 50, type: 'checkbox' }
          ],
          12,
          21,
          { showTotal: true, totalLabel: 'WEEK 1 TOTAL SPEND' }
        );
        drawTable(
          doc,
          theme,
          36,
          y + 8,
          [
            { header: 'DATE', width: 60 },
            { header: 'WEEK 2 — MERCHANT / DESCRIPTION', width: 225 },
            { header: 'ENVELOPE / CATEGORY', width: 130 },
            { header: 'AMOUNT ($)', width: 75 },
            { header: 'TRACKED', width: 50, type: 'checkbox' }
          ],
          12,
          21,
          { showTotal: true, totalLabel: 'WEEK 2 TOTAL SPEND' }
        );
      }
    },
    {
      title: 'Weekly Expense Ledger: Weeks 3 & 4',
      render: () => {
        let y = drawTable(
          doc,
          theme,
          36,
          74,
          [
            { header: 'DATE', width: 60 },
            { header: 'WEEK 3 — MERCHANT / DESCRIPTION', width: 225 },
            { header: 'ENVELOPE / CATEGORY', width: 130 },
            { header: 'AMOUNT ($)', width: 75 },
            { header: 'TRACKED', width: 50, type: 'checkbox' }
          ],
          12,
          21,
          { showTotal: true, totalLabel: 'WEEK 3 TOTAL SPEND' }
        );
        drawTable(
          doc,
          theme,
          36,
          y + 8,
          [
            { header: 'DATE', width: 60 },
            { header: 'WEEK 4 — MERCHANT / DESCRIPTION', width: 225 },
            { header: 'ENVELOPE / CATEGORY', width: 130 },
            { header: 'AMOUNT ($)', width: 75 },
            { header: 'TRACKED', width: 50, type: 'checkbox' }
          ],
          12,
          21,
          { showTotal: true, totalLabel: 'WEEK 4 TOTAL SPEND' }
        );
      }
    },
    {
      title: 'Zero-Balance Verification & Rollover Audit',
      render: () => {
        let y = drawZeroBalanceCheckBar(doc, theme, 36, 74, 540);
        y = drawTable(
          doc,
          theme,
          36,
          y + 4,
          [
            { header: 'ZERO-BALANCE VERIFICATION CHECKLIST', width: 350 },
            { header: 'AMOUNT ($)', width: 110 },
            { header: 'VERIFIED', width: 80, type: 'checkbox' }
          ],
          10,
          22,
          {
            prefill: [
              ['1. All Checking & Cash Deposits Reconciled'],
              ['2. Fixed Bills Paid & Cleared Bank Statement'],
              ['3. Variable Cash Envelopes Counted & Tallied'],
              ['4. Sinking Fund Transfers Executed to HYSA'],
              ['5. Extra Debt Snowball Payment Submitted'],
              ['6. Retirement & Brokerage Auto-Drafts Confirmed'],
              ['7. Leftover Envelope Surplus Swept to Goal'],
              ['8. Final Unassigned Balance Equals Exactly $0.00']
            ]
          }
        );
        drawTable(
          doc,
          theme,
          36,
          y + 8,
          [
            { header: 'CATEGORY WITH SURPLUS OR OVERAGE', width: 230 },
            { header: 'VARIANCE (+/-)', width: 110 },
            { header: 'REASSIGNED TO / COVERED FROM', width: 200 }
          ],
          9,
          22,
          { showTotal: true, totalLabel: 'NET VARIANCE ADJUSTMENT = $0.00' }
        );
      }
    },
    {
      title: 'Monthly Budget Retrospective & Next Month Reset',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Savings Rate (%)' },
          { label: 'Debt Paid Off ($)' },
          { label: 'Net Worth Change (+)' },
          { label: 'Zero-Based Grade (A-F)' }
        ]);
        const prompts = [
          '1. TOP 3 FINANCIAL WINS THIS MONTH:',
          '2. BIGGEST BUDGET LEAKS OR UNEXPECTED EXPENSES TO ANTICIPATE:',
          '3. CATEGORIES TO ADJUST UP OR DOWN FOR NEXT MONTH:',
          '4. NEXT MONTH NON-NEGOTIABLE #1 MONEY PRIORITY:'
        ];
        prompts.forEach((p, idx) => {
          const py = y + idx * 145;
          doc.roundedRect(36, py, 540, 132, 5).fill('#ffffff').stroke(theme.border);
          doc.rect(36, py, 540, 22).fill(theme.primaryLight);
          doc
            .font('Helvetica-Bold')
            .fontSize(8.5)
            .fillColor(theme.primaryDark)
            .text(p, 46, py + 7, { lineBreak: false });
          for (let l = 1; l <= 4; l++) {
            doc
              .moveTo(46, py + 24 + l * 23)
              .lineTo(564, py + 24 + l * 23)
              .lineWidth(0.5)
              .strokeColor(theme.border)
              .stroke();
          }
        });
      }
    }
  ];

  pageSpecs.forEach((spec, idx) => {
    doc.addPage();
    drawPageChrome(doc, theme, TITLE, spec.title, idx + 2, TOTAL);
    spec.render();
  });

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filename));
    stream.on('error', reject);
  });
}

// ============================================================================
// 2. DEBT SNOWBALL TRACKER (14 Pages)
// ============================================================================
function buildDebtSnowballTracker(theme) {
  const filename = path.join(OUTPUT_DIR, `Debt-Snowball-Tracker_${theme.name}.pdf`);
  const doc = new PDFDocument({ size: 'LETTER', margin: 0, bufferPages: true });
  const stream = fs.createWriteStream(filename);
  doc.pipe(stream);

  const TOTAL = 14;
  const TITLE = 'Debt Snowball & Payoff Tracker';

  drawCoverPage(
    doc,
    theme,
    'DEBT SNOWBALL TRACKER',
    'Debt Inventory Table (Smallest to Largest Balance & Highest APR), Monthly Payoff Thermometer & Extra Payment Accelerator Log',
    'Complete 14-Page Debt Elimination System',
    TOTAL,
    [
      {
        title: '1. Complete Debt Inventory & Ranking Matrix',
        desc: 'List every liability with exact balance, APR, minimum payment, and due date for total clarity.'
      },
      {
        title: '2. Snowball (Smallest Balance) vs. Avalanche (Highest APR)',
        desc: 'Compare psychological quick-wins against mathematical interest savings and lock in your attack order.'
      },
      {
        title: '3. Visual Monthly Payoff Thermometer',
        desc: 'Color in milestone markers as each balance drops from 100% down to $0.00 Debt-Free.'
      },
      {
        title: '4. Extra Payment Accelerator & Rollover Compounder',
        desc: 'Roll every eliminated minimum payment directly into the next target debt for exponential payoff speed.'
      },
      {
        title: '5. Debt-Free Countdown & Wealth Redirect Blueprint',
        desc: 'Convert former debt payments immediately into high-yield savings and index fund wealth.'
      }
    ]
  );

  const pageSpecs = [
    {
      title: 'Master Debt Inventory Table (All Liabilities)',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Total Starting Debt ($)' },
          { label: 'Total Minimums / Mo ($)' },
          { label: 'Weighted Average APR (%)' },
          { label: 'Target Debt-Free Date' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'RANK', width: 40 },
            { header: 'CREDITOR / ACCOUNT NAME', width: 170 },
            { header: 'DEBT TYPE', width: 75 },
            { header: 'STARTING BAL', width: 85 },
            { header: 'APR %', width: 55 },
            { header: 'MIN PAY', width: 65 },
            { header: 'DUE DAY', width: 50 }
          ],
          22,
          21,
          { showTotal: true, totalLabel: 'TOTAL STARTING DEBT & MINIMUM OBLIGATION' }
        );
      }
    },
    {
      title: 'Snowball Order Queue (Smallest to Largest Balance)',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Target #1 Balance ($)' },
          { label: 'Initial Extra Snowball ($)' },
          { label: 'Total Monthly Attack ($)' },
          { label: 'Est. First Win Date' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'ORDER', width: 45 },
            { header: 'CREDITOR (SMALLEST TO LARGEST)', width: 165 },
            { header: 'BALANCE ($)', width: 80 },
            { header: 'MIN PAY', width: 70 },
            { header: '+ ROLLOVER SNOWBALL', width: 110 },
            { header: 'CRUSHED', width: 70, type: 'checkbox' }
          ],
          22,
          21,
          {
            showTotal: true,
            totalLabel: 'TOTAL SNOWBALL VELOCITY',
            prefill: Array.from({ length: 22 }, (_, i) => [`#${i + 1}`])
          }
        );
      }
    },
    {
      title: 'Avalanche Comparison Queue (Highest to Lowest APR)',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Highest APR Rate (%)' },
          { label: 'Monthly Interest Bleed ($)' },
          { label: 'Est. Interest Saved ($)' },
          { label: 'Selected Strategy' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'ORDER', width: 45 },
            { header: 'CREDITOR (HIGHEST TO LOWEST APR)', width: 165 },
            { header: 'APR (%)', width: 65 },
            { header: 'BALANCE ($)', width: 85 },
            { header: 'EST. MO INTEREST', width: 110 },
            { header: 'CRUSHED', width: 70, type: 'checkbox' }
          ],
          22,
          21,
          {
            showTotal: true,
            totalLabel: 'TOTAL MONTHLY INTEREST ELIMINATED',
            prefill: Array.from({ length: 22 }, (_, i) => [`#${i + 1}`])
          }
        );
      }
    },
    {
      title: 'Monthly Payoff Thermometer & Milestone Tracker',
      render: () => {
        drawThermometer(doc, theme, 36, 74, 255, 655, 'MASTER PAYOFF THERMOMETER');
        drawThermometer(doc, theme, 305, 74, 271, 318, 'TARGET DEBT #1 THERMOMETER');
        drawThermometer(doc, theme, 305, 411, 271, 318, 'TARGET DEBT #2 THERMOMETER');
      }
    },
    {
      title: 'Snowball Rollover Compounding Matrix',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Base Minimums (A)' },
          { label: 'Extra Budget Cash (B)' },
          { label: 'Freed Minimums (C)' },
          { label: 'Total Snowball (A+B+C)' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'STEP', width: 45 },
            { header: 'TARGET CREDITOR', width: 145 },
            { header: 'OWN MIN', width: 70 },
            { header: '+ PRIOR FREED MINS', width: 100 },
            { header: '+ EXTRA CASH', width: 90 },
            { header: '= TOTAL ATTACK', width: 90 }
          ],
          22,
          21,
          {
            showTotal: true,
            totalLabel: 'FINAL SNOWBALL MONTHLY FIREPOWER',
            prefill: Array.from({ length: 22 }, (_, i) => [`Step ${i + 1}`])
          }
        );
      }
    },
    {
      title: 'Extra Payment Accelerator Log (Side Income & Windfalls)',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Total Extra Payments ($)' },
          { label: 'Months Shaved Off Plan' },
          { label: 'Interest Saved ($)' },
          { label: 'Snowball Multiplier' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'DATE', width: 65 },
            { header: 'SOURCE (SIDE HUSTLE / SELLING / REFUND)', width: 185 },
            { header: 'TARGET DEBT APPLIED TO', width: 130 },
            { header: 'EXTRA ($)', width: 80 },
            { header: 'NEW BAL ($)', width: 80 }
          ],
          22,
          21,
          { showTotal: true, totalLabel: 'TOTAL ACCELERATOR PAYMENTS APPLIED' }
        );
      }
    },
    {
      title: 'Dedicated Debt Attack Dossier: Targets #1 & #2',
      render: () => {
        [0, 1].forEach((idx) => {
          const by = 74 + idx * 332;
          doc.roundedRect(36, by, 540, 318, 5).fill('#ffffff').stroke(theme.border);
          doc.rect(36, by, 540, 24).fill(theme.primary);
          doc
            .font('Helvetica-Bold')
            .fontSize(9)
            .fillColor('#ffffff')
            .text(
              `TARGET DEBT #${idx + 1}: ___________________________   Start Bal: $__________   APR: _____%   Min: $_______`,
              46,
              by + 8,
              { lineBreak: false }
            );
          drawTable(
            doc,
            theme,
            44,
            by + 32,
            [
              { header: 'DATE', width: 68 },
              { header: 'BEGINNING BAL', width: 95 },
              { header: 'PAYMENT ($)', width: 90 },
              { header: 'INTEREST ($)', width: 85 },
              { header: 'PRINCIPAL ($)', width: 90 },
              { header: 'ENDING BAL ($)', width: 96 }
            ],
            11,
            22
          );
        });
      }
    },
    {
      title: 'Dedicated Debt Attack Dossier: Targets #3 & #4',
      render: () => {
        [2, 3].forEach((idx, i) => {
          const by = 74 + i * 332;
          doc.roundedRect(36, by, 540, 318, 5).fill('#ffffff').stroke(theme.border);
          doc.rect(36, by, 540, 24).fill(theme.primary);
          doc
            .font('Helvetica-Bold')
            .fontSize(9)
            .fillColor('#ffffff')
            .text(
              `TARGET DEBT #${idx + 1}: ___________________________   Start Bal: $__________   APR: _____%   Min: $_______`,
              46,
              by + 8,
              { lineBreak: false }
            );
          drawTable(
            doc,
            theme,
            44,
            by + 32,
            [
              { header: 'DATE', width: 68 },
              { header: 'BEGINNING BAL', width: 95 },
              { header: 'PAYMENT ($)', width: 90 },
              { header: 'INTEREST ($)', width: 85 },
              { header: 'PRINCIPAL ($)', width: 90 },
              { header: 'ENDING BAL ($)', width: 96 }
            ],
            11,
            22
          );
        });
      }
    },
    {
      title: 'Dedicated Debt Attack Dossier: Targets #5 & #6',
      render: () => {
        [4, 5].forEach((idx, i) => {
          const by = 74 + i * 332;
          doc.roundedRect(36, by, 540, 318, 5).fill('#ffffff').stroke(theme.border);
          doc.rect(36, by, 540, 24).fill(theme.primary);
          doc
            .font('Helvetica-Bold')
            .fontSize(9)
            .fillColor('#ffffff')
            .text(
              `TARGET DEBT #${idx + 1}: ___________________________   Start Bal: $__________   APR: _____%   Min: $_______`,
              46,
              by + 8,
              { lineBreak: false }
            );
          drawTable(
            doc,
            theme,
            44,
            by + 32,
            [
              { header: 'DATE', width: 68 },
              { header: 'BEGINNING BAL', width: 95 },
              { header: 'PAYMENT ($)', width: 90 },
              { header: 'INTEREST ($)', width: 85 },
              { header: 'PRINCIPAL ($)', width: 90 },
              { header: 'ENDING BAL ($)', width: 96 }
            ],
            11,
            22
          );
        });
      }
    },
    {
      title: '12-Month Master Debt Balance Reduction Grid',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Jan 1 Total Debt ($)' },
          { label: 'Mid-Year Debt ($)' },
          { label: 'Dec 31 Total Debt ($)' },
          { label: 'Total Principal Crushed' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'MONTH', width: 80 },
            { header: 'DEBT #1 BAL', width: 75 },
            { header: 'DEBT #2 BAL', width: 75 },
            { header: 'DEBT #3 BAL', width: 75 },
            { header: 'DEBT #4 BAL', width: 75 },
            { header: 'ALL OTHER', width: 75 },
            { header: 'TOTAL DEBT', width: 85 }
          ],
          12,
          24,
          {
            showTotal: true,
            totalLabel: 'TOTAL ANNUAL PRINCIPAL REDUCTION',
            prefill: [
              ['Month 1'],
              ['Month 2'],
              ['Month 3'],
              ['Month 4'],
              ['Month 5'],
              ['Month 6'],
              ['Month 7'],
              ['Month 8'],
              ['Month 9'],
              ['Month 10'],
              ['Month 11'],
              ['Month 12']
            ]
          }
        );
      }
    },
    {
      title: 'APR Negotiation & 0% Balance Transfer Tracker',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Accounts Negotiated' },
          { label: 'Old Avg APR (%)' },
          { label: 'New Avg APR (%)' },
          { label: 'Annual Interest Saved' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'CREDITOR / CARD ISSUER', width: 150 },
            { header: 'CURRENT APR', width: 70 },
            { header: 'NEW APR / PROMO', width: 85 },
            { header: 'PROMO EXPIRES', width: 85 },
            { header: 'TRANSFER FEE', width: 75 },
            { header: 'APPROVED', width: 75, type: 'checkbox' }
          ],
          20,
          22,
          { showTotal: true, totalLabel: 'TOTAL INTEREST SAVINGS LOCKED IN' }
        );
      }
    },
    {
      title: '100-Box Debt-Free Countdown Grid (Each Box = 1% Paid Off)',
      render: () => {
        doc
          .font('Helvetica-Bold')
          .fontSize(9.5)
          .fillColor(theme.text)
          .text(
            '1% AT A TIME: Divide Total Starting Debt by 100. Value per Box = $_______________. Color each box as you crush it!',
            36,
            76
          );
        const startX = 36;
        const startY = 102;
        const cols = 10;
        const rows = 10;
        const boxW = 50;
        const boxH = 54;
        const gapX = 4.4;
        const gapY = 6;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const num = r * 10 + c + 1;
            const bx = startX + c * (boxW + gapX);
            const by = startY + r * (boxH + gapY);
            doc
              .roundedRect(bx, by, boxW, boxH, 4)
              .fill(num % 25 === 0 ? theme.primaryLight : '#ffffff')
              .stroke(num % 25 === 0 ? theme.primary : theme.border);
            doc
              .font('Helvetica-Bold')
              .fontSize(8)
              .fillColor(num % 25 === 0 ? theme.primaryDark : theme.muted)
              .text(`${num}%`, bx + 5, by + 6, { lineBreak: false });
            doc
              .font('Helvetica')
              .fontSize(6.5)
              .fillColor(theme.muted)
              .text('$_______', bx + 5, by + 36, { lineBreak: false });
          }
        }
      }
    },
    {
      title: 'Debt-Free Victory Certificate & Wealth Redirect Plan',
      render: () => {
        doc.roundedRect(36, 78, 540, 260, 8).fill(theme.surface).stroke(theme.primary);
        doc.rect(36, 78, 540, 32).fill(theme.primary);
        doc
          .font('Helvetica-Bold')
          .fontSize(12)
          .fillColor('#ffffff')
          .text('OFFICIAL DEBT-FREE VICTORY CERTIFICATE', 36, 89, { width: 540, align: 'center' });

        doc
          .font('Helvetica-Bold')
          .fontSize(14)
          .fillColor(theme.text)
          .text('100% DEBT ELIMINATED & FINANCIAL FREEDOM RECLAIMED', 36, 134, {
            width: 540,
            align: 'center'
          });

        const certLines = [
          'Total Principal Eliminated: $_______________________',
          'Date Journey Started: ___________________   Date Completed: ___________________',
          'Total Monthly Cash Flow Reclaimed (Former Debt Payments): $___________________ / month',
          'Signed: ___________________________________________'
        ];
        certLines.forEach((line, idx) => {
          doc
            .font('Helvetica-Bold')
            .fontSize(9.5)
            .fillColor(theme.primaryDark)
            .text(line, 70, 175 + idx * 34);
        });

        drawTable(
          doc,
          theme,
          36,
          358,
          [
            { header: 'POST-DEBT WEALTH REDIRECT BUCKET (FORMER SNOWBALL)', width: 250 },
            { header: 'MONTHLY AUTO-INVEST ($)', width: 120 },
            { header: '10-YR AT 8% PROJECTION', width: 110 },
            { header: 'ACTIVE', width: 60, type: 'checkbox' }
          ],
          14,
          23,
          { showTotal: true, totalLabel: 'TOTAL RECLAIMED MONTHLY WEALTH FLOW' }
        );
      }
    }
  ];

  pageSpecs.forEach((spec, idx) => {
    doc.addPage();
    drawPageChrome(doc, theme, TITLE, spec.title, idx + 2, TOTAL);
    spec.render();
  });

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filename));
    stream.on('error', reject);
  });
}

// ============================================================================
// 3. SIDE HUSTLE LAUNCHPAD (20 Pages)
// ============================================================================
function buildSideHustleLaunchpad(theme) {
  const filename = path.join(OUTPUT_DIR, `Side-Hustle-Launchpad_${theme.name}.pdf`);
  const doc = new PDFDocument({ size: 'LETTER', margin: 0, bufferPages: true });
  const stream = fs.createWriteStream(filename);
  doc.pipe(stream);

  const TOTAL = 20;
  const TITLE = 'Side Hustle Launchpad ($10K MRR System)';

  drawCoverPage(
    doc,
    theme,
    'SIDE HUSTLE LAUNCHPAD',
    'Offer Validation Canvas, $10K MRR Revenue Breakdown, Content & Outreach Tracker, Client Funnel & Profit Ledger',
    'Complete 20-Page Entrepreneurial Revenue Architecture',
    TOTAL,
    [
      {
        title: '1. Offer Validation Canvas & ICP Problem Matrix',
        desc: 'Validate high-pain problems, craft an irresistible value proposition, and pre-sell before overbuilding.'
      },
      {
        title: '2. $10K MRR Reverse-Engineered Revenue Stack',
        desc: 'Break $10,000/month into exact unit economics across low-ticket, core retainer, and high-ticket offers.'
      },
      {
        title: '3. Content Engine & Daily Outbound Outreach Tracker',
        desc: 'Track warm/cold outreach touches, follow-up cadences, and inbound content distribution.'
      },
      {
        title: '4. Client Conversion Funnel & Delivery Roadmap',
        desc: 'Manage leads from discovery call to signed proposal and milestone delivery.'
      },
      {
        title: '5. Profit Ledger, Tax Set-Aside & CEO Owner Pay',
        desc: 'Separate gross revenue from deductible expenses, 25-30% tax reserves, and clean owner distributions.'
      }
    ]
  );

  const pageSpecs = [
    {
      title: 'Side Hustle Idea Scoring & Validation Matrix',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Winning Concept' },
          { label: 'Available Hrs / Week' },
          { label: 'Startup Capital ($)' },
          { label: '90-Day MRR Goal ($)' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'HUSTLE / OFFER IDEA', width: 180 },
            { header: 'PAIN (1-10)', width: 65 },
            { header: 'PURCHASING POWER', width: 90 },
            { header: 'SPEED TO CASH', width: 80 },
            { header: 'SKILL FIT', width: 65 },
            { header: 'SCORE /40', width: 60 }
          ],
          18,
          24,
          { showTotal: true, totalLabel: 'SELECT #1 HIGHEST-SCORING OFFER TO LAUNCH' }
        );
      }
    },
    {
      title: 'Offer Validation Canvas (Problem, ICP, Promise, Proof)',
      render: () => {
        const boxes = [
          { title: '1. IDEAL CUSTOMER PROFILE (WHO HAS THE BLEEDING NECK PROBLEM?)', x: 36, y: 74, w: 264, h: 205 },
          { title: '2. PAINFUL PROBLEM & COST OF INACTION ($ / TIME LOST)', x: 312, y: 74, w: 264, h: 205 },
          { title: '3. IRRESISTIBLE TRANSFORMATION & SPECIFIC RESULT PROMISE', x: 36, y: 291, w: 264, h: 205 },
          { title: '4. UNIQUE MECHANISM / 3-STEP DELIVERY FRAMEWORK', x: 312, y: 291, w: 264, h: 205 },
          { title: '5. RISK REVERSAL, GUARANTEE & FAST-ACTION BONUSES', x: 36, y: 508, w: 264, h: 225 },
          { title: '6. VALIDATION CHECKLIST (FIRST 5 PAYING BUYERS)', x: 312, y: 508, w: 264, h: 225 }
        ];
        boxes.forEach((b) => {
          doc.roundedRect(b.x, b.y, b.w, b.h, 5).fill('#ffffff').stroke(theme.border);
          doc.rect(b.x, b.y, b.w, 22).fill(theme.primary);
          doc
            .font('Helvetica-Bold')
            .fontSize(7.5)
            .fillColor('#ffffff')
            .text(b.title, b.x + 8, b.y + 7, { width: b.w - 16, lineBreak: false });
          for (let l = 1; l <= 7; l++) {
            doc
              .moveTo(b.x + 10, b.y + 24 + l * 24)
              .lineTo(b.x + b.w - 10, b.y + 24 + l * 24)
              .lineWidth(0.5)
              .strokeColor(theme.border)
              .stroke();
          }
        });
      }
    },
    {
      title: 'Ideal Customer Profile (ICP) & Buyer Triggers',
      render: () => {
        let y = drawTable(
          doc,
          theme,
          36,
          74,
          [
            { header: 'ICP DIMENSION', width: 170 },
            { header: 'SPECIFIC CUSTOMER RESEARCH NOTES & EXACT LANGUAGE', width: 370 }
          ],
          12,
          25,
          {
            prefill: [
              ['Role / Niche / Industry'],
              ['Current Revenue / Income Level'],
              ['Top 3 Daily Frustrations'],
              ['What They Already Tried That Failed'],
              ['Dream Outcome in 30-90 Days'],
              ['Exact Buying Trigger Event'],
              ['Top 3 Objections Before Buying'],
              ['Where They Hang Out Online'],
              ['Podcasts / Creators They Trust'],
              ['Decision Maker vs. Gatekeeper'],
              ['Price Anchors They Compare Against'],
              ['Why They Will Renew / Refer Others']
            ]
          }
        );
        drawTable(
          doc,
          theme,
          36,
          y + 8,
          [
            { header: 'CUSTOMER DISCOVERY INTERVIEWEE', width: 160 },
            { header: 'KEY PAIN QUOTED VERBATIM', width: 240 },
            { header: 'WILLING TO PAY ($)', width: 85 },
            { header: 'PITCHED', width: 55, type: 'checkbox' }
          ],
          10,
          24
        );
      }
    },
    {
      title: 'Irresistible Value Stack & Pricing Tier Architecture',
      render: () => {
        const tiers = [
          { name: 'TIER 1: ENTRY / STARTER OFFER', price: 'Price: $_________' },
          { name: 'TIER 2: CORE SIGNATURE OFFER', price: 'Price: $_________' },
          { name: 'TIER 3: VIP / HIGH-TICKET DONE-FOR-YOU', price: 'Price: $_________' }
        ];
        tiers.forEach((t, idx) => {
          const tx = 36 + idx * 183;
          doc.roundedRect(tx, 74, 174, 340, 5).fill('#ffffff').stroke(theme.primary);
          doc.rect(tx, 74, 174, 26).fill(idx === 1 ? theme.primaryDark : theme.primary);
          doc
            .font('Helvetica-Bold')
            .fontSize(8)
            .fillColor('#ffffff')
            .text(t.name, tx + 8, 83, { width: 158, lineBreak: false });
          doc
            .font('Helvetica-Bold')
            .fontSize(10)
            .fillColor(theme.text)
            .text(t.price, tx + 10, 110, { lineBreak: false });
          for (let l = 1; l <= 10; l++) {
            doc
              .moveTo(tx + 10, 128 + l * 26)
              .lineTo(tx + 164, 128 + l * 26)
              .lineWidth(0.5)
              .strokeColor(theme.border)
              .stroke();
          }
        });
        drawTable(
          doc,
          theme,
          36,
          432,
          [
            { header: 'VALUE STACK COMPONENT / DELIVERABLE / BONUS', width: 260 },
            { header: 'REAL WORLD VALUE ($)', width: 110 },
            { header: 'DELIVERY FORMAT', width: 110 },
            { header: 'READY', width: 60, type: 'checkbox' }
          ],
          11,
          23,
          { showTotal: true, totalLabel: 'TOTAL PERCEIVED VALUE STACK VS. ACTUAL PRICE' }
        );
      }
    },
    {
      title: '$10K MRR Revenue Breakdown & Unit Economics',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Target Monthly MRR', placeholder: '$ 10,000.00' },
          { label: 'Current Active MRR' },
          { label: 'MRR Gap to Close' },
          { label: 'Avg Client LTV ($)' }
        ]);
        y = drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: '$10K MRR PATHWAY SCENARIO', width: 175 },
            { header: 'PRICE / UNIT', width: 85 },
            { header: 'UNITS / MO NEEDED', width: 95 },
            { header: 'CLOSE RATE %', width: 85 },
            { header: 'LEADS / MO NEEDED', width: 100 }
          ],
          8,
          22,
          {
            prefill: [
              ['Path A: High-Ticket Retainer', '$2,500 / mo', '4 Clients', '25%', '16 Discovery Calls'],
              ['Path B: Core Consulting / Service', '$1,000 / mo', '10 Clients', '20%', '50 Qualified Leads'],
              ['Path C: Productized Sprint', '$500 / pkg', '20 Sales', '10%', '200 Warm Prospects'],
              ['Path D: Cohort / Group Program', '$250 / mo', '40 Members', '5%', '800 Opt-in Leads'],
              ['Path E: Digital Product + Upsell', '$100 avg', '100 Buyers', '2%', '5,000 Visitors'],
              ['Custom Hybrid Stack — Stream 1'],
              ['Custom Hybrid Stack — Stream 2'],
              ['Custom Hybrid Stack — Stream 3']
            ]
          }
        );
        drawTable(
          doc,
          theme,
          36,
          y + 8,
          [
            { header: 'MONTH', width: 70 },
            { header: 'NEW MRR ADDED', width: 95 },
            { header: 'CHURNED MRR', width: 90 },
            { header: 'ONE-OFF CASH', width: 95 },
            { header: 'TOTAL MONTHLY REV', width: 100 },
            { header: '% OF $10K', width: 90, type: 'progress' }
          ],
          12,
          22,
          { showTotal: true, totalLabel: 'CUMULATIVE RUN-RATE TOWARD $10K/MO ($120K ARR)' }
        );
      }
    },
    {
      title: '90-Day Go-To-Market Sprint Roadmap',
      render: () => {
        const phases = [
          'DAYS 1-30: VALIDATION, MINIMUM VIABLE OFFER & FIRST 3 PAYING CLIENTS',
          'DAYS 31-60: CASE STUDIES, DAILY OUTREACH ENGINE & REPEATABLE DELIVERY',
          'DAYS 61-90: PRICING POWER, RETAINERS, REFERRAL LOOPS & $10K MRR SCALE'
        ];
        phases.forEach((p, idx) => {
          const py = 74 + idx * 222;
          drawTable(
            doc,
            theme,
            36,
            py,
            [
              { header: p, width: 315 },
              { header: 'TARGET KPI', width: 95 },
              { header: 'DEADLINE', width: 70 },
              { header: 'DONE', width: 60, type: 'checkbox' }
            ],
            8,
            21
          );
        });
      }
    },
    {
      title: 'Content Pillar & Weekly Distribution Planner',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Primary Platform' },
          { label: 'Secondary Platform' },
          { label: 'Lead Magnet / CTA' },
          { label: 'Weekly Subscribers (+)' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'DAY / DATE', width: 65 },
            { header: 'HOOK / CONTENT TOPIC (PAIN, PROOF, FRAMEWORK)', width: 215 },
            { header: 'CHANNEL', width: 75 },
            { header: 'CTA / OFFER LINK', width: 120 },
            { header: 'LIVE', width: 65, type: 'checkbox' }
          ],
          22,
          21,
          { showTotal: true, totalLabel: 'TOTAL WEEKLY CONTENT ASSETS PUBLISHED' }
        );
      }
    },
    {
      title: 'Social Growth, Lead Magnet & Funnel Metrics',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Profile Views / Mo' },
          { label: 'Lead Magnet Opt-in %' },
          { label: 'Email List Growth' },
          { label: 'Booked Calls from Content' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'WEEK OF', width: 70 },
            { header: 'IMPRESSIONS', width: 80 },
            { header: 'LINK CLICKS', width: 80 },
            { header: 'NEW LEADS', width: 75 },
            { header: 'DMS STARTED', width: 75 },
            { header: 'CALLS BOOKED', width: 80 },
            { header: 'REVENUE ($)', width: 80 }
          ],
          22,
          21,
          { showTotal: true, totalLabel: 'TOTAL ORGANIC & CONTENT FUNNEL CONVERSIONS' }
        );
      }
    },
    {
      title: 'Daily Cold & Warm Outreach Tracker (Rule of 100)',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Daily Outreach Target' },
          { label: 'Total Outbound Sent' },
          { label: 'Positive Reply Rate (%)' },
          { label: 'Booked Calls Generated' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'DATE', width: 55 },
            { header: 'PROSPECT / COMPANY', width: 150 },
            { header: 'CHANNEL (DM/EMAIL)', width: 95 },
            { header: 'FOLLOW-UP #1', width: 80, type: 'checkbox' },
            { header: 'FOLLOW-UP #2', width: 80, type: 'checkbox' },
            { header: 'BOOKED', width: 80, type: 'checkbox' }
          ],
          22,
          21,
          { showTotal: true, totalLabel: 'TOTAL OUTREACH TOUCHES & CONVERSATIONS' }
        );
      }
    },
    {
      title: 'Client Acquisition Funnel & CRM Pipeline Tracker',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Total Pipeline Value ($)' },
          { label: 'Weighted Forecast ($)' },
          { label: 'Proposals Out ($)' },
          { label: 'Closed Won This Month' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'PROSPECT / ACCOUNT NAME', width: 155 },
            { header: 'OFFER / PACKAGE', width: 105 },
            { header: 'VALUE ($)', width: 70 },
            { header: 'STAGE (CALL/PROP/WON)', width: 115 },
            { header: 'NEXT ACTION DATE', width: 95 }
          ],
          22,
          21,
          { showTotal: true, totalLabel: 'TOTAL ACTIVE PIPELINE VALUE' }
        );
      }
    },
    {
      title: 'Discovery Call & Sales Closing Scorecard',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Calls Booked' },
          { label: 'Show-Up Rate (%)' },
          { label: 'Offers Pitched' },
          { label: 'Close Rate (%)' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'DATE', width: 55 },
            { header: 'PROSPECT NAME', width: 135 },
            { header: 'PAIN / GOAL IDENTIFIED', width: 145 },
            { header: 'MAIN OBJECTION', width: 95 },
            { header: 'DEAL ($)', width: 60 },
            { header: 'WON', width: 50, type: 'checkbox' }
          ],
          22,
          21,
          { showTotal: true, totalLabel: 'TOTAL CLOSED SALES VOLUME' }
        );
      }
    },
    {
      title: 'Active Client Onboarding & Delivery Tracker',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Active Clients' },
          { label: 'On-Time Delivery (%)' },
          { label: 'Testimonials Collected' },
          { label: 'Referrals Asked' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'CLIENT NAME', width: 135 },
            { header: 'CONTRACT', width: 60, type: 'checkbox' },
            { header: 'PAID', width: 55, type: 'checkbox' },
            { header: 'KICKOFF', width: 60, type: 'checkbox' },
            { header: 'DELIVERY PROGRESS', width: 150, type: 'progress' },
            { header: 'CASE STUDY', width: 80, type: 'checkbox' }
          ],
          22,
          21,
          { showTotal: true, totalLabel: 'CLIENT SUCCESS & RETENTION CHECK' }
        );
      }
    },
    {
      title: 'Recurring Retainer & MRR Retention Matrix',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Active Retainer Clients' },
          { label: 'Locked-In Monthly MRR' },
          { label: 'Monthly Churn Rate (%)' },
          { label: 'Expansion / Upsell MRR' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'RETAINER CLIENT NAME', width: 165 },
            { header: 'START DATE', width: 75 },
            { header: 'BILLING DAY', width: 70 },
            { header: 'MONTHLY FEE ($)', width: 85 },
            { header: 'RENEWAL DATE', width: 85 },
            { header: 'ACTIVE', width: 60, type: 'checkbox' }
          ],
          22,
          21,
          { showTotal: true, totalLabel: 'TOTAL RECURRING MONTHLY REVENUE (MRR)' }
        );
      }
    },
    {
      title: 'Side Hustle Income & Invoice Ledger',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Gross Revenue Invoiced' },
          { label: 'Stripe / Payment Fees' },
          { label: 'Net Cash Collected' },
          { label: 'Overdue Invoices ($)' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'INV #', width: 50 },
            { header: 'DATE', width: 60 },
            { header: 'CLIENT / PRODUCT SOLD', width: 175 },
            { header: 'GROSS ($)', width: 75 },
            { header: 'FEES ($)', width: 65 },
            { header: 'NET ($)', width: 65 },
            { header: 'PAID', width: 50, type: 'checkbox' }
          ],
          22,
          21,
          { showTotal: true, totalLabel: 'TOTAL COLLECTED BUSINESS INCOME' }
        );
      }
    },
    {
      title: 'Business Expenses, Software & Tax Write-Off Tracker',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Software / SaaS Stack' },
          { label: 'Ads & Marketing Spend' },
          { label: 'Contractors / Fulfillment' },
          { label: 'Total Tax-Deductible ($)' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'DATE', width: 60 },
            { header: 'VENDOR / EXPENSE DESCRIPTION', width: 185 },
            { header: 'TAX CATEGORY (ADS, SAAS, EQUIP)', width: 150 },
            { header: 'AMOUNT ($)', width: 80 },
            { header: 'RECEIPT', width: 65, type: 'checkbox' }
          ],
          22,
          21,
          { showTotal: true, totalLabel: 'TOTAL DEDUCTIBLE OPERATING EXPENSES' }
        );
      }
    },
    {
      title: 'Monthly Profit & Loss (P&L) & Tax Reserve Split',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Gross Revenue (100%)' },
          { label: 'Operating Expenses (%)' },
          { label: 'Tax Reserve (25-30%)' },
          { label: 'Owner Net Take-Home' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'MONTH', width: 75 },
            { header: 'GROSS REV ($)', width: 80 },
            { header: 'EXPENSES ($)', width: 80 },
            { header: 'NET PROFIT ($)', width: 80 },
            { header: 'TAX VAULT (30%)', width: 80 },
            { header: 'REINVEST ($)', width: 70 },
            { header: 'OWNER PAY ($)', width: 75 }
          ],
          12,
          24,
          {
            showTotal: true,
            totalLabel: 'ANNUAL SIDE HUSTLE PROFIT & OWNER DISTRIBUTIONS',
            prefill: [
              ['January'],
              ['February'],
              ['March'],
              ['April'],
              ['May'],
              ['June'],
              ['July'],
              ['August'],
              ['September'],
              ['October'],
              ['November'],
              ['December']
            ]
          }
        );
      }
    },
    {
      title: 'Time-Block & High-ROI CEO Weekly Schedule',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Total Hustle Hrs / Wk' },
          { label: 'Sales & Outreach Hrs' },
          { label: 'Client Delivery Hrs' },
          { label: 'Effective Hourly Rate ($/Hr)' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'TIME BLOCK', width: 80 },
            { header: 'MON', width: 65 },
            { header: 'TUE', width: 65 },
            { header: 'WED', width: 65 },
            { header: 'THU', width: 65 },
            { header: 'FRI', width: 65 },
            { header: 'SAT', width: 67 },
            { header: 'SUN', width: 68 }
          ],
          20,
          22,
          {
            prefill: [
              ['05:30 - 06:30'],
              ['06:30 - 07:30'],
              ['07:30 - 08:30'],
              ['12:00 - 13:00'],
              ['17:30 - 18:30'],
              ['18:30 - 19:30'],
              ['19:30 - 20:30'],
              ['20:30 - 21:30'],
              ['21:30 - 22:30']
            ]
          }
        );
      }
    },
    {
      title: 'Standard Operating Procedures (SOP) & Automation Checklist',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Documented SOPs' },
          { label: 'Automated Workflows' },
          { label: 'Hours Saved / Week' },
          { label: 'Delegated Tasks' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'CORE BUSINESS PROCESS / WORKFLOW', width: 225 },
            { header: 'TOOL / AUTOMATION', width: 120 },
            { header: 'FREQ', width: 65 },
            { header: 'SOP DOC', width: 65, type: 'checkbox' },
            { header: 'AUTO', width: 65, type: 'checkbox' }
          ],
          22,
          21,
          {
            showTotal: true,
            totalLabel: 'SYSTEMATIZATION & SCALE READINESS',
            prefill: [
              ['Lead Magnet Opt-In -> Welcome Email Sequence'],
              ['Discovery Call Booking -> Calendar + Intake Form'],
              ['Proposal + Stripe Invoice + E-Sign Contract'],
              ['Client Onboarding Welcome Portal & Kickoff'],
              ['Weekly Client KPI Status Update Report'],
              ['Testimonial & Case Study Request Flow'],
              ['Monthly Bookkeeping & 30% Tax Sweep']
            ]
          }
        );
      }
    },
    {
      title: 'Quarterly CEO Review & Scaling to $10K+ MRR Blueprint',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Quarter Ending MRR ($)' },
          { label: 'Quarter Net Profit ($)' },
          { label: 'Best Acquisition Channel' },
          { label: 'Next Quarter MRR Goal' }
        ]);
        const sections = [
          '1. 80/20 PARETO AUDIT — WHICH 20% OF OFFERS & CHANNELS DROVE 80% OF REVENUE?',
          '2. BOTTLENECKS TO ELIMINATE, AUTOMATE, OR DELEGATE NEXT QUARTER:',
          '3. PRICING POWER — HOW CAN WE INCREASE LTV OR RAISE PRICES BY 20-50%?',
          '4. NEXT 90-DAY TOP 3 REVENUE MILESTONES:'
        ];
        sections.forEach((s, idx) => {
          const sy = y + idx * 145;
          doc.roundedRect(36, sy, 540, 132, 5).fill('#ffffff').stroke(theme.border);
          doc.rect(36, sy, 540, 22).fill(theme.primaryLight);
          doc
            .font('Helvetica-Bold')
            .fontSize(8.5)
            .fillColor(theme.primaryDark)
            .text(s, 46, sy + 7, { lineBreak: false });
          for (let l = 1; l <= 4; l++) {
            doc
              .moveTo(46, sy + 24 + l * 23)
              .lineTo(564, sy + 24 + l * 23)
              .lineWidth(0.5)
              .strokeColor(theme.border)
              .stroke();
          }
        });
      }
    }
  ];

  pageSpecs.forEach((spec, idx) => {
    doc.addPage();
    drawPageChrome(doc, theme, TITLE, spec.title, idx + 2, TOTAL);
    spec.render();
  });

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filename));
    stream.on('error', reject);
  });
}

// ============================================================================
// 4. NO-SPEND CHALLENGE (12 Pages)
// ============================================================================
function buildNoSpendChallenge(theme) {
  const filename = path.join(OUTPUT_DIR, `No-Spend-Challenge_${theme.name}.pdf`);
  const doc = new PDFDocument({ size: 'LETTER', margin: 0, bufferPages: true });
  const stream = fs.createWriteStream(filename);
  doc.pipe(stream);

  const TOTAL = 12;
  const TITLE = '30-Day No-Spend Challenge';

  drawCoverPage(
    doc,
    theme,
    '30-DAY NO-SPEND CHALLENGE',
    '30-Day No-Spend Visual Calendar Grid, Triggers & Impulse Wishlist Cooling-Off Log & Total Money Saved Tally',
    'Complete 12-Page Mindful Spending & Savings Reset',
    TOTAL,
    [
      {
        title: '1. Crystal-Clear Allowed vs. Frozen Spending Rules',
        desc: 'Define essential bills and groceries vs. frozen impulse categories before Day 1 begins.'
      },
      {
        title: '2. 30-Day Visual No-Spend Calendar & Streak Grid',
        desc: 'Mark every $0.00 No-Spend day and build an unbroken chain of mindful financial discipline.'
      },
      {
        title: '3. Emotional Triggers & Impulse Cooling-Off Wishlist',
        desc: 'Replace instant 1-click checkout with a mandatory 30-day cooling-off audit.'
      },
      {
        title: '4. Pantry, Freezer & Zero-Cost Activity Challenge',
        desc: 'Turn unused pantry inventory and free local experiences into immediate cash savings.'
      },
      {
        title: '5. Total Money Saved Tally & Wealth Transfer',
        desc: 'Sweep every single dollar saved directly into your Debt Snowball or Sinking Funds.'
      }
    ]
  );

  const pageSpecs = [
    {
      title: 'No-Spend Challenge Rules, Exceptions & Pledge Contract',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Challenge Month / Dates' },
          { label: 'Target No-Spend Days', placeholder: '____ / 30 Days' },
          { label: 'Target Cash Saved ($)' },
          { label: 'Savings Destination' }
        ]);

        // Two columns: Green Light vs Red Light
        [
          {
            title: 'GREEN LIGHT: ALLOWED ESSENTIALS ONLY',
            x: 36,
            items: [
              'Rent / Mortgage & Fixed Utilities',
              'Essential Groceries (Meal-Planned List Only)',
              'Commute Fuel / Public Transit to Work',
              'Prescriptions & Essential Medical Care',
              'Minimum Debt & Scheduled Sinking Transfers',
              'Custom Allowed #1: _______________________',
              'Custom Allowed #2: _______________________',
              'Custom Allowed #3: _______________________'
            ]
          },
          {
            title: 'RED LIGHT: FROZEN FOR 30 DAYS ($0 SPEND)',
            x: 312,
            items: [
              'Restaurants, Takeout, Delivery Apps & Drive-Thru',
              'Coffee Shops, Boba & Impulse Snacks',
              'Amazon / Online Late-Night Browsing Carts',
              'Clothing, Shoes, Cosmetics & Fast Fashion',
              'Home Decor, Gadgets & Hobby Upgrades',
              'In-App Purchases & Unplanned Subscriptions',
              'Custom Frozen #1: ________________________',
              'Custom Frozen #2: ________________________'
            ]
          }
        ].forEach((col) => {
          doc.roundedRect(col.x, y, 264, 285, 5).fill('#ffffff').stroke(theme.border);
          doc.rect(col.x, y, 264, 24).fill(theme.primary);
          doc
            .font('Helvetica-Bold')
            .fontSize(8)
            .fillColor('#ffffff')
            .text(col.title, col.x + 8, y + 8, { lineBreak: false });
          col.items.forEach((it, idx) => {
            const iy = y + 36 + idx * 29;
            doc.roundedRect(col.x + 10, iy, 10, 10, 2).stroke(theme.primary);
            doc
              .font('Helvetica')
              .fontSize(8)
              .fillColor(theme.text)
              .text(it, col.x + 26, iy + 1, { width: 228, lineBreak: false });
          });
        });

        // Pledge Card
        const py = y + 300;
        doc.roundedRect(36, py, 540, 240, 6).fill(theme.surface).stroke(theme.primary);
        doc.rect(36, py, 540, 26).fill(theme.primaryLight);
        doc
          .font('Helvetica-Bold')
          .fontSize(9)
          .fillColor(theme.primaryDark)
          .text('MY 30-DAY NO-SPEND COMMITMENT & WHY', 48, py + 8, { lineBreak: false });
        const pledgeLines = [
          'I commit to pausing all non-essential spending for 30 days so that I can accelerate:',
          '___________________________________________________________________________________________',
          'When I feel bored, stressed, or tempted to impulse-shop, my default replacement action is:',
          '___________________________________________________________________________________________',
          'Every Friday, I will transfer my No-Spend savings directly into: ______________________________',
          'Signature: _________________________________________     Date: ____________________________'
        ];
        pledgeLines.forEach((line, i) => {
          doc
            .font('Helvetica-Bold')
            .fontSize(8.5)
            .fillColor(theme.text)
            .text(line, 48, py + 42 + i * 31, { width: 516 });
        });
      }
    },
    {
      title: '30-Day No-Spend Visual Calendar Grid & Streak Tracker',
      render: () => {
        doc
          .font('Helvetica-Bold')
          .fontSize(9)
          .fillColor(theme.text)
          .text(
            '30-DAY VISUAL CALENDAR GRID: Check [NO SPEND] for every $0 non-essential day and log daily victories!',
            36,
            74
          );

        const cols = 6;
        const rows = 5;
        const cellW = 86;
        const cellH = 104;
        const gapX = 4.8;
        const gapY = 6;
        const startX = 36;
        const startY = 95;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const day = r * cols + c + 1;
            const cx = startX + c * (cellW + gapX);
            const cy = startY + r * (cellH + gapY);
            doc.roundedRect(cx, cy, cellW, cellH, 4).fill('#ffffff').stroke(theme.border);
            doc.rect(cx, cy, cellW, 18).fill(theme.primaryLight);
            doc
              .font('Helvetica-Bold')
              .fontSize(8)
              .fillColor(theme.primaryDark)
              .text(`DAY ${day}`, cx + 6, cy + 5, { lineBreak: false });

            // Checkbox for No-Spend
            doc.roundedRect(cx + 6, cy + 25, 10, 10, 2).stroke(theme.primary);
            doc
              .font('Helvetica-Bold')
              .fontSize(7)
              .fillColor(theme.text)
              .text('$0 NO-SPEND', cx + 20, cy + 27, { lineBreak: false });

            doc
              .font('Helvetica')
              .fontSize(7)
              .fillColor(theme.muted)
              .text('Saved: $________', cx + 6, cy + 48, { lineBreak: false });
            doc
              .font('Helvetica')
              .fontSize(7)
              .fillColor(theme.muted)
              .text('Mood: _________', cx + 6, cy + 66, { lineBreak: false });
            doc
              .font('Helvetica')
              .fontSize(7)
              .fillColor(theme.muted)
              .text('Streak: ________', cx + 6, cy + 84, { lineBreak: false });
          }
        }

        drawKpiRow(doc, theme, 36, 652, 540, [
          { label: 'Total No-Spend Days / 30' },
          { label: 'Longest Unbroken Streak' },
          { label: 'Impulse Urges Defeated' },
          { label: 'Total Saved This Month' }
        ]);
      }
    },
    {
      title: 'Emotional Spending Triggers & Root-Cause Log',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: '#1 Danger Time of Day' },
          { label: '#1 Trigger Emotion' },
          { label: '#1 Temptation App/Site' },
          { label: 'Urges Logged & Resisted' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'DATE / TIME', width: 70 },
            { header: 'ITEM I WANTED TO BUY', width: 135 },
            { header: 'COST ($)', width: 60 },
            { header: 'EMOTION / TRIGGER (BORED/TIRED/AD)', width: 145 },
            { header: 'HEALTHY SWAP USED', width: 85 },
            { header: 'RESISTED', width: 45, type: 'checkbox' }
          ],
          22,
          21,
          { showTotal: true, totalLabel: 'TOTAL IMPULSE TRIGGERS SUCCESSFULLY DEFLECTED' }
        );
      }
    },
    {
      title: '30-Day Impulse Wishlist Cooling-Off Vault (Page 1)',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Items Placed in Vault' },
          { label: 'Total Cart Value Paused' },
          { label: 'Items Forgotten After 30d' },
          { label: 'Money Saved by Waiting' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'DATE ADDED', width: 65 },
            { header: 'IMPULSE ITEM & STORE / LINK', width: 185 },
            { header: 'PRICE ($)', width: 65 },
            { header: 'HRS OF WORK', width: 75 },
            { header: '30-DAY REVIEW DATE', width: 85 },
            { header: 'SKIP IT!', width: 65, type: 'checkbox' }
          ],
          22,
          21,
          { showTotal: true, totalLabel: 'TOTAL COOLING-OFF VAULT SAVINGS (PAGE 1)' }
        );
      }
    },
    {
      title: '30-Day Impulse Wishlist Cooling-Off Vault (Page 2)',
      render: () => {
        drawTable(
          doc,
          theme,
          36,
          74,
          [
            { header: 'DATE ADDED', width: 65 },
            { header: 'IMPULSE ITEM & STORE / LINK', width: 185 },
            { header: 'PRICE ($)', width: 65 },
            { header: 'HRS OF WORK', width: 75 },
            { header: '30-DAY REVIEW DATE', width: 85 },
            { header: 'SKIP IT!', width: 65, type: 'checkbox' }
          ],
          25,
          22,
          { showTotal: true, totalLabel: 'TOTAL COOLING-OFF VAULT SAVINGS (PAGE 2)' }
        );
      }
    },
    {
      title: 'Pantry, Freezer & Fridge Clean-Out Meal Planner',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Normal Grocery Spend' },
          { label: 'Challenge Grocery Spend' },
          { label: 'Takeout Orders Skipped' },
          { label: 'Pantry Challenge Savings' }
        ]);
        y = drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'FREEZER / PANTRY / FRIDGE ITEM ON HAND', width: 195 },
            { header: 'QTY', width: 55 },
            { header: 'MEAL IDEA TO COOK THIS WEEK', width: 225 },
            { header: 'USED', width: 65, type: 'checkbox' }
          ],
          12,
          21,
          { showTotal: true, totalLabel: 'ZERO-WASTE PANTRY INVENTORY USED' }
        );
        drawTable(
          doc,
          theme,
          36,
          y + 8,
          [
            { header: 'WEEK / DAY', width: 80 },
            { header: 'BREAKFAST AT HOME', width: 145 },
            { header: 'PACKED LUNCH', width: 145 },
            { header: 'HOME-COOKED DINNER', width: 170 }
          ],
          7,
          22,
          {
            prefill: [
              ['Monday'],
              ['Tuesday'],
              ['Wednesday'],
              ['Thursday'],
              ['Friday'],
              ['Saturday'],
              ['Sunday']
            ]
          }
        );
      }
    },
    {
      title: 'Zero-Cost Entertainment, Dopamine Menu & Free Fun List',
      render: () => {
        let y = drawTable(
          doc,
          theme,
          36,
          74,
          [
            { header: 'ZERO-COST DOPAMINE / FREE ACTIVITY IDEA', width: 260 },
            { header: 'CATEGORY', width: 110 },
            { header: 'REPLACES ($ SPEND)', width: 105 },
            { header: 'DONE', width: 65, type: 'checkbox' }
          ],
          24,
          22,
          {
            showTotal: true,
            totalLabel: 'TOTAL ENTERTAINMENT DOLLARS SAVED',
            prefill: [
              ['Library Books, Audiobooks (Libby) & Magazines', 'Learning', '$25 Bookstore'],
              ['Sunset Walk / Local Trail Hike with Thermos Coffee', 'Outdoors', '$15 Cafe + Parking'],
              ['At-Home Movie Marathon + Stovetop Popcorn', 'Entertainment', '$45 Cinema Tickets'],
              ['Board Game / Card Night with Friends (Potluck)', 'Social', '$75 Restaurant/Bar'],
              ['Closet Shop & 30-Piece Capsule Wardrobe Remix', 'Style', '$120 Online Order'],
              ['Declutter & List 10 Unused Items on Marketplace', 'Declutter', '+$150 Cash Earned'],
              ['At-Home Spa Evening, Bath & Skincare Routine', 'Self-Care', '$80 Salon Visit'],
              ['Free Museum Day / Community Park Concert', 'Culture', '$50 Event Tickets'],
              ['Batch-Cook Freezer Meals while Listening to Podcast', 'Home', '$60 Takeout Delivery'],
              ['Deep Clean Car Interior & Detail at Home', 'Maintenance', '$40 Car Wash']
            ]
          }
        );
        return y;
      }
    },
    {
      title: 'Daily Essential vs. Non-Essential Check-In: Days 1-15',
      render: () => {
        drawTable(
          doc,
          theme,
          36,
          74,
          [
            { header: 'DAY', width: 45 },
            { header: 'DATE', width: 65 },
            { header: 'ESSENTIAL SPEND DESCRIPTION', width: 185 },
            { header: 'ESSENTIAL ($)', width: 80 },
            { header: 'IMPULSE ($0)', width: 80 },
            { header: 'NO-SPEND WIN', width: 85, type: 'checkbox' }
          ],
          15,
          34,
          {
            showTotal: true,
            totalLabel: 'DAYS 1-15 CUMULATIVE CHECK-IN',
            prefill: Array.from({ length: 15 }, (_, i) => [`Day ${i + 1}`])
          }
        );
      }
    },
    {
      title: 'Daily Essential vs. Non-Essential Check-In: Days 16-30',
      render: () => {
        drawTable(
          doc,
          theme,
          36,
          74,
          [
            { header: 'DAY', width: 45 },
            { header: 'DATE', width: 65 },
            { header: 'ESSENTIAL SPEND DESCRIPTION', width: 185 },
            { header: 'ESSENTIAL ($)', width: 80 },
            { header: 'IMPULSE ($0)', width: 80 },
            { header: 'NO-SPEND WIN', width: 85, type: 'checkbox' }
          ],
          15,
          34,
          {
            showTotal: true,
            totalLabel: 'DAYS 16-30 CUMULATIVE CHECK-IN',
            prefill: Array.from({ length: 15 }, (_, i) => [`Day ${i + 16}`])
          }
        );
      }
    },
    {
      title: 'Total Money Saved Tally & Weekly Sweep Transfer Log',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Dining/Coffee Saved ($)' },
          { label: 'Shopping Carts Saved ($)' },
          { label: 'Declutter Sales Earned' },
          { label: 'GRAND TOTAL SAVED ($)' }
        ]);
        y = drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'DATE', width: 65 },
            { header: 'EXPENSE AVOIDED / ITEM SKIPPED / CASH RECLAIMED', width: 225 },
            { header: 'AMOUNT SAVED ($)', width: 95 },
            { header: 'TRANSFERRED TO GOAL', width: 95 },
            { header: 'SWEPT', width: 60, type: 'checkbox' }
          ],
          16,
          21,
          { showTotal: true, totalLabel: 'TOTAL VERIFIED NO-SPEND CHALLENGE SAVINGS' }
        );
        drawTable(
          doc,
          theme,
          36,
          y + 8,
          [
            { header: 'WEEKLY SAVINGS SWEEP', width: 150 },
            { header: 'TRANSFER DATE', width: 110 },
            { header: 'DESTINATION ACCOUNT (DEBT / HYSA)', width: 180 },
            { header: 'AMOUNT ($)', width: 100 }
          ],
          4,
          22,
          {
            showTotal: true,
            totalLabel: 'TOTAL CASH LOCKED INTO WEALTH / DEBT PAYOFF',
            prefill: [['Week 1 Sweep'], ['Week 2 Sweep'], ['Week 3 Sweep'], ['Week 4 Final Sweep']]
          }
        );
      }
    },
    {
      title: '30-Day Challenge Debrief & Mindful Money Reset',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Final No-Spend Score', placeholder: '____ / 30 Days' },
          { label: 'Total Dollars Reclaimed' },
          { label: 'Habits Permanently Cut' },
          { label: 'Next Challenge Date' }
        ]);
        const questions = [
          '1. WHAT SURPRISED ME MOST ABOUT MY SPENDING HABITS DURING THESE 30 DAYS?',
          '2. WHICH THINGS DID I NOT MISS AT ALL ONCE I STOPPED BUYING THEM?',
          '3. WHAT WERE MY STRONGEST TRIGGERS & HOW WILL I GUARD AGAINST THEM GOING FORWARD?',
          '4. HOW DID TRANSFERRING THIS SAVED MONEY ACCELERATE MY BIGGEST FINANCIAL GOAL?'
        ];
        questions.forEach((q, idx) => {
          const qy = y + idx * 145;
          doc.roundedRect(36, qy, 540, 132, 5).fill('#ffffff').stroke(theme.border);
          doc.rect(36, qy, 540, 22).fill(theme.primaryLight);
          doc
            .font('Helvetica-Bold')
            .fontSize(8.5)
            .fillColor(theme.primaryDark)
            .text(q, 46, qy + 7, { lineBreak: false });
          for (let l = 1; l <= 4; l++) {
            doc
              .moveTo(46, qy + 24 + l * 23)
              .lineTo(564, qy + 24 + l * 23)
              .lineWidth(0.5)
              .strokeColor(theme.border)
              .stroke();
          }
        });
      }
    }
  ];

  pageSpecs.forEach((spec, idx) => {
    doc.addPage();
    drawPageChrome(doc, theme, TITLE, spec.title, idx + 2, TOTAL);
    spec.render();
  });

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filename));
    stream.on('error', reject);
  });
}

// ============================================================================
// 5. SINKING FUNDS TRACKER (14 Pages)
// ============================================================================
function drawSinkingBucketCard(doc, theme, x, y, width, height, bucketTitle, defaultGoalNote) {
  doc.roundedRect(x, y, width, height, 6).fill('#ffffff').stroke(theme.border);
  doc.rect(x, y, width, 24).fill(theme.primary);
  doc
    .font('Helvetica-Bold')
    .fontSize(8.5)
    .fillColor('#ffffff')
    .text(bucketTitle.toUpperCase(), x + 10, y + 8, { width: width - 20, lineBreak: false });

  // KPI strip inside bucket
  const metaY = y + 30;
  doc
    .font('Helvetica-Bold')
    .fontSize(7.5)
    .fillColor(theme.text)
    .text(
      'Target Goal: $____________   Target Date: __________   Monthly Save: $____________   Saved So Far: $____________',
      x + 10,
      metaY,
      { lineBreak: false }
    );

  // Visual Progress Bar (0% -> 25% -> 50% -> 75% -> 100%)
  const barY = metaY + 15;
  const barW = width - 20;
  doc.roundedRect(x + 10, barY, barW, 14, 7).fill(theme.surface).stroke(theme.primary);
  [0, 25, 50, 75, 100].forEach((pct) => {
    const tx = x + 10 + (barW * pct) / 100;
    if (pct > 0 && pct < 100) {
      doc
        .moveTo(tx, barY)
        .lineTo(tx, barY + 14)
        .lineWidth(0.6)
        .strokeColor(theme.primary)
        .stroke();
    }
    doc
      .font('Helvetica-Bold')
      .fontSize(6.5)
      .fillColor(theme.primaryDark)
      .text(`${pct}%`, tx - (pct === 100 ? 18 : 6), barY + 4, { lineBreak: false });
  });

  doc
    .font('Helvetica')
    .fontSize(7.5)
    .fillColor(theme.muted)
    .text(defaultGoalNote, x + 10, barY + 19, { lineBreak: false });

  drawTable(
    doc,
    theme,
    x + 8,
    barY + 32,
    [
      { header: 'DATE', width: 65 },
      { header: 'CONTRIBUTION / EXPENSE NOTE', width: 195 },
      { header: '+ DEPOSIT ($)', width: 85 },
      { header: '- SPENT ($)', width: 85 },
      { header: 'BALANCE ($)', width: 94 }
    ],
    9,
    21
  );
}

function buildSinkingFundsTracker(theme) {
  const filename = path.join(OUTPUT_DIR, `Sinking-Funds-Tracker_${theme.name}.pdf`);
  const doc = new PDFDocument({ size: 'LETTER', margin: 0, bufferPages: true });
  const stream = fs.createWriteStream(filename);
  doc.pipe(stream);

  const TOTAL = 14;
  const TITLE = 'Sinking Funds Master Tracker';

  drawCoverPage(
    doc,
    theme,
    'SINKING FUNDS TRACKER',
    '12 Dedicated Sinking Fund Buckets (Car Maintenance, Holidays, Medical, Annual Subscriptions, Travel & More) with Target Goal, Saved So Far & Progress Bars',
    'Complete 14-Page Future Expense Smoothing System',
    TOTAL,
    [
      {
        title: '1. Turn Lumpy Annual Surprises into Smooth Monthly Transfers',
        desc: 'Eliminate credit card emergencies by funding irregular annual expenses 1/12th at a time.'
      },
      {
        title: '2. 12 Dedicated Sinking Fund Bucket Dashboards',
        desc: 'Pre-configured ledgers for Auto, Holidays, Medical, Subscriptions, Travel, Home, Taxes, Pets & Tech.'
      },
      {
        title: '3. Target Goal, Saved So Far & Visual Progress Bars',
        desc: 'Every single bucket includes 0%-100% progress bars, monthly contribution math, and running balance.'
      },
      {
        title: '4. High-Yield Savings Account (HYSA) Sub-Bucket Reconciliation',
        desc: 'Keep all cash in one high-APY account while tracking exact virtual bucket allocations on paper.'
      },
      {
        title: '5. Annual Renewal Calendar & Interest Compounding Log',
        desc: 'Map every annual renewal month-by-month so cash is always waiting before the bill arrives.'
      }
    ]
  );

  const bucketPairs = [
    [
      {
        title: 'Bucket #1: Car Maintenance, Tires & Repairs',
        note: 'Oil changes, brake pads, tire replacement, deductible buffer & unexpected mechanic bills.'
      },
      {
        title: 'Bucket #2: Holidays, Christmas & Seasonal Hosting',
        note: 'Holiday gifts, travel, wrapping, festive groceries, family hosting & end-of-year generosity.'
      }
    ],
    [
      {
        title: 'Bucket #3: Medical, Dental, Vision & HSA Buffer',
        note: 'Deductibles, dental work, glasses/contacts, prescriptions & specialist co-pays.'
      },
      {
        title: 'Bucket #4: Annual Subscriptions & Memberships',
        note: 'Amazon Prime, Costco, credit card annual fees, cloud storage, domain renewals & software.'
      }
    ],
    [
      {
        title: 'Bucket #5: Travel, Vacations & Weekend Getaways',
        note: 'Flights, hotels, rental cars, national parks, experiences & 100% debt-free vacation memories.'
      },
      {
        title: 'Bucket #6: Home Repairs, Maintenance & Appliances',
        note: 'HVAC servicing, plumbing, roof/gutter care, lawn equipment & appliance replacement reserve.'
      }
    ],
    [
      {
        title: 'Bucket #7: Auto Insurance, Registration & Property Taxes',
        note: '6-month auto insurance premiums (pay-in-full discount), vehicle tags & annual tax bills.'
      },
      {
        title: 'Bucket #8: Gifts, Birthdays, Weddings & Anniversaries',
        note: 'Family birthdays, baby showers, weddings, teacher appreciation & anniversary celebrations.'
      }
    ],
    [
      {
        title: 'Bucket #9: Pet Care, Vet Visits & Annual Vaccines',
        note: 'Annual wellness exams, vaccines, flea/heartworm prevention, grooming & emergency vet fund.'
      },
      {
        title: 'Bucket #10: Tech, Laptop & Smartphone Replacement',
        note: 'Upgrade phones, laptops, tablets & home office gear in cash on a 3-to-4 year cycle.'
      }
    ],
    [
      {
        title: 'Bucket #11: Clothing, Seasonal Wardrobe & Back-to-School',
        note: 'Winter coats, work attire, kids growing shoes, school supplies & sports registrations.'
      },
      {
        title: 'Bucket #12: Emergency Buffer & Opportunity Fund',
        note: 'Income smoothing, career transition buffer, professional certifications & high-ROI opportunities.'
      }
    ]
  ];

  const pageSpecs = [
    {
      title: 'Master 12-Bucket Sinking Funds Dashboard',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Total Target Goals ($)' },
          { label: 'Total Saved So Far ($)' },
          { label: 'Monthly Contribution ($)' },
          { label: 'Overall Funding %' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: '#', width: 28 },
            { header: 'DEDICATED SINKING FUND BUCKET', width: 172 },
            { header: 'TARGET GOAL', width: 75 },
            { header: 'MONTHLY ADD', width: 75 },
            { header: 'SAVED SO FAR', width: 80 },
            { header: 'PROGRESS BAR (0-100%)', width: 110, type: 'progress' }
          ],
          12,
          36,
          {
            showTotal: true,
            totalLabel: 'TOTAL ACROSS ALL 12 SINKING FUND BUCKETS',
            prefill: [
              ['01', 'Car Maintenance, Tires & Repairs'],
              ['02', 'Holidays, Christmas & Seasonal Hosting'],
              ['03', 'Medical, Dental, Vision & Copays'],
              ['04', 'Annual Subscriptions & Memberships'],
              ['05', 'Travel, Vacations & Getaways'],
              ['06', 'Home Repairs & Appliance Reserve'],
              ['07', 'Auto Insurance & Registration'],
              ['08', 'Gifts, Birthdays & Weddings'],
              ['09', 'Pet Care & Veterinary Reserve'],
              ['10', 'Tech & Device Replacement'],
              ['11', 'Clothing & Back-to-School'],
              ['12', 'Emergency Buffer & Opportunity Fund']
            ]
          }
        );
      }
    },
    {
      title: 'Annual Expense Timeline & Monthly Sinking Calculator',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Total Annual Lumpy Bills' },
          { label: 'Divide by 12 Months (÷12)' },
          { label: 'Divide by 26 Paychecks' },
          { label: 'HYSA Account APY (%)' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'MONTH DUE', width: 80 },
            { header: 'MAJOR ANNUAL / SEMI-ANNUAL EXPENSE EVENT', width: 200 },
            { header: 'EST. COST ($)', width: 85 },
            { header: 'MONTHS LEFT', width: 80 },
            { header: 'SAVE / MO ($)', width: 95 }
          ],
          22,
          21,
          {
            showTotal: true,
            totalLabel: 'TOTAL MONTHLY SINKING CONTRIBUTION REQUIRED',
            prefill: [
              ['January'],
              ['February'],
              ['March'],
              ['April'],
              ['May'],
              ['June'],
              ['July'],
              ['August'],
              ['September'],
              ['October'],
              ['November'],
              ['December']
            ]
          }
        );
      }
    },
    ...bucketPairs.map((pair, idx) => ({
      title: `Dedicated Sinking Fund Buckets #${idx * 2 + 1} & #${idx * 2 + 2}`,
      render: () => {
        drawSinkingBucketCard(doc, theme, 36, 74, 540, 322, pair[0].title, pair[0].note);
        drawSinkingBucketCard(doc, theme, 36, 410, 540, 322, pair[1].title, pair[1].note);
      }
    })),
    {
      title: '12-Month Sinking Fund Deposit & Withdrawal Matrix',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Starting HYSA Balance' },
          { label: 'Total Yearly Deposits (+)' },
          { label: 'Total Planned Spend (-)' },
          { label: 'Ending HYSA Balance' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'MONTH', width: 85 },
            { header: 'START BAL ($)', width: 90 },
            { header: '+ DEPOSITS ($)', width: 90 },
            { header: '+ HYSA INTEREST', width: 90 },
            { header: '- WITHDRAWALS', width: 90 },
            { header: 'ENDING BAL ($)', width: 95 }
          ],
          12,
          24,
          {
            showTotal: true,
            totalLabel: 'ANNUAL SINKING FUND CASH FLOW SUMMARY',
            prefill: [
              ['January'],
              ['February'],
              ['March'],
              ['April'],
              ['May'],
              ['June'],
              ['July'],
              ['August'],
              ['September'],
              ['October'],
              ['November'],
              ['December']
            ]
          }
        );
      }
    },
    {
      title: 'High-Yield Savings Account (HYSA) Reconciliation Audit',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Bank Statement Balance' },
          { label: 'Sum of All 12 Buckets' },
          { label: 'Unallocated Interest ($)' },
          { label: 'Reconciled Difference ($0)', placeholder: '$ 0.00' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'RECONCILIATION DATE', width: 110 },
            { header: 'HYSA BANK STATEMENT ($)', width: 135 },
            { header: 'SUM OF 12 BUCKETS ($)', width: 135 },
            { header: 'INTEREST ALLOCATED', width: 95 },
            { header: 'MATCHED', width: 65, type: 'checkbox' }
          ],
          22,
          21,
          { showTotal: true, totalLabel: '100% PENNY-PERFECT SINKING FUND RECONCILIATION' }
        );
      }
    },
    {
      title: 'Year-End Sinking Fund Review & Next-Year Target Reset',
      render: () => {
        let y = drawKpiRow(doc, theme, 36, 74, 540, [
          { label: 'Emergencies Paid in Cash' },
          { label: 'Credit Card Debt Avoided' },
          { label: 'Underfunded Bucket' },
          { label: 'Overfunded Bucket' }
        ]);
        drawTable(
          doc,
          theme,
          36,
          y,
          [
            { header: 'SINKING FUND BUCKET', width: 175 },
            { header: 'THIS YR ACTUAL SPEND', width: 115 },
            { header: 'YEAR-END ROLLOVER', width: 115 },
            { header: 'NEXT YR MONTHLY TARGET', width: 135 }
          ],
          12,
          36,
          {
            showTotal: true,
            totalLabel: 'NEXT YEAR UPDATED MONTHLY SINKING FUND PLAN',
            prefill: [
              ['01. Car Maintenance & Tires'],
              ['02. Holidays & Christmas'],
              ['03. Medical, Dental & Vision'],
              ['04. Annual Subscriptions'],
              ['05. Travel & Vacations'],
              ['06. Home Repairs & Appliances'],
              ['07. Auto Insurance & Tags'],
              ['08. Gifts, Birthdays & Weddings'],
              ['09. Pet Care & Veterinary'],
              ['10. Tech & Device Upgrade'],
              ['11. Clothing & Back-to-School'],
              ['12. Emergency & Opportunity']
            ]
          }
        );
      }
    }
  ];

  pageSpecs.forEach((spec, idx) => {
    doc.addPage();
    drawPageChrome(doc, theme, TITLE, spec.title, idx + 2, TOTAL);
    spec.render();
  });

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filename));
    stream.on('error', reject);
  });
}

async function generateAllWealthPlanners() {
  const results = [];
  for (const themeKey of Object.keys(THEMES)) {
    const theme = THEMES[themeKey];
    results.push(await buildZeroBasedBudgetBinder(theme));
    results.push(await buildDebtSnowballTracker(theme));
    results.push(await buildSideHustleLaunchpad(theme));
    results.push(await buildNoSpendChallenge(theme));
    results.push(await buildSinkingFundsTracker(theme));
  }
  console.log(`Generated ${results.length} wealth & finance PDF planners successfully:`);
  results.forEach((f) => {
    const stat = fs.statSync(f);
    console.log(` - ${path.basename(f)} (${stat.size} bytes)`);
  });
}

generateAllWealthPlanners().catch((err) => {
  console.error('Error generating wealth planners:', err);
  process.exit(1);
});
