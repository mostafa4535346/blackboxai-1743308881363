// Language data
const LANG_DATA = {
  en: {},
  ar: {}
};

// Load language files
async function loadLanguageData() {
  try {
    const [enRes, arRes] = await Promise.all([
      fetch('lang/en.json'),
      fetch('lang/ar.json')
    ]);
    LANG_DATA.en = await enRes.json();
    LANG_DATA.ar = await arRes.json();
    applyLanguage();
  } catch (error) {
    console.error('Error loading language files:', error);
  }
}

// Apply current language to page
function applyLanguage() {
  const lang = localStorage.getItem('lang') || 'en';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (LANG_DATA[lang][key]) {
      if (el.tagName === 'INPUT' && el.placeholder) {
        el.placeholder = LANG_DATA[lang][key];
      } else {
        el.textContent = LANG_DATA[lang][key];
      }
    }
  });
}

// Toggle language
function toggleLanguage(lang) {
  localStorage.setItem('lang', lang);
  applyLanguage();
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', loadLanguageData);