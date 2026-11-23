/**
 * SANJALIKA WATER PARK - INTERACTIVE BOOKING LOGIC
 * Dynamic calculator, add-ons, promo code, instant ticket pass generation & printable ticket
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingSystem();
});

function initBookingSystem() {
  const form = document.getElementById('parkBookingForm');
  if (!form) return;

  // Pricing configuration in PKR (Pakistani Rupee)
  const TICKET_RATES = {
    regular: { name: 'Adult Splash Pass (Above 4ft)', price: 2500, childPrice: 1800, seniorPrice: 1600 },
    student: { name: 'Student Splash Pass (with Valid ID)', price: 1999, childPrice: 1800, seniorPrice: 1600 },
    family: { name: 'Family Grand Combo (2 Adults + 2 Kids)', price: 7500, childPrice: 1500, seniorPrice: 1500 },
    vip: { name: 'Mermaid VIP Cabana Pass', price: 6500, childPrice: 4000, seniorPrice: 4000 }
  };

  const ADDON_RATES = {
    locker: 400,
    costume: 500,
    buffet: 1200
  };

  let selectedType = 'regular';
  let adults = 2;
  let children = 0;
  let seniors = 0;
  let addons = {
    locker: 1,
    costume: 0,
    buffet: 0
  };
  let discountPercent = 0;

  // Pre-fill from sessionStorage if available
  const savedPref = sessionStorage.getItem('sanjalika_booking_pref');
  if (savedPref) {
    try {
      const parsed = JSON.parse(savedPref);
      if (parsed.adults !== undefined) adults = parsed.adults;
      if (parsed.children !== undefined) children = parsed.children;
      if (parsed.type && TICKET_RATES[parsed.type]) selectedType = parsed.type;
      if (parsed.date) {
        const dateInput = document.getElementById('visitDate');
        if (dateInput) dateInput.value = parsed.date;
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Set min date to today
  const dateInput = document.getElementById('visitDate');
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // Bind Ticket Type Radios
  const typeOptions = document.querySelectorAll('.ticket-option');
  typeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      typeOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedType = radio.value;
        calculateTotal();
      }
    });

    // Check if initial selection matches
    const radio = opt.querySelector('input[type="radio"]');
    if (radio && radio.value === selectedType) {
      opt.classList.add('selected');
      radio.checked = true;
    }
  });

  // Setup Counters
  const setupCounter = (decId, incId, displayId, getVal, setVal) => {
    const decBtn = document.getElementById(decId);
    const incBtn = document.getElementById(incId);
    const display = document.getElementById(displayId);

    if (decBtn && incBtn && display) {
      display.textContent = getVal();

      decBtn.addEventListener('click', () => {
        let val = getVal();
        if (val > 0) {
          setVal(val - 1);
          display.textContent = getVal();
          calculateTotal();
        }
      });

      incBtn.addEventListener('click', () => {
        let val = getVal();
        if (val < 25) {
          setVal(val + 1);
          display.textContent = getVal();
          calculateTotal();
        }
      });
    }
  };

  setupCounter('btnAdultDec', 'btnAdultInc', 'adultCountDisplay', () => adults, (v) => { adults = v; });
  setupCounter('btnChildDec', 'btnChildInc', 'childCountDisplay', () => children, (v) => { children = v; });
  setupCounter('btnSeniorDec', 'btnSeniorInc', 'seniorCountDisplay', () => seniors, (v) => { seniors = v; });

  // Add-on checkboxes or counters
  const lockerCountEl = document.getElementById('lockerCount');
  const costumeCountEl = document.getElementById('costumeCount');
  const buffetCountEl = document.getElementById('buffetCount');

  if (lockerCountEl) {
    lockerCountEl.addEventListener('change', (e) => {
      addons.locker = parseInt(e.target.value) || 0;
      calculateTotal();
    });
  }

  if (costumeCountEl) {
    costumeCountEl.addEventListener('change', (e) => {
      addons.costume = parseInt(e.target.value) || 0;
      calculateTotal();
    });
  }

  if (buffetCountEl) {
    buffetCountEl.addEventListener('change', (e) => {
      addons.buffet = parseInt(e.target.value) || 0;
      calculateTotal();
    });
  }

  // Promo Code Handler
  const promoInput = document.getElementById('promoCodeInput');
  const promoBtn = document.getElementById('applyPromoBtn');
  const promoMsg = document.getElementById('promoMessage');

  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'MERMAID20') {
        discountPercent = 20;
        promoMsg.innerHTML = '<span style="color:#10b981; font-weight:700;">✓ Coupon applied: 20% Mermaid Splash Discount!</span>';
      } else if (code === 'SANJALIKA10') {
        discountPercent = 10;
        promoMsg.innerHTML = '<span style="color:#10b981; font-weight:700;">✓ Coupon applied: 10% Welcome Discount!</span>';
      } else if (code === '') {
        discountPercent = 0;
        promoMsg.innerHTML = '';
      } else {
        discountPercent = 0;
        promoMsg.innerHTML = '<span style="color:#ef4444; font-weight:700;">✗ Invalid code. Try "MERMAID20" or "SANJALIKA10"</span>';
      }
      calculateTotal();
    });
  }

  // Calculation function
  function calculateTotal() {
    const typeInfo = TICKET_RATES[selectedType] || TICKET_RATES.regular;

    const adultSubtotal = adults * typeInfo.price;
    const childSubtotal = children * typeInfo.childPrice;
    const seniorSubtotal = seniors * typeInfo.seniorPrice;

    const ticketSubtotal = adultSubtotal + childSubtotal + seniorSubtotal;

    const addonsSubtotal = (addons.locker * ADDON_RATES.locker) +
                           (addons.costume * ADDON_RATES.costume) +
                           (addons.buffet * ADDON_RATES.buffet);

    const rawTotal = ticketSubtotal + addonsSubtotal;
    const discountAmount = Math.round((rawTotal * discountPercent) / 100);
    const taxableAmount = rawTotal - discountAmount;
    const gstTax = Math.round(taxableAmount * 0.16); // 16% Sales Tax
    const finalPayable = taxableAmount + gstTax;

    // Update DOM summary elements
    setText('sumTicketName', typeInfo.name);
    setText('sumVisitorsBreakdown', `${adults} Adult(s), ${children} Child(ren), ${seniors} Senior(s)`);
    setText('sumTicketSubtotal', `PKR ${ticketSubtotal.toLocaleString('en-PK')}`);
    setText('sumAddonsSubtotal', `PKR ${addonsSubtotal.toLocaleString('en-PK')}`);

    const discountRow = document.getElementById('discountRow');
    if (discountRow) {
      if (discountPercent > 0) {
        discountRow.style.display = 'flex';
        setText('sumDiscount', `-PKR ${discountAmount.toLocaleString('en-PK')} (${discountPercent}%)`);
      } else {
        discountRow.style.display = 'none';
      }
    }

    setText('sumGstTax', `PKR ${gstTax.toLocaleString('en-PK')}`);
    setText('sumGrandTotal', `PKR ${finalPayable.toLocaleString('en-PK')}`);

    return {
      typeInfo,
      adults,
      children,
      seniors,
      ticketSubtotal,
      addonsSubtotal,
      discountAmount,
      gstTax,
      finalPayable
    };
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (adults + children + seniors === 0) {
      alert('Please select at least 1 visitor before proceeding with booking.');
      return;
    }

    const name = document.getElementById('visitorName')?.value.trim();
    const email = document.getElementById('visitorEmail')?.value.trim();
    const phone = document.getElementById('visitorPhone')?.value.trim();
    const date = document.getElementById('visitDate')?.value;

    if (!name || !email || !phone || !date) {
      alert('Please fill all mandatory visitor information fields.');
      return;
    }

    const calcResult = calculateTotal();
    const bookingId = 'SWP-' + Math.floor(100000 + Math.random() * 900000);

    // Show Confirmation E-Ticket Modal
    showConfirmationModal({
      bookingId,
      name,
      email,
      phone,
      date,
      calcResult
    });
  });

  // Initial calculation
  calculateTotal();
}

/**
 * Display the Generated E-Ticket Pass Modal
 */
