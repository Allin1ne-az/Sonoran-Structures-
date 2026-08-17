/* ─────────────────────────────────────────────
   Sonoran Structures — Shared Product Database
   Used by all category pages + structures.html
   Update prices here and every page reflects it
   ───────────────────────────────────────────── */

const AZ_TAX = 0.083;

/* ── SQUARE PAYMENT LINKS ──
   Paste your Square payment link URLs below once created.
   squareup.com/dashboard → Online → Payment Links → Create  */
const PAYMENT_LINKS = {
  buy:       "https://square.link/u/ntRIZB09",            // Purchase & Install
  assembly:  "https://square.link/u/ntRIZB09",            // Assembly Only (same link until separate one created)
  anchoring: "https://square.link/u/ntRIZB09",            // Anchoring Add-On (same link until separate one created)
};

/* ── LIVE PRICE LOADER ──
   Fetches prices.json (written nightly by price_fetcher.py)
   and overlays live Amazon/Walmart prices onto product cards.
   Falls back to hardcoded prices if file not available.        */
async function loadLivePrices() {
  try {
    const resp = await fetch('prices.json?v=' + Date.now(), { cache: 'no-store' });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data || !data.prices) return null;

    // Build lookup map: product_id → live prices
    const liveMap = {};
    for (const item of data.prices) {
      liveMap[item.product_id] = item;
    }

    // Overlay live prices onto the global PRODUCTS array
    let updated = 0;
    for (const product of PRODUCTS) {
      const live = liveMap[product.id];
      if (!live) continue;

      // Inject Amazon live price
      if (live.amazon_price && live.amazon_url) {
        const existing = product.prices.find(p => p.r === "Amazon");
        if (existing) {
          existing.p = live.amazon_formatted;
          existing.v = live.amazon_price;
          existing.url = live.amazon_url;
          existing.live = true;
        } else {
          product.prices.unshift({ r: "Amazon", p: live.amazon_formatted, v: live.amazon_price, url: live.amazon_url, live: true });
        }
      }

      // Inject Walmart live price
      if (live.walmart_price && live.walmart_url) {
        const existing = product.prices.find(p => p.r === "Walmart");
        if (existing) {
          existing.p = live.walmart_formatted;
          existing.v = live.walmart_price;
          existing.url = live.walmart_url;
          existing.live = true;
        } else {
          product.prices.push({ r: "Walmart", p: live.walmart_formatted, v: live.walmart_price, url: live.walmart_url, live: true });
        }
      }
      updated++;
    }

    console.log(`[Sonoran] Live prices loaded: ${updated} products updated, last updated ${data.last_updated_display || data.last_updated}`);

    // Show last-updated badge if element exists
    const badge = document.getElementById('price-update-badge');
    if (badge && data.last_updated_display) {
      badge.textContent = `Prices last verified ${data.last_updated_display}`;
      badge.style.display = 'inline';
    }

    return data;
  } catch (e) {
    console.log('[Sonoran] prices.json not available — using built-in prices');
    return null;
  }
}



/* ── CATEGORY DEFINITIONS ── */
const CATEGORIES = [
  { type:"woodgazebo",   slug:"wood-gazebos",       label:"Wood Gazebos",        num:"01", emoji:"🌲", color:"#7a5e38", desc:"Cedar-framed gazebos with solid steel or aluminum roofs. Warmest aesthetic, most popular in Phoenix." },
  { type:"metalgazebo",  slug:"metal-gazebos",       label:"Metal Gazebos",       num:"02", emoji:"🏗️", color:"#3A5A6B", desc:"Aluminum and galvanized steel hardtop gazebos. Zero maintenance, widest size range, most brands." },
  { type:"woodpergola",  slug:"wood-pergolas",        label:"Wood Pergolas",       num:"03", emoji:"🌳", color:"#5C4A28", desc:"Open slatted or trellis-roof cedar pergolas. Wind passes through — strong ratings at budget prices." },
  { type:"metalpergola", slug:"metal-pergolas",       label:"Metal Pergolas",      num:"04", emoji:"🔩", color:"#2A4A5B", desc:"Open-frame aluminum pergolas. Clean architectural lines, sleek modern profile, 100 mph rated." },
  { type:"louvered",     slug:"louvered-pergolas",    label:"Louvered Pergolas",   num:"05", emoji:"☀️", color:"#5C8B5A", desc:"Adjustable aluminum louvers with integrated gutters. Most versatile structure for monsoon season." },
  { type:"grill",        slug:"grill-gazebos",        label:"Grill Gazebos",       num:"06", emoji:"🔥", color:"#B84A0A", desc:"Fire-safe steel roofs, open sides for airflow, built-in prep shelves. Designed to go over your grill." },
  { type:"bar",          slug:"bar-gazebos",          label:"Bar Gazebos",         num:"07", emoji:"🍹", color:"#2A7A8C", desc:"Entertainment pavilions with integrated bar counters and cord management — built for hosting." },
  { type:"slopedRoof",   slug:"sloped-roof",          label:"Sloped Roof / Lean-To",num:"08",emoji:"📐", color:"#6B5A8B", desc:"Wall-mounted or freestanding lean-to structures. Single-pitch sloped roof maximizes patio space." },
  { type:"composite",    slug:"polycarbonate",        label:"Polycarbonate",       num:"09", emoji:"💡", color:"#5A6FAD", desc:"Polycarbonate panels filter light while blocking UV. A fundamentally different experience from steel." },
];

