// =============================================================
// docs-site: TOC 自動生成 + スクロールスパイ + 進捗管理 + コピーボタン
// =============================================================

const articles = document.querySelectorAll('article');
const toc = document.getElementById('toc');
const COMPLETED_KEY = 'codelab-completed';

// Load completed state from localStorage
const completed = new Set(JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]'));

// Build TOC
const tocItems = [];
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

function refreshCompleted() {
  tocItems.forEach((li) => li.classList.toggle('completed', completed.has(li.dataset.target)));
}
refreshCompleted();

// Scroll spy
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      tocItems.forEach((li) => li.classList.toggle('active', li.dataset.target === entry.target.id));
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

articles.forEach((a) => observer.observe(a));

// Inject completion buttons
articles.forEach((art) => {
  const btn = document.createElement('button');
  btn.className = 'complete-btn';
  const setLabel = () => {
    const done = completed.has(art.id);
    btn.textContent = done ? '✅ 完了済み' : 'この章を完了にする';
    btn.classList.toggle('completed', done);
  };
  setLabel();
  btn.addEventListener('click', () => {
    if (completed.has(art.id)) {
      completed.delete(art.id);
    } else {
      completed.add(art.id);
    }
    localStorage.setItem(COMPLETED_KEY, JSON.stringify([...completed]));
    setLabel();
    refreshCompleted();
  });
  art.prepend(btn);
});

// Copy buttons for code blocks
document.querySelectorAll('article pre').forEach((pre) => {
  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.textContent = 'Copy';
  btn.addEventListener('click', async () => {
    const code = pre.querySelector('code')?.textContent ?? pre.textContent;
    try {
      await navigator.clipboard.writeText(code);
      btn.textContent = '✅ Copied';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1500);
    } catch (e) {
      btn.textContent = 'Failed';
    }
  });
  pre.appendChild(btn);
});
