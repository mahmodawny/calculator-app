// نختار زر التبديل
const themeToggle = document.querySelector(".themes__toggle");
// تعريف الثيمات
const themes = ["","light","purple"];
let currentTheme = 0;
// عند تحميل الصفحة أول مرة
const savedTheme = localStorage.getItem("calcThemeIndex");

if(savedTheme !== null){
    currentTheme = Number(savedTheme);
    document.body.className= themes[currentTheme]
}
themeToggle.addEventListener("click",()=>{
    currentTheme = (currentTheme+1)%themes.length;
    document.body.className= themes[currentTheme];
    localStorage.setItem("calcThemeIndex", currentTheme)
})

const resultEl = document.querySelector(".calc__result")
const buttons = document.querySelectorAll(".calc__keys button");
let currentNumber = "";
let expression = "";

buttons.forEach((btn)=>{
    btn.addEventListener("click",()=>{
        const type = btn.dataset.type;
        const value = btn.dataset.value;

        if(type === "number") handleNumber(value)
        if (type === "operation") handleOperation(value);
        if (type === "action") handleAction(value);
    })
})

function handleNumber(value){
    if(value === "." && currentNumber.includes(".")) return;
    currentNumber+= value;
    updateDisplay(expression + currentNumber);
}

function handleOperation(value){
    if(currentNumber === "" && expression === "") return;
    expression += currentNumber+value;
    currentNumber ="";
    updateDisplay(expression);
}

function handleAction(value){
    if(value === "del"){
        currentNumber = currentNumber.slice(0,-1);
        updateDisplay(expression + currentNumber || "0");
    }
    if(value  ==="reset"){
        expression ="";
        currentNumber="";
        updateDisplay("0")
    }

    if(value === "="){
        expression += currentNumber;
        try{
                const result = eval(expression);
                updateDisplay(result)
                expression = result.toString();
                currentNumber="";
        }catch{
                updateDisplay("Error");
                expression="";
                currentNumber ="";
        }
    }
}
function updateDisplay(value) {
    resultEl.textContent = value;
  }
  // ===== Keyboard Support =====
document.addEventListener('keydown',(e)=>{
    const key = e.key;
    
    if(!isNaN(key || key === ".")){
        handleNumber(key)
        simulateKeyPress(key)
        return;
    }
    if(["+","-","*","/"].includes(key)){
        e.preventDefault?.();
        handleNumber(key)
        simulateKeyPress(key)
        return;
    }
    if (key === "Enter" || key === "=") {
        e.preventDefault?.();
        handleAction("=");
        simulateKeyPress("=");
        return;
      }
    
      // Backspace => DEL
      if (key === "Backspace" || key === "Delete") {
        handleAction("del");
        simulateKeyPress("del");
      }
      
    
      // Escape => RESET
      if (key === "Escape") {
        e.preventDefault?.();
        handleAction("reset");
        simulateKeyPress("reset");
        return;
      }
})

function simulateKeyPress(){
    const button = [...button].find((btn)=>btn.dataset.value === value);
    if(!buttons) return;
    button.classList.add("active-key");
    setTimeout(() => {
            button.classList.remove("active-key");

    }, 150);
}