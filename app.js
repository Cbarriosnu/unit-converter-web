const translations = {
  en: {
    pageTitle: "Everyday Unit Converter",
    description: "Convert distance, temperature, and weight instantly.",
    eyebrow: "QUICK TOOLS",
    language: "Language",
    subtitle: "Created by Carlos Barriosnuevo — fast, accurate conversions for distance, temperature, and weight.",
    categoryAria: "Conversion category",
    categories: { distance: "Distance", temperature: "Temperature", weight: "Weight" },
    units: { miles: "Miles", kilometers: "Kilometers", celsius: "Celsius", fahrenheit: "Fahrenheit", kelvin: "Kelvin", pounds: "Pounds", kilograms: "Kilograms" },
    direction: "{from} to {to}",
    inputLabel: "Value to convert",
    inputPlaceholder: "Enter a number",
    fromAria: "Unit to convert from",
    swap: "Swap units",
    swapAria: "Swap conversion direction",
    outputLabel: "Converted value",
    toAria: "Unit to convert to",
    enterValue: "Enter a value to see the result.",
    enterNumber: "Please enter a number.",
    invalidNumber: "Please enter a valid number.",
    complete: "Conversion complete.",
    convert: "Convert",
    offline: "Works offline after your first visit."
  },
  es: {
    pageTitle: "Convertidor de Unidades Cotidianas",
    description: "Convierte distancias, temperaturas y pesos al instante.",
    eyebrow: "HERRAMIENTAS RÁPIDAS",
    language: "Idioma",
    subtitle: "Creado por Carlos Barriosnuevo — conversiones rápidas y precisas de distancia, temperatura y peso.",
    categoryAria: "Categoría de conversión",
    categories: { distance: "Distancia", temperature: "Temperatura", weight: "Peso" },
    units: { miles: "Millas", kilometers: "Kilómetros", celsius: "Celsius", fahrenheit: "Fahrenheit", kelvin: "Kelvin", pounds: "Libras", kilograms: "Kilogramos" },
    direction: "{from} a {to}",
    inputLabel: "Valor a convertir",
    inputPlaceholder: "Ingresa un número",
    fromAria: "Unidad de origen",
    swap: "Intercambiar unidades",
    swapAria: "Intercambiar dirección de conversión",
    outputLabel: "Valor convertido",
    toAria: "Unidad de destino",
    enterValue: "Ingresa un valor para ver el resultado.",
    enterNumber: "Ingresa un número.",
    invalidNumber: "Ingresa un número válido.",
    complete: "Conversión completada.",
    convert: "Convertir",
    offline: "Funciona sin conexión después de tu primera visita."
  },
  fr: {
    pageTitle: "Convertisseur d’Unités Quotidien",
    description: "Convertissez instantanément les distances, les températures et les poids.",
    eyebrow: "OUTILS RAPIDES",
    language: "Langue",
    subtitle: "Créé par Carlos Barriosnuevo — conversions rapides et précises de distance, de température et de poids.",
    categoryAria: "Catégorie de conversion",
    categories: { distance: "Distance", temperature: "Température", weight: "Poids" },
    units: { miles: "Miles", kilometers: "Kilomètres", celsius: "Celsius", fahrenheit: "Fahrenheit", kelvin: "Kelvin", pounds: "Livres", kilograms: "Kilogrammes" },
    direction: "{from} en {to}",
    inputLabel: "Valeur à convertir",
    inputPlaceholder: "Saisissez un nombre",
    fromAria: "Unité de départ",
    swap: "Inverser les unités",
    swapAria: "Inverser le sens de conversion",
    outputLabel: "Valeur convertie",
    toAria: "Unité d’arrivée",
    enterValue: "Saisissez une valeur pour voir le résultat.",
    enterNumber: "Veuillez saisir un nombre.",
    invalidNumber: "Veuillez saisir un nombre valide.",
    complete: "Conversion terminée.",
    convert: "Convertir",
    offline: "Fonctionne hors connexion après votre première visite."
  }
};

const categories = {
  distance: {
    icon: "↔",
    units: [
      { id: "miles", toBase: value => value * 1.609344, fromBase: value => value / 1.609344 },
      { id: "kilometers", toBase: value => value, fromBase: value => value }
    ]
  },
  temperature: {
    icon: "°",
    units: [
      { id: "celsius", toBase: value => value, fromBase: value => value },
      { id: "fahrenheit", toBase: value => (value - 32) * 5 / 9, fromBase: value => (value * 9 / 5) + 32 },
      { id: "kelvin", toBase: value => value - 273.15, fromBase: value => value + 273.15 }
    ]
  },
  weight: {
    icon: "⚖",
    units: [
      { id: "pounds", toBase: value => value * 0.45359237, fromBase: value => value / 0.45359237 },
      { id: "kilograms", toBase: value => value, fromBase: value => value }
    ]
  }
};

const tabs = [...document.querySelectorAll(".tab")];
const input = document.querySelector("#input-value");
const fromUnit = document.querySelector("#from-unit");
const toUnit = document.querySelector("#to-unit");
const output = document.querySelector("#output-value");
const message = document.querySelector("#message");
const title = document.querySelector("#converter-title");
const categoryLabel = document.querySelector("#category-label");
const categoryIcon = document.querySelector("#category-icon");
const convertButton = document.querySelector("#convert-button");
const swapButton = document.querySelector("#swap-button");
const languageSelect = document.querySelector("#language-select");

