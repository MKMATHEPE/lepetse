// Only Spring Boot enables submission. The static prototype remains a preview.
function rfqSubmissionAvailable(buyer=formData){return window.LEPETSE_CONFIG?.rfqSubmission===true&&['Private business','Government / public entity','School / education'].includes(buyer.buyerType)}
const rfqSubmissionKeys=new Map();
let rfqSubmitting=false;
function rfqSubmissionPrivacy(){return pageHero('Your information','How RFQ information is handled','Submit only the information needed to assess your stationery requirements.')+'<section class="section"><div class="wrap content"><h2>When you submit an RFQ</h2><p>Selecting Submit RFQ sends your organisation, contact details, requirements, delivery information and attached documents to the Lepetse backend. These are stored for quotation review. Documents remain private and await safety checks. No confirmation email is sent and no order or payment is created.</p><h2>On this device</h2><p>Cart and quote-basket selections are saved on this device. Contact details and attachments stay in browser memory until submission and clear on refresh. Downloaded summaries and receipts are files on your device; keep them secure.</p><p>For questions about information supplied with an RFQ, contact <a href="mailto:Admin@lepetse.co.za">Admin@lepetse.co.za</a>.</p></div></section>'}
function rfqRequestedBrand(item){
  if(typeof item.requestedBrand==='string'&&item.requestedBrand.trim())return item.requestedBrand.trim();
  // School substitutions are proposed products, not evidence of the originally requested brand.
  if(item.school)return null;
  const product=products.find(p=>p.id===item.productId)||retiredProducts.find(p=>p.id===item.productId);
  const brand=typeof product?.brand==='string'?product.brand.trim():'';
  return !brand||/^(?:to be confirmed|not specified|brand to be confirmed|unknown|unbranded|generic)$/i.test(brand)?null:brand;
}
function rfqRequestPayload(summary,source){
  const b=summary.buyer;
  const sites=rfqDeliveryLocations(b);
  const delivery=sites.length?sites:[{town:b.town,province:b.province,postcode:b.postcode,contact:b.contact,phone:b.phone}];
  const purchaseType=b.orderType==='Scheduled repeat request'?'scheduled_repeat':/recurr|repeat|regular/i.test(b.orderType||'')?'repeat':'once_off';
  return {source,buyer:{organisation:b.organisation,contact:b.contact,email:b.email,phone:b.phone||'',buyerType:b.buyerType==='Government / public entity'?'government':b.buyerType==='School / education'?'schools':'business',purchaseType,reference:b.reference||null,deadline:b.deadline?b.deadline+'+02:00':null,channel:b.channel||null,briefing:b.briefing||null,previousReference:b.previousReference||null,poNumber:b.poNumber||null,costCentre:b.costCentre||null,alternatives:b.alternatives||'Please confirm with me',notes:b.notes||null,scheduleFrequency:b.scheduleFrequency||null,scheduleCustom:b.scheduleCustom||null,scheduleStart:b.scheduleStart||null,scheduleEndRule:b.scheduleEndRule||null,scheduleEnd:b.scheduleEnd||null},items:summary.items.map(x=>({productId:x.productId||null,description:x.description,quantity:Number(x.quantity),unit:x.unit,...(rfqRequestedBrand(x)?{requestedBrand:rfqRequestedBrand(x)}:{})})),deliveries:delivery.map(x=>({street:x.street||'',building:x.building||'',suburb:x.suburb||'',town:x.town,province:x.province,postcode:x.postcode,contact:x.contact||b.contact,phone:x.phone||b.phone||'',instructions:[x.label,x.instructions].filter(Boolean).join(' · '),requiredDate:b.date,flexibility:b.timing==='Required on this date'?'fixed':'flexible'}))};
}
function rfqReceiptPage(receipt,buyer){
  const route=buyer.buyerType==='Government / public entity'?'government':buyer.buyerType==='School / education'?'schools':'business';
  main.innerHTML=`<section class="section"><div class="wrap content"><span class="eyebrow">Request for quotation</span><h1 tabindex="-1">RFQ received</h1><p>Your reference: <strong>${esc(receipt.reference)}</strong></p><p>Your requirements have been saved for review. Lepetse will determine the prices and respond with a quotation. No order or payment has been created.</p><p>${receipt.itemCount} item lines · ${receipt.attachmentCount} documents${receipt.attachmentCount?' · Documents awaiting safety checks':''}</p><p class="help">No confirmation email has been sent. Keep your reference for follow-up. Submitting an RFQ here does not submit a bid to a government institution.</p><div class="actions"><button class="btn dark" id="download-rfq-receipt" type="button">Download receipt</button><a class="btn outline" href="#${route}">Return to ${route==='government'?'Government':route==='schools'?'Schools':'Businesses'}</a></div></div></section>`;
  $('#download-rfq-receipt').onclick=()=>{
    const html='<!doctype html><html lang="en-ZA"><meta charset="utf-8"><title>Lepetse RFQ receipt</title><body><h1>Lepetse RFQ receipt</h1><p>Reference: '+esc(receipt.reference)+'</p><p>Received: '+esc(receipt.receivedAt)+'</p><p>'+receipt.itemCount+' item lines · '+receipt.attachmentCount+' documents</p><p>Saved for review. Pricing and delivery are confirmed separately by quotation. This is not an order or a payment receipt. No confirmation email has been sent.</p></body></html>';
    const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=receipt.reference+'-receipt.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  main.querySelector('h1').focus();window.scrollTo(0,0);
}
async function submitRfq(summary,files,source,button,error){
  if(rfqSubmitting)return;
  rfqSubmitting=true;
  const label=button.textContent;button.disabled=true;button.textContent='Submitting…';error.textContent='';
  const payload=rfqRequestPayload(summary,source);
  const signature=JSON.stringify([payload,files.map(f=>[f.name,f.size,f.lastModified])]);
  if(!rfqSubmissionKeys.has(signature))rfqSubmissionKeys.set(signature,crypto.randomUUID());
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);
  try{
    const body=new FormData();body.append('request',new Blob([JSON.stringify(payload)],{type:'application/json'}));files.forEach(f=>body.append('files',f,f.name));
    const response=await fetch(String(window.LEPETSE_CONFIG.apiBase||'').replace(/\/$/,'')+'/api/rfqs',{method:'POST',headers:{'Idempotency-Key':rfqSubmissionKeys.get(signature)},body,signal:controller.signal});
    const result=await response.json().catch(()=>({}));
    if(!response.ok)throw Error(result.message||'Your RFQ could not be saved. Please try again.');
    if(!result.reference||result.status!=='submitted')throw Error('The submission could not be confirmed. Please try again.');
    rfqReceiptPage(result,summary.buyer);
  }catch(e){
    error.textContent=e.name==='AbortError'?'The submission could not be confirmed. Your details are still here. Try again; the same request will not be saved twice.':e.message||'Unable to connect. Your details are still here. Please try again.';
  }finally{clearTimeout(timer);button.disabled=false;button.textContent=label;rfqSubmitting=false;}
}
function bindDocumentRfqSubmission(summary){
  if(!rfqSubmissionAvailable(summary.buyer))return;
  const actions=document.querySelector('.enquiry-actions>div:last-child');
  const email=$('#email-enquiry');if(email)email.hidden=true;
  const button=document.createElement('button');button.className='btn dark';button.type='button';button.textContent='Submit RFQ';actions.prepend(button);
  const error=document.createElement('p');error.className='error';error.setAttribute('role','alert');document.querySelector('.enquiry-actions').after(error);
  document.querySelector('.enquiry-actions>div:first-child p').textContent='Review your details before submitting. Submission stores this request and its documents with Lepetse. Email confirmations are not enabled.';
  button.onclick=()=>submitRfq(summary,uploadFiles,'document',button,error);
}

function bindCatalogueRfqJourney(){
 const route=location.hash.slice(1).split('?')[0];
 if(!quotationMode()||!(route==='stationery'||route.startsWith('product-')))return;
 if(!document.getElementById('catalogue-rfq-journey'))main.insertAdjacentHTML('afterbegin',`<div id="catalogue-rfq-journey" class="wrap catalogue-rfq-journey"><div><strong>Build your RFQ</strong><span id="catalogue-rfq-count" aria-live="polite"></span></div><a class="btn dark" id="catalogue-rfq-review" href="${rfqHref('basket')}">Review RFQ</a></div>`);
 updateCatalogueRfqJourney();
}
function updateCatalogueRfqJourney(){
 const count=document.getElementById('catalogue-rfq-count');if(!count)return;
 count.textContent=items.length?items.length+' item line'+(items.length===1?'':'s')+' selected':'Choose products and quantities below';
 document.getElementById('catalogue-rfq-review').hidden=!items.length;
}
