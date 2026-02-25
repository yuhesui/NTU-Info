const DEFAULT_BANNER_ALT = 'Register for the upcoming NTU student event';
const DEFAULT_BANNER_LINK = 'https://luma.com/tqx5xvcy';
const DEFAULT_BANNER_IMAGE = 'data/Banner-Low.png';

export function initFloatingPromoBanner() {
  const root = document.body;
  if (!root || !root.hasAttribute('data-floating-promo')) return;

  const href = root.getAttribute('data-promo-link') || DEFAULT_BANNER_LINK;
  const imgSrc = root.getAttribute('data-promo-image') || DEFAULT_BANNER_IMAGE;
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
