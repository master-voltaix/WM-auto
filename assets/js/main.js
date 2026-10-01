document.documentElement.classList.remove('no-js');

// Mobile navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('.header .nav');
if (burger && nav) {
  const toggle = open => {
    nav.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  };
  burger.addEventListener('click', () => toggle(!nav.classList.contains('open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) toggle(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
}

// Price calculator
const calc = document.getElementById('calc');
if (calc) {
  const cls = document.getElementById('c-class');
  const days = document.getElementById('c-days');
  const total = document.getElementById('c-total');
  const note = document.getElementById('c-note');
  const out = calc.querySelector('.calc__out');
  const fmt = n => n.toLocaleString('de-DE') + ' €';

  const update = animate => {
    const d = Math.min(365, Math.max(1, parseInt(days.value, 10) || 1));
    const rate = d >= 28 ? 0.2 : d >= 7 ? 0.1 : 0;
    total.textContent = fmt(Math.round(+cls.value * d * (1 - rate)));
    note.textContent = rate ? `inkl. ${rate * 100} % ${d >= 28 ? 'Monats' : 'Wochen'}rabatt` : `für ${d} ${d === 1 ? 'Tag' : 'Tage'}`;
    if (animate) { out.classList.remove('pulse'); void out.offsetWidth; out.classList.add('pulse'); }
  };
  calc.addEventListener('submit', e => { e.preventDefault(); update(true); });
  cls.addEventListener('change', () => update(true));
  days.addEventListener('input', () => update(false));
  update(false);
}

// Fleet slider: rotate the car tiles
const fleetCars = [
  { img: 'assets/img/fleet-1.jpg', price: 'ab 89 €', name: 'Business-Limousine', spec: 'Automatik · Diesel · 5 Sitze' },
  { img: 'assets/img/fleet-4.jpg', price: 'ab 69 €', name: 'SUV', spec: 'Automatik · Benzin · 5 Sitze' },
  { img: 'assets/img/service-transporter.jpg', price: 'ab 79 €', name: 'Transporter', spec: 'Schaltung · Diesel · 3 Sitze' },
  { img: 'assets/img/service-kurz.jpg', price: 'ab 39 €', name: 'Kompaktklasse', spec: 'Schaltung · Benzin · 5 Sitze' },
  { img: 'assets/img/service-lang.jpg', price: 'ab 59 €', name: 'Kombi', spec: 'Automatik · Hybrid · 5 Sitze' },
  { img: 'assets/img/service-premium.jpg', price: 'ab 119 €', name: 'Sport-Coupé', spec: 'Automatik · Benzin · 4 Sitze' },
];
const slots = document.querySelectorAll('.f-car[data-slot]');
let offset = 0;
document.querySelectorAll('.f-arrows button').forEach(btn => btn.addEventListener('click', () => {
  offset = (offset + +btn.dataset.dir + fleetCars.length) % fleetCars.length;
  slots.forEach((slot, i) => {
    const car = fleetCars[(offset + i) % fleetCars.length];
    const img = slot.querySelector('img');
    img.style.opacity = 0;
    setTimeout(() => {
      img.src = car.img;
      slot.querySelector('.tag').textContent = car.price;
      slot.querySelector('.cap b').textContent = car.name;
      slot.querySelector('.cap span:last-child').textContent = car.spec;
      img.style.opacity = 1;
    }, 250);
  });
}));

// FAQ accordion
document.querySelectorAll('.faq__item').forEach(item => {
  const a = item.querySelector('.faq__a');
  const q = item.querySelector('.faq__q');
  const set = open => {
    item.classList.toggle('open', open);
    q.setAttribute('aria-expanded', open);
    a.style.maxHeight = open ? a.scrollHeight + 'px' : 0;
  };
  set(item.classList.contains('open'));
  q.addEventListener('click', () => set(!item.classList.contains('open')));
});

// Forms (demo: no backend)
document.querySelectorAll('.js-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = form.querySelector('.form__msg');
    if (msg) msg.classList.add('show');
    form.reset();
  });
});

// Reveal on scroll
const io = 'IntersectionObserver' in window && new IntersectionObserver(entries => {
  entries.forEach((en, i) => {
    if (en.isIntersecting) {
      setTimeout(() => en.target.classList.add('in'), i * 90);
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));

// Highlight today's opening hours
const today = document.querySelector(`.hours tr[data-day="${new Date().getDay()}"]`);
if (today) today.classList.add('today');

// Booking bar: preselect vehicle class from service cards, sensible date limits
const bookClass = document.getElementById('b-klasse');
document.querySelectorAll('[data-klasse]').forEach(el => el.addEventListener('click', () => {
  if (bookClass) bookClass.selectedIndex = +el.dataset.klasse;
}));
const isoToday = new Date().toISOString().slice(0, 10);
document.querySelectorAll('input[type="date"]').forEach(inp => { inp.min = isoToday; });
document.querySelectorAll('form').forEach(form => {
  const from = form.querySelector('[name="von"]'), to = form.querySelector('[name="bis"]');
  if (from && to) from.addEventListener('change', () => {
    to.min = from.value || isoToday;
    if (to.value && to.value < from.value) to.value = from.value;
  });
});
