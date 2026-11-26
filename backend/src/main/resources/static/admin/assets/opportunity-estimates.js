// Researched benchmarks, not supplier offers. Never used in sourcing or quotations.
const opportunityCostResearch={
 'COJ0015-26/27':{
  checked:'25 Nov 2026',
  items:[
   {name:'Cotton reflective conti suits',qty:19,low:400.38,high:456.38,source:'https://www.allaboutapparel.co.za/product-category/clothing/conti-suits/'},
   {name:'Caps',qty:94,low:39.51,high:39.51,source:'https://originproduction.brandability.co.za/buy/pro-basic-cap-6-panel'},
   {name:'Golf shirts',qty:137},
   {name:'Reflective vests',qty:315,low:55/1.15,high:99/1.15,source:'https://africapro.co.za/collection/hi-viz-reflective'},
   {name:'Boots (pairs)',qty:310,low:1190.94/1.15,high:1247.40,source:'https://zdi.co.za/safety-shoes-3/',otherSource:'https://gfox.co.za/products/footwear/BC'},
   {name:'Outdoor cricket hats',qty:12}
  ]
 }
};
function opportunityCostEstimate(d){
 const estimate=opportunityCostResearch[d.reference];
 if(!estimate)return '<section class="document-section opp-cost-estimate"><h2>Estimated buying cost</h2><p class="muted">Not estimated yet. Item quantities and current supplier prices are needed.</p></section>';
 const known=estimate.items.filter(i=>i.low!=null),low=known.reduce((v,i)=>v+i.qty*i.low,0),high=known.reduce((v,i)=>v+i.qty*i.high,0);
 const money=v=>'R '+Number(v).toLocaleString('en-ZA',{minimumFractionDigits:2,maximumFractionDigits:2});
 const range=(a,b)=>money(a)+(Math.abs(a-b)>.01?' – '+money(b):'');
 return `<section class="document-section opp-cost-estimate"><h2>Estimated buying cost</h2><p><strong>${range(low,high)} excl. VAT</strong> <span class="small muted">· Partial estimate · ${known.length} of ${estimate.items.length} product groups priced</span></p><p class="small muted">Market benchmarks checked ${estimate.checked}. Excludes golf shirts, cricket hats, branding, delivery and markup. This is not the complete job cost or a supplier quotation.</p><details><summary>Cost breakdown &amp; sources</summary><div class="table-scroll"><table class="item-table"><thead><tr><th>Item</th><th>Quantity</th><th>Unit benchmark excl. VAT</th><th>Estimated line cost</th></tr></thead><tbody>${estimate.items.map(i=>`<tr><td>${h(i.name)}${i.source?`<small><a href="${h(i.source)}" target="_blank" rel="noopener noreferrer">Price source ↗</a>${i.otherSource?` · <a href="${h(i.otherSource)}" target="_blank" rel="noopener noreferrer">Upper benchmark ↗</a>`:''}</small>`:''}</td><td>${i.qty}</td><td>${i.low==null?'Price needed':range(i.low,i.high)}</td><td>${i.low==null?'Not included':range(i.qty*i.low,i.qty*i.high)}</td></tr>`).join('')}</tbody></table></div></details></section>`;
}