/* ── WIND HELPERS ── */
const windColor = w => w>=100?"#2563ae":w>=80?"#4a9e6b":w>=60?"#e8a020":"#e05555";
const windLabel = w => w>=100?"100+ mph · Pro-Rated":w>=80?"80–99 mph · Heavy Duty":w>=60?"60–79 mph · Moderate":"Under 60 mph";
const catColor  = t => (CATEGORIES.find(c=>c.type===t)||{color:"#555"}).color;

/* ── PRODUCT DATABASE ── */

const PRODUCTS = [
  // ── WOOD GAZEBOS ──
  {id:1,  type:"woodgazebo",  wind:100,brand:"Backyard Discovery",name:"Barrington Cedar Gazebo",          size:"16×12 ft", isBD:true,  sonoranRate:850,
   assemblyComps:[{n:"BD Official",r:1080},{n:"HandyBuddy",r:895.95},{n:"Go Configure",r:781.25,note:"≤15ft only"}],
   prices:[{r:"Sam's Club",p:"~$2,799",v:2799,best:true},{r:"Home Depot",p:"~$3,609",v:3609},{r:"Direct",p:"~$3,799",v:3799}]},
  {id:2,  type:"woodgazebo",  wind:100,brand:"Backyard Discovery",name:"Barrington Cedar Gazebo",          size:"14×12 ft", isBD:true,  sonoranRate:775,
   assemblyComps:[{n:"BD Official",r:960},{n:"HandyBuddy",r:895.95},{n:"Go Configure",r:781.25,note:"≤15ft only"}],
   prices:[{r:"Direct",p:"From $3,299",v:3299,best:true},{r:"Home Depot",p:"~$3,499",v:3499}]},
  {id:3,  type:"woodgazebo",  wind:100,brand:"Backyard Discovery",name:"Barrington Cedar Gazebo",          size:"14×10 ft", isBD:true,  sonoranRate:775,
   assemblyComps:[{n:"BD Official",r:910},{n:"HandyBuddy",r:895.95},{n:"Go Configure",r:781.25,note:"≤15ft only"}],
   prices:[{r:"Direct",p:"From $2,799",v:2799,best:true},{r:"Lowe's",p:"~$2,999",v:2999}]},
  {id:4,  type:"woodgazebo",  wind:100,brand:"Backyard Discovery",name:"Arcadia Cedar Gazebo",             size:"12×9.5 ft",isBD:true,  sonoranRate:775,
   assemblyComps:[{n:"HandyBuddy",r:785.95},{n:"Go Configure",r:781.25,note:"≤15ft only"}],
   prices:[{r:"Sam's Club",p:"~$1,999",v:1999,best:true},{r:"Home Depot",p:"~$2,499",v:2499}]},
  {id:5,  type:"woodgazebo",  wind:100,brand:"Backyard Discovery",name:"Arlington Cedar Gazebo",           size:"12×10 ft", isBD:true,  sonoranRate:775,
   assemblyComps:[{n:"HandyBuddy",r:785.95},{n:"Go Configure",r:781.25,note:"≤15ft only"}],
   prices:[{r:"Direct",p:"From $2,499",v:2499,best:true},{r:"Home Depot",p:"~$2,599",v:2599}]},
  {id:6,  type:"woodgazebo",  wind:100,brand:"Backyard Discovery",name:"Norwood Cedar + Steel Gazebo",     size:"16×12 ft", isBD:true,  sonoranRate:850,
   assemblyComps:[{n:"BD Official",r:1080},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"From $3,799",v:3799,best:true}]},
  {id:7,  type:"woodgazebo",  wind:100,brand:"Backyard Discovery",name:"Barrington Cedar Carport/Gazebo",  size:"20×12 ft", isBD:true,  sonoranRate:1200,
   assemblyComps:[{n:"BD Official",r:1460},{n:"HandyBuddy (est.)",r:1099}],
   prices:[{r:"Direct",p:"From $4,499",v:4499,best:true}]},
  {id:8,  type:"woodgazebo",  wind:100,brand:"Backyard Discovery",name:"Norwood Cedar Carport/Gazebo",     size:"24×12 ft", isBD:true,  sonoranRate:1500,
   assemblyComps:[{n:"BD Official",r:1650},{n:"HandyBuddy (est.)",r:1099}],
   prices:[{r:"Direct",p:"From $5,299",v:5299,best:true}]},
  {id:9,  type:"woodgazebo",  wind:100,brand:"Range by Backyard Discovery",name:"Lodge Cedar + Steel Gazebo",size:"14×14 ft",isBD:true, sonoranRate:775,
   assemblyComps:[{n:"HandyBuddy (est.)",r:895.95}],
   prices:[{r:"Direct",p:"$4,499",v:4499,best:true}]},
  {id:10, type:"woodgazebo",  wind:100,brand:"Range by Backyard Discovery",name:"Lodge Cedar + Steel Gazebo",size:"19×14 ft",isBD:true, sonoranRate:1200,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1099}],
   prices:[{r:"Direct",p:"$5,499",v:5499,best:true}]},
  {id:11, type:"woodgazebo",  wind:65, brand:"Yardistry",            name:"Meridian Gazebo — Aluminum Roof",size:"12×14 ft", isBD:false, sonoranRate:775,
   assemblyComps:[{n:"HandyBuddy (confirmed)",r:965.95},{n:"Go Configure",r:781.25,note:"≤15ft only"}],
   prices:[{r:"Costco",p:"~$2,499",v:2499,best:true},{r:"Lowe's",p:"~$2,699",v:2699},{r:"Direct",p:"$2,999",v:2999}]},
  {id:12, type:"woodgazebo",  wind:65, brand:"Yardistry",            name:"Meridian Gazebo — Aluminum Roof",size:"12×16 ft", isBD:false, sonoranRate:1100,
   assemblyComps:[{n:"HandyBuddy (confirmed)",r:1285.95}],
   prices:[{r:"Costco",p:"~$2,799",v:2799,best:true},{r:"Lowe's",p:"~$2,999",v:2999},{r:"Direct",p:"$3,359",v:3359}]},
  {id:13, type:"woodgazebo",  wind:65, brand:"Yardistry",            name:"Meridian Gazebo — Aluminum Roof",size:"12×20 ft", isBD:false, sonoranRate:1200,
   assemblyComps:[{n:"HandyBuddy (confirmed)",r:1485.95}],
   prices:[{r:"Costco",p:"~$3,699",v:3699,best:true},{r:"Lowe's",p:"~$3,899",v:3899},{r:"Direct",p:"$4,199",v:4199}]},
  {id:14, type:"woodgazebo",  wind:65, brand:"Yardistry",            name:"Meridian Gazebo — Aluminum Roof",size:"12×24 ft", isBD:false, sonoranRate:1500,
   assemblyComps:[{n:"HandyBuddy (confirmed)",r:1785.95}],
   prices:[{r:"Costco",p:"TBD",v:0,best:true},{r:"Direct",p:"~$4,499",v:4499}]},
  {id:15, type:"woodgazebo",  wind:50, brand:"Sunjoy",               name:"Cedar Frame Steel Hardtop",      size:"12×10 ft", isBD:false, sonoranRate:775,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Lowe's",p:"~$943",v:943,best:true},{r:"Home Depot",p:"$943",v:943},{r:"Direct (sunjoyshop.com)",p:"~$943",v:943,url:"https://sunjoyshop.com/collections/outdoor-gazebo-for-sale"}]},

  // ── METAL GAZEBOS ──
  {id:20, type:"metalgazebo", wind:100,brand:"Range by Backyard Discovery",name:"Lancaster Steel Gazebo",  size:"14×14 ft", isBD:true,  sonoranRate:750,
   assemblyComps:[{n:"HandyBuddy (est.)",r:895.95}],
   prices:[{r:"Direct",p:"$4,999",v:4999,best:true}]},
  {id:21, type:"metalgazebo", wind:100,brand:"Range by Backyard Discovery",name:"Lancaster Steel Gazebo",  size:"16×14 ft", isBD:true,  sonoranRate:850,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1099}],
   prices:[{r:"Direct",p:"$5,499",v:5499,best:true}]},
  {id:22, type:"metalgazebo", wind:100,brand:"Range by Backyard Discovery",name:"Lancaster Steel Gazebo",  size:"18×14 ft", isBD:true,  sonoranRate:850,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1099}],
   prices:[{r:"Direct",p:"$5,999",v:5999,best:true}]},
  {id:23, type:"metalgazebo", wind:85, brand:"Gazebo Penguin",        name:"Venus Hardtop Gazebo",         size:"10×10 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Walmart",p:"~$2,719",v:2719,best:true},{r:"Direct",p:"~$2,899",v:2899}]},
  {id:24, type:"metalgazebo", wind:60, brand:"Purple Leaf",           name:"Hardtop Aluminum Gazebo",      size:"10×12 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Walmart",p:"~$1,079",v:1079,best:true},{r:"Amazon",p:"~$1,199",v:1199},{r:"Lowe's",p:"~$1,199",v:1199}]},
  {id:25, type:"metalgazebo", wind:60, brand:"Purple Leaf",           name:"Hardtop Aluminum Gazebo",      size:"12×14 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Walmart",p:"~$1,199",v:1199,best:true},{r:"Amazon",p:"~$1,249",v:1249}]},
  {id:26, type:"metalgazebo", wind:60, brand:"Purple Leaf",           name:"Hardtop Aluminum Gazebo",      size:"12×16 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1099,note:"Go Configure doesn't service 16ft+"}],
   prices:[{r:"Walmart",p:"~$1,403",v:1403,best:true},{r:"Amazon",p:"~$1,499",v:1499}]},
  {id:27, type:"metalgazebo", wind:60, brand:"Purple Leaf",           name:"Hardtop Aluminum Gazebo",      size:"12×20 ft", isBD:false, sonoranRate:900,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1295.95,note:"Go Configure doesn't service 20ft+"}],
   prices:[{r:"Walmart",p:"~$1,999",v:1999,best:true},{r:"Amazon",p:"~$2,099",v:2099}]},
  {id:28, type:"metalgazebo", wind:60, brand:"Domi Outdoor Living",   name:"Hardtop Gazebo w/ Gutter",     size:"10×12 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"$999",v:999,best:true},{r:"Amazon",p:"~$1,049",v:1049}]},
  {id:29, type:"metalgazebo", wind:60, brand:"Domi Outdoor Living",   name:"Hardtop Gazebo w/ Gutter",     size:"12×14 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"$1,099",v:1099,best:true},{r:"Amazon",p:"~$1,199",v:1199}]},
  {id:30, type:"metalgazebo", wind:60, brand:"Kozyard",               name:"Alexander Hardtop Gazebo",     size:"10×12 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Home Depot",p:"$1,198",v:1198,best:true},{r:"Walmart",p:"$1,198",v:1198}]},
  {id:31, type:"metalgazebo", wind:60, brand:"Kozyard",               name:"Alexander Hardtop Gazebo",     size:"12×16 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1099,note:"Go Configure doesn't service 16ft+"}],
   prices:[{r:"Home Depot",p:"$1,841",v:1841,best:true},{r:"Walmart",p:"~$1,841",v:1841}]},
  {id:32, type:"metalgazebo", wind:60, brand:"Kozyard",               name:"Alexander Hardtop Gazebo",     size:"12×20 ft", isBD:false, sonoranRate:900,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1295.95,note:"Go Configure doesn't service 20ft+"}],
   prices:[{r:"Walmart",p:"$1,942",v:1942,best:true},{r:"Direct",p:"$2,310",v:2310}]},
  {id:33, type:"metalgazebo", wind:50, brand:"ShelterLogic / Sojag",  name:"Genova Hardtop Gazebo",        size:"10×12 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"$1,799",v:1799,best:true},{r:"Home Depot",p:"~$1,899",v:1899}]},
  {id:34, type:"metalgazebo", wind:50, brand:"ShelterLogic / Sojag",  name:"Genova Hardtop Gazebo",        size:"12×16 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1099,note:"Go Configure doesn't service 16ft+"}],
   prices:[{r:"Walmart",p:"$2,099",v:2099,best:true},{r:"Direct",p:"~$2,399",v:2399}]},
  {id:35, type:"metalgazebo", wind:50, brand:"ShelterLogic / Sojag",  name:"Mykonos II Double Roof Gazebo",size:"12×16 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1099,note:"Go Configure doesn't service 16ft+"}],
   prices:[{r:"Walmart",p:"$1,557",v:1557,best:true},{r:"Direct",p:"~$1,699",v:1699}]},
  {id:36, type:"metalgazebo", wind:40, brand:"Gazebest",              name:"Hardtop Gazebo",               size:"10×12 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"$449",v:449,best:true},{r:"Amazon",p:"~$499",v:499}]},
  {id:37, type:"metalgazebo", wind:40, brand:"Gazebest",              name:"Hardtop Gazebo",               size:"12×16 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1099,note:"Go Configure doesn't service 16ft+"}],
   prices:[{r:"Direct",p:"$699",v:699,best:true},{r:"Amazon",p:"~$749",v:749}]},
  {id:38, type:"metalgazebo", wind:40, brand:"Gazebest",              name:"Hardtop Gazebo",               size:"12×20 ft", isBD:false, sonoranRate:900,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1295.95,note:"Go Configure doesn't service 20ft+"}],
   prices:[{r:"Direct",p:"$899",v:899,best:true},{r:"Amazon",p:"~$949",v:949}]},
  {id:39, type:"metalgazebo", wind:25, brand:"StarEcho",              name:"Soft-Top Steel Gazebo ⚠️",    size:"10×13 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Amazon",p:"~$259",v:259,best:true},{r:"Wayfair",p:"~$269",v:269}]},

  // ── WOOD PERGOLAS ──
  {id:50, type:"woodpergola", wind:100,brand:"Backyard Discovery",    name:"Beaumont Cedar Pergola",        size:"16×12 ft", isBD:true,  sonoranRate:750,
   assemblyComps:[{n:"BD Official",r:670},{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"From $2,199",v:2199,best:true},{r:"Lowe's",p:"~$2,299",v:2299}]},
  {id:51, type:"woodpergola", wind:100,brand:"Backyard Discovery",    name:"Cedar Pergola w/ PowerPort",   size:"14×10 ft", isBD:true,  sonoranRate:750,
   assemblyComps:[{n:"BD Official",r:670},{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Sam's Club",p:"From $1,299",v:1299,best:true},{r:"Direct",p:"From $1,499",v:1499}]},
  {id:52, type:"woodpergola", wind:80, brand:"Veikous",               name:"Cedar Wood Pergola (Open Trellis)",size:"10×12 ft",isBD:false,sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Walmart",p:"~$700",v:700,best:true},{r:"Lowe's",p:"~$799",v:799}]},
  {id:53, type:"woodpergola", wind:80, brand:"Veikous",               name:"Cedar Wood Pergola (Open Trellis)",size:"12×14 ft",isBD:false,sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Walmart",p:"~$700",v:700,best:true},{r:"Lowe's",p:"~$1,100",v:1100}]},

  // ── METAL PERGOLAS ──
  {id:60, type:"metalpergola",wind:100,brand:"Range by Backyard Discovery",name:"Stratford Steel Pergola", size:"12×10 ft", isBD:true,  sonoranRate:700,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"$2,299",v:2299,best:true}]},
  {id:61, type:"metalpergola",wind:100,brand:"Range by Backyard Discovery",name:"Stratford Steel Pergola", size:"14×10 ft", isBD:true,  sonoranRate:700,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"$2,499",v:2499,best:true}]},
  {id:62, type:"metalpergola",wind:100,brand:"Range by Backyard Discovery",name:"Stratford Steel Pergola", size:"14×12 ft", isBD:true,  sonoranRate:700,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"$2,799",v:2799,best:true}]},
  {id:63, type:"metalpergola",wind:100,brand:"Range by Backyard Discovery",name:"Stratford Steel Pergola", size:"16×12 ft", isBD:true,  sonoranRate:700,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"$2,999",v:2999,best:true}]},

  // ── LOUVERED PERGOLAS ──
  {id:70, type:"louvered",    wind:165,brand:"Pergolux",              name:"Series 4 Louvered Pergola",    size:"Custom",   isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750}],
   prices:[{r:"Direct",p:"From $4,732",v:4732,best:true}]},
  {id:71, type:"louvered",    wind:100,brand:"Backyard Discovery",    name:"Louvered Steel Pergola w/ PowerPort",size:"14×10 ft",isBD:true,sonoranRate:650,
   assemblyComps:[{n:"BD Official",r:670},{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Sam's Club",p:"$1,499",v:1499,best:true},{r:"Lowe's",p:"~$1,599",v:1599}]},
  {id:72, type:"louvered",    wind:100,brand:"Backyard Discovery",    name:"Louvered Steel Pergola w/ PowerPort",size:"14×12 ft",isBD:true,sonoranRate:650,
   assemblyComps:[{n:"BD Official",r:670},{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Sam's Club",p:"$1,799",v:1799,best:true},{r:"Lowe's",p:"~$1,899",v:1899}]},
  {id:73, type:"louvered",    wind:75, brand:"Mirador",               name:"Adjustable Louvered Pergola",  size:"10×12 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Costco",p:"$1,899",v:1899,best:true},{r:"Lowe's",p:"~$1,999",v:1999}]},
  {id:74, type:"louvered",    wind:75, brand:"Mirador",               name:"Louvered Pergola",             size:"10×13 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Costco",p:"$1,999",v:1999,best:true},{r:"Lowe's",p:"~$2,099",v:2099}]},
  {id:75, type:"louvered",    wind:75, brand:"Mirador",               name:"80S Louvered Pergola",         size:"10×20 ft", isBD:false, sonoranRate:900,
   assemblyComps:[{n:"HandyBuddy (confirmed)",r:1385.95,note:"Go Configure doesn't service 20ft+"}],
   prices:[{r:"Costco",p:"$3,399",v:3399,best:true},{r:"Lowe's",p:"~$3,499",v:3499}]},
  {id:76, type:"louvered",    wind:70, brand:"Purple Leaf",           name:"Louvered Aluminum Pergola",    size:"10×12 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Walmart",p:"$1,699",v:1699,best:true},{r:"Lowe's",p:"~$1,799",v:1799}]},
  {id:77, type:"louvered",    wind:70, brand:"Purple Leaf",           name:"Louvered Aluminum Pergola",    size:"12×20 ft", isBD:false, sonoranRate:900,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1295.95,note:"Go Configure doesn't service 20ft+"}],
   prices:[{r:"Home Depot",p:"$3,449",v:3449,best:true},{r:"Walmart",p:"~$3,399",v:3399}]},
  {id:78, type:"louvered",    wind:50, brand:"Erommy",                name:"Motorized Louvered Pergola w/ LED",size:"10×13 ft",isBD:false,sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"~$1,299",v:1299,best:true},{r:"Amazon",p:"~$1,399",v:1399}]},
  {id:79, type:"louvered",    wind:35, brand:"Nordivale",             name:"Louvered Pergola",             size:"10×10 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Lowe's",p:"~$399",v:399,best:true},{r:"Walmart",p:"~$399",v:399}]},

  // ── GRILL GAZEBOS ──
  {id:80, type:"grill",       wind:50, brand:"ShelterLogic / Sojag",  name:"Dakota BBQ Grill Gazebo",      size:"6×9 ft",   isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Walmart",p:"~$370",v:370,best:true},{r:"Direct",p:"~$399",v:399}]},
  {id:81, type:"grill",       wind:50, brand:"Sunjoy",                name:"Cedar Frame Grill Gazebo",     size:"12×10 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct (sunjoyshop.com)",p:"~$949",v:949,best:true},{r:"Home Depot",p:"~$987",v:987},{r:"Amazon",p:"~$999",v:999}]},
  {id:82, type:"grill",       wind:50, brand:"Erommy",                name:"BBQ Louvered Grill Pergola",   size:"8×10 ft",  isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"~$499",v:499,best:true},{r:"Amazon",p:"~$549",v:549}]},
  {id:83, type:"grill",       wind:50, brand:"SunVilla",              name:"Grill Pergola w/ Louvered Roof",size:"6×9 ft",  isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"From $999",v:999,best:true}]},

  // ── BAR GAZEBOS ──
  {id:84, type:"bar",         wind:65, brand:"Yardistry",             name:"Cantina Cedar Bar Gazebo",     size:"7.6×7.6 ft",isBD:false,sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Costco",p:"$1,499",v:1499,best:true},{r:"Direct",p:"$1,999",v:1999}]},
  {id:85, type:"bar",         wind:50, brand:"ShelterLogic / Sojag",  name:"Barilo Bar Gazebo",            size:"9×9 ft",   isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Walmart",p:"~$969",v:969,best:true},{r:"Direct",p:"~$999",v:999}]},
  {id:86, type:"bar",         wind:35, brand:"Keter",                 name:"Signature Collection Bar Gazebo",size:"11×7 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Sam's Club",p:"~$899",v:899,best:true},{r:"Direct",p:"~$999",v:999}]},

  // ── SUNJOY — ADDITIONAL MODELS ──
  {id:100,type:"woodgazebo",  wind:50, brand:"Sunjoy",               name:"Cedar Frame 2-Tier Hardtop Gazebo", size:"11×11 ft", isBD:false, sonoranRate:775,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Home Depot",p:"$923",v:923,best:true},{r:"Lowe's",p:"~$1,023",v:1023},{r:"Direct (sunjoyshop.com)",p:"~$923",v:923,url:"https://sunjoyshop.com/collections/outdoor-gazebo-for-sale"}]},
  {id:101,type:"woodgazebo",  wind:50, brand:"Sunjoy",               name:"Cedar Frame 2-Tier Hardtop Gazebo", size:"13×11 ft", isBD:false, sonoranRate:775,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Home Depot",p:"$1,503",v:1503,best:true},{r:"Direct (sunjoyshop.com)",p:"~$1,503",v:1503,url:"https://sunjoyshop.com/collections/outdoor-gazebo-for-sale"}]},
  {id:102,type:"woodgazebo",  wind:50, brand:"Sunjoy",               name:"Cedar Frame Steel 2-Tier Hardtop Gazebo",size:"12×16 ft",isBD:false,sonoranRate:850,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1099,note:"Go Configure doesn't service 16ft+"}],
   prices:[{r:"Home Depot",p:"$1,589",v:1589,best:true},{r:"Lowe's",p:"~$1,699",v:1699},{r:"Direct (sunjoyshop.com)",p:"~$1,589",v:1589,url:"https://sunjoyshop.com/collections/outdoor-gazebo-for-sale"}]},
  {id:103,type:"woodgazebo",  wind:50, brand:"Sunjoy",               name:"Cedar Frame Steel 2-Tier Hardtop Gazebo",size:"12×20 ft",isBD:false,sonoranRate:1200,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1295.95,note:"Go Configure doesn't service 20ft+"}],
   prices:[{r:"Home Depot",p:"$1,451",v:1451,best:true},{r:"Home Depot (Brown)",p:"$1,657",v:1657},{r:"Direct (sunjoyshop.com)",p:"~$1,451",v:1451,url:"https://sunjoyshop.com/collections/outdoor-gazebo-for-sale"}]},
  {id:104,type:"metalgazebo", wind:50, brand:"Sunjoy",               name:"Kingston Hardtop Gazebo — Woodgrain Aluminum",size:"20×12 ft",isBD:false,sonoranRate:900,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1295.95,note:"Go Configure doesn't service 20ft+"}],
   prices:[{r:"Home Depot",p:"$1,644",v:1644,best:true},{r:"Direct (sunjoyshop.com)",p:"~$1,644",v:1644,url:"https://sunjoyshop.com/collections/outdoor-gazebo-for-sale"}]},
  {id:105,type:"metalgazebo", wind:50, brand:"Sunjoy",               name:"Heavy-Duty Steel Hardtop Gazebo",   size:"10×12 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Home Depot",p:"$871",v:871,best:true},{r:"Direct (sunjoyshop.com)",p:"~$871",v:871,url:"https://sunjoyshop.com/collections/outdoor-gazebo-for-sale"}]},
  {id:106,type:"composite",   wind:50, brand:"Sunjoy",               name:"Aurora Cedar Frame + Polycarbonate Roof Gazebo",size:"9×9 ft",isBD:false,sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Home Depot",p:"$1,054",v:1054,best:true},{r:"Direct (sunjoyshop.com)",p:"~$1,054",v:1054,url:"https://sunjoyshop.com/collections/outdoor-gazebo-for-sale"}]},
  {id:107,type:"grill",       wind:50, brand:"Sunjoy",               name:"Churchill Cedar Framed Grill Gazebo w/ Power Port",size:"8×12 ft",isBD:false,sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Home Depot",p:"$622",v:622,best:true},{r:"Home Depot (Brown)",p:"$687",v:687},{r:"Direct (sunjoyshop.com)",p:"~$622",v:622,url:"https://sunjoyshop.com/collections/outdoor-gazebo-for-sale"}]},
  {id:108,type:"metalpergola",wind:50, brand:"Sunjoy",               name:"Dylon Arched Roof Pergola w/ Adjustable Canopy",size:"10×12 ft",isBD:false,sonoranRate:700,
   assemblyComps:[{n:"Go Configure",r:750},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Home Depot",p:"$923",v:923,best:true},{r:"Direct (sunjoyshop.com)",p:"~$923",v:923,url:"https://sunjoyshop.com/collections/outdoor-gazebo-for-sale"}]},

  // ── SLOPED ROOF / LEAN-TO ──
  {id:90, type:"slopedRoof",  wind:100,brand:"Backyard Discovery",    name:"Arcadia Slope Roof Gazebo/Carport",size:"20×9.5 ft",isBD:true,sonoranRate:1200,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1099,note:"Go Configure doesn't service 20ft+"}],
   prices:[{r:"Direct",p:"From $2,499",v:2499,best:true},{r:"Wayfair",p:"~$2,699",v:2699}]},
  {id:91, type:"slopedRoof",  wind:100,brand:"Backyard Discovery",    name:"Kingsport Slope Roof Carport", size:"20×12 ft", isBD:true,  sonoranRate:1200,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1099,note:"Go Configure doesn't service 20ft+"}],
   prices:[{r:"Direct",p:"From $2,999",v:2999,best:true},{r:"Lowe's",p:"~$3,199",v:3199}]},
  {id:92, type:"slopedRoof",  wind:80, brand:"Aecojoy",               name:"Lean-To Hardtop Gazebo",       size:"14×10 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Walmart",p:"~$320",v:320,best:true},{r:"Amazon",p:"~$380",v:380}]},
  {id:93, type:"slopedRoof",  wind:80, brand:"Aecojoy",               name:"Lean-To Hardtop Gazebo",       size:"20×12 ft", isBD:false, sonoranRate:900,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1295.95,note:"Go Configure doesn't service 20ft+"}],
   prices:[{r:"Direct",p:"~$859",v:859,best:true},{r:"Amazon",p:"~$899",v:899}]},
  {id:94, type:"slopedRoof",  wind:60, brand:"SunVilla",              name:"Drift Lean-To Gazebo",         size:"10×14 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"$2,099",v:2099,best:true}]},

  // ── POLYCARBONATE / COMPOSITE ──
  {id:95, type:"composite",   wind:75, brand:"Canopia by Palram",     name:"Roma Polycarbonate Gazebo",    size:"12×14 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Home Depot",p:"$1,678",v:1678,best:true},{r:"Lowe's",p:"~$1,700",v:1700}]},
  {id:96, type:"composite",   wind:56, brand:"Canopia by Palram",     name:"Palermo Polycarbonate Gazebo", size:"12×12 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Home Depot",p:"$1,046",v:1046,best:true},{r:"Lowe's",p:"~$1,050",v:1050}]},
  {id:97, type:"composite",   wind:50, brand:"ShelterLogic / Sojag",  name:"Meridien Polycarbonate Gazebo",size:"10×12 ft", isBD:false, sonoranRate:750,
   assemblyComps:[{n:"Go Configure",r:781.25,note:"≤15ft only"},{n:"HandyBuddy",r:895.95}],
   prices:[{r:"Direct",p:"$480",v:480,best:true},{r:"Home Depot",p:"~$549",v:549}]},
  {id:98, type:"composite",   wind:56, brand:"Canopia by Palram",     name:"Dallas Polycarbonate Gazebo",  size:"12×20 ft", isBD:false, sonoranRate:900,
   assemblyComps:[{n:"HandyBuddy (est.)",r:1295.95,note:"Go Configure doesn't service 20ft+"}],
   prices:[{r:"Home Depot",p:"$3,042",v:3042,best:true},{r:"Wayfair",p:"~$3,100",v:3100}]},
];

