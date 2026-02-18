/**
 * Airport Arrival Guide
 * Lightweight initialization + required verification logs.
 */

function init() {
  console.log('[PAGE] Loaded successfully:', document.title);
  console.log('[PAGE] Steps visible:', document.querySelectorAll('.step').length);
}

document.addEventListener('DOMContentLoaded', init);
