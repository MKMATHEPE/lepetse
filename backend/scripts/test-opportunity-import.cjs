const {parseOpportunity}=require('../src/main/resources/static/admin/assets/opportunity-import.js');
const assert=require('node:assert/strict');
const labelled=parseOpportunity(`## Broadband Infraco — Website Hosting Services
RFQ 12379 (POSSIBLE)
Closing deadline
17 Nov 2026, 12:00 SAST
Briefing: None specified
Submission: Email
Submit to: Quotations@infraco.co.za
https://www.etenders.gov.za/home/Download?blobName=example.pdf`);
assert.equal(labelled.details.buyer,'Broadband Infraco');assert.equal(labelled.details.title,'Website Hosting Services');assert.equal(labelled.details.reference,'RFQ 12379');assert.equal(labelled.details.closing,'2026-11-17T12:00+02:00');assert.equal(labelled.details.email,'Quotations@infraco.co.za');assert.equal(labelled.details.recommendation,'possible');
const prose=parseOpportunity('National Heritage Council — Bulk email platform\nRFQ/NHC/2026/27/037\nIt closes 24 November 2026 at 11:00 SAST.\nClassification: SKIP.\nEmail: procurement@nhc.org.za');
assert.equal(prose.details.closing,'2026-11-24T11:00+02:00');assert.equal(prose.details.recommendation,'skip');assert.equal(prose.details.reference,'RFQ/NHC/2026/27/037');
const missing=parseOpportunity('Title: Paper supply\nBuyer: Test office\nReference: TEST-1\nClosing: 10 Dec 2026');assert.equal(missing.details.closing,'');assert(missing.warnings.some(w=>w.includes('complete closing')));assert.equal(missing.details.contact,'');
const multi=parseOpportunity('RFQ 12379\nRFQ 99999');assert(multi.warnings.some(w=>w.includes('Several tender references')));
const hostile=parseOpportunity('Title: <script>alert(1)</script>\nBuyer: Example\nSource URL: javascript:alert(1)');assert.equal(hostile.details.title,'<script>alert(1)</script>');
assert(missing.details.importOriginal.includes('Closing: 10 Dec 2026'));
console.log('Opportunity import: 5 extraction scenarios passed.');
