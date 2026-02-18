/**
 * Pointer aim-assist for trigger -> submenu movement.
 * Keeps menu open while pointer moves diagonally into panel bounds.
 */
export function createSafeTriangle({ trigger, panel, closeDelay = 300, onOpen, onClose }) {
  if (!trigger || !panel) return { destroy() {} };

  let closeTimer = null;
  let lastPoint = null;
  let previousPoint = null;

  const clearCloseTimer = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  };

  const setLastPoint = (event) => {
    previousPoint = lastPoint;
    lastPoint = { x: event.clientX, y: event.clientY };
  };

  const pointInTriangle = (p, a, b, c) => {
    const area = (v1, v2, v3) => (v1.x * (v2.y - v3.y) + v2.x * (v3.y - v1.y) + v3.x * (v1.y - v2.y));
    const s1 = area(p, a, b);
    const s2 = area(p, b, c);
    const s3 = area(p, c, a);
    const hasNeg = (s1 < 0) || (s2 < 0) || (s3 < 0);
    const hasPos = (s1 > 0) || (s2 > 0) || (s3 > 0);
    return !(hasNeg && hasPos);
  };

  const movingTowardPanel = () => {
    if (!previousPoint || !lastPoint) return false;
    const rect = panel.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;

    const left = { x: rect.left, y: rect.top };
    const right = { x: rect.right, y: rect.top };
    return pointInTriangle(lastPoint, previousPoint, left, right);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer = window.setTimeout(() => {
      if (movingTowardPanel()) {
        scheduleClose();
        return;
      }
      onClose?.();
    }, closeDelay);
  };

  const open = () => {
    clearCloseTimer();
    onOpen?.();
  };

  const onTriggerEnter = (event) => {
    setLastPoint(event);
    open();
  };

  const onTriggerLeave = (event) => {
    setLastPoint(event);
    scheduleClose();
  };

  const onPanelEnter = () => {
    clearCloseTimer();
    onOpen?.();
  };

  const onPanelLeave = (event) => {
    setLastPoint(event);
    scheduleClose();
  };

  const onMove = (event) => setLastPoint(event);

  trigger.addEventListener('mouseenter', onTriggerEnter);
  trigger.addEventListener('mouseleave', onTriggerLeave);
  panel.addEventListener('mouseenter', onPanelEnter);
  panel.addEventListener('mouseleave', onPanelLeave);
  document.addEventListener('mousemove', onMove, { passive: true });

  return {
    destroy() {
      clearCloseTimer();
      trigger.removeEventListener('mouseenter', onTriggerEnter);
      trigger.removeEventListener('mouseleave', onTriggerLeave);
      panel.removeEventListener('mouseenter', onPanelEnter);
      panel.removeEventListener('mouseleave', onPanelLeave);
      document.removeEventListener('mousemove', onMove);
    },
  };
}
