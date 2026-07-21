const categories = {
  distance: {
    label: "DISTANCE",
    icon: "↔",
    units: [
      { id: "miles", label: "Miles", short: "mi" },
      { id: "kilometers", label: "Kilometers", short: "km" }
    ],
    convert(value, from) {
      return from === "miles" ? value * 1.609344 : value / 1.609344;
    }
  },
  temperature: {
    label: "TEMPERATURE",
    icon: "°",
    units: [
      { id: "celsius", label: "Celsius", short: "°C" },
      { id: "fahrenheit", label: "Fahrenheit", short: "°F" }
    ],
    convert(value, from) {
      return from === "celsius" ? (value * 9 / 5) + 32 : (value - 32) * 5 / 9;
    }
  },
  weight: {
    label: "WEIGHT",
    icon: "⚖",
    units: [
      { id: "pounds", label: "Pounds", short: "lb" },
      { id: "kilograms", label: "Kilograms", short: "kg" }
    ],
    convert(value, from) {
      return from === "pounds" ? value * 0.45359237 : value / 0.45359237;
    }
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

let activeCategory = "distance";

function currentConfig() {
  return categories[activeCategory];
}

function destinationUnit() {
  return currentConfig().units.find(unit => unit.id !== fromUnit.value);
}

function updateDirection() {
  const config = currentConfig();
  const from = config.units.find(unit => unit.id === fromUnit.value);
  const to = destinationUnit();
  title.textContent = `${from.label} to ${to.label}`;
  toUnit.textContent = to.short;
  calculate(false);
}

function selectCategory(category) {
  activeCategory = category;
  const config = currentConfig();

  tabs.forEach(tab => {
    const selected = tab.dataset.category === category;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });

  categoryLabel.textContent = config.label;
  categoryIcon.textContent = config.icon;
  fromUnit.replaceChildren(...config.units.map(unit => {
    const option = document.createElement("option");
    option.value = unit.id;
    option.textContent = unit.label;
    return option;
  }));
  input.value = "";
  output.textContent = "—";
  message.textContent = "Enter a value to see the result.";
  message.classList.remove("error");
  updateDirection();
  input.focus();
}

function formatNumber(value) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(value);
}

function calculate(showError = true) {
  if (input.value.trim() === "") {
    output.textContent = "—";
    if (showError) {
      message.textContent = "Please enter a number.";
      message.classList.add("error");
    }
    return;
  }

  const value = Number(input.value);
  if (!Number.isFinite(value)) {
    output.textContent = "—";
    message.textContent = "Please enter a valid number.";
    message.classList.add("error");
    return;
  }

  const result = currentConfig().convert(value, fromUnit.value);
  output.textContent = formatNumber(result);
  message.textContent = "Conversion complete.";
  message.classList.remove("error");
}

tabs.forEach(tab => tab.addEventListener("click", () => selectCategory(tab.dataset.category)));
fromUnit.addEventListener("change", updateDirection);
convertButton.addEventListener("click", () => calculate(true));
input.addEventListener("input", () => calculate(false));
input.addEventListener("keydown", event => {
  if (event.key === "Enter") calculate(true);
});
swapButton.addEventListener("click", () => {
  const to = destinationUnit();
  fromUnit.value = to.id;
  updateDirection();
});

selectCategory("distance");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js", { updateViaCache: "none" });
  });
}
