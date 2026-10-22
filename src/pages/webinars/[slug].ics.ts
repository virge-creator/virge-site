import type { APIRoute, GetStaticPaths } from 'astro';
import { webinars, getWebinarBySlug, startIso, endIso, webinarPath } from '../../data/webinars';
import { SITE_URL } from '../../data/structured-data';

export const getStaticPaths: GetStaticPaths = () => webinars.map(w => ({ params: { slug: w.slug } }));

const toIcsUtc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
// RFC 5545 text escaping
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

// RFC 5545 line folding: max 75 octets per line, continuation lines start with a space.
const fold = (line: string) => {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = ' ' + rest.slice(74);
  }
  out.push(rest);
  return out.join('\r\n');
};

export const GET: APIRoute = ({ params }) => {
  const w = getWebinarBySlug(params.slug as string)!;
  const url = `${SITE_URL}${webinarPath('en', w.slug)}`;
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Virge.io//Webinars//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${w.slug}@virge.io`,
    `DTSTAMP:${toIcsUtc(new Date().toISOString())}`,
    `DTSTART:${toIcsUtc(startIso(w.date))}`,
    `DTEND:${toIcsUtc(endIso(w.date))}`,
    `SUMMARY:${esc(`Virge.io webinar: ${w.title.en}`)}`,
    `DESCRIPTION:${esc(`${w.summary.en}\n\nThe join link is sent by email after registration.\n${url}`)}`,
    `URL:${url}`,
    'LOCATION:Online',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].map(fold).join('\r\n');
  return new Response(body, { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
