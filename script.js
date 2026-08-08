const stage = document.querySelector('#stage');
const languageSwitch = document.querySelector('.language-switch');
const status = document.querySelector('#stage-status');

const copy = {
  zh: {
    statement: '让想法有地方生长。',
    languageAction: '切换到英文',
    switched: '已切换至中文',
    pressed: '光线已响应',
    contactEyebrow: '保持联络 · 01',
    contactTitleLineOne: '在别处，',
    contactTitleLineTwo: '继续发生。',
    lnkLumen: '项目 · Lnk Lumen',
    email: '邮箱',
  },
  en: {
    statement: 'MAKE ROOM FOR IDEAS.',
    languageAction: 'Switch to Chinese',
    switched: 'Language switched to English',
    pressed: 'Light responded',
    contactEyebrow: 'STAY IN TOUCH · 01',
    contactTitleLineOne: 'KEEP GOING,',
    contactTitleLineTwo: 'ELSEWHERE.',
    lnkLumen: 'PROJECT · Lnk Lumen',
    email: 'EMAIL',
  },
};

let language = 'zh';
let pressFrame;
let lightFrame;
const targetLight = { x: 50, y: 46 };
const renderedLight = { x: 50, y: 46 };

function animateLight() {
  renderedLight.x += (targetLight.x - renderedLight.x) * 0.09;
  renderedLight.y += (targetLight.y - renderedLight.y) * 0.09;
  stage.style.setProperty('--pointer-x', `${renderedLight.x}%`);
  stage.style.setProperty('--pointer-y', `${renderedLight.y}%`);

  if (Math.abs(targetLight.x - renderedLight.x) > 0.03 || Math.abs(targetLight.y - renderedLight.y) > 0.03) {
    lightFrame = requestAnimationFrame(animateLight);
  } else {
    lightFrame = undefined;
  }
}

function scheduleLight() {
  if (!lightFrame && !document.hidden) {
    lightFrame = requestAnimationFrame(animateLight);
  }
}

function pressStage(event) {
  if (event.target.closest('button, a')) return;
  window.cancelAnimationFrame(pressFrame);
  stage.classList.remove('stage--pressed');
  pressFrame = requestAnimationFrame(() => stage.classList.add('stage--pressed'));
  status.textContent = copy[language].pressed;
}

function setPointerLight(event) {
  const bounds = stage.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * 100;
  const y = ((event.clientY - bounds.top) / bounds.height) * 100;
  targetLight.x = Math.max(0, Math.min(100, x));
  targetLight.y = Math.max(0, Math.min(100, y));
  scheduleLight();
}

function switchLanguage() {
  language = language === 'zh' ? 'en' : 'zh';
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = copy[language][element.dataset.i18n];
  });
  languageSwitch.querySelector('[aria-hidden="true"]').textContent = language === 'zh' ? '中' : 'EN';
  languageSwitch.setAttribute('aria-pressed', String(language === 'en'));
  status.textContent = copy[language].switched;
}

stage.addEventListener('pointermove', setPointerLight, { passive: true });
stage.addEventListener('pointerdown', pressStage);
languageSwitch.addEventListener('click', switchLanguage);

stage.addEventListener('animationend', (event) => {
  if (event.animationName === 'press-bloom') {
    stage.classList.remove('stage--pressed');
  }

  if (event.animationName === 'letter-arrival' && event.target === document.querySelector('.hero__name span:last-child')) {
    stage.classList.add('stage--ready');
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stage.classList.remove('stage--pressed');
    window.cancelAnimationFrame(lightFrame);
    lightFrame = undefined;
  }
});
