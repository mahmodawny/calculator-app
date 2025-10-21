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