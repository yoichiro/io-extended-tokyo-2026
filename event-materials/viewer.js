// =============================================================
// Staff site: dynamically fetch and render Markdown source files.
// The .md files remain the source of truth (readable on GitHub);
// this viewer renders them as HTML for the Firebase Hosting audience.
// =============================================================

// marked.js and DOMPurify are loaded via <script> tags and expose
// globals `marked` and `DOMPurify` respectively.
const md = window.marked;
const purify = window.DOMPurify;

md.setOptions({
  gfm: true,        // GitHub Flavored Markdown (tables, task lists, etc.)
  breaks: false,    // Line breaks require blank line
});

const articles = document.querySelectorAll('article[data-src]');
const toc = document.getElementById('toc');
const tocItems = [];

// Build TOC
articles.forEach((art) => {
  const li = document.createElement('li');
  li.textContent = art.dataset.title;
  li.dataset.target = art.id;
  li.addEventListener('click', () => {
    art.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  toc.appendChild(li);
  tocItems.push(li);
});

// Scroll spy
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      tocItems.forEach((li) => li.classList.toggle('active', li.dataset.target === entry.target.id));
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

// Load and render each markdown file
async function loadAndRender(article) {
  const src = article.dataset.src;
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.textContent = `Loading ${src}...`;
  article.appendChild(loading);

  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    // Sanitize marked's HTML output with DOMPurify (defense-in-depth,
    // even though source markdown is author-controlled).
    const rawHtml = md.parse(text);
    const safeHtml = purify.sanitize(rawHtml);
    article.innerHTML = safeHtml;
    observer.observe(article);
  } catch (e) {
    const err = document.createElement('div');
    err.className = 'error';
    err.textContent = `${src} を読み込めませんでした: ${e.message}`;
    article.replaceChildren(err);
  }
}

// Kick off all loads in parallel
Promise.all(Array.from(articles).map(loadAndRender));
