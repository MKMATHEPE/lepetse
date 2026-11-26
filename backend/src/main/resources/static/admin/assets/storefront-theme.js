const form = document.getElementById('storefront-theme');
const options = document.getElementById('theme-options');
const save = form.querySelector('button[type=submit]');
const status = document.getElementById('theme-status');
const lastApplied = document.getElementById('last-applied');
const endpoint = '/api/admin/storefront-theme';
let session;
let appliedSettings;

function selectedSettings() {
  return {
    theme: form.elements.theme.value,
    rotateCatalogueBanner: form.elements.rotateCatalogueBanner.checked,
    showFooterWhatsApp: form.elements.showFooterWhatsApp.checked
  };
}

function hasChanges() {
  const selection = selectedSettings();
  return Object.keys(selection).some(key => selection[key] !== appliedSettings[key]);
}

function showAppliedSettings(settings) {
  appliedSettings = settings;
  const { theme: value, rotateCatalogueBanner, showFooterWhatsApp, appliedBy, appliedAt } = settings;
  form.elements.rotateCatalogueBanner.checked = rotateCatalogueBanner;
  form.elements.showFooterWhatsApp.checked = showFooterWhatsApp;
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
    showAppliedSettings(await request(endpoint));
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
