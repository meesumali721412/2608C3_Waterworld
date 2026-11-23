/**
 * SANJALIKA WATER PARK - MAIN JAVASCRIPT
 * Smooth navigation, interactive filters, lightbox, accordions, and document downloaders (PDF & DOC)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initStickyHeader();
  initBackToTop();
  initParkStatus();
  initFaqAccordion();
  initGalleryFilter();
  initGalleryLightbox();
  initDownloadHandlers();
  initQuickBookingCalc();
});

/* ==========================================================================
   1. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');

      const icon = menuBtn.querySelector('svg');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>`;
        } else {
          icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>`;
        }
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuBtn.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        const icon = menuBtn.querySelector('svg');
        if (icon) {
          icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>`;
        }
      }
    });
  }
}

/* ==========================================================================
   2. STICKY HEADER & SCROLL BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
      header.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12)';
    } else {
      header.classList.remove('scrolled');
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    }
  });
}

/* ==========================================================================
   3. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   4. LIVE PARK STATUS & TIMING CHECKER
   ========================================================================== */
function initParkStatus() {
  const badge = document.querySelector('.status-badge');
  if (!badge) return;

  const now = new Date();
  const hours = now.getHours();
  // Sanjalika Water Park timings: 10:00 AM to 6:00 PM (10 to 18)
  if (hours >= 10 && hours < 18) {
    badge.innerHTML = `<span class="status-dot"></span> Open Today (10 AM - 6 PM)`;
    badge.style.background = 'rgba(16, 185, 129, 0.2)';
    badge.style.color = '#34d399';
  } else {
    badge.innerHTML = `<span class="status-dot" style="background:#f59e0b;"></span> Opens at 10:00 AM Tomorrow`;
    badge.style.background = 'rgba(245, 158, 11, 0.2)';
    badge.style.color = '#fbbf24';
  }
}

/* ==========================================================================
   5. FAQ ACCORDION COMPONENT
   ========================================================================== */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordion items
      accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
    });
  });
}

/* ==========================================================================
   6. RIDES & GALLERY FILTERING
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterCards = document.querySelectorAll('[data-category]');

  if (!filterBtns.length || !filterCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      filterCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. GALLERY LIGHTBOX MODAL
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h4')?.textContent || img.getAttribute('alt') || 'Sanjalika Water Park Attraction';

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = title;
        if (lightboxCaption) {
          lightboxCaption.textContent = title;
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   8. DOWNLOAD BROCHURE / PARK INFO AS PDF OR DOC
   ========================================================================== */
function initDownloadHandlers() {
  const downloadPdfBtns = document.querySelectorAll('.btn-download-pdf');
  const downloadDocBtns = document.querySelectorAll('.btn-download-doc');

  downloadPdfBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadParkGuidePDF();
    });
  });

  downloadDocBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadParkGuideDOC();
    });
  });
}

/**
 * Generates and downloads the Official Sanjalika Water Park Guide as PDF.
 * Uses print styling or HTML to printable view window for high-fidelity PDF output.
 */