const supportedLanguages = Object.keys(translations);
const browserLanguage = (navigator.languages?.[0] || navigator.language || "en").split("-")[0].toLowerCase();
const savedLanguage = localStorage.getItem("unit-converter-language");
let language = supportedLanguages.includes(savedLanguage)
  ? savedLanguage
  : supportedLanguages.includes(browserLanguage) ? browserLanguage : "en";
let activeCategory = "distance";
let messageState = "enterValue";

function text() { return translations[language]; }
function currentConfig() { return categories[activeCategory]; }
function unitLabel(unit) { return text().units[unit.id]; }

function setMessage(state, isError = false) {
  messageState = state;
  message.textContent = text()[state];
  message.classList.toggle("error", isError);
}

function createUnitOptions() {
  return currentConfig().units.map(unit => {
    const option = document.createElement("option");
    option.value = unit.id;
    option.textContent = unitLabel(unit);
    return option;
  });
}

function updateDirection() {
  const config = currentConfig();
  const from = config.units.find(unit => unit.id === fromUnit.value);
  const to = config.units.find(unit => unit.id === toUnit.value);
  title.textContent = text().direction
    .replace("{from}", unitLabel(from))
    .replace("{to}", unitLabel(to));
  calculate(false);
}

function selectCategory(category, reset = true) {
  activeCategory = category;
  const config = currentConfig();

  tabs.forEach(tab => {
    const selected = tab.dataset.category === category;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });

  categoryLabel.textContent = text().categories[category].toLocaleUpperCase(language);
  categoryIcon.textContent = config.icon;
  fromUnit.replaceChildren(...createUnitOptions());
  toUnit.replaceChildren(...createUnitOptions());
  fromUnit.value = config.units[0].id;
  toUnit.value = config.units[1].id;

  if (reset) {
    input.value = "";
    output.textContent = "—";
    setMessage("enterValue");
  }

  updateDirection();
  if (reset) input.focus();
}

function applyLanguage(nextLanguage) {
  language = supportedLanguages.includes(nextLanguage) ? nextLanguage : "en";
  const t = text();
  const previousFrom = fromUnit.value;
  const previousTo = toUnit.value;

  document.documentElement.lang = language;
  document.title = t.pageTitle;
  document.querySelector('meta[name="description"]').content = t.description;
  document.querySelector("#eyebrow").textContent = t.eyebrow;
  document.querySelector("#language-label").textContent = t.language;
  document.querySelector("#page-title").textContent = t.pageTitle;
  document.querySelector("#subtitle").textContent = t.subtitle;
  document.querySelector("#category-tabs").setAttribute("aria-label", t.categoryAria);
  document.querySelector("#input-label").textContent = t.inputLabel;
  input.placeholder = t.inputPlaceholder;
  fromUnit.setAttribute("aria-label", t.fromAria);
  document.querySelector("#swap-text").textContent = t.swap;
  swapButton.setAttribute("aria-label", t.swapAria);
  document.querySelector("#output-label").textContent = t.outputLabel;
  toUnit.setAttribute("aria-label", t.toAria);
  convertButton.textContent = t.convert;
  document.querySelector("#footer-note").textContent = t.offline;
  languageSelect.value = language;

  tabs.forEach(tab => {
    tab.textContent = t.categories[tab.dataset.category];
  });

  fromUnit.replaceChildren(...createUnitOptions());
  toUnit.replaceChildren(...createUnitOptions());
  fromUnit.value = previousFrom || currentConfig().units[0].id;
  toUnit.value = previousTo || currentConfig().units[1].id;
  categoryLabel.textContent = t.categories[activeCategory].toLocaleUpperCase(language);
  message.textContent = t[messageState];
  updateDirection();
}

function formatNumber(value) {
  return new Intl.NumberFormat(language, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(value);
}

function calculate(showError = true) {
  if (input.value.trim() === "") {
    output.textContent = "—";
    if (showError) setMessage("enterNumber", true);
    return;
  }

  const value = Number(input.value);
  if (!Number.isFinite(value)) {
    output.textContent = "—";
    setMessage("invalidNumber", true);
    return;
  }

  const config = currentConfig();
  const from = config.units.find(unit => unit.id === fromUnit.value);
  const to = config.units.find(unit => unit.id === toUnit.value);
  output.textContent = formatNumber(to.fromBase(from.toBase(value)));
  setMessage("complete");
}

tabs.forEach(tab => tab.addEventListener("click", () => selectCategory(tab.dataset.category)));
fromUnit.addEventListener("change", updateDirection);
toUnit.addEventListener("change", updateDirection);
convertButton.addEventListener("click", () => calculate(true));
input.addEventListener("input", () => calculate(false));
input.addEventListener("keydown", event => {
  if (event.key === "Enter") calculate(true);
});
swapButton.addEventListener("click", () => {
  const oldFrom = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = oldFrom;
  updateDirection();
});
languageSelect.addEventListener("change", () => {
  localStorage.setItem("unit-converter-language", languageSelect.value);
  applyLanguage(languageSelect.value);
});

selectCategory("distance");
applyLanguage(language);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js", { updateViaCache: "none" });
  });
}
