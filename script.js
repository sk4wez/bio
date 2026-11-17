const $ = (s, el = document) => el.querySelector(s);
const root = document.documentElement;

/* тема */
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.dataset.theme = savedTheme;

$('#themeBtn').addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
});

/* мобильное меню */
const burger = $('#burger');
const navLinks = $('#navLinks');

const closeMenu = () => {
  navLinks.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
};

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});

navLinks.addEventListener('click', (e) => {
  if (e.target.closest('a')) closeMenu();
});

/* появление блоков при скролле */
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    io.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* счётчики */
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const step = Math.max(1, Math.round(target / 40));
    let n = 0;

    const timer = setInterval(() => {
      n += step;
      if (n >= target) {
        n = target;
        clearInterval(timer);
      }
      el.textContent = n;
    }, 26);

    counterIO.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach((el) => counterIO.observe(el));

/* всплывающее сообщение */
const toast = $('#toast');

const showToast = (message, ok = true) => {
  toast.textContent = message;
  toast.style.borderColor = ok ? 'rgba(34,211,165,.6)' : 'rgba(255,99,99,.6)';
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3400);
};

/* форма: отправка на почту через FormSubmit */
const form = $('#form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  /* скрытое поле-ловушка: заполняют только боты */
  if (form.querySelector('[name="_honey"]').value) return;

  const original = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправляю...';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });

    if (!res.ok) throw new Error('Ошибка отправки');

    form.reset();
    showToast('Заявка отправлена. Спасибо!');
  } catch (err) {
    showToast('Не получилось отправить. Напишите в Discord: @sk4wez', false);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = original;
  }
});

/* год в подвале */
$('#year').textContent = new Date().getFullYear();