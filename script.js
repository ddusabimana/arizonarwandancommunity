
// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links){
  toggle.addEventListener('click', ()=>{
    links.classList.toggle('open');
    // Update aria-expanded for accessibility
    const isExpanded = links.classList.contains('open');
    toggle.setAttribute('aria-expanded', isExpanded);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close menu when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Highlight current page
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const target = a.getAttribute('href');
    if ((path === '' && target === 'index.html') || path === target){
      a.setAttribute('aria-current','page');
      a.classList.add('active');
    }
  });
})();

// Slider (only on home)
(function(){
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;
  let index = 0;
  const activate = i => {
    slides.forEach((s, j)=> s.classList.toggle('active', i===j));
  };
  activate(index);
  setInterval(()=>{ index = (index + 1) % slides.length; activate(index); }, 3000);
})();

// Simple on-scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.style.transform = 'translateY(0)';
      entry.target.style.opacity = '1';
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.12});

document.querySelectorAll('.reveal').forEach(el=>{
  el.style.opacity = '0';
  el.style.transform = 'translateY(12px)';
  el.style.transition = 'all .7s ease';
  observer.observe(el);
});


// Lightbox for gallery
(function(){
  const grid = document.querySelector('.masonry');
  if(!grid) return;
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="close" aria-label="Close">✕</button>
    <div class="controls">
      <button class="prev" aria-label="Previous">‹</button>
      <button class="next" aria-label="Next">›</button>
    </div>
    <img alt="Gallery image preview"/>
  `;
  document.body.appendChild(lb);
  const img = lb.querySelector('img');
  const prev = lb.querySelector('.prev');
  const next = lb.querySelector('.next');
  const close = lb.querySelector('.close');
  const items = Array.from(grid.querySelectorAll('img'));
  let idx = 0;

  function open(i){
    idx = i; img.src = items[idx].src; img.alt = items[idx].alt || 'Image'; lb.classList.add('open');
  }
  function move(d){
    idx = (idx + d + items.length) % items.length; img.src = items[idx].src; img.alt = items[idx].alt || 'Image';
  }
  items.forEach((el,i)=> el.addEventListener('click', ()=>open(i)));
  prev.addEventListener('click', ()=>move(-1));
  next.addEventListener('click', ()=>move(1));
  close.addEventListener('click', ()=>lb.classList.remove('open'));
  lb.addEventListener('click', (e)=>{ if(e.target===lb) lb.classList.remove('open'); });
  document.addEventListener('keydown', (e)=>{
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') lb.classList.remove('open');
    if(e.key==='ArrowLeft') move(-1);
    if(e.key==='ArrowRight') move(1);
  });
})();

// Formspree AJAX enhancement
(function(){
  const form = document.querySelector('form[action^="https://formspree.io/f/"]');
  if(!form) return;
  const status = document.getElementById('form-status');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if (form.querySelector('input[name="_gotcha"]')?.value) return; // honeypot
    const data = new FormData(form);
    try{
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if(res.ok){
        status.textContent = 'Thank you! Your message has been sent.';
        status.style.color = '#7dffb0';
        form.reset();
      }else{
        status.textContent = 'There was an issue sending. Please try again or email us directly.';
        status.style.color = '#ffd7a1';
      }
    }catch(err){
      status.textContent = 'Network error. Please email us directly.';
      status.style.color = '#ffd7a1';
    }
  });
})();
