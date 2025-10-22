// ===== Theme toggle =====
const themeToggle = document.querySelector(".themes__toggle");
const themes = ["", "light", "purple"];
let currentTheme = 0;

const savedTheme = localStorage.getItem("calcThemeIndex");
if (savedTheme !== null) {
  currentTheme = Number(savedTheme);
  document.body.className = themes[currentTheme];
}

themeToggle.addEventListener("click", () => {
  currentTheme = (currentTheme + 1) % themes.length;
  document.body.className = themes[currentTheme];
  localStorage.setItem("calcThemeIndex", currentTheme);
});

// ===== Calculator elements =====
const expressionEl = document.querySelector(".calc__expression");
const resultEl = document.querySelector(".calc__result");
const buttons = document.querySelectorAll(".calc__keys button");

let currentNumber = "";
let expression = "";

// ===== Button clicks =====
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;
    const value = btn.dataset.value;

    if (type === "number") handleNumber(value);
    if (type === "operation") handleOperation(value);
    if (type === "action") handleAction(value);
  });
});

function handleNumber(value) {
  if (value === "." && currentNumber.includes(".")) return;
  currentNumber += value;
  updateDisplay();
}

function handleOperation(value) {
  if (currentNumber === "" && expression === "") return;
  expression += currentNumber + value;
  currentNumber = "";
  updateDisplay();
}

function handleAction(value) {
  if (value === "del") {
    if(currentNumber.length > 0){
        currentNumber = currentNumber.slice(0,-1)
    }else{
        expression = expression.slice(0,-1)
    }
    updateDisplay();
  }

  if (value === "reset") {
    expression = "";
    currentNumber = "";
    fontState.delete(expressionEl);
    fontState.delete(resultEl);
    updateDisplay();

  }

  if (value === "=") {
    expression += currentNumber;
    try {
      const result = eval(expression);
      expression = result.toString();
      currentNumber = "";
      updateDisplay();
    } catch {
      resultEl.textContent = "Error";
      expression = "";
      currentNumber = "";
    }
  }
}

function updateDisplay() {
    // عرض العملية على الشمال
    expressionEl.textContent = (expression + currentNumber) || "0";
  
    try {
      // ما نحسبش إلا لو المعادلة مكتملة (ما تنتهيش بعلامة)
      if (
        (expression + currentNumber) &&
        !["+", "-", "*", "/"].includes((expression + currentNumber).slice(-1))
      ) {
        const result = eval(expression + currentNumber);
        resultEl.textContent = result;
      } else {
        resultEl.textContent = "0";
      }
    } catch {
      resultEl.textContent = "0";
    }
  
    // ✅ ننتظر التحديث البصري ثم نضبط الخط
    requestAnimationFrame(() => {
      adjustFontSize(expressionEl, 1.8, 0.8);
      adjustFontSize(resultEl, 2.2, 1.2);
    });
  }
  

// ===== Keyboard Support =====
document.addEventListener("keydown", (e) => {
  const key = e.key;

  // أرقام أو نقطة
  if (!isNaN(key) || key === ".") {
    handleNumber(key);
    simulateKeyPress(key);
    return;
  }

  // العمليات
  if (["+", "-", "*", "/"].includes(key)) {
    e.preventDefault?.();
    handleOperation(key);
    simulateKeyPress(key);
    return;
  }

  // Enter أو =
  if (key === "Enter" || key === "=") {
    e.preventDefault?.();
    handleAction("=");
    simulateKeyPress("=");
    return;
  }

  // Delete / Backspace
  if (key === "Backspace" || key === "Delete") {
    handleAction("del");
    simulateKeyPress("del");
    return;
  }

  // Escape
  if (key === "Escape") {
    e.preventDefault?.();
    handleAction("reset");
    simulateKeyPress("reset");
    return;
  }
});

function simulateKeyPress(value) {
  const button = [...buttons].find((btn) => btn.dataset.value === value);
  if (!button) return;
  button.classList.add("active-key");
  setTimeout(() => {
    button.classList.remove("active-key");
  }, 150);
}

// نخزن آخر حجم للخط لكل عنصر
const fontState = new WeakMap();

function adjustFontSize(element, maxFont = 2.2, minFont = 0.8) {
  const containerWidth = element.parentElement.offsetWidth - 10;
  let fontSize = fontState.get(element) || maxFont; // نبدأ بآخر حجم معروف أو بالحجم الكبير

  // نضبط الحجم الحالي أولًا
  element.style.fontSize = fontSize + "rem";

  // لو النص طلع برا الحاوية، نصغره تدريجيًا
  while (element.scrollWidth > containerWidth && fontSize > minFont) {
    fontSize -= 0.05;
    element.style.fontSize = fontSize + "rem";
  }

  // ✅ نحفظ آخر حجم تم الوصول له
  fontState.set(element, fontSize);
}

  
  