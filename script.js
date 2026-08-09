const stage = document.querySelector('#stage');
const languageSwitch = document.querySelector('.language-switch');
const status = document.querySelector('#stage-status');

const copy = {
  zh: {
    statement: '个人项目、工具与正在推进的实验。',
    languageAction: '切换到英文',
    switched: '已切换至中文',
    pressed: '光线已响应',
    navProjects: '项目',
    navContact: '联系',
    viewProjects: '查看项目',
    getInTouch: '联系',
    footerNote: '个人主页 · 项目索引',
    pageBack: '首页',
    projectsEyebrow: '项目索引 · 03',
    projectsTitle: '正在做的东西。',
    projectsLead: '每个项目单独说明用途、边界和当前形式。',
    projectLnkType: '桌面学习工具',
    projectLnkDescription: '面向古诗文背诵的桌面工具：围绕主动回忆、复习排程和学习计划组织练习。',
    projectSmartType: 'Chromium 扩展',
    projectSmartDescription: '将当前 AI 对话导出为 Markdown、纯文本或 JSON。文件在浏览器本地生成，不经过自建上传或分析服务。',
    projectViliType: 'Chrome 扩展',
    projectViliDescription: '为哔哩哔哩视频页提供下载控制面板；媒体获取、音视频合并和 MP3 转换均在本机浏览器中完成。',
    openProject: '打开项目',
    contactEyebrow: '联系方式 · 01',
    contactTitle: '在别处找到我。',
    contactLead: '项目讨论、使用反馈和合作来信，都可以从这里开始。',
    contactPersonal: '个人主页',
    contactGithub: 'GitHub',
    contactX: 'X / Twitter',
    contactReddit: 'Reddit',
    contactEmail: '邮箱',
    contactNote: '外部链接会在新标签页打开。',
  },
  en: {
    statement: 'PERSONAL PROJECTS, TOOLS, AND WORK IN PROGRESS.',
    languageAction: 'Switch to Chinese',
    switched: 'Language switched to English',
    pressed: 'Light responded',
    navProjects: 'PROJECTS',
    navContact: 'CONTACT',
    viewProjects: 'VIEW PROJECTS',
    getInTouch: 'CONTACT',
    footerNote: 'PERSONAL SITE · PROJECT INDEX',
    pageBack: 'HOME',
    projectsEyebrow: 'PROJECT INDEX · 03',
    projectsTitle: 'THINGS IN PROGRESS.',
    projectsLead: 'Each project states its purpose, boundaries, and current form.',
    projectLnkType: 'DESKTOP LEARNING TOOL',
    projectLnkDescription: 'A desktop tool for classical Chinese memorisation, organised around retrieval practice, review scheduling, and study plans.',
    projectSmartType: 'CHROMIUM EXTENSION',
    projectSmartDescription: 'Exports the current AI conversation as Markdown, plain text, or JSON. Files are produced locally in the browser without a separate upload or analytics service.',
    projectViliType: 'CHROME EXTENSION',
    projectViliDescription: 'Adds download controls to Bilibili pages. Media retrieval, merging, and MP3 conversion run locally in the browser.',
    openProject: 'OPEN PROJECT',
    contactEyebrow: 'CONTACT · 01',
    contactTitle: 'FIND ME ELSEWHERE.',
    contactLead: 'Project discussion, feedback, and collaboration can start here.',
    contactPersonal: 'PERSONAL SITE',
    contactGithub: 'GITHUB',
    contactX: 'X / TWITTER',
    contactReddit: 'REDDIT',
    contactEmail: 'EMAIL',
    contactNote: 'External links open in a new tab.',
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

if (stage) {
  stage.addEventListener('pointermove', setPointerLight, { passive: true });
  stage.addEventListener('pointerdown', pressStage);
  stage.addEventListener('animationend', (event) => {
    if (event.animationName === 'press-bloom') {
      stage.classList.remove('stage--pressed');
    }

    if (event.animationName === 'letter-arrival' && event.target === document.querySelector('.hero__name span:last-child')) {
      stage.classList.add('stage--ready');
    }
  });
}

languageSwitch?.addEventListener('click', switchLanguage);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stage?.classList.remove('stage--pressed');
    window.cancelAnimationFrame(lightFrame);
    lightFrame = undefined;
  }
});
