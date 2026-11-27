(() => {
  const form = document.getElementById('sale-form');
  const fields = form.querySelector('fieldset');
  const search = document.getElementById('sale-search');
  const product = document.getElementById('sale-product');
  const regular = document.getElementById('regular-price');
  const message = document.getElementById('sale-status');
  const list = document.getElementById('sale-list');
  const table = document.getElementById('sales-table');
  const empty = document.getElementById('no-sales');
  const newSale = document.getElementById('new-sale');
  const editorHome = document.getElementById('new-sale-editor');
  const closeButton = document.getElementById('close-sale-form');
  const save = form.querySelector('[type="submit"]');
  let editRow;
  let editorTrigger;
  const endpoint = '/api/admin/storefront-sales';
  const currency = new Intl.NumberFormat('en-ZA', {style: 'currency', currency: 'ZAR'});
  const formatTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Johannesburg', year: 'numeric', month: '2-digit',
    day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  });
  let session;
  let catalogue = [];
  let prices = {};

  function localInput(time) {
    const parts = Object.fromEntries(formatTime.formatToParts(new Date(time)).map(part => [part.type, part.value]));
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  }

  async function api(path, options = {}) {
    const response = await fetch(path, {cache: 'no-store', ...options});
    if (response.status === 401) location.assign('/admin/login.html');
    if (!response.ok) throw new Error(String(response.status));
    return response.status === 204 ? null : response.json();
  }

  function showRegularPrice() {
    const price = prices[product.value];
    regular.textContent = price ? 'Regular price ' + currency.format(price.amountMinor / 100) : '';
  }

  function showProducts() {
    const selected = product.value;
    const query = search.value.trim().toLowerCase();
    const matches = catalogue.filter(item =>
      [item.name, item.brand, item.id, item.sku, item.productCode].join(' ').toLowerCase().includes(query));
    product.replaceChildren(new Option(matches.length ? 'Select a product' : 'No matching products', ''),
      ...matches.map(item => new Option(item.name, item.id)));
    if (matches.some(item => item.id === selected)) product.value = selected;
    showRegularPrice();
  }

  function closeEditor(restoreFocus = false) {
    const trigger = editorTrigger;
    trigger?.setAttribute('aria-expanded', 'false');
    form.hidden = true;
    editorHome.append(form);
    editRow?.remove();
    editRow = null;
    editorTrigger = null;
    if (restoreFocus) trigger?.focus();
  }

  function openEditor(trigger, row, sale) {
    if (fields.disabled) return;
    if (editorTrigger === trigger) {
      closeEditor(true);
      return;
    }
    closeEditor();
    form.reset();
    showProducts();
    editorTrigger = trigger;
    trigger.setAttribute('aria-expanded', 'true');
    product.disabled = search.disabled = Boolean(sale);
    save.textContent = sale ? 'Save sale changes' : 'Schedule sale';
    if (sale) {
      editRow = document.createElement('tr');
      editRow.className = 'sale-editor-row';
      const cell = editRow.insertCell();
      cell.colSpan = 5;
      row.after(editRow);
      cell.append(form);
      product.value = sale.productId;
      showRegularPrice();
      form.elements.price.value = (sale.amountMinor / 100).toFixed(2);
      form.elements.startsAt.value = localInput(sale.startsAt);
      form.elements.endsAt.value = localInput(sale.endsAt);
    }
    form.hidden = false;
    (sale ? form.elements.price : search).focus();
  }

  async function refreshSales() {
    const sales = await api(endpoint);
    closeEditor();
    list.replaceChildren();
    for (const sale of sales) {
      const item = catalogue.find(entry => entry.id === sale.productId);
      if (!item) continue;
      const row = list.insertRow();
      const productCell = row.insertCell();
      const name = document.createElement('strong');
      name.textContent = item.name;
      const state = document.createElement('small');
      state.textContent = Date.parse(sale.startsAt) <= Date.now() ? 'Active' : 'Scheduled';
      productCell.append(name, state);
      for (const [label, value] of [
        ['Sale price', currency.format(sale.amountMinor / 100)],
        ['Starts (SAST)', formatTime.format(new Date(sale.startsAt))],
        ['Ends (SAST)', formatTime.format(new Date(sale.endsAt))]
      ]) {
        const cell = row.insertCell();
        const mobileLabel = document.createElement('span');
        mobileLabel.className = 'sale-mobile-label';
        mobileLabel.setAttribute('aria-hidden', 'true');
        mobileLabel.textContent = label;
        cell.append(mobileLabel, document.createTextNode(value));
      }
      const actions = row.insertCell();
      actions.className = 'sale-row-actions';
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'quiet';
      edit.textContent = 'Edit';
      edit.setAttribute('aria-label', 'Edit sale for ' + item.name);
      edit.setAttribute('aria-controls', 'sale-form');
      edit.setAttribute('aria-expanded', 'false');
      edit.onclick = () => openEditor(edit, row, sale);
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'quiet';
      cancel.textContent = 'Cancel sale';
      cancel.setAttribute('aria-label', 'Cancel sale for ' + item.name);
      cancel.onclick = async () => {
        cancel.disabled = true;
        try {
          await api(endpoint + '/' + encodeURIComponent(sale.productId), {
            method: 'DELETE', headers: {[session.csrfHeader]: session.csrfToken}
          });
          await refreshSales();
          newSale.focus();
          message.textContent = 'Sale cancelled.';
        } catch {
          cancel.disabled = false;
          message.textContent = 'Could not cancel the sale. Try again.';
        }
      };
      actions.append(edit, cancel);
    }
    table.hidden = list.rows.length === 0;
    empty.hidden = !table.hidden;
  }

  newSale.addEventListener('click', () => openEditor(newSale));
  closeButton.addEventListener('click', () => closeEditor(true));
  search.addEventListener('input', showProducts);
  product.addEventListener('change', showRegularPrice);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const {price, startsAt, endsAt} = form.elements;
    const amountMinor = Math.round(price.valueAsNumber * 100);
    if (!(amountMinor > 0 && amountMinor < prices[product.value]?.amountMinor)) {
      message.textContent = 'Enter a sale price below the regular price.';
      return;
    }
    if (endsAt.value <= startsAt.value || Date.parse(endsAt.value + '+02:00') <= Date.now()) {
      message.textContent = 'The end time must be in the future and after the start time.';
      return;
    }
    const selection = {productId: product.value, amountMinor, startsAt: startsAt.value, endsAt: endsAt.value};
    fields.disabled = true;
    try {
      await api(endpoint, {method: 'POST', headers: {
        [session.csrfHeader]: session.csrfToken, 'Content-Type': 'application/json'
      }, body: JSON.stringify(selection)});
      form.reset();
      showProducts();
      await refreshSales();
      newSale.focus();
      message.textContent = 'Sale saved.';
    } catch {
      message.textContent = 'Could not save the sale. Check the price and dates, then try again.';
    } finally {
      fields.disabled = false;
    }
  });

  Promise.all([api('/api/admin/session'), api('/api/site-data')]).then(async ([account, data]) => {
    if (!account.authenticated) {
      location.assign('/admin/login.html');
      return;
    }
    session = account;
    prices = data.priceReferences;
    catalogue = data.products.filter(item => prices[item.id]?.amountMinor > 0);
    showProducts();
    await refreshSales();
    fields.disabled = false;
    newSale.disabled = false;
  }).catch(() => { message.textContent = 'Could not load sale settings.'; });
})();
