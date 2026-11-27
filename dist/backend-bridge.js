// Load database data before app.js restores baskets or renders routes.
(async function startLepetse(){
  const main=document.getElementById('main');
  async function loadData(){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),window.LEPETSE_CONFIG.apiBase?90000:15000);
    try{
      const base=String(window.LEPETSE_CONFIG.apiBase||'').replace(/\/$/,'');
      const response=await fetch(base+'/api/site-data',{signal:controller.signal,headers:{Accept:'application/json'},cache:'no-store'});
      if(!response.ok)throw Error('Data request failed');
      const data=await response.json();
      if(data.schemaVersion!==1||!Array.isArray(data.products)||!Array.isArray(data.retiredProducts)||!Array.isArray(data.schools)||!data.priceReferences)throw Error('Unsupported data format');
      const glenanda={},curro={},names=[],conversions={},matches={};
      for(const school of data.schools){
        for(const list of school.lists){
          if(school.slug==='glenanda-primary'){
            glenanda[list.grade]=list.items.map(row=>{
              matches[row.source_key]=row.proposed_product_id||row.source_key;
              conversions[row.source_key]={required:row.conversion_required,supplied:row.conversion_supplied,label:row.source_snapshot?.label||({ 'glenanda-27':'clips','glenanda-28':'clips','glenanda-11':'pockets','glenanda-33':'wipes'}[row.source_key]||'')};
              return {key:row.source_key,original:row.requested_description,quantity:row.quantity_per_learner,unit:row.requested_unit,difference:row.replacement_notes||''};
            });
          }else if(school.slug==='curro-serengeti'){
            const grade={general:{},subjects:{},extras:{}};
            for(const row of list.items){
              const raw=row.source_snapshot;
              if(row.source_key.includes(':extra:')){
                (grade.extras[row.subject]||=[]).push((row.quantity_per_learner===null?'':row.quantity_per_learner+' × ')+row.requested_description);
              }else{
                const index=Number(raw.index);
                if(!Number.isInteger(index)||index<0)throw Error('Invalid school requirement');
                names[index]=row.requested_description;
                const counts=row.subject?(grade.subjects[row.subject]||={}):grade.general;
                counts[index]=row.quantity_per_learner;
              }
            }
            curro[list.grade]=grade;
          }
        }
      }
      // Commit only after the complete response has been checked and transformed.
      products.splice(0,products.length,...data.products);
      retiredProducts.splice(0,retiredProducts.length,...data.retiredProducts);
      for(const key of Object.keys(priceReferences))delete priceReferences[key];
      Object.assign(priceReferences,data.priceReferences);
      window.lepetseSales = new Map((data.sales || []).map(sale => [sale.productId, sale]));
      for(const key of Object.keys(schoolGradeLists))delete schoolGradeLists[key];
      Object.assign(schoolGradeLists,glenanda);
      for(const key of Object.keys(curroLists))delete curroLists[key];
      Object.assign(curroLists,curro);
      curroNames.splice(0,curroNames.length,...names);
      window.lepetseSchoolConversions=conversions;
      window.lepetseSchoolMatches=matches;
      const oldDirectory=[...schoolDirectory];
      const directory=data.schools.map(s=>({...oldDirectory.find(old=>old.id===s.slug),id:s.slug,name:s.name}));
      const rank=id=>{const index=oldDirectory.findIndex(s=>s.id===id);return index<0?oldDirectory.length:index};
      directory.sort((a,b)=>rank(a.id)-rank(b.id));
      schoolDirectory.splice(0,schoolDirectory.length,...directory);
      shoppingCart=restoreShoppingCart();
      document.documentElement.dataset.storefrontTheme = data.theme === 'charcoal' ? 'charcoal' : 'classic';
      window.lepetseFeaturedProductIds = data.featuredProductIds;
      document.documentElement.dataset.dataSource='postgresql';
    }finally{clearTimeout(timer)}
  }
  async function boot(){
    main.setAttribute('aria-busy','true');
    if(window.LEPETSE_CONFIG?.dataSource==='api'){
      main.innerHTML='<section class="section"><div class="wrap"><p role="status">Loading stationery and school lists…</p></div></section>';
      try{await loadData()}catch{
        main.removeAttribute('aria-busy');
        main.innerHTML='<section class="section"><div class="wrap"><h1>Unable to load stationery</h1><p>Please try again in a moment.</p><button class="btn dark" id="retry-data" type="button">Try again</button></div></section>';
        document.getElementById('retry-data').onclick=boot;
        return;
      }
    }else document.documentElement.dataset.dataSource='snapshot';
    main.removeAttribute('aria-busy');
    const script=document.createElement('script');script.src='app.js?v=66';document.body.appendChild(script);
  }
  await boot();
})();
