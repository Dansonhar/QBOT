/** Fire WhatsApp-click conversion events to Meta Pixel + GA4.
 *  @param source  Format: "PageName > ButtonLabel"
 */
export function trackWhatsAppClick(source: string) {
  if (typeof window === 'undefined') return;
  // Meta Pixel — standard "Contact" event
  (window as any).fbq?.('track', 'Contact', { content_name: source });
  // GA4 — custom whatsapp_click event (filter/segment by source in reports)
  (window as any).gtag?.('event', 'whatsapp_click', {
    source,
    event_category: 'engagement',
    event_label: source,
  });
}