/* ─────────────────────────
   SHARED NAV HTML
───────────────────────── */
function renderNav(activePage) {
  const pages = [
    {href:"structures.html", label:"Compare Structures"},
    {href:"wind-guide.html",  label:"Wind Guide"},
    {href:"anchoring.html",   label:"Anchoring"},
  ];
  document.getElementById('site-nav').innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">Sonoran <span>Structures</span></a>
      <nav class="nav-links">
        ${pages.map(p=>`<a href="${p.href}" class="${activePage===p.href?'active':''}">${p.label}</a>`).join('')}
        <a href="book.html" class="nav-cta">Book Install</a>
      </nav>
    </div>`;
}

/* ─────────────────────────
   SHARED FOOTER HTML
───────────────────────── */
function renderFooter() {
  document.getElementById('site-footer').innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">Sonoran <span>Structures</span></div>
        <div class="footer-tagline">America's Most Complete Outdoor Structure Comparison</div>
        <div class="footer-sub">Installation by All in 1ne Handyman LLC · Licensed · Bonded · Insured</div>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <div class="footer-col-head">Browse</div>
          ${CATEGORIES.map(c=>`<a href="${c.slug}.html">${c.emoji} ${c.label}</a>`).join('')}
        </div>
        <div class="footer-col">
          <div class="footer-col-head">Services</div>
          <a href="wind-guide.html">Wind Rating Guide</a>
          <a href="anchoring.html">Anchoring Services</a>
          <a href="book.html">Book Install</a>
          <a href="book.html">Assembly Only</a>
        </div>
        <div class="footer-col">
          <div class="footer-col-head">Contact</div>
          <a href="tel:16232747754">(623) 274-7754</a>
          <a href="mailto:info@allin1nehandyman.com">info@allin1nehandyman.com</a>
          <a href="https://www.allin1nehandyman.com" target="_blank">All in 1ne Handyman LLC</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">© 2026 Sonoran Structures · sonoranstructures.com</div>`;
}

