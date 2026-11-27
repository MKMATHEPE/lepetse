const form = document.getElementById('storefront-theme');
const options = document.getElementById('theme-options');
const save = form.querySelector('button[type=submit]');
const status = document.getElementById('theme-status');
const lastApplied = document.getElementById('last-applied');
const endpoint = '/api/admin/storefront-theme';
let session;
let appliedSettings;
const featuredList = document.getElementById('featured-products');
const featuredEmpty = document.getElementById('featured-empty');
const addFeatured = document.getElementById('add-featured');
const picker = document.getElementById('featured-picker');
const search = document.getElementById('featured-search');
const results = document.getElementById('featured-results');
const featuredLimit = 12;
let catalogue = new Map();
let featuredIds = [];

function featuredButton(label, action, accessibleLabel = label) {
  const button = document.createElement('button');
  button.className = 'quiet';
  button.type = 'button';
  button.textContent = label;
  button.setAttribute('aria-label', accessibleLabel);
  button.addEventListener('click', action);
  return button;
}

function renderSearch() {
  results.replaceChildren();
  const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length || featuredIds.length >= featuredLimit) return;
  const matches = [...catalogue.values()].filter(product => {
    const text = [product.name, product.brand, product.id, product.databaseId, product.sku,
      product.productCode, product.code, product.image].join(' ').toLowerCase();
    return !featuredIds.includes(product.id) && terms.every(term => text.includes(term));
  }).slice(0, 8);
  if (!matches.length) {
    const empty = document.createElement('li');
    empty.textContent = 'No matching products.';
    results.append(empty);
    return;
  }
  for (const product of matches) {
    const row = document.createElement('li');
    row.append(featuredButton(product.name, () => {
      featuredIds.push(product.id);
      updateFeatured();
      if (addFeatured.disabled) featuredList.lastElementChild.querySelector('button:last-child').focus();
      else search.focus();
    }, 'Feature ' + product.name));
    results.append(row);
  }
}

function updateFeatured() {
  renderFeatured();
  save.disabled = options.disabled || !hasChanges();
}

function renderFeatured() {
  featuredList.replaceChildren();
  featuredEmpty.hidden = featuredIds.length > 0;
  addFeatured.disabled = featuredIds.length >= featuredLimit;
  if (addFeatured.disabled) {
    picker.hidden = true;
    addFeatured.setAttribute('aria-expanded', 'false');
  }
  featuredIds.forEach((id, index) => {
    const product = catalogue.get(id);
    const row = document.createElement('li');
    row.className = 'featured-row';
    if (product.image) {
      const image = document.createElement('img');
      image.src = '/' + product.image.replace(/^\/+/, '');
      image.alt = '';
      image.width = image.height = 36;
      row.append(image);
    }
    const description = document.createElement('span');
    description.textContent = product.name;
    if (!index) {
      const lead = document.createElement('small');
      lead.textContent = 'Shown first';
      description.append(lead);
    }
    const controls = document.createElement('div');
    controls.className = 'featured-controls';
    for (const [label, delta, direction] of [['↑', -1, 'up'], ['↓', 1, 'down']]) {
      const target = index + delta;
      const button = featuredButton(label, () => {
        [featuredIds[index], featuredIds[target]] = [featuredIds[target], featuredIds[index]];
        updateFeatured();
        const nextControls = featuredList.children[target].querySelectorAll('button');
        (nextControls[delta < 0 ? 0 : 1].disabled
          ? nextControls[delta < 0 ? 1 : 0]
          : nextControls[delta < 0 ? 0 : 1]).focus();
      }, 'Move ' + product.name + ' ' + direction);
      button.disabled = target < 0 || target >= featuredIds.length;
      controls.append(button);
    }
    controls.append(featuredButton('Remove', () => {
      featuredIds.splice(index, 1);
      updateFeatured();
      const next = featuredList.children[Math.min(index, featuredIds.length - 1)];
      (next?.querySelector('button:last-child') || addFeatured).focus();
    }, 'Remove ' + product.name + ' from featured products'));
    row.append(description, controls);
    featuredList.append(row);
  });
  renderSearch();
}

