/* Local text extraction only: no pasted content is sent to an external service. */
(function(root){
 function parseOpportunity(text){
  const original=String(text||'').trim();
  const clean=original.replace(/\\([@.])/g,'$1').replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'$1 $2').replace(/[*_`]/g,'').replace(/^\s*#{1,6}\s*/gm,'');
  const lines=clean.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  const labels={title:['Opportunity','Title'],buyer:['Buyer','Organisation','Organization'],reference:['Reference','RFQ reference','Tender reference','Tender number','RFQ number'],closing:['Closing deadline','Closing date','Closes','Closing'],scope:['Scope','What NAMARO would deliver','What Lepetse would deliver'],rationale:['Recommendation reason','Rationale','Why it fits','Assessment'],requirements:['Mandatory requirements','Eligibility','Requirements'],briefing:['Briefing','Compulsory briefing'],submission:['Submission','Submit to','Submission method'],contact:['Contact','Buyer contact'],email:['Email','Buyer email'],phone:['Telephone','Phone','Tel'],source:['Official notice URL','Source URL'],documents:['Documents','Document links'],instructions:['Instructions','Amendments']};
  function value(names){for(let i=0;i<lines.length;i++)for(const name of names){if(lines[i].toLowerCase()===name.toLowerCase())return lines[i+1]||'';if(lines[i].toLowerCase().startsWith(name.toLowerCase()+':'))return lines[i].slice(name.length+1).trim();}return '';}
  const d={};Object.entries(labels).forEach(([k,v])=>d[k]=value(v));
  const ref=clean.match(/\b(?:RFQ|RFP|RFB)\s*(?:No\.?\s*|number\s*|reference\s*)?[:#/]?\s*([A-Z0-9][A-Z0-9/._-]*(?:\s*[-/]\s*[A-Z0-9]+)*)/i);
  if(!d.reference&&ref)d.reference=ref[0].trim();
  if(!d.buyer){const header=lines.find(l=>/\s[—–]\s/.test(l)&&!/^NAMARO|^Closing|^Classification/i.test(l));if(header){const parts=header.replace(/^(BID|POSSIBLE|SKIP)\s*[—–:]\s*/i,'').split(/\s[—–]\s/);d.buyer=parts[0];if(!d.title)d.title=parts.slice(1).join(' — ');}}
  if(!d.title)d.title=lines.find(l=>!/^NAMARO|^\(|^(new opportunity|closing|published|classification|recommendation|buyer|reference)\b/i.test(l)&&l!==d.buyer&&l!==d.reference)||'';
  const judgement=clean.match(/(?:Classification|Recommendation)\s*:\s*(BID|POSSIBLE|SKIP)\b/i)||clean.match(/\b(BID|POSSIBLE|SKIP)\s*[—–:]/i)||clean.match(/\((BID|POSSIBLE|SKIP)(?:[,\s)]|$)/i);
  d.recommendation=judgement?judgement[1].toLowerCase():'possible';d.buyerType='government';
  if(!d.email)d.email=clean.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]||'';
  if(!d.phone)d.phone=clean.match(/(?:\+27|0)\s*\d{2}[\s-]*\d{3}[\s-]*\d{4}\b/)?.[0]||'';
  const urls=[...new Set((clean.match(/https?:\/\/[^\s<>]+/g)||[]).map(v=>v.replace(/[).,;]+$/,'')))];
  if(!/^https?:\/\/\S+$/i.test(d.source))d.source=urls[0]||'';d.documents=urls.filter(v=>v!==d.source).join('\n');
  const closingText=d.closing||clean.match(/clos(?:es|ing)(?:\s+(?:date|deadline))?\s*[:—–]?\s*([^\n.]+)/i)?.[1]||'';
  let closing='';const iso=closingText.match(/\b(\d{4}-\d{2}-\d{2})[T\s,]+(\d{1,2}:\d{2})(?::\d{2})?(Z|[+-]\d{2}:\d{2})?/i);
  if(iso)closing=iso[1]+'T'+iso[2].padStart(5,'0')+(iso[3]||'+02:00');
  else {const m=closingText.match(/\b(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{4})\s*[,·—–]?\s*(?:at\s+)?(\d{1,2}):(\d{2})/i);if(m){const month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(m[2].slice(0,3).toLowerCase())+1;closing=`${m[3]}-${String(month).padStart(2,'0')}-${m[1].padStart(2,'0')}T${m[4].padStart(2,'0')}:${m[5]}+02:00`;}}
  d.closing=closing&&!Number.isNaN(Date.parse(closing))&&new Date(closing.slice(0,10)).toISOString().slice(0,10)===closing.slice(0,10)?closing:'';
  const warnings=['Review the extracted fields against the original update. Nothing is saved yet.'];
  if(!d.closing)warnings.push('Confirm the complete closing date, year and time (SAST).');
  const identities=[...clean.matchAll(/\b(?:RFQ|RFP|RFB)\s*[/:-]?\s*[A-Z0-9][A-Z0-9/._-]*\d[A-Z0-9/._-]*/gi)].map(m=>m[0].toLowerCase());
  if(new Set(identities).size>1)warnings.push('Several tender references were detected. Import one opportunity at a time.');
  if(!d.scope)d.scope='';
  // Preserve the full update for review instead of inventing missing requirements.
  d.importOriginal=original;
  return {details:d,warnings};
 }
 root.parseOpportunity=parseOpportunity;
 if(typeof module!=='undefined'&&module.exports)module.exports={parseOpportunity};
})(typeof window!=='undefined'?window:globalThis);
