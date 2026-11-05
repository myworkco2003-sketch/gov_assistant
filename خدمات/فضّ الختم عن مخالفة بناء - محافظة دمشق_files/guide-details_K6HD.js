document.addEventListener("DOMContentLoaded", () => {
  const COPY_RESET_MS = 2000;

  const layout = document.getElementById("serviceLayout");
  const nameEl = document.getElementById("serviceName");
  const descriptionEl = document.getElementById("serviceDescription");
  const factsEl = document.getElementById("serviceFacts");
  const stepsList = document.getElementById("stepsList");
  const papersList = document.getElementById("papersList");
  const feesList = document.getElementById("feesList");
  const copyLinkBtn = document.getElementById("copyLinkBtn");
  const printBtn = document.getElementById("printBtn");

  const params = new URLSearchParams(window.location.search);
  const serviceId = params.get("id");

  const clean = (value) => (value == null ? "" : String(value).trim());

  function fallbackCopy(text) {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    field.remove();
    return copied;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      return fallbackCopy(text);
    }
  }

  const copyIcon = copyLinkBtn.querySelector("i");
  const copyLabel = copyLinkBtn.querySelector("span");
  let copyTimer;

  copyLinkBtn.addEventListener("click", async () => {
    const copied = await copyText(window.location.href);

    copyIcon.className = copied
      ? "fa-solid fa-check"
      : "fa-solid fa-triangle-exclamation";
    copyLabel.textContent = copied ? "تم نسخ الرابط" : "تعذّر نسخ الرابط";

    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copyIcon.className = "fa-regular fa-copy";
      copyLabel.textContent = "نسخ رابط الخدمة";
    }, COPY_RESET_MS);
  });

if (printBtn) {
  printBtn.addEventListener("click", () => window.print());
}

  function showMissing(message) {
    layout.classList.add("is-missing");
    nameEl.textContent = "تعذّر عرض الخدمة";
    descriptionEl.textContent = message;
  }

  const service = getPaperServices().find((item) => String(item.id) === serviceId);

  if (!service) {
    showMissing(
      "لم يتم العثور على الخدمة. ارجعي إلى دليل المعاملات واختاري الخدمة من جديد."
    );
    return;
  }

  function toItems(value) {
    return clean(value)
      .split(/\r?\n/)
      .map((line) => line.replace(/^\s*[\d٠-٩]+\s*[-.)–]\s*/, "").trim())
      .filter(Boolean);
  }

  function renderList(list, value, emptyText) {
    const items = toItems(value);

    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "sd-empty";
      empty.textContent = emptyText;
      list.replaceWith(empty);
      return;
    }

    list.replaceChildren(
      ...items.map((text) => {
        const item = document.createElement("li");
        item.textContent = text;
        return item;
      })
    );
  }

  function createFact(iconClass, label, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "sd-fact";

    const term = document.createElement("dt");
    const icon = document.createElement("i");
    icon.className = iconClass;
    icon.setAttribute("aria-hidden", "true");
    term.append(icon, label);

    const detail = document.createElement("dd");
    detail.textContent = value;

    wrapper.append(term, detail);
    return wrapper;
  }

  const name = clean(service.name) || "خدمة بدون اسم";
  document.title = `${name} - محافظة دمشق`;
  nameEl.textContent = name;
  descriptionEl.textContent =
    clean(service.description) || "لا يوجد وصف مضاف لهذه الخدمة.";

  const requestPlace = clean(service.requestPlace);
  const requestPlaceText = {
    "إلكتروني": "إلكترونياً عبر المنصة",
    "مكاني": "حضورياً في الدائرة المختصة"
  }[requestPlace] || requestPlace || "غير محددة";

  const facts = [

    createFact(
      requestPlace === "مكاني" ? "fa-solid fa-building" : "fa-solid fa-display",
      "طريقة تقديم الطلب",
      requestPlaceText
    )
  ];

  const physicalPlace = clean(service.physicalPlace);
  if (physicalPlace) {
    facts.push(
      createFact("fa-solid fa-location-dot", "مكان تقديم الطلب", physicalPlace)
    );
  }

  factsEl.replaceChildren(...facts);

  renderList(stepsList, service.stages, "لم تتم إضافة خطوات لهذه الخدمة.");
  renderList(papersList, service.papers, "لم تتم إضافة أوراق مطلوبة لهذه الخدمة.");
  renderList(feesList, service.fees, "لم تتم إضافة رسوم لهذه الخدمة.");
});
