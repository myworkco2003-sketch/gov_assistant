const STORAGE_KEY = "damascusPaperServices";

function getLocalServices() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function getPaperServices() {
  const online = Array.isArray(window.DAMASCUS_SERVICES) ? window.DAMASCUS_SERVICES : [];
  const ids = new Set(online.map((service) => String(service.id)));
  return online.concat(getLocalServices().filter((service) => !ids.has(String(service.id))));
}

async function savePaperService(service) {
  const { item } = await window.DashAuth.api("/api/data/services", { method: "POST", body: service });
  if (Array.isArray(window.DAMASCUS_SERVICES)) window.DAMASCUS_SERVICES.push(item);
  return item;
}

async function moveLocalServicesOnline() {
  const local = getLocalServices();
  if (!local.length) return;
  try {
    await window.DashAuth.api("/api/data/services", { method: "POST", body: local });
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
