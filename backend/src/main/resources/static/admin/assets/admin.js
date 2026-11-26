const workspace=document.getElementById('workspace');
const h=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={submitted:'New',in_review:'Reviewing',approved:'Sourcing approved',quoted:'Sent',closed:'Closed',cancelled:'Cancelled'};
const badge=status=>`<span class="badge ${h(status)}">${h(labels[status]||status)}</span>`;
const buyerName=value=>value==='government'?'Government':value==='schools'?'Schools':'Business';
const date=value=>value?new Intl.DateTimeFormat('en-ZA',{day:'numeric',month:'short',year:'numeric',timeZone:'Africa/Johannesburg'}).format(new Date(value)):'Not supplied';
const dateTime=value=>value?new Intl.DateTimeFormat('en-ZA',{dateStyle:'medium',timeStyle:'short',timeZone:'Africa/Johannesburg'}).format(new Date(value))+' SAST':'Not supplied';
let session;
const noteDrafts=new Map();
const responseTargetDrafts=new Map();
function deadlineBadges(alerts=[]){return alerts.length?'<div class="deadline-badges">'+alerts.map(a=>`<span class="deadline-tag ${h(a.severity)}" title="${h(dateTime(a.dueAt))}">${h(a.label)}</span>`).join('')+'</div>':'';}
function deadlineNotice(alerts=[]){return alerts.length?'<section class="deadline-notice" aria-label="Deadline alerts"><h2>Needs attention</h2><ul>'+alerts.map(a=>`<li class="${h(a.severity)}"><strong>${h(a.label)}</strong><span>${h(dateTime(a.dueAt))}</span></li>`).join('')+'</ul><p>These are planning alerts, not delivery commitments.</p></section>':'';}
function localSast(value){return value?new Intl.DateTimeFormat('sv-SE',{timeZone:'Africa/Johannesburg',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value)).replace(' ','T'):'';}
function internalNotesPanel(r){
  const draft=noteDrafts.get(r.id)?.text||'';
  return `<section class="panel internal-notes"><h2>Internal notes</h2><p class="small muted">Staff only. Notes are not included in customer receipts.</p><form id="internal-note-form"><label for="internal-note">Add a note</label><textarea id="internal-note" name="body" maxlength="4000" rows="3" required placeholder="Supplier checks, buyer conversations or outstanding questions">${h(draft)}</textarea><div class="note-actions"><span class="small muted" id="note-length">${draft.length} / 4000</span><button class="primary" type="submit">Save note</button></div><p id="note-result" role="status" class="small"></p></form><div class="note-history">${r.internalNotes.length?r.internalNotes.map(n=>`<article class="staff-note"><p class="pre">${h(n.body)}</p><p class="small muted">${h(n.author_username)} · ${h(dateTime(n.created_at))}</p></article>`).join(''):'<p class="small muted">No internal notes yet.</p>'}</div></section>`;
}
function responseTargetPanel(r){
  const active=['submitted','in_review'].includes(r.status);
  return `<section class="panel response-target"><h2>Response target</h2><p class="small muted">An internal target, separate from the buyer’s closing deadline.</p>${active?`<form id="response-target-form"><label for="respond-by">Respond by (SAST)</label><input id="respond-by" type="datetime-local" value="${h(responseTargetDrafts.has(r.id)?responseTargetDrafts.get(r.id):localSast(r.admin_response_due_at))}"><p class="small muted">Optional. Leave blank to remove the target. A past time appears overdue.</p><button class="secondary" type="submit">Save target</button><p id="target-result" role="status" class="small"></p></form>`:`<p>${r.admin_response_due_at?h(dateTime(r.admin_response_due_at)):'No target set'}</p><p class="small muted">Response alerts stop once a request is quoted, closed or cancelled.</p>`}${r.responseTargetHistory.length?`<details class="target-history"><summary>Target changes</summary>${r.responseTargetHistory.map(change=>`<p class="small">${h(change.actor_username)} · ${h(dateTime(change.created_at))}<br>${change.new_due_at?'Set to '+h(dateTime(change.new_due_at)):'Target cleared'}</p>`).join('')}</details>`:''}</section>`;
}
function bindInternalNotes(r){
  const form=document.getElementById('internal-note-form'),input=document.getElementById('internal-note');
  input.oninput=()=>{input.setCustomValidity('');const previous=noteDrafts.get(r.id);noteDrafts.set(r.id,{text:input.value,key:previous?.text.trim()===input.value.trim()?previous.key:crypto.randomUUID()});document.getElementById('note-length').textContent=input.value.length+' / 4000';};
  form.onsubmit=async e=>{
    e.preventDefault();if(!input.value.trim()){input.setCustomValidity('Enter a note before saving.');input.reportValidity();return;}
    const result=document.getElementById('note-result'),button=form.querySelector('button');
    let draft=noteDrafts.get(r.id);if(!draft||draft.text!==input.value){draft={text:input.value,key:crypto.randomUUID()};noteDrafts.set(r.id,draft);}
    button.disabled=true;input.disabled=true;button.textContent='Saving…';result.textContent='';
    try{await api('/api/admin/rfqs/'+r.id+'/notes',{method:'POST',headers:{[session.csrfHeader]:session.csrfToken,'Content-Type':'application/json'},body:JSON.stringify({submissionKey:draft.key,body:draft.text.trim()})});noteDrafts.delete(r.id);await refreshSelected(r.id);const notice=String(r.id)===selectedId?document.getElementById('note-result'):null;if(notice)notice.textContent='Note saved.';}catch(error){result.textContent=error.message;result.classList.add('error');button.disabled=false;input.disabled=false;button.textContent='Save note';}
  };
}
function bindResponseTarget(r){
  const form=document.getElementById('response-target-form');if(!form)return;document.getElementById('respond-by').oninput=e=>responseTargetDrafts.set(r.id,e.target.value);
  form.onsubmit=async e=>{
    e.preventDefault();const value=document.getElementById('respond-by').value,button=form.querySelector('button'),result=document.getElementById('target-result');
    button.disabled=true;result.textContent='Saving…';
    try{await api('/api/admin/rfqs/'+r.id+'/response-target',{method:'POST',headers:{[session.csrfHeader]:session.csrfToken,'Content-Type':'application/json'},body:JSON.stringify({dueAt:value?value+'+02:00':null})});responseTargetDrafts.delete(r.id);await refreshSelected(r.id);await loadInbox();const notice=String(r.id)===selectedId?document.getElementById('target-result'):null;if(notice)notice.textContent=value?'Response target saved.':'Response target removed.';}catch(error){result.textContent=error.message;result.classList.add('error');button.disabled=false;}
  };
}
function signIn(){workspace.replaceChildren();document.getElementById('signed-in').textContent='';location.replace('/admin/login.html');}
async function api(path,options={}){
  const response=await fetch(path,{cache:'no-store',...options});
  if(response.status===401){signIn();throw Error('Your session has ended. Please sign in again.');}
  if(!response.ok){const problem=await response.json().catch(()=>({}));throw Error(problem.message||(response.status===403?'Your session or security token has expired. Refresh this page.':response.status===404?'This request could not be found.':'Unable to complete this action. Please try again.'));}
  return response.json();
}
function facts(rows){return '<dl class="facts">'+rows.filter(([,v])=>v!==null&&v!==undefined&&v!=='').map(([label,value])=>`<dt>${h(label)}</dt><dd>${h(value)}</dd>`).join('')+'</dl>';}
function failure(error){workspace.innerHTML=`<section class="panel"><h1>Unable to load requests</h1><p class="error" role="alert">${h(error.message)}</p><button class="secondary" id="try-again">Try again</button></section>`;document.getElementById('try-again').onclick=render;}
function options(selected,values){return values.map(([value,label])=>`<option value="${h(value)}" ${value===selected?'selected':''}>${h(label)}</option>`).join('');}

// Paginate standalone admin lists without replacing their editable rows.
function paginateAdminTable(host){
 if(!host)return;const table=host.querySelector('table');if(!table)return;
 const rows=[...table.tBodies[0].rows];if(rows.length<=10)return;
 let page=1;const pages=Math.ceil(rows.length/10),nav=document.createElement('nav');nav.className='admin-list-pagination';nav.setAttribute('aria-label','List pages');table.closest('.table-scroll').after(nav);
 function draw(){rows.forEach((row,i)=>row.hidden=i<(page-1)*10||i>=page*10);host.querySelector('#inventory-expanded')?.remove();const first=Math.max(1,Math.min(page-2,pages-4));nav.innerHTML=`<span class="small muted">${(page-1)*10+1}–${Math.min(page*10,rows.length)} of ${rows.length}</span><div><button type="button" class="quiet" data-list-page="${page-1}" ${page===1?'disabled':''}>Prev</button>${Array.from({length:Math.min(5,pages)},(_,i)=>first+i).map(n=>`<button type="button" class="quiet" data-list-page="${n}" ${n===page?'aria-current="page"':''}>${n}</button>`).join('')}<button type="button" class="quiet" data-list-page="${page+1}" ${page===pages?'disabled':''}>Next</button></div>`;nav.querySelectorAll('[data-list-page]').forEach(b=>b.onclick=()=>{page=Number(b.dataset.listPage);draw();table.scrollIntoView({block:'start'});});}draw();
}
