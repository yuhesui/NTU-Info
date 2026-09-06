const DEFAULT_BANNER_ALT = 'Register for the upcoming NTU student event';
const DEFAULT_BANNER_LINK = ''; // no default link
const DEFAULT_BANNER_IMAGE = new URL('', import.meta.url).toString(); // no default image

function resolvePromoImageSrc(rawSrc) {
  if (!rawSrc) return DEFAULT_BANNER_IMAGE;
  // Absolute, protocol-relative, root-relative, and data/blob URLs are used as-is.
  if (/^(?:[a-zA-Z][a-zA-Z\d+\-.]*:)?\/\//.test(rawSrc) ||
      rawSrc.startsWith('/') ||
      rawSrc.startsWith('data:') ||
      rawSrc.startsWith('blob:')) {
    return rawSrc;
  }
  try {
    return new URL(rawSrc, import.meta.url).toString();
  } catch {
    return rawSrc;
  }
}

export function initFloatingPromoBanner() {
  const root = document.body;
  if (!root || !root.hasAttribute('data-floating-promo')) return;

  const rawHref = root.getAttribute('data-promo-link') || DEFAULT_BANNER_LINK;
  // Only allow safe protocols; fall back to the default link if the value looks unsafe.
  let href;
  try {
    const parsed = new URL(rawHref);
    href = (parsed.protocol === 'https:' || parsed.protocol === 'http:') ? rawHref : DEFAULT_BANNER_LINK;
  } catch {
    href = DEFAULT_BANNER_LINK;
  }
  const imgSrc = resolvePromoImageSrc(root.getAttribute('data-promo-image'));
  const alt = root.getAttribute('data-promo-alt') || DEFAULT_BANNER_ALT;

  const wrapper = document.createElement('section');
  wrapper.className = 'floating-promo';
  wrapper.setAttribute('aria-label', 'Event promotion');

  const link = document.createElement('a');
  link.className = 'floating-promo-link';
  link.href = href;

  const image = document.createElement('img');
  image.className = 'floating-promo-image';
  image.src = imgSrc;
  image.alt = alt;
  image.width = 1200;
  image.height = 120;
  image.loading = 'eager';
  image.decoding = 'async';

  link.appendChild(image);
  wrapper.appendChild(link);
  root.appendChild(wrapper);
}