addFeatured.addEventListener('click', () => {
  picker.hidden = !picker.hidden;
  addFeatured.setAttribute('aria-expanded', String(!picker.hidden));
  if (!picker.hidden) search.focus();
});
search.addEventListener('input', renderSearch);

function selectedSettings() {
  return {
    theme: form.elements.theme.value,
    featuredProductIds: featuredIds.slice()
  };
}

function hasChanges() {
  const selection = selectedSettings();
  return Object.keys(selection).some(key => key === 'featuredProductIds'
    ? JSON.stringify(selection[key]) !== JSON.stringify(appliedSettings[key])
    : selection[key] !== appliedSettings[key]);
}

function showAppliedSettings(settings) {
  featuredIds = (settings.featuredProductIds || []).filter(id => catalogue.has(id));
  appliedSettings = { ...settings, featuredProductIds: featuredIds.slice() };
  renderFeatured();
  const { theme: value, appliedBy, appliedAt } = settings;
  form.elements.theme.value = value;
  document.documentElement.dataset.dashboardTheme = value;
  for (const badge of form.querySelectorAll('[data-applied]')) {
    badge.hidden = badge.dataset.applied !== value;
  }
  lastApplied.hidden = !appliedAt;
  lastApplied.textContent = appliedAt
    ? `Last applied by ${appliedBy} · ${new Intl.DateTimeFormat('en-ZA', {
      dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Johannesburg'
    }).format(new Date(appliedAt))} SAST` : '';
}

async function request(url, options = {}) {
  const response = await fetch(url, { cache: 'no-store', ...options });
  if (response.status === 401) {
    location.assign('/admin/login.html');
    throw new Error('Sign-in required.');
  }
  if (!response.ok) throw new Error('Request failed.');
  return response.json();
}

async function loadTheme() {
  try {
    session = await request('/api/admin/session');
    if (!session.authenticated) {
      location.assign('/admin/login.html');
      return;
    }
    const [settings, data] = await Promise.all([request(endpoint), request('/api/site-data')]);
    catalogue = new Map(data.products.map(product => [product.id, product]));
    showAppliedSettings(settings);
    options.disabled = false;
    status.textContent = '';
  } catch {
    status.textContent = 'Could not load storefront settings. Reload the page to try again.';
  }
}

form.addEventListener('change', () => {
  save.disabled = options.disabled || !hasChanges();
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (options.disabled || !hasChanges()) return;
  const selection = selectedSettings();
  options.disabled = save.disabled = true;
  status.textContent = 'Applying…';
  try {
    const result = await request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', [session.csrfHeader]: session.csrfToken },
      body: JSON.stringify(selection)
    });
    showAppliedSettings(result);
    status.textContent = 'Settings applied.';
  } catch {
    status.textContent = 'Could not apply the settings. Try again.';
  } finally {
    options.disabled = false;
    save.disabled = options.disabled || !hasChanges();
  }
});

loadTheme();

const settingsTabs = [...document.querySelectorAll('.theme-workspace .view-tabs [role="tab"]')];

function selectSettingsTab(selected) {
  for (const tab of settingsTabs) {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  }
  form.hidden = selected.id === 'sales-tab';
}

for (const tab of settingsTabs) {
  tab.addEventListener('click', () => selectSettingsTab(tab));
  tab.addEventListener('keydown', event => {
    const index = settingsTabs.indexOf(tab);
    const destinations = {
      ArrowLeft: (index + settingsTabs.length - 1) % settingsTabs.length,
      ArrowRight: (index + 1) % settingsTabs.length,
      Home: 0,
      End: settingsTabs.length - 1
    };
    const next = settingsTabs[destinations[event.key]];
    if (!next) return;

    event.preventDefault();
    selectSettingsTab(next);
    next.focus();
  });
}