/* ─────────────────────────
   PRODUCT CARD
───────────────────────── */
function buildCard(p) {
  const bestPrice = p.prices.find(pr=>pr.best) || p.prices[0];
  const col = catColor(p.type);
  return `
  <div class="product-card" id="card-${p.id}">
    <div class="card-head">
      <div class="card-badges">
        <span class="badge-cert" style="background:${col}20;color:${col};border:1px solid ${col}40">
          ${(CATEGORIES.find(c=>c.type===p.type)||{emoji:''}).emoji} ${p.type.replace('gazebo','Gazebo').replace('pergola','Pergola').replace('slopedRoof','Sloped').replace('composite','Poly').replace('louvered','Louvered').replace('grill','Grill').replace('bar','Bar').replace('wood','Wood').replace('metal','Metal')}
        </span>
        ${p.isBD?'<span class="badge-dealer">🏅 Authorized Dealer</span>':''}
      </div>
      <div class="card-brand">${p.brand}</div>
      <div class="card-name">${p.name}</div>
      <div class="card-size">📐 ${p.size}</div>
    </div>
    <div class="card-wind">
      <div class="wind-row">
        <span class="wind-mph" style="color:${windColor(p.wind)}">${p.wind} mph</span>
        <span class="wind-label" style="color:${windColor(p.wind)}">${windLabel(p.wind)}</span>
      </div>
      <div class="wind-bar-track"><div class="wind-bar-fill" style="width:${Math.min(p.wind/110*100,100)}%;background:${windColor(p.wind)}"></div></div>
      <div class="wind-note">Wind rating when properly anchored</div>
    </div>
    <div class="card-prices">
      <div class="prices-label">Click a price to see our total</div>
      ${p.prices.map(pr=>`
        <button class="price-row ${pr.best?'price-best':''}" onclick="openModal(${p.id},'${pr.r}','${pr.p}',${pr.v||0})">
          <span class="price-retailer">${pr.r}</span>
          <span class="price-val">${pr.p} ↗</span>
        </button>`).join('')}
      ${p.isBD?`<div class="dealer-note" onclick="openModal(${p.id},'${bestPrice.r}','${bestPrice.p}',${bestPrice.v||0})">💰 Authorized dealer — ask about pricing</div>`:''}
    </div>
  </div>`;
}

