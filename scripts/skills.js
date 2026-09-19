/**
 * Interactive Skills Matrix Manager
 * Handles real-time search filtering, category pills, and click inspect.
 */
document.addEventListener('DOMContentLoaded', () => {
  const filterPills = document.querySelectorAll('.filter-pill');
  const searchInput = document.getElementById('skills-search-input');
  const skillCards = document.querySelectorAll('.skill-group-card');

  let currentCategory = 'all';
  let currentSearchQuery = '';

  function applyFilter() {
    skillCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const title = (card.querySelector('.group-title')?.textContent || '').toLowerCase();
      const items = (card.querySelector('.group-items')?.textContent || '').toLowerCase();

      const matchesCategory = (currentCategory === 'all') || (category === currentCategory);
      const matchesSearch = !currentSearchQuery || 
                            keywords.includes(currentSearchQuery) || 
                            title.includes(currentSearchQuery) || 
                            items.includes(currentSearchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.animation = 'fadeInDown 0.25s ease-out';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Category Pills
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-filter');
      applyFilter();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      applyFilter();
    });
  }

  // Card click interaction
  skillCards.forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.group-title')?.textContent;
      const items = card.querySelector('.group-items')?.textContent;
      if (window.showToast) {
        window.showToast(`Selected: ${title} (${items})`);
      }
    });
  });
});