function showConfirmationModal(data) {
  const modal = document.getElementById('bookingConfirmationModal');
  if (!modal) return;

  const content = document.getElementById('ticketPassContent');
  if (content) {
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    content.innerHTML = `
      <div class="ticket-pass" id="printableTicketArea">
        <div class="ticket-pass-header">
          <div>
            <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: #0284c7; font-weight: 800;">
              SANJALIKA WATER PARK • OFFICIAL E-TICKET PASS
            </div>
            <h2 style="color: #0c4a6e; margin: 4px 0; font-size: 1.6rem;">${data.calcResult.typeInfo.name}</h2>
            <div style="font-size: 0.85rem; color: #10b981; font-weight: 700;">
              ✓ Status: Confirmed & Paid • Instant Entry Allowed
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.8rem; color: #64748b;">Booking Reference:</div>
            <div style="font-size: 1.25rem; font-weight: 900; color: #0284c7; letter-spacing: 1px;">
              ${data.bookingId}
            </div>
          </div>
        </div>

        <div class="ticket-pass-grid">
          <div class="ticket-pass-item">
            <small>Primary Guest</small>
            <strong>${data.name}</strong>
          </div>
          <div class="ticket-pass-item">
            <small>Visit Date</small>
            <strong>${formattedDate}</strong>
          </div>
          <div class="ticket-pass-item">
            <small>Park Hours</small>
            <strong>10:00 AM - 6:00 PM</strong>
          </div>
          <div class="ticket-pass-item">
            <small>Total Visitors</small>
            <strong>${data.calcResult.adults} Adults, ${data.calcResult.children} Children, ${data.calcResult.seniors} Seniors</strong>
          </div>
          <div class="ticket-pass-item">
            <small>Add-Ons Included</small>
            <strong>Lockers & Services</strong>
          </div>
          <div class="ticket-pass-item">
            <small>Total Amount Paid</small>
            <strong style="color: #0284c7; font-size: 1.2rem;">PKR ${data.calcResult.finalPayable.toLocaleString('en-PK')}</strong>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #cbd5e1; padding-top: 20px;">
          <div>
            <div style="font-size: 0.85rem; color: #334155; font-weight: 600; margin-bottom: 5px;">
              📍 Gate Access: Show this QR pass at Turnstile 1-4
            </div>
            <div style="font-size: 0.78rem; color: #64748b;">
              • Valid photo ID matching primary guest required at entrance.<br/>
              • Waterproof wristbands issued upon QR scan.<br/>
              • Strict 100% nylon/lycra swimwear mandatory on all water slides.
            </div>
          </div>
          <div style="text-align: center;">
            <svg class="qr-code-placeholder" viewBox="0 0 100 100" width="100" height="100" style="background: #fff; padding: 6px; border: 1px solid #cbd5e1;">
              <!-- Stylized Vector QR Code -->
              <rect width="100" height="100" fill="#ffffff" />
              <!-- Top Left Marker -->
              <rect x="10" y="10" width="28" height="28" fill="#0c4a6e" />
              <rect x="14" y="14" width="20" height="20" fill="#ffffff" />
              <rect x="18" y="18" width="12" height="12" fill="#0c4a6e" />
              <!-- Top Right Marker -->
              <rect x="62" y="10" width="28" height="28" fill="#0c4a6e" />
              <rect x="66" y="14" width="20" height="20" fill="#ffffff" />
              <rect x="70" y="18" width="12" height="12" fill="#0c4a6e" />
              <!-- Bottom Left Marker -->
              <rect x="10" y="62" width="28" height="28" fill="#0c4a6e" />
              <rect x="14" y="66" width="20" height="20" fill="#ffffff" />
              <rect x="18" y="70" width="12" height="12" fill="#0c4a6e" />
              <!-- Grid Matrix Dots -->
              <rect x="44" y="12" width="6" height="6" fill="#0284c7" />
              <rect x="52" y="18" width="6" height="6" fill="#0284c7" />
              <rect x="44" y="28" width="6" height="6" fill="#0284c7" />
              <rect x="12" y="44" width="6" height="6" fill="#0284c7" />
              <rect x="22" y="48" width="6" height="6" fill="#0284c7" />
              <rect x="46" y="46" width="14" height="14" fill="#0c4a6e" />
              <rect x="66" y="44" width="6" height="6" fill="#0284c7" />
              <rect x="78" y="48" width="6" height="6" fill="#0284c7" />
              <rect x="44" y="66" width="6" height="6" fill="#0284c7" />
              <rect x="54" y="76" width="6" height="6" fill="#0284c7" />
              <rect x="72" y="66" width="6" height="6" fill="#0284c7" />
              <rect x="80" y="74" width="6" height="6" fill="#0284c7" />
            </svg>
            <div style="font-size: 0.7rem; color: #64748b; font-family: monospace; margin-top: 4px;">
              ${data.bookingId}
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 25px; display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
        <button type="button" class="btn btn-primary" onclick="printTicketPass()">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          Print Ticket / Save as PDF
        </button>
        <button type="button" class="btn btn-secondary" onclick="closeConfirmationModal()">
          Close
        </button>
      </div>
    `;
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function printTicketPass() {
  const printable = document.getElementById('printableTicketArea');
  if (!printable) return;

  const win = window.open('', '_blank', 'width=800,height=700');
  win.document.open();
  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Sanjalika Water Park - Official E-Ticket</title>
        <link rel="stylesheet" href="css/style.css">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #fff; }
          .ticket-pass { border: 2px dashed #0284c7; padding: 25px; max-width: 650px; margin: 0 auto; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        ${printable.outerHTML}
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);
  win.document.close();
}

function closeConfirmationModal() {
  const modal = document.getElementById('bookingConfirmationModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Make functions available globally for modal buttons
window.printTicketPass = printTicketPass;
window.closeConfirmationModal = closeConfirmationModal;