/* ─────────────────────────
   PURCHASE MODAL
───────────────────────── */
let _modalProduct = null;
let _modalRetailer = '';
let _modalPrice = '';
let _modalValue = 0;
let _anchoring = false;

function openModal(productId, retailer, price, value) {
  _modalProduct  = PRODUCTS.find(p=>p.id===productId);
  _modalRetailer = retailer;
  _modalPrice    = price;
  _modalValue    = value;
  _anchoring     = false;
  renderModal();
  document.getElementById('purchase-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('purchase-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function toggleAnchoring() {
  _anchoring = !_anchoring;
  renderModal();
}

function renderModal() {
  const p   = _modalProduct;
  if(!p) return;
  const tax      = Math.round(_modalValue * AZ_TAX);
  const prodT    = _modalValue + tax;
  const asm      = p.sonoranRate||750;
  const anchAmt  = _anchoring ? 120 : 0;
  const ourTotal = prodT + asm + anchAmt;
  const compMax  = p.assemblyComps.length ? Math.max(...p.assemblyComps.map(c=>c.r)) : 900;
  const savings  = (prodT + compMax + 175) - ourTotal;

  const payUrl = PAYMENT_LINKS.buy;

  document.getElementById('modal-content').innerHTML = `
    <div class="modal-header">
      <div class="modal-eyebrow">Before You Purchase</div>
      <div class="modal-title">${p.brand} — ${p.name}</div>
      <div class="modal-sub">${p.size} · ${_modalRetailer}: ${_modalPrice}</div>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      ${p.isBD ? `
      <div class="modal-badge-bd">
        <span>🏅</span>
        <div><strong>Authorized Backyard Discovery Dealer</strong><br>We carry this product through our dealer account at competitive pricing.</div>
      </div>` : `
      <div class="modal-badge-gen">
        <span>🏗️</span>
        <div><strong>We Install Every Major Brand</strong><br>See what assembly costs elsewhere — then see how we compare.</div>
      </div>`}

      <div class="modal-table">
        <div class="modal-row"><span>Structure — ${_modalRetailer}</span><span>${_modalPrice}</span></div>
        <div class="modal-row alt"><span>Est. AZ sales tax (~8.3%)</span><span>+$${tax.toLocaleString()}</span></div>
        <div class="modal-row subtotal"><span>Your product cost</span><span>$${prodT.toLocaleString()}</span></div>

        <div class="modal-section-head red">⚠️ Competitor assembly pricing</div>
        ${p.assemblyComps.map((c,i)=>`
          <div class="modal-row ${i%2===0?'red-alt':'red-dim'}">
            <span>${c.n}${c.note?` <em>(${c.note})</em>`:''}</span>
            <span class="red-val">+$${c.r.toLocaleString()}</span>
          </div>`).join('')}
        <div class="modal-row red-dim"><span>Masonry anchoring (most installs)</span><span class="red-val">+~$175</span></div>
        <div class="modal-row red-total"><span>Est. total — other installers</span><span>$${(prodT+compMax+175).toLocaleString()}+</span></div>

        <div class="modal-section-head green">✅ Sonoran Structures — complete pricing</div>
        <div class="modal-row"><span>Product cost (incl. tax)</span><span>$${prodT.toLocaleString()}</span></div>
        <div class="modal-row alt"><span>Professional assembly</span><span class="clay-val">+$${asm.toLocaleString()}</span></div>
        <div class="modal-row">
          <span>⚓ Masonry anchoring ($30/leg · 4 legs)</span>
          <div style="display:flex;align-items:center;gap:10px">
            <span class="clay-val">${_anchoring?'+$120':'—'}</span>
            <div class="anch-toggle ${_anchoring?'on':''}" onclick="toggleAnchoring()"><div class="anch-knob"></div></div>
          </div>
        </div>
        ${['📦 Storage until install day','🚚 Delivery to your home','🗑️ Box & packaging disposal'].map((l,i)=>
          `<div class="modal-row ${i%2===1?'alt':''}"><span>${l}</span><span class="green-val">FREE</span></div>`
        ).join('')}
        <div class="modal-total-row">
          <div>
            <div class="total-label">Your total with Sonoran Structures</div>
            <div class="total-save">Save $${savings.toLocaleString()}+ vs. highest competitor</div>
          </div>
          <div class="total-amount">$${ourTotal.toLocaleString()}</div>
        </div>
      </div>

      <a href="${payUrl}" target="_blank" class="modal-cta-primary">
        Purchase Through Us — $${ourTotal.toLocaleString()} total
      </a>
      <button class="modal-cta-secondary" onclick="closeModal();window.location.href='book.html?path=assembly'">
        Already own this structure? Book assembly →
      </button>
      <div class="modal-note">Licensed · Bonded · Insured · (623) 274-7754</div>
    </div>`;
}

/* ─────────────────────────
   CATEGORY STATS HELPER
───────────────────────── */
function getCatStats(type) {
  const prods = PRODUCTS.filter(p=>p.type===type);
  if(!prods.length) return {count:0,minWind:0,maxWind:0,minPrice:'TBD'};
  const winds  = prods.map(p=>p.wind);
  const prices = prods.flatMap(p=>p.prices.map(pr=>pr.v)).filter(v=>v>0);
  const minP   = prices.length ? Math.min(...prices) : 0;
  return {
    count:   prods.length,
    minWind: Math.min(...winds),
    maxWind: Math.max(...winds),
    minPrice: minP ? '$'+minP.toLocaleString() : 'TBD',
  };
}
