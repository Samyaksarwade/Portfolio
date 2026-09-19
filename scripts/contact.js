/**
 * Contact System, Clipboard Interactions & Toast Notifications
 */
document.addEventListener('DOMContentLoaded', () => {
  const toastContainer = document.getElementById('toast-container');

  // Global Toast function
  window.showToast = function(message, type = 'normal') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'success' : ''}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : '⚡'}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  // 1. One-click Copy-to-Clipboard
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        window.showToast(`Copied to clipboard: ${textToCopy}`, 'success');

        const copyBadge = btn.querySelector('.copy-badge');
        if (copyBadge) {
          const original = copyBadge.textContent;
          copyBadge.textContent = 'Copied!';
          copyBadge.style.background = 'rgba(34, 197, 94, 0.2)';
          copyBadge.style.color = '#4ade80';

          setTimeout(() => {
            copyBadge.textContent = original;
            copyBadge.style.background = '';
            copyBadge.style.color = '';
          }, 2000);
        }
      } catch (err) {
        window.showToast(`Could not copy: ${textToCopy}`);
      }
    });
  });

  // 2. Direct Mail Button
  const directMailBtn = document.getElementById('hero-mail-direct-btn');
  if (directMailBtn) {
    directMailBtn.addEventListener('click', () => {
      window.location.href = 'mailto:samyaksarwade1105@gmail.com?subject=Inquiry%20from%20Portfolio';
    });
  }

  // 3. Contact Form Submission
  const contactForm = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('submit-contact-btn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        window.showToast('Please complete all required fields.');
        return;
      }

      // Simulate sending
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Transmitting message...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        window.showToast(`Thank you, ${name}! Your message has been sent to Samyak.`, 'success');
      }, 1000);
    });
  }
});
