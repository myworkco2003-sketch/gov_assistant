document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const serviceId = params.get("id");

  const titleElement = document.getElementById("guideTitle");
  const descriptionElement = document.getElementById("guideDescription");
  const factsElement = document.getElementById("guideFacts");
  const feesElement = document.getElementById("guideFees");
  const papersElement = document.getElementById("guidePapers");
  const stepsElement = document.getElementById("guideSteps");
  const startButton = document.getElementById("startServiceBtn");
  const missingBox = document.getElementById("guideMissing");
  const missingName = document.getElementById("missingServiceName");
  const layout = document.getElementById("electronicServiceLayout");

  const savedServices = getPaperServices();

  const service = savedServices.find(item =>
    String(item.id) === String(serviceId) &&
    item.requestPlace === "إلكتروني"
  );

function renderItems(container, value, emptyMessage) {
  if (!container) return;

  container.replaceChildren();

  let items = [];

  if (Array.isArray(value)) {
    items = value;
  } else if (typeof value === "string" && value.trim()) {
    items = value
      .split(/\r?\n/)
      .map(item => item.trim())
      .filter(Boolean);
  } else if (value && typeof value === "object" && value.name) {
    items = [value];
  }

  items = items
    .map(item => {
      if (typeof item === "object" && item !== null) {
        return item.name || item.title || "";
      }
      return String(item);
    })
    .filter(item => item.trim() !== "");

  if (items.length === 0) {
    const li = document.createElement("li");
    li.textContent = emptyMessage;
    li.classList.add("sd-empty-item");
    container.appendChild(li);
    container.classList.add("is-empty");
    return;
  }

  container.classList.remove("is-empty");

  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    container.appendChild(li);
  });
}

  if (!service) {
    if (titleElement) {
      titleElement.textContent = "تعذر العثور على الخدمة";
    }

    if (descriptionElement) {
      descriptionElement.textContent =
        "ارجعي إلى صفحة الخدمات الإلكترونية واختاري الخدمة المطلوبة من جديد.";
    }

    if (missingName) {
      missingName.textContent = "الخدمة الإلكترونية";
    }

    if (missingBox) {
      missingBox.hidden = false;
    }

    if (layout) {
      layout.classList.add("is-missing");
    }

    if (startButton) {
      startButton.hidden = true;
    }

    return;
  }

  document.title = `دليل ${service.name} - محافظة دمشق`;

  if (titleElement) {
    titleElement.textContent = `دليل ${service.name || "الخدمة الإلكترونية"}`;
  }

  if (descriptionElement) {
    descriptionElement.textContent =
      service.description || "لا يوجد وصف مضاف لهذه الخدمة حالياً.";
  }

  if (factsElement) {
    factsElement.replaceChildren();

    const directorate = document.createElement("p");
    directorate.textContent =
      `المديرية: ${service.electronicDirectorate || "غير محددة"}`;

    factsElement.appendChild(directorate);
  }

  renderItems(
    feesElement,
    service.fees,
    "لم تتم إضافة معلومات الرسوم بعد."
  );

  renderItems(
    papersElement,
    service.papers,
    "لم تتم إضافة معلومات الأوراق المطلوبة بعد."
  );

  renderItems(
    stepsElement,
    service.stages,
    "لم تتم إضافة خطوات تنفيذ الخدمة بعد."
  );

  if (startButton) {
    const serviceUrl =
      typeof service.serviceUrl === "string"
        ? service.serviceUrl.trim()
        : "";

    if (serviceUrl) {
      startButton.href = serviceUrl;
      startButton.target = "_blank";
      startButton.rel = "noopener noreferrer";
      startButton.hidden = false;
    } else {
      startButton.href = "#";
      startButton.hidden = false;

      startButton.addEventListener("click", event => {
        event.preventDefault();
        alert("لم يتم تحديد رابط بدء هذه الخدمة بعد.");
      });
    }
  }

  if (missingBox) {
    missingBox.hidden = true;
  }

  if (layout) {
    layout.classList.remove("is-missing");
  }
});
