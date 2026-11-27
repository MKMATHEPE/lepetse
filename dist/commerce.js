// Separate purchase intent from RFQs. No payments or customer data are transmitted.
const shoppingStorageKey='lepetse-shopping-cart-v1';
let shoppingStorageUnavailable=false;
function restoreShoppingCart(){try{const raw=JSON.parse(localStorage.getItem(shoppingStorageKey)||'[]');return Array.isArray(raw)?raw.slice(0,250).filter(x=>products.some(p=>p.id===x.productId)&&Number.isInteger(x.quantity)&&x.quantity>0&&x.quantity<=999999).map(x=>({productId:x.productId,quantity:x.quantity})):[]}catch{return []}}
let shoppingCart=restoreShoppingCart();
const selectedPaymentProvider=Object.freeze({id:'yoco',name:'Yoco',integration:'hosted-checkout',activation:'pending-registration'});
let checkoutDraft={},checkoutReview=false;
function rfqBuyer(){const buyer=new URLSearchParams(location.hash.split('?')[1]||'').get('buyer');return ['business','government'].includes(buyer)?buyer:''}
function quoteBasketBuyer() {
  const route = location.hash.slice(1).split('?')[0];
  if (['business', 'government', 'schools'].includes(route)) return route;
  const buyer = new URLSearchParams(location.hash.split('?')[1] || '').get('buyer');
  return ['business', 'government', 'schools'].includes(buyer) ? buyer : '';
}
function rfqHref(route){return '#'+route+(quoteBasketBuyer()?'?mode=quote&buyer='+quoteBasketBuyer():'')}
function syncRfqNavigation() {
  const showBasket = Boolean(quoteBasketBuyer()) || quotationMode();
  document.querySelectorAll('header a[href="#cart"]').forEach(a => a.hidden = showBasket);
  document.querySelectorAll('header a[href^="#basket"],.mobile-basket').forEach(a => {
    a.hidden = !showBasket;
    a.href = rfqHref('basket');
    a.innerHTML = 'Quote basket <span class="basket-count">' + (items.length ? '(' + items.length + ')' : '') + '</span>';
  });
}
function quotationMode(){return new URLSearchParams(location.hash.split('?')[1]||'').get('mode')==='quote'}
function quoteModeQuery(){const p=new URLSearchParams(location.hash.split('?')[1]||'');return 'mode=quote'+(['business','government','schools'].includes(p.get('buyer'))?'&buyer='+p.get('buyer'):'')}
function productIntentHref(id){return '#product-'+id+(quotationMode()?'?'+quoteModeQuery():'')}
function purchaseLabel(p,detail=false){return rfqBuyer()&&quotationMode()?'Add to RFQ':quotationMode()||!priceReferences[p.id]?(detail?'Add to quote basket':'Add to quote'):'Add to cart'}
function saveShoppingCart(){try{if(shoppingCart.length)localStorage.setItem(shoppingStorageKey,JSON.stringify(shoppingCart));else localStorage.removeItem(shoppingStorageKey)}catch{shoppingStorageUnavailable=true}document.querySelectorAll('.cart-count').forEach(e=>e.textContent=shoppingCart.length?'('+shoppingCart.length+')':'')}
function addShoppingProduct(id,quantity){if(!Number.isInteger(quantity)||quantity<1||quantity>999999){toast('Enter a whole quantity between 1 and 999,999.');return}const p=products.find(p=>p.id===id);if(!p)return;const line=shoppingCart.find(x=>x.productId===id),total=(line?.quantity||0)+quantity;if(total>999999||(!line&&shoppingCart.length>=250)){toast('The cart limit has been reached. Review your cart.');return}if(line)line.quantity=total;else shoppingCart.push({productId:id,quantity});checkoutReview=false;saveShoppingCart();showProductAdded(p,quantity,total,'cart')}
function shoppingTotal(){return shoppingCart.reduce((sum,x)=>sum+(storefrontPrice(x.productId)?.amountMinor||0)*x.quantity,0)}
function shoppingSummary(){const missing=shoppingCart.filter(x=>!priceReferences[x.productId]).length;return `<dl>
  <div><dt>Item lines</dt><dd>${shoppingCart.length}</dd></div>
  <div><dt>Total quantity</dt><dd>${shoppingCart.reduce((total,item)=>total+item.quantity,0)}</dd></div>
</dl><div class="basket-price-total"><span>Indicative item subtotal</span><strong>${esc(schoolMoney(shoppingTotal()))}</strong></div>${missing?`<p class="help">${missing} item(s) need pricing and are excluded from the subtotal.</p>`:''}`}
function shoppingCartPage(){return `<section class="catalogue-heading"><div class="wrap"><span class="eyebrow">Shopping</span><h1>Your shopping cart</h1><p>Buying directly? Review your items here.</p></div></section><section class="section shopping-cart-content"><div class="wrap basket-layout"><div>${shoppingCart.length?`<section class="basket-group basket-catalogue-group" aria-labelledby="cart-catalogue-heading">
  <h2 class="basket-group-title" id="cart-catalogue-heading">Catalogue items</h2>
  ${shoppingCart.map((x,i)=>{
    const p=products.find(product=>product.id===x.productId);
    const price=storefrontPrice(p.id);
    return `<article class="basket-item">
      <div class="basket-thumb">${productArt(p)}</div>
      <div class="basket-description">
        <h3>${esc(p.name)}</h3>
        <div class="basket-item-details">${basketItemDetails(x,p)}</div>
        <p>${price?`${esc(schoolMoney(price.amountMinor))} ${p.unit.toLowerCase()==='each'?'each':'per '+esc(p.unit.toLowerCase())}${saleMarkup(price)}`:`Price by quotation · ${esc(p.unit)}`}</p>
      </div>
      <div class="cart-line-controls">
        <div>
          <label for="cart-qty-${i}">Quantity</label>
          <input id="cart-qty-${i}" data-cart-qty="${i}" type="number" min="1" max="999999" step="1" value="${x.quantity}">
          <button class="remove-item" data-cart-remove="${i}" aria-label="Remove ${esc(p.name)}">Remove</button>
        </div>
        <dl class="cart-line-total">
          <dt>Line total</dt>
          <dd data-cart-line="${i}">${price?esc(schoolMoney(price.amountMinor*x.quantity)):'Not available'}</dd>
        </dl>
      </div>
    </article>`;
  }).join('')}
</section>`+'<div class="basket-footer-actions"><a href="#stationery">Continue shopping</a><button id="clear-cart" class="clear-filters">Clear cart</button></div>':'<div class="empty"><h2>Your cart is empty</h2><p>Browse stationery to choose items for direct purchase.</p><a class="btn dark" href="#stationery">Shop stationery</a></div>'}</div><aside class="basket-summary cart-summary"><h2>Shopping summary</h2><div id="shopping-summary" aria-live="polite">${shoppingSummary()}</div><dl>
  <div><dt>Availability</dt><dd>To be confirmed</dd></div>
  <div><dt>Delivery charges</dt><dd>Subject to location</dd></div>
</dl>${shoppingCart.length?'<a class="btn dark" href="#checkout" id="checkout-link">Continue to checkout</a>':''}${shoppingStorageUnavailable?'<p class="help">Device storage is unavailable. Keep this page open.</p>':''}</aside></div></section>`}
function bindShoppingCart(){main.querySelectorAll('[data-cart-qty]').forEach(input=>{input.oninput=()=>{const valid=input.value&&input.checkValidity();input.setAttribute('aria-invalid',String(!valid));if(valid){shoppingCart[Number(input.dataset.cartQty)].quantity=input.valueAsNumber;saveShoppingCart();checkoutReview=false;const line=shoppingCart[Number(input.dataset.cartQty)],price=storefrontPrice(line.productId);main.querySelector(`[data-cart-line="${input.dataset.cartQty}"]`).textContent=price?schoolMoney(price.amountMinor*line.quantity):'Not available'}const invalid=[...main.querySelectorAll('[data-cart-qty]')].some(x=>!x.value||!x.checkValidity());$('#shopping-summary').innerHTML=invalid?'<p>Enter valid whole quantities to calculate the subtotal.</p>':shoppingSummary()}});main.querySelectorAll('[data-cart-remove]').forEach(b=>b.onclick=()=>{shoppingCart.splice(Number(b.dataset.cartRemove),1);saveShoppingCart();checkoutReview=false;main.innerHTML=shoppingCartPage();bindShoppingCart()});$('#checkout-link')?.addEventListener('click',e=>{const bad=[...main.querySelectorAll('[data-cart-qty]')].find(x=>!x.value||!x.checkValidity());if(bad){e.preventDefault();bad.reportValidity()}});$('#clear-cart')?.addEventListener('click',()=>{const d=$('#basket-dialog');d.innerHTML='<h2 id="basket-dialog-title">Clear shopping cart?</h2><p>Your quote basket will be kept.</p><div class="dialog-actions"><button class="btn outline" id="cart-cancel">Keep items</button><button class="btn dark" id="cart-confirm">Clear cart</button></div>';d.showModal();$('#cart-cancel').onclick=()=>d.close();$('#cart-confirm').onclick=()=>{shoppingCart=[];saveShoppingCart();checkoutReview=false;d.close();main.innerHTML=shoppingCartPage();bindShoppingCart()}})}
function checkoutField(name,label,type='text',required=true){return `<div class="field"><label for="checkout-${name}">${label}${required?' *':''}</label><input id="checkout-${name}" name="${name}" type="${type}" value="${esc(checkoutDraft[name]||'')}" ${required?'required':''} maxlength="200" autocomplete="${{contact:'name',email:'email',phone:'tel',address:'street-address',city:'address-level2',province:'address-level1',postcode:'postal-code'}[name]||'off'}"></div>`}
function checkoutPage(){if(!shoppingCart.length)return shoppingCartPage();return `<section class="catalogue-heading"><div class="wrap"><h1>${checkoutReview?'Review your purchase':'Contact and delivery details'}</h1><p>Online payments are currently unavailable.</p></div></section><section class="section checkout-content"><div class="wrap basket-layout"><div><ol class="checkout-progress" aria-label="Checkout steps"><li ${!checkoutReview?'aria-current="step"':''}>1. Contact & delivery</li><li ${checkoutReview?'aria-current="step"':''}>2. Review</li><li>3. Payment — unavailable</li></ol>${checkoutReview?`<div class="checkout-review"><h2>Contact and delivery</h2><p>${esc(checkoutDraft.contact)}<br>${esc(checkoutDraft.email)}<br>${esc(checkoutDraft.phone)}</p><p>${esc(checkoutDraft.address)}<br>${esc(checkoutDraft.city)}, ${esc(checkoutDraft.province)}<br>${esc(checkoutDraft.postcode)}</p><button id="checkout-edit" class="btn outline">Edit details</button><h2>Items</h2><ul class="checkout-items">${shoppingCart.map(x=>{const p=products.find(p=>p.id===x.productId);return `<li><span>${esc(p.name)}<small>${x.quantity} × ${esc(p.unit)}</small></span><strong>${priceReferences[p.id]?esc(schoolMoney(storefrontPrice(p.id).amountMinor*x.quantity)):'Price by quotation'}</strong></li>`}).join('')}</ul><h2>Payment</h2><button class="btn dark" disabled>Pay with Yoco — unavailable</button></div>`:`<form id="shopping-checkout"><h2>Contact</h2><div class="fields">${checkoutField('contact','Full name')}${checkoutField('email','Email address','email')}${checkoutField('phone','Phone number','tel')}</div><h2>Delivery address</h2><div class="fields">${checkoutField('address','Street address')}${checkoutField('city','Town or city')}${checkoutField('province','Province')}${checkoutField('postcode','Postal code')}</div><p class="help">Delivery availability and charges are still to be confirmed. Your details stay in memory and clear when this page is refreshed.</p><button class="btn dark" type="submit">Review purchase</button></form>`}</div><aside class="basket-summary"><h2>Purchase summary</h2>${shoppingSummary()}<p class="help payment-provider-note"><strong>${esc(selectedPaymentProvider.name)}</strong><br>Online payment pending activation.</p><dl><div><dt>Delivery</dt><dd>To be confirmed</dd></div><div><dt>Final payable total</dt><dd>Not yet available</dd></div></dl><a href="#cart" class="btn outline">Back to cart</a></aside></div></section>`}
function bindCheckout(){const form=$('#shopping-checkout');if(form){form.oninput=()=>{checkoutDraft=Object.fromEntries(new FormData(form))};form.onsubmit=e=>{e.preventDefault();checkoutDraft=Object.fromEntries(new FormData(form));checkoutReview=true;main.innerHTML=checkoutPage();bindCheckout();main.focus();window.scrollTo(0,0)}}$('#checkout-edit')?.addEventListener('click',()=>{checkoutReview=false;main.innerHTML=checkoutPage();bindCheckout()})}

function rfqNavigationTab(route){return quoteBasketBuyer()&&(["stationery","basket","quote","upload"].includes(route)||route.startsWith("product-"))?quoteBasketBuyer():route}
