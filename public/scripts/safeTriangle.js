/**
 * Hover intent helper for trigger + floating panel pairs.
 * Uses short close delay and safe-triangle hit testing to keep panel open
 * while pointer moves diagonally from trigger toward panel.
 */
export function createSafeTriangle(options) {
  const {
    trigger,
    panel,
    onOpen,
    onClose,
    closeDelay = 300
  } = options;

  let closeTimer = null;
  let pointer = null;

  function clearCloseTimer() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  function scheduleClose(origin) {
    clearCloseTimer();
    closeTimer = setTimeout(() => {
      if (origin === 'trigger' && isMovingTowardPanel()) {
        scheduleClose('triangle');
        return;
      }
      onClose();
    }, closeDelay);
  }

  function capturePointerMove(event) {
    pointer = { x: event.clientX, y: event.clientY };
  }

  function pointInTriangle(p, a, b, c) {
    const area = (p1, p2, p3) => (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
    const w1 = area(p, b, c);
    const w2 = area(a, p, c);
    const w3 = area(a, b, p);
    const hasNeg = (w1 < 0) || (w2 < 0) || (w3 < 0);
    const hasPos = (w1 > 0) || (w2 > 0) || (w3 > 0);
    return !(hasNeg && hasPos);
  }

  function isMovingTowardPanel() {
    if (!pointer) return false;

    const triggerRect = trigger.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();

    const anchor = {
      x: Math.min(Math.max(pointer.x, triggerRect.left), triggerRect.right),
      y: Math.min(Math.max(pointer.y, triggerRect.top), triggerRect.bottom)
    };

    const topCorner = { x: panelRect.left, y: panelRect.top };
    const bottomCorner = { x: panelRect.left, y: panelRect.bottom };

    return pointInTriangle(pointer, anchor, topCorner, bottomCorner);
  }

  trigger.addEventListener('mouseenter', () => {
    clearCloseTimer();
    onOpen();
  });

  trigger.addEventListener('mouseleave', () => scheduleClose('trigger'));
  panel.addEventListener('mouseenter', clearCloseTimer);
  panel.addEventListener('mouseleave', () => scheduleClose('panel'));
  document.addEventListener('mousemove', capturePointerMove, { passive: true });

  return {
    clearCloseTimer,
    destroy() {
      clearCloseTimer();
      document.removeEventListener('mousemove', capturePointerMove);
    }
  };
}
