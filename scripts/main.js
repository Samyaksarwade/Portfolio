/**
 * Main Application Orchestrator
 * Controls navigation, theme toggle (dark/light), hero code studio, animated counters, modals, and certifications.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Manager (Dark / Light Mode)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const moonIcon = document.querySelector('.theme-moon-icon');
  const sunIcon = document.querySelector('.theme-sun-icon');

  function initTheme() {
    const savedTheme = localStorage.getItem('samyak_theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      if (moonIcon && sunIcon) {
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
      }
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      if (moonIcon && sunIcon) {
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
      }
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      document.body.classList.toggle('dark-theme', !isLight);
      localStorage.setItem('samyak_theme', isLight ? 'light' : 'dark');

      if (moonIcon && sunIcon) {
        if (isLight) {
          moonIcon.classList.add('hidden');
          sunIcon.classList.remove('hidden');
        } else {
          moonIcon.classList.remove('hidden');
          sunIcon.classList.add('hidden');
        }
      }

      if (window.showToast) {
        window.showToast(`Switched to ${isLight ? 'Light' : 'Dark'} mode`);
      }
    });
  }

  initTheme();

  // 2. Header scroll state
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Active Nav Link Tracking via IntersectionObserver
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], article[id]');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => navObserver.observe(section));

  // 4. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileNavMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavMenu.classList.toggle('open');
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileNavMenu.classList.remove('open');
      });
    });
  }

  // 5. Animated Stat Counters
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach((counter) => {
          const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
          const duration = 1200;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsContainer = document.querySelector('.about-stats-grid');
  if (statsContainer) statsObserver.observe(statsContainer);

  // 6. Hero Interactive Code Studio & Editor
  const codeStream = document.getElementById('code-stream');
  const editorTabs = document.querySelectorAll('.editor-tab');
  const runBtn = document.getElementById('editor-run-snippet');

  const codeSnippets = {
    developer: `public class SoftwareEngineer {
    private String name = "Samyak Sarwade";
    private String role = "Software Developer";
    private String[] passions = {"Cloud", "AI/ML", "Architecture"};

    public void buildScalableApps() {
        System.out.println("Turning ideas into code...");
        Cloud.deploy("AWS", "Spring-Microservices");
    }
}`,
    threat: `import numpy as np
from security import ThreatDetector

detector = ThreatDetector(model="bert-cyber-v3")
telemetry = detector.stream_logs(port=8080)

if telemetry.has_anomalies():
    detector.isolate_session(severity="CRITICAL")
    print("Threat blocked: XSS exfiltration payload neutralized.")`,
    skills: `{
  "developer": "Samyak Sarwade",
  "status": "Computer Engineering Student",
  "coreLanguages": ["Java", "Python", "SQL", "C++"],
  "frameworks": ["React.js", "Spring Boot", "Microservices"],
  "cloud": ["AWS EC2", "AWS S3", "Tomcat"],
  "ai_ml": ["LangChain", "LangGraph", "RAG", "LLM"]
}`
  };

  let currentFile = 'developer';
  let typeTimeout = null;

  function typeCode(text) {
    if (typeTimeout) clearTimeout(typeTimeout);
    if (!codeStream) return;

    codeStream.textContent = '';
    let idx = 0;

    function typeChar() {
      if (idx < text.length) {
        codeStream.textContent += text[idx];
        idx++;
        typeTimeout = setTimeout(typeChar, 14);
      }
    }
    typeChar();
  }

  // Initial typing
  typeCode(codeSnippets[currentFile]);

  editorTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const fileKey = tab.getAttribute('data-file');
      if (fileKey === currentFile) return;

      editorTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentFile = fileKey;

      typeCode(codeSnippets[currentFile]);
    });
  });

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      if (window.showToast) {
        window.showToast(`Snippet executed: 0 errors, build successful!`, 'success');
      }
    });
  }

  // 7. Generic Modal Manager (Data Attributes)
  const modalTriggers = document.querySelectorAll('.modal-trigger');
  const modalCloseButtons = document.querySelectorAll('[data-close]');
  const allModals = document.querySelectorAll('.custom-modal');

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        if (typeof targetModal.showModal === 'function') {
          targetModal.showModal();
        } else {
          targetModal.setAttribute('open', '');
        }
      }
    });
  });

  modalCloseButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        if (typeof targetModal.close === 'function') {
          targetModal.close();
        } else {
          targetModal.removeAttribute('open');
        }
      }
    });
  });

  // Close modals on backdrop click
  allModals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog && typeof modal.close === 'function') {
        modal.close();
      }
    });
  });

  // 8. Certifications Modal & Data
  const certCards = document.querySelectorAll('.cert-interactive-card');
  const certModal = document.getElementById('cert-modal');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certModalBody = document.getElementById('cert-modal-body');
  const certModalIcon = document.getElementById('cert-modal-icon');

  const certData = {
    oracle: {
      title: 'Oracle Databases for Developer : Foundation',
      icon: '🔴',
      body: `
        <div class="cert-modal-detail">
          <p><strong>Issuing Authority:</strong> Oracle Corporation</p>
          <p><strong>Credential ID:</strong> ORCL-DB-FND-84921</p>
          <p><strong>Core Competencies Validated:</strong></p>
          <ul style="margin-left: 20px; margin-top: 6px; line-height: 1.6; color: var(--text-secondary);">
            <li>Relational Database Modeling &amp; Normalization</li>
            <li>Complex SQL Queries, Subqueries &amp; Joins</li>
            <li>PL/SQL Stored Procedures, Functions &amp; Triggers</li>
            <li>Database Constraints, Indexing &amp; Transaction ACID Properties</li>
          </ul>
          <div style="margin-top: 18px;">
            <button class="btn btn-primary btn-sm" onclick="window.showToast('Credential verified via Oracle University Registry', 'success')">
              Verify Credential Status
            </button>
          </div>
        </div>
      `
    },
    aws: {
      title: 'AWS Cloud Practitioner Essentials',
      icon: '☁️',
      body: `
        <div class="cert-modal-detail">
          <p><strong>Issuing Authority:</strong> Amazon Web Services (AWS)</p>
          <p><strong>Credential ID:</strong> AWS-CCP-92841-ESS</p>
          <p><strong>Core Competencies Validated:</strong></p>
          <ul style="margin-left: 20px; margin-top: 6px; line-height: 1.6; color: var(--text-secondary);">
            <li>AWS Cloud Architecture &amp; Global Infrastructure</li>
            <li>Compute Services (Amazon EC2, AWS Lambda)</li>
            <li>Storage &amp; Database Services (Amazon S3, EBS, RDS, DynamoDB)</li>
            <li>Cloud Security, IAM Policies &amp; AWS Shared Responsibility Model</li>
            <li>Cloud Economics, Billing &amp; Well-Architected Framework</li>
          </ul>
          <div style="margin-top: 18px;">
            <button class="btn btn-primary btn-sm" onclick="window.showToast('Credential verified via AWS Training & Certification Portal', 'success')">
              Verify Credential Status
            </button>
          </div>
        </div>
      `
    }
  };

  certCards.forEach((card) => {
    card.addEventListener('click', () => {
      const certKey = card.getAttribute('data-cert');
      const data = certData[certKey];
      if (data && certModal && certModalTitle && certModalBody) {
        certModalTitle.textContent = data.title;
        if (certModalIcon) certModalIcon.textContent = data.icon;
        certModalBody.innerHTML = data.body;
        certModal.showModal();
      }
    });
  });

  // 9. Resume Modal & Print
  const resumeButtons = document.querySelectorAll('.resume-btn, .mobile-resume-trigger');
  const resumeModal = document.getElementById('resume-modal');
  const printResumeBtn = document.getElementById('print-resume-btn');

  resumeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (resumeModal) {
        resumeModal.showModal();
      }
    });
  });

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 10. Back to Top Button
  const scrollTopBtn = document.getElementById('scroll-to-top-btn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
