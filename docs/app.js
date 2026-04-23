(async function () {
  var params = new URLSearchParams(window.location.search);
  var id = (params.get("id") || "").trim();
  var locale = (params.get("l") || params.get("lang") || "").trim().toLowerCase();
  var platform = (params.get("platform") || "mac").trim().toLowerCase();

  var normalizedPlatform = platform;
  if (platform === "iphone" || platform === "ipad") {
    normalizedPlatform = "ios";
  }

  var isMac = normalizedPlatform === "mac";
  var isIOS = normalizedPlatform === "ios";

  var statusEl = document.getElementById("status");
  var openLinkEl = document.getElementById("open-link");
  var fallbackLinkEl = document.getElementById("fallback-link");
  var appsListEl = document.getElementById("apps-list");
  var heroAppEl = document.getElementById("hero-app");
  var heroAppIconEl = document.getElementById("hero-app-icon");
  var heroAppNameEl = document.getElementById("hero-app-name");
  var heroAppPlatformEl = document.getElementById("hero-app-platform");
  var appCatalog = [];
  var currentApp = null;

  function detectLocale() {
    var candidates = [];

    if (Array.isArray(navigator.languages)) {
      candidates = candidates.concat(navigator.languages);
    }
    if (navigator.language) {
      candidates.push(navigator.language);
    }

    // First pass: look for locale codes with region (e.g., 'zh-CN' -> 'cn')
    for (var i = 0; i < candidates.length; i += 1) {
      var value = String(candidates[i] || "").trim();
      if (!value) {
        continue;
      }

      var parts = value.replace(/_/g, "-").split("-");
      // If has region code (e.g., 'zh-CN' -> parts[1] = 'CN')
      if (parts.length > 1 && /^[a-z]{2}$/i.test(parts[1])) {
        return parts[1].toLowerCase();
      }
    }

    // Fallback: return default locale
    return "us";
  }

  if (!locale) {
    locale = detectLocale();
  }

  function setText(idOrEl, value) {
    var el = typeof idOrEl === "string" ? document.getElementById(idOrEl) : idOrEl;
    el.textContent = value;
  }

  function setHTML(idOrEl, html) {
    var el = typeof idOrEl === "string" ? document.getElementById(idOrEl) : idOrEl;
    el.innerHTML = html;
  }

  function normalizeCatalogPlatform(value) {
    var text = String(value || "").toLowerCase();
    if (text.indexOf("ios") !== -1 && text.indexOf("mac") === -1) {
      return "ios";
    }
    return "mac";
  }

  function buildStoreLink(appId, targetPlatform) {
    if (!appId) {
      return "#";
    }

    var normalized = normalizeCatalogPlatform(targetPlatform);
    if (normalized === "ios") {
      return "itms-apps://itunes.apple.com/app/id" + appId + "?l=" + encodeURIComponent(locale);
    }

    return "macappstore://itunes.apple.com/app/id" + appId + "?mt=12&l=" + encodeURIComponent(locale);
  }

  function buildAppHref(item) {
    if (!item || !item.id) {
      return item && item.path ? item.path : "#";
    }

    return buildStoreLink(String(item.id), item.platform);
  }

  function renderAppsTopList(items) {
    appsListEl.textContent = "";

    if (!Array.isArray(items) || items.length === 0) {
      var empty = document.createElement("span");
      empty.className = "hero-app-meta";
      empty.textContent = "No app data available.";
      appsListEl.appendChild(empty);
      return;
    }

    for (var i = 0; i < items.length; i += 1) {
      var item = items[i];
      var anchor = document.createElement("a");
      var image = document.createElement("img");
      var name = document.createElement("span");

      anchor.className = "app-item";
      anchor.href = buildAppHref(item);
      anchor.title = item.name || "App";
      if (item.path && !item.id) {
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
      }

      image.src = item.icon || "";
      image.alt = item.name || "App";

      name.textContent = item.name || "Unnamed";

      anchor.appendChild(image);
      anchor.appendChild(name);
      appsListEl.appendChild(anchor);
    }
  }

  function renderCurrentApp(item) {
    if (!item) {
      heroAppEl.style.display = "none";
      return;
    }

    heroAppNameEl.textContent = item.name || "Unknown App";
    heroAppPlatformEl.textContent = item.platform || "-";
    heroAppIconEl.src = item.icon || "";
    heroAppIconEl.alt = item.name || "App";
    heroAppEl.style.display = "flex";
  }

  try {
    var response = await fetch("./data.json", { cache: "no-store" });
    if (response.ok) {
      appCatalog = await response.json();
    }
  } catch (error) {
    appCatalog = [];
  }

  if (Array.isArray(appCatalog) && id) {
    for (var j = 0; j < appCatalog.length; j += 1) {
      if (String(appCatalog[j].id || "") === id) {
        currentApp = appCatalog[j];
        break;
      }
    }
  }

  renderAppsTopList(appCatalog);
  renderCurrentApp(currentApp);

  if (!/^\d+$/.test(id)) {
    statusEl.innerHTML =
      "<strong>Missing or invalid app id.</strong> Please pass a numeric <code>id</code> query parameter.";
    openLinkEl.removeAttribute("href");
    fallbackLinkEl.removeAttribute("href");
    return;
  }

  if (!isMac && !isIOS) {
    statusEl.innerHTML =
      "<strong>Unsupported platform.</strong> Use <code>mac</code> or <code>ios</code>.";
    openLinkEl.removeAttribute("href");
    fallbackLinkEl.removeAttribute("href");
    return;
  }

  var deepLink = buildStoreLink(id, normalizedPlatform);

  var webFallback = isMac
    ? "https://apps.apple.com/" + encodeURIComponent(locale) + "/app/id" + id + "?mt=12"
    : "https://apps.apple.com/" + encodeURIComponent(locale) + "/app/id" + id;

  openLinkEl.href = deepLink;
  fallbackLinkEl.href = webFallback;

  setHTML(
    statusEl,
    "<strong>Redirecting now.</strong> If your browser blocks the custom protocol, use the buttons below."
  );

  if (!currentApp && Array.isArray(appCatalog) && appCatalog.length > 0) {
    setHTML(
      statusEl,
      "<strong>Redirecting now.</strong> App ID was not found in <code>data.json</code>, but deep link generation still works."
    );
  }

  window.setTimeout(function () {
    window.location.href = deepLink;
  }, 180);
})();
