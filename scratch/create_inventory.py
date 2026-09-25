import re
import os

html_content = """<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" name="viewport"><meta content="mobile_tab" name="shell-type"><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"><link href="https://fonts.googleapis.com" rel="preconnect"><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;700&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"><style>@layer base{html,body{width:100vw;margin:0;padding:0;}body{overscroll-behavior:none;}.pb-safe{padding-bottom:env(safe-area-inset-bottom,0px);}.pt-safe{padding-top:env(safe-area-inset-top,0px);}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "error-container": "#ffdad6", "tertiary": "#002112", "tertiary-container": "#003923", "inverse-primary": "#afc6ff", "secondary-fixed-dim": "#71d2ff", "on-secondary-fixed-variant": "#004d66", "on-secondary": "#ffffff", "surface-container": "#e9edff", "on-primary-fixed-variant": "#224585", "surface-container-highest": "#d8e2ff", "surface-variant": "#d8e2ff", "outline": "#747781", "surface-bright": "#faf9ff", "on-background": "#0b1b38", "on-tertiary-container": "#00ae73", "surface-container-low": "#f1f3ff", "primary-fixed-dim": "#afc6ff", "tertiary-fixed": "#73fbb8", "on-tertiary": "#ffffff", "on-tertiary-fixed-variant": "#005233", "primary-container": "#002e6e", "on-primary-container": "#7998de", "secondary": "#006686", "on-surface-variant": "#434750", "surface": "#faf9ff", "background": "#faf9ff", "outline-variant": "#c4c6d2", "on-secondary-fixed": "#001e2b", "on-error-container": "#93000a", "secondary-fixed": "#c0e8ff", "surface-tint": "#3d5d9e", "surface-container-lowest": "#ffffff", "error": "#ba1a1a", "surface-dim": "#ccdaff", "on-error": "#ffffff", "surface-container-high": "#e1e8ff", "tertiary-fixed-dim": "#53de9e", "primary": "#001a45", "on-primary": "#ffffff", "primary-fixed": "#d9e2ff", "inverse-surface": "#22304e", "on-secondary-container": "#004f69", "on-tertiary-fixed": "#002112", "secondary-container": "#2bc6ff", "on-surface": "#0b1b38", "on-primary-fixed": "#001943", "inverse-on-surface": "#edf0ff" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": { "margin-tablet": "1.5rem", "space-2xs": "0.25rem", "gutter-desktop": "1.5rem", "space-sm": "0.75rem", "space-xl": "2rem", "space-2xl": "3rem", "margin": "1rem", "gutter": "1rem", "space-lg": "1.5rem", "space-xs": "0.5rem", "space-md": "1rem", "margin-desktop": "2.5rem" }, "fontFamily": { "headline-md": ["Plus Jakarta Sans"], "label-caps": ["JetBrains Mono"], "body-sm": ["Plus Jakarta Sans"], "body-lg": ["Plus Jakarta Sans"], "headline-lg": ["Plus Jakarta Sans"], "display-currency-mobile": ["Plus Jakarta Sans"], "headline-lg-mobile": ["Plus Jakarta Sans"], "body-md": ["Plus Jakarta Sans"], "headline-sm": ["Plus Jakarta Sans"], "display-currency": ["Plus Jakarta Sans"], "data-mono-num": ["JetBrains Mono"] }, "fontSize": { "headline-md": ["20px", {"lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "600"}], "label-caps": ["11px", {"lineHeight": "14px", "letterSpacing": "0.06em", "fontWeight": "700"}], "body-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0em", "fontWeight": "500"}], "body-lg": ["16px", {"lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "400"}], "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}], "display-currency-mobile": ["30px", {"lineHeight": "36px", "letterSpacing": "-0.02em", "fontWeight": "800"}], "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "700"}], "body-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0em", "fontWeight": "400"}], "headline-sm": ["16px", {"lineHeight": "24px", "letterSpacing": "0em", "fontWeight": "600"}], "display-currency": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.03em", "fontWeight": "800"}], "data-mono-num": ["14px", {"lineHeight": "20px", "letterSpacing": "-0.02em", "fontWeight": "600"}] } } } };</script></head><body class="bg-surface font-body-md text-body-md text-on-surface flex flex-col min-h-screen"><header class="fixed top-0 w-full z-50 pt-safe bg-primary-container shadow-[0_1px_8px_rgba(0,46,110,0.12)]"><div class="h-14 px-margin flex items-center justify-between"><button aria-label="Go back" class="w-11 h-11 flex items-center justify-center text-on-primary rounded-xl hover:bg-white/10 active:scale-95 transition-all" onclick="window.location.href='dashboard.html'"><span class="material-symbols-outlined text-[24px]">arrow_back</span></button><h1 class="font-headline-sm text-headline-sm text-on-primary tracking-tight text-center truncate px-space-xs flex-1">Home</h1><div class="flex items-center gap-space-xs"><button aria-label="Quick Actions" class="w-11 h-11 flex items-center justify-center text-on-primary rounded-xl hover:bg-white/10 active:scale-95 transition-all"><span class="material-symbols-outlined text-[22px]">tune</span></button><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="flex flex-col relative w-full pt-14 pb-20 bg-surface min-h-screen"><div class="flex flex-col w-full pb-24">
<!-- Top Operational Banner / Sub-Header Context -->
<div class="bg-primary-container text-on-primary px-margin py-space-sm shadow-md">
<div class="flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<span class="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
<span class="font-label-caps text-label-caps uppercase tracking-wider text-secondary-container">Store Sync Active</span>
</div>
<button class="flex items-center gap-space-2xs bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 active:scale-95 text-on-primary px-space-sm py-1.5 rounded-xl transition-all font-body-sm text-body-sm font-semibold" id="add-item-trigger">
<span class="material-symbols-outlined text-[18px]">add</span>
<span class="">Add SKU</span>
</button>
</div>
</div>
<div class="p-margin space-y-space-md">
<!-- Overview Metrics Bento Grid -->
<div class="grid grid-cols-2 gap-space-sm">
<!-- Card 1: Total Valuation -->
<div class="bg-surface-container-lowest rounded-xl p-space-md shadow-[0_4px_16px_rgba(0,46,110,0.06)] flex flex-col justify-between relative overflow-hidden">
<div class="flex items-center justify-between">
<span class="font-body-sm text-body-sm text-on-surface-variant font-medium">Total Inventory</span>
<div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
<span class="material-symbols-outlined text-[20px]">inventory_2</span>
</div>
</div>
<div class="mt-space-xs">
<div class="font-display-currency-mobile text-display-currency-mobile text-on-surface">₹45,200</div>
<div class="flex items-center gap-1 mt-1 text-on-tertiary-container">
<span class="material-symbols-outlined text-[16px]">trending_up</span>
<span class="font-label-caps text-label-caps">+4.8% vs last week</span>
</div>
</div>
</div>
<!-- Card 2: Low Stock Warning -->
<div class="bg-error-container/60 rounded-xl p-space-md shadow-[0_4px_16px_rgba(186,26,26,0.08)] flex flex-col justify-between relative overflow-hidden">
<div class="flex items-center justify-between">
<span class="font-body-sm text-body-sm text-error font-medium">Low Stock Alerts</span>
<div class="w-8 h-8 rounded-lg bg-error text-on-error flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">warning</span>
</div>
</div>
<div class="mt-space-xs">
<div class="font-display-currency-mobile text-display-currency-mobile text-error">3 Items</div>
<div class="flex items-center gap-1 mt-1 text-error">
<span class="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
<span class="font-label-caps text-label-caps">Restock Recommended</span>
</div>
</div>
</div>
</div>
<!-- Predictive Copilot Drawer Teaser -->
<div class="bg-gradient-to-r from-primary-container to-secondary rounded-xl p-space-sm text-on-primary flex items-center justify-between shadow-[0_8px_20px_rgba(0,46,110,0.12)]">
<div class="flex items-center gap-space-sm">
<div class="w-9 h-9 rounded-xl bg-surface-container-lowest/15 flex items-center justify-center text-secondary-container">
<span class="material-symbols-outlined text-[20px]">smart_toy</span>
</div>
<div>
<div class="font-headline-sm text-headline-sm leading-tight text-on-primary">Weekend Stock Advisory</div>
<div class="font-body-sm text-body-sm text-on-primary-container">Dairy &amp; Instant noodles spike projected by 28%</div>
</div>
</div>
<button class="bg-secondary-container text-on-secondary-fixed font-label-caps text-label-caps px-space-xs py-1.5 rounded-lg font-bold uppercase active:scale-95 transition-all">Review</button>
</div>
<!-- Search & Filter Bar -->
<div class="flex items-center gap-space-xs">
<div class="relative flex-1 bg-surface-container-lowest rounded-xl shadow-[0_2px_8px_rgba(0,46,110,0.05)] flex items-center px-space-sm h-12">
<span class="material-symbols-outlined text-outline text-[22px]">search</span>
<input class="w-full h-full bg-transparent px-space-xs font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none" id="product-search" placeholder="Search products, SKU, category..." type="text">
<button class="hidden text-outline hover:text-on-surface p-1" id="clear-search">
<span class="material-symbols-outlined text-[18px]">cancel</span>
</button>
</div>
<button aria-label="Filter Options" class="w-12 h-12 flex items-center justify-center bg-surface-container-lowest rounded-xl shadow-[0_2px_8px_rgba(0,46,110,0.05)] text-on-surface-variant hover:text-primary-container active:scale-95 transition-all">
<span class="material-symbols-outlined text-[22px]">tune</span>
</button>
</div>
<!-- Interactive Category Filter Chips -->
<div class="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-0.5" id="filter-chip-rail">
<button class="chip active-chip flex-shrink-0 bg-primary-container text-on-primary px-space-sm py-1.5 rounded-full font-label-caps text-label-caps uppercase transition-all shadow-sm" data-filter="all">
        All (148)
      </button>
<button class="chip flex-shrink-0 bg-surface-container-high text-error px-space-sm py-1.5 rounded-full font-label-caps text-label-caps uppercase hover:bg-error-container transition-all" data-filter="low-stock">
        Low Stock (3)
      </button>
<button class="chip flex-shrink-0 bg-surface-container-lowest text-on-surface-variant px-space-sm py-1.5 rounded-full font-label-caps text-label-caps uppercase hover:bg-surface-container transition-all shadow-sm" data-filter="grocery">
        Grocery (64)
      </button>
<button class="chip flex-shrink-0 bg-surface-container-lowest text-on-surface-variant px-space-sm py-1.5 rounded-full font-label-caps text-label-caps uppercase hover:bg-surface-container transition-all shadow-sm" data-filter="instant">
        Snacks (42)
      </button>
<button class="chip flex-shrink-0 bg-surface-container-lowest text-on-surface-variant px-space-sm py-1.5 rounded-full font-label-caps text-label-caps uppercase hover:bg-surface-container transition-all shadow-sm" data-filter="dairy">
        Dairy (18)
      </button>
</div>
<!-- Inventory Product Ledger -->
<div class="space-y-space-sm" id="inventory-list">
<!-- Item 1: Healthy Stock -->
<div class="product-card group bg-surface-container-lowest rounded-xl p-space-md shadow-[0_4px_12px_rgba(0,46,110,0.04)] flex items-center justify-between transition-all gap-space-sm" data-category="grocery" data-status="healthy"><div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 font-headline-sm text-headline-sm flex items-center justify-center font-bold flex-shrink-0 shadow-inner">AA</div><div class="flex-1 min-w-0 flex flex-col gap-1.5"><div class="flex items-start justify-between gap-space-xs"><div class="min-w-0 flex-1"><h2 class="font-headline-sm text-headline-sm text-on-surface truncate">Aashirvaad Atta 5kg</h2><div class="flex items-center gap-space-xs mt-0.5"><span class="font-label-caps text-label-caps text-outline truncate">Grocery • SKU-4091</span><span class="text-outline text-[10px] flex-shrink-0">•</span><span class="font-label-caps text-label-caps text-outline flex-shrink-0">Shelf A-3</span></div></div><button class="bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-body-sm text-body-sm font-semibold px-space-sm py-1.5 rounded-lg active:scale-95 transition-all flex-shrink-0">Update</button></div><div class="flex items-center justify-between pt-1 border-t border-surface-container/60"><div class="font-data-mono-num text-[16px] text-on-surface font-bold">₹210</div><div class="flex items-center gap-1 text-on-tertiary-container bg-surface-container-low px-space-xs py-0.5 rounded-full font-body-sm text-body-sm font-semibold"><span class="material-symbols-outlined text-[14px]">check_circle</span><span class="">In Stock: 24 units</span></div></div></div></div>
<!-- Item 2: Low Stock (Tata Salt) -->
<div class="product-card group bg-surface-container-lowest rounded-xl p-space-md shadow-[0_4px_12px_rgba(0,46,110,0.04)] flex items-center justify-between transition-all gap-space-sm" data-category="grocery" data-status="low"><div class="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-headline-sm text-headline-sm flex items-center justify-center font-bold flex-shrink-0">TS</div><div class="flex-1 min-w-0 flex flex-col gap-1.5"><div class="flex items-start justify-between gap-space-xs"><div class="min-w-0 flex-1"><div class="flex items-center gap-space-2xs"><h2 class="font-headline-sm text-headline-sm text-on-surface truncate">Tata Salt 1kg</h2><span class="w-2 h-2 rounded-full bg-error flex-shrink-0"></span></div><div class="flex items-center gap-space-xs mt-0.5"><span class="font-label-caps text-label-caps text-outline truncate">Grocery • SKU-1082</span><span class="text-outline text-[10px] flex-shrink-0">•</span><span class="font-label-caps text-label-caps text-error flex-shrink-0">Min threshold: 10</span></div></div><button class="reorder-btn bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold px-space-sm py-1.5 rounded-lg shadow-sm flex items-center gap-1 active:scale-95 hover:bg-primary transition-all flex-shrink-0"><span class="material-symbols-outlined text-[16px]">shopping_cart_checkout</span><span class="">Reorder</span></button></div><div class="flex items-center justify-between pt-1 border-t border-surface-container/60"><div class="font-data-mono-num text-[16px] text-on-surface font-bold">₹28</div><div class="flex items-center gap-1 text-error bg-error-container/60 px-space-xs py-0.5 rounded-full font-body-sm text-body-sm font-bold"><span class="material-symbols-outlined text-[16px]">warning</span><span class="">Stock: 2 units</span></div></div></div></div>
<!-- Item 3: Low Stock (Maggi Noodles) -->
<div class="product-card group bg-surface-container-lowest rounded-xl p-space-md shadow-[0_4px_12px_rgba(0,46,110,0.04)] flex items-center justify-between transition-all gap-space-sm" data-category="instant" data-status="low"><div class="w-12 h-12 rounded-xl bg-error-container text-on-error-container font-headline-sm text-headline-sm flex items-center justify-center font-bold flex-shrink-0">MN</div><div class="flex-1 min-w-0 flex flex-col gap-1.5"><div class="flex items-start justify-between gap-space-xs"><div class="min-w-0 flex-1"><div class="flex items-center gap-space-2xs"><h2 class="font-headline-sm text-headline-sm text-on-surface truncate">Maggi Masala Noodles</h2><span class="w-2 h-2 rounded-full bg-error flex-shrink-0"></span></div><div class="flex items-center gap-space-xs mt-0.5"><span class="font-label-caps text-label-caps text-outline truncate">Instant Foods • Pack of 12</span><span class="text-outline text-[10px] flex-shrink-0">•</span><span class="font-label-caps text-label-caps text-error flex-shrink-0">Min threshold: 20</span></div></div><button class="reorder-btn bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold px-space-sm py-1.5 rounded-lg shadow-sm flex items-center gap-1 active:scale-95 hover:bg-primary transition-all flex-shrink-0"><span class="material-symbols-outlined text-[16px]">shopping_cart_checkout</span><span class="">Reorder</span></button></div><div class="flex items-center justify-between pt-1 border-t border-surface-container/60"><div class="font-data-mono-num text-[16px] text-on-surface font-bold">₹168</div><div class="flex items-center gap-1 text-error bg-error-container/60 px-space-xs py-0.5 rounded-full font-body-sm text-body-sm font-bold"><span class="material-symbols-outlined text-[16px]">warning</span><span class="">Stock: 5 units</span></div></div></div></div>
<!-- Item 4: Healthy Stock (Amul Butter) -->
<div class="product-card group bg-surface-container-lowest rounded-xl p-space-md shadow-[0_4px_12px_rgba(0,46,110,0.04)] flex items-center justify-between transition-all gap-space-sm" data-category="dairy" data-status="healthy"><div class="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed font-headline-sm text-headline-sm flex items-center justify-center font-bold flex-shrink-0">AB</div><div class="flex-1 min-w-0 flex flex-col gap-1.5"><div class="flex items-start justify-between gap-space-xs"><div class="min-w-0 flex-1"><h2 class="font-headline-sm text-headline-sm text-on-surface truncate">Amul Butter 500g</h2><div class="flex items-center gap-space-xs mt-0.5"><span class="font-label-caps text-label-caps text-outline truncate">Dairy • SKU-2201</span><span class="text-outline text-[10px] flex-shrink-0">•</span><span class="font-label-caps text-label-caps text-outline flex-shrink-0">Chiller Bay 1</span></div></div><button class="bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-body-sm text-body-sm font-semibold px-space-sm py-1.5 rounded-lg active:scale-95 transition-all flex-shrink-0">Update</button></div><div class="flex items-center justify-between pt-1 border-t border-surface-container/60"><div class="font-data-mono-num text-[16px] text-on-surface font-bold">₹275</div><div class="flex items-center gap-1 text-on-tertiary-container bg-surface-container-low px-space-xs py-0.5 rounded-full font-body-sm text-body-sm font-semibold"><span class="material-symbols-outlined text-[14px]">check_circle</span><span class="">In Stock: 18 units</span></div></div></div></div>
</div>
<!-- Empty Search State Placeholder (Hidden by default) -->
<div class="hidden flex flex-col items-center justify-center py-space-xl text-center bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm" id="empty-state">
<div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mb-space-sm">
<span class="material-symbols-outlined text-[32px]">inventory</span>
</div>
<div class="font-headline-sm text-headline-sm text-on-surface">No Products Found</div>
<p class="font-body-sm text-body-sm text-outline max-w-[240px] mt-1">Check the spelling or try filtering by another retail category.</p>
</div>
<!-- Distributor Quick Insights Tile -->
<div class="bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_4px_12px_rgba(0,46,110,0.04)] flex items-center gap-space-md">
<div class="w-12 h-12 rounded-xl bg-primary-fixed-dim/40 flex items-center justify-center text-primary-container flex-shrink-0">
<span class="material-symbols-outlined text-[24px]">local_shipping</span>
</div>
<div class="flex-1 min-w-0">
<div class="font-headline-sm text-headline-sm text-on-surface">Next Scheduled Delivery</div>
<div class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Metro FMCG Wholesalers • Tomorrow 09:30 AM</div>
</div>
<span class="material-symbols-outlined text-outline">chevron_right</span>
</div>
</div>
<!-- Sticky Bulk Action Purchase Order Tray -->
<div class="sticky bottom-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md px-margin py-space-sm shadow-[0_-8px_24px_rgba(0,46,110,0.08)]">
<div class="flex flex-col gap-1.5 max-w-lg mx-auto">
<button class="w-full bg-primary-container text-on-primary py-3.5 px-space-md rounded-xl font-headline-sm text-headline-sm font-semibold shadow-lg hover:bg-primary active:scale-[0.98] transition-all flex items-center justify-center gap-space-xs relative overflow-hidden group" id="draft-po-btn">
<div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
<span class="material-symbols-outlined text-[22px]">assignment</span>
<span class="">Draft Purchase Order (3)</span>
</button>
<div class="flex items-center justify-center gap-1.5 text-on-surface-variant">
<span class="material-symbols-outlined text-[14px] text-secondary">bolt</span>
<span class="font-label-caps text-label-caps tracking-tight">Auto-fills 3 low-stock items from verified distributors</span>
</div>
</div>
</div>
<!-- Interactive Quick Sheet / Feedback Modal (Triggered by draft PO) -->
<div class="fixed top-16 left-4 right-4 z-50 transform -translate-y-24 opacity-0 pointer-events-none transition-all duration-300" id="confirmation-toast">
<div class="bg-primary text-on-primary p-space-md rounded-xl shadow-2xl flex items-center justify-between">
<div class="flex items-center gap-space-sm">
<div class="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold">
<span class="material-symbols-outlined text-[18px]">done_all</span>
</div>
<div>
<div class="font-headline-sm text-headline-sm text-on-primary">PO #8942 Created</div>
<div class="font-body-sm text-body-sm text-primary-fixed">Sent to Metro FMCG Suppliers via WhatsApp &amp; EDI</div>
</div>
</div>
<button class="text-primary-fixed hover:text-on-primary" id="close-toast">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
</div>
</div>
<script>
  // Search and Filter Handling
  const searchInput = document.getElementById('product-search');
  const clearSearchBtn = document.getElementById('clear-search');
  const cards = document.querySelectorAll('.product-card');
  const emptyState = document.getElementById('empty-state');
  const chips = document.querySelectorAll('.chip');
  let currentFilter = 'all';

  function applyFilters() {
    const term = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach(card => {
      const title = card.querySelector('h2').textContent.toLowerCase();
      const meta = card.textContent.toLowerCase();
      const category = card.getAttribute('data-category');
      const status = card.getAttribute('data-status');

      const matchesSearch = title.includes(term) || meta.includes(term);
      let matchesChip = true;

      if (currentFilter === 'low-stock') {
        matchesChip = (status === 'low');
      } else if (currentFilter !== 'all') {
        matchesChip = (category === currentFilter);
      }

      if (matchesSearch && matchesChip) {
        card.classList.remove('hidden');
        card.classList.add('flex');
        visibleCount++;
      } else {
        card.classList.add('hidden');
        card.classList.remove('flex');
      }
    });

    if (visibleCount === 0) {
      emptyState.classList.remove('hidden');
      emptyState.classList.add('flex');
    } else {
      emptyState.classList.add('hidden');
      emptyState.classList.remove('flex');
    }

    if (term.length > 0) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }
  }

  searchInput.addEventListener('input', applyFilters);

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    applyFilters();
    searchInput.focus();
  });

  // Filter Chips Switcher
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => {
        c.classList.remove('bg-primary-container', 'text-on-primary', 'shadow-sm');
        c.classList.add('bg-surface-container-lowest', 'text-on-surface-variant');
      });

      chip.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');
      chip.classList.add('bg-primary-container', 'text-on-primary', 'shadow-sm');

      currentFilter = chip.getAttribute('data-filter');
      applyFilters();
    });
  });

  // Micro-interaction: Trigger Purchase Order Feedback Toast
  const draftPOBtn = document.getElementById('draft-po-btn');
  const toast = document.getElementById('confirmation-toast');
  const closeToast = document.getElementById('close-toast');

  draftPOBtn.addEventListener('click', () => {
    toast.classList.remove('-translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      toast.classList.add('-translate-y-24', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 4000);
  });

  closeToast.addEventListener('click', () => {
    toast.classList.add('-translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.remove('translate-y-0', 'opacity-100');
  });

  // Instant reorder clicks
  document.querySelectorAll('.reorder-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentText = btn.innerHTML;
      btn.innerHTML = `<span class="material-symbols-outlined text-[16px] animate-spin">sync</span><span>Added</span>`;
      btn.classList.add('bg-tertiary-container', 'text-on-tertiary-container');
      setTimeout(() => {
        btn.innerHTML = currentText;
        btn.classList.remove('bg-tertiary-container', 'text-on-tertiary-container');
      }, 1500);
    });
  });
</script></main><nav class="fixed bottom-0 w-full z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,46,110,0.06)]" data-active-classes="text-primary-container font-headline-sm"><div class="h-16 px-space-sm flex items-center justify-around"><a aria-current="page" class="flex flex-col items-center justify-center h-14 min-w-[56px] transition-colors group text-primary-container font-semibold" data-path="home" href="dashboard.html"><span class="material-symbols-outlined text-[24px]">home</span><span class="font-body-sm text-[11px]">Home</span></a><a class="flex flex-col items-center justify-center h-14 min-w-[56px] text-on-surface-variant transition-colors group" data-path="passbook" href="passbook.html"><span class="material-symbols-outlined text-[24px]">receipt_long</span><span class="font-body-sm text-[11px]">Passbook</span></a><a class="flex flex-col items-center justify-center h-14 min-w-[56px] text-on-surface-variant transition-colors group" data-path="loans" href="loans.html"><span class="material-symbols-outlined text-[24px]">credit_card</span><span class="font-body-sm text-[11px]">Loans</span></a><a class="flex flex-col items-center justify-center h-14 min-w-[56px] text-on-surface-variant transition-colors group" data-path="account" href="account.html"><span class="material-symbols-outlined text-[24px]">account_circle</span><span class="font-body-sm text-[11px]">Account</span></a></div></nav>

</body></html>"""

