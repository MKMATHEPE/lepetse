(() => {
  fetch('/api/admin/storefront-theme', { cache: 'no-store' })
    .then(response => response.ok ? response.json() : null)
    .then(settings => {
      if (settings) document.documentElement.dataset.dashboardTheme = settings.theme;
    })
    .catch(() => {});
})();