function downloadParkGuidePDF() {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Please allow popups to download the Sanjalika Water Park PDF Guide.');
    return;
  }

  const guideHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Sanjalika Water Park - Official Visitor Information Guide</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #1e293b;
          line-height: 1.6;
          margin: 30px;
          background: #ffffff;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #0284c7;
          padding-bottom: 20px;
          margin-bottom: 25px;
        }
        .header h1 {
          color: #0284c7;
          margin: 0;
          font-size: 28px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .header p {
          color: #0d9488;
          font-weight: bold;
          margin: 5px 0 0 0;
        }
        .meta-box {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }
        h2 {
          color: #0369a1;
          border-left: 4px solid #06b6d4;
          padding-left: 10px;
          font-size: 18px;
          margin-top: 25px;
          margin-bottom: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 13px;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background: #e0f2fe;
          color: #0369a1;
        }
        .rule-list {
          padding-left: 20px;
        }
        .rule-list li {
          margin-bottom: 8px;
        }
        .highlight-box {
          background: #fffbeb;
          border-left: 4px solid #f59e0b;
          padding: 12px;
          margin: 20px 0;
          font-size: 13px;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #cbd5e1;
          padding-top: 15px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
        }
        @media print {
          body { margin: 15mm; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>SANJALIKA WATER PARK</h1>
        <p>The Ultimate & Out-of-this-World Aquatic Adventure</p>
        <small>Featuring the World-Class Mermaid Statues, Mystical Cave & Giant Wave Pool</small>
      </div>

      <div class="meta-box">
        <div><strong>Park Timings:</strong> 10:00 AM - 6:00 PM (Everyday)</div>
        <div><strong>Water Temp:</strong> 26°C Controlled</div>
        <div><strong>Helpline:</strong> +91 98765 43210</div>
      </div>

      <h2>1. Park Highlights & Theme</h2>
      <p>Decorated with enchanted mermaids and mythical statues, Sanjalika Water Park is home to the largest cave and swimming pool area powered by modern filtration and wave-generation technology. Offering more than 20 high-speed, family, and kid-friendly slides.</p>

      <h2>2. Signature Rides & Slides</h2>
      <table>
        <thead>
          <tr>
            <th>Ride Name</th>
            <th>Type</th>
            <th>Thrill Level</th>
            <th>Height Requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>The Mermaid's Abyss</td>
            <td>Tornado Funnel Slide</td>
            <td>Extreme (5/5)</td>
            <td>Min 120 cm</td>
          </tr>
          <tr>
            <td>Poseidon's Thunder Drop</td>
            <td>80ft Vertical Freefall</td>
            <td>Extreme (5/5)</td>
            <td>Min 130 cm</td>
          </tr>
          <tr>
            <td>The Great Mystical Cave River</td>
            <td>Illuminated Cave Lazy River</td>
            <td>Family (2/5)</td>
            <td>All Heights</td>
          </tr>
          <tr>
            <td>Aqua Tsunami Wave Pool</td>
            <td>Modern 2.5m Ocean Waves</td>
            <td>Moderate (3/5)</td>
            <td>All Heights (Lifejacket for kids)</td>
          </tr>
          <tr>
            <td>Kraken's Multi-Racer</td>
            <td>6-Lane High-Speed Mat Racer</td>
            <td>High (4/5)</td>
            <td>Min 110 cm</td>
          </tr>
          <tr>
            <td>Mermaid Splash Fortress</td>
            <td>Interactive Kids Water Playground</td>
            <td>Fun (1/5)</td>
            <td>Kids & Families</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Ticket Tariffs</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Weekday Rate</th>
            <th>Weekend & Holiday</th>
            <th>Includes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Adult Splash Pass (Above 4ft)</td>
            <td>PKR 2,500</td>
            <td>PKR 2,800</td>
            <td>Unlimited Rides, Cave & Pools</td>
          </tr>
          <tr>
            <td>Child Pass (Below 4ft)</td>
            <td>PKR 1,800</td>
            <td>PKR 2,000</td>
            <td>Kids Play Zone, Wave Pool & Lazy River</td>
          </tr>
          <tr>
            <td>Senior Citizen (Age 60+)</td>
            <td>PKR 1,600</td>
            <td>PKR 1,800</td>
            <td>Access to relaxation pools & caves</td>
          </tr>
          <tr>
            <td>Mermaid VIP Cabana Pass</td>
            <td>PKR 6,500</td>
            <td>PKR 7,500</td>
            <td>Express Entry, Private Cabana & Buffet Lunch</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Important Park Rules & Dress Code</h2>
      <ul class="rule-list">
        <li><strong>Swimwear:</strong> 100% Lycra or Nylon swimwear is strictly mandatory for all water attractions. Cottons are strictly prohibited.</li>
        <li><strong>Safety:</strong> Obey instructions given by certified lifeguards. Heart patients and expectant mothers should avoid extreme thrill slides.</li>
        <li><strong>Hygiene:</strong> Mandatory shower before entering the swimming pools and cave rivers.</li>
        <li><strong>Lockers:</strong> Waterproof RFID wristbands are provided at locker counters. Keep your valuables secure.</li>
      </ul>

      <div class="highlight-box">
        <strong>Need Assistance?</strong> Reach our Guest Relations Counter at Gate 1 or call our 24/7 tourist desk at <strong>+91 98765 43210</strong>.
      </div>

      <div class="footer">
        <p>© 2026 Sanjalika Water Park. All rights reserved. Sanjalika Boulevard, Ocean Drive, Adventure Bay.</p>
        <p class="no-print">Press <strong>Ctrl+P</strong> (or Cmd+P on Mac) to save this guide as a PDF or print it.</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(guideHtml);
  printWindow.document.close();
}

/**
 * Generates and downloads the Official Sanjalika Water Park Guide as a .doc (Microsoft Word) file.
 */
function downloadParkGuideDOC() {
  const docContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Sanjalika Water Park - Visitor Information Guide</title>
      <style>
        body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; color: #1e293b; line-height: 1.5; }
        h1 { color: #0284c7; text-align: center; font-size: 24pt; margin-bottom: 0; }
        .subtitle { color: #0d9488; text-align: center; font-style: italic; font-size: 14pt; margin-top: 5px; }
        h2 { color: #0369a1; border-bottom: 2px solid #0284c7; padding-bottom: 4px; font-size: 16pt; margin-top: 20pt; }
        table { width: 100%; border-collapse: collapse; margin-top: 10pt; }
        th, td { border: 1px solid #94a3b8; padding: 8px; text-align: left; }
        th { background-color: #e0f2fe; color: #0c4a6e; }
        .box { background-color: #f0fdf4; border: 1px solid #86efac; padding: 10pt; margin: 15pt 0; }
      </style>
    </head>
    <body>
      <h1>SANJALIKA WATER PARK</h1>
      <p class='subtitle'>Official Information, Rides, Timings & Visitor Guidelines</p>
      <hr/>

      <h2>1. About Sanjalika Water Park</h2>
      <p>Sanjalika Water Park is definitely an ultimate and out of the world source of entertainment. Decorated by mermaids, other statues, the Sanjalika Water park has largest cave and swimming pool area of modern technology a kind of place for thrills and fun. At Sanjalika Water park there is lot of water rides which are very exciting and thrilling.</p>

      <h2>2. Operating Hours & Key Highlights</h2>
      <ul>
        <li><strong>Park Operational Hours:</strong> 10:00 AM to 6:00 PM (Monday through Sunday)</li>
        <li><strong>Water Quality:</strong> State-of-the-art ozonated German filtration system, 26°C temperature controlled</li>
        <li><strong>Special Attraction:</strong> The Grand Mermaid Cave & Statues with ambient LED lighting</li>
        <li><strong>Wave Pool:</strong> Massive 2.5-meter ocean wave simulator with golden sandy deck</li>
      </ul>

      <h2>3. Rides & Slides Directory</h2>
      <table>
        <tr>
          <th>Ride / Slide Name</th>
          <th>Category</th>
          <th>Description</th>
        </tr>
        <tr>
          <td>The Mermaid's Abyss</td>
          <td>Extreme Thrill</td>
          <td>Giant 60ft tornado vortex funnel plunging into mysterious cave waters.</td>
        </tr>
        <tr>
          <td>Poseidon's Thunder Drop</td>
          <td>Speed Slide</td>
          <td>Near-vertical drop from an 80-foot tower reaching speeds over 65 km/h.</td>
        </tr>
        <tr>
          <td>The Great Mystical Cave River</td>
          <td>Family Scenic</td>
          <td>Float past illuminated mermaid statues, stalactite caves, and waterfalls.</td>
        </tr>
        <tr>
          <td>Aqua Tsunami Wave Pool</td>
          <td>Family & Groups</td>
          <td>Largest modern wave pool creating oceanic breakers every 15 minutes.</td>
        </tr>
        <tr>
          <td>Kraken's Multi-Racer</td>
          <td>Mat Racing</td>
          <td>6-lane head-first competition slide with digital finish-line timers.</td>
        </tr>
        <tr>
          <td>Mermaid Splash Fortress</td>
          <td>Kids Kingdom</td>
          <td>Interactive play castle with 1000L tipping bucket and child slides.</td>
        </tr>
      </table>

      <h2>4. Ticket Tariffs</h2>
      <table>
        <tr>
          <th>Ticket Option</th>
          <th>Price</th>
          <th>Validity</th>
        </tr>
        <tr>
          <td>Adult Splash Pass</td>
          <td>PKR 2,500</td>
          <td>Full Day All-Access</td>
        </tr>
        <tr>
          <td>Child Splash Pass (Below 4ft)</td>
          <td>PKR 1,800</td>
          <td>Full Day All-Access</td>
        </tr>
        <tr>
          <td>Senior Citizen Pass</td>
          <td>PKR 1,600</td>
          <td>Full Day All-Access</td>
        </tr>
        <tr>
          <td>Mermaid VIP Cabana Pass</td>
          <td>PKR 6,500</td>
          <td>Includes Cabana + Buffet + Express Entry</td>
        </tr>
      </table>

      <h2>5. Facilities Available</h2>
      <p>1. High-tech waterproof RFID lockers</p>
      <p>2. International hygiene changing suites & showers</p>
      <p>3. Food Zone with 5 multi-cuisine restaurants</p>
      <p>4. 24/7 First-aid emergency trauma room with certified EMTs</p>
      <p>5. Ample shaded parking for 1,500+ vehicles</p>

      <div class='box'>
        <strong>Contact Information:</strong><br/>
        Address: Sanjalika Boulevard, Coastal Highway, Adventure Bay<br/>
        Phone: +91 98765 43210 / +91 11 2345 6789<br/>
        Email: contact@sanjalikawaterpark.com<br/>
        Website: www.sanjalikawaterpark.com
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', docContent], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'Sanjalika_Water_Park_Information_Guide.doc';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

/* ==========================================================================
   9. QUICK BOOKING ESTIMATOR (HOME PAGE)
   ========================================================================== */
function initQuickBookingCalc() {
  const quickForm = document.getElementById('heroQuickBookingForm');
  if (!quickForm) return;

  const adultValEl = document.getElementById('heroAdultCount');
  const childValEl = document.getElementById('heroChildCount');
  const priceDisplay = document.getElementById('heroCalcTotal');

  const ADULT_PRICE = 2500;
  const CHILD_PRICE = 1800;

  let adultCount = 2;
  let childCount = 1;

  const updateTotal = () => {
    const total = (adultCount * ADULT_PRICE) + (childCount * CHILD_PRICE);
    if (priceDisplay) {
      priceDisplay.textContent = `PKR ${total.toLocaleString('en-PK')}`;
    }
  };

  const setupCounter = (decId, incId, countSetter, getCount, displayEl) => {
    const decBtn = document.getElementById(decId);
    const incBtn = document.getElementById(incId);

    if (decBtn && incBtn && displayEl) {
      decBtn.addEventListener('click', () => {
        let current = getCount();
        if (current > 0) {
          countSetter(current - 1);
          displayEl.textContent = getCount();
          updateTotal();
        }
      });

      incBtn.addEventListener('click', () => {
        let current = getCount();
        if (current < 20) {
          countSetter(current + 1);
          displayEl.textContent = getCount();
          updateTotal();
        }
      });
    }
  };

  setupCounter('heroAdultDec', 'heroAdultInc', (val) => { adultCount = val; }, () => adultCount, adultValEl);
  setupCounter('heroChildDec', 'heroChildInc', (val) => { childCount = val; }, () => childCount, childValEl);

  quickForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const dateInput = document.getElementById('heroVisitDate')?.value || '';
    const ticketType = document.getElementById('heroTicketType')?.value || 'regular';

    // Store in sessionStorage and redirect to booking page
    sessionStorage.setItem('sanjalika_booking_pref', JSON.stringify({
      adults: adultCount,
      children: childCount,
      date: dateInput,
      type: ticketType
    }));

    window.location.href = 'booking.html';
  });

  updateTotal();
}