with open(r'c:\Users\Pranav\PROJECT\BRAHAMAPUTRAX\scratch\jaldrishti\frontend\public\inventory.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# Update dashboard.html to link to inventory.html
dashboard_path = r'c:\Users\Pranav\PROJECT\BRAHAMAPUTRAX\scratch\jaldrishti\frontend\public\dashboard.html'
with open(dashboard_path, 'r', encoding='utf-8') as f:
    dashboard_html = f.read()

# Replace any a tag with data-path="merchant-inventory" href="#" or similar
# Based on earlier code, we should replace href="#" in the Inventory Quick Action
# Let's use regex to find the Inventory action button (anchor tag)
dashboard_html = re.sub(r'href="[^"]*"\s*>\s*<span class="material-symbols-outlined text-\[28px\]">inventory_2</span>', r'href="inventory.html">\n<span class="material-symbols-outlined text-[28px]">inventory_2</span>', dashboard_html)
# Update low stock card link if it exists and is an anchor
dashboard_html = re.sub(r'href="[^"]*"\s*>\s*<div class="flex items-center gap-space-xs">\s*<div class="w-8 h-8 rounded-full bg-error-container', r'href="inventory.html">\n<div class="flex items-center gap-space-xs">\n<div class="w-8 h-8 rounded-full bg-error-container', dashboard_html)

# To be perfectly safe, let's also ensure any href="#" with "inventory" in text nearby is replaced.
# Let's run a more targeted string replacement for the Inventory quick-action pillar.
with open(dashboard_path, 'w', encoding='utf-8') as f:
    f.write(dashboard_html)

print("Inventory saved and dashboard patched.")
