function includeHTML() {
  const elements = document.querySelectorAll('[include-html]');
  elements.forEach(el => {
    const file = el.getAttribute('include-html');
    if (file) {
      fetch(file)
        .then(response => {
          if (!response.ok) throw new Error('Page not found');
          return response.text();
        })
        .then(data => {
          el.innerHTML = data;
          el.removeAttribute('include-html');
          includeHTML(); // Recursive call for nested includes
        })
        .catch(err => console.error('Include error:', err));
    }
  });
}
document.addEventListener("DOMContentLoaded", includeHTML);