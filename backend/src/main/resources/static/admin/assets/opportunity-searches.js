function searchScanSummary(search){
 const message=String(search.last_message||'');
 const results=message.match(/(\d+) new · (\d+) updated · (\d+) notices missing essential fields\. Checked (\d+) releases\./);
 if(!results)return search.last_status==='failed'?'Search could not finish. Retry Fetch now.': 'Incomplete scan. Retry Fetch now; review eligibility and documents.';
 const [,added,updated,missing,checked]=results;
 return `${added} new · ${updated} updated · ${checked} notices checked${Number(missing)?` · ${missing} missing essential details`:''}. Review eligibility and documents.`;
}
let opportunitySearchTimer,opportunitySettingsOpen=false;
async function opportunitySearches(){
 clearTimeout(opportunitySearchTimer);const host=document.getElementById('opportunity-searches'),fetchButton=document.getElementById('opp-fetch');if(!host||!fetchButton)return;
 try{
 const searches=await api('/api/admin/opportunity-searches'),s=searches[0];if(!host.isConnected)return;
 if(!s){host.textContent='No supply search configured.';fetchButton.disabled=true;return;}
 const running=s.last_status==='running',incomplete=['failed','partial','interrupted'].includes(s.last_status);
 host.innerHTML=`${running?'<p class="opp-run-status small" role="status">Checking Treasury for supply opportunities…</p>':incomplete?`<p class="opp-scan-notice" role="status">${h(searchScanSummary(s))}</p>`:''}<p id="search-result" class="error small" role="status"></p>`;
 fetchButton.disabled=running;fetchButton.innerHTML=running?'Checking…':'<span aria-hidden="true">↻</span> Fetch now';
 fetchButton.onclick=async()=>{fetchButton.disabled=true;try{await api('/api/admin/opportunity-searches/'+s.id+'/fetch',{method:'POST',headers:{[session.csrfHeader]:session.csrfToken}});await opportunitySearches();}catch(e){document.getElementById('search-result').textContent=e.message;fetchButton.disabled=false;}};
 opportunitySearchTimer=setTimeout(async()=>{if(!document.getElementById('opportunity-searches')||opportunitySettingsOpen)return;await opportunitySearches();window.dispatchEvent(new CustomEvent('opportunities-fetched'));},running?3500:60000);
 }catch(e){host.textContent=e.message;fetchButton.disabled=true;}
}
