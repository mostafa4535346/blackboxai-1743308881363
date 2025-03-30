function openWhatsApp() {
  // Developer contact number (Egyptian format with country code)
  const phoneNumber = "+201033022988";
  
  // Default message in current language
  const lang = localStorage.getItem('lang') || 'en';
  const defaultMessage = lang === 'ar' 
    ? "مرحبًا، أريد الاستفسار عن موقع في مصر" 
    : "Hello, I want to inquire about a place in Egypt";
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(defaultMessage);
  
  // Open WhatsApp with pre-filled message
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

// Add event listener to all WhatsApp buttons
document.querySelectorAll('.whatsapp-button').forEach(button => {
  button.addEventListener('click', openWhatsApp);
});