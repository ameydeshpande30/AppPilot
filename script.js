const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const workflowSteps = [...document.querySelectorAll('.workflow-step')];
const demoAction = document.querySelector('[data-demo-action]');
const replayButton = document.querySelector('[data-replay]');
const demoTitle = document.querySelector('[data-demo-title]');
const demoStatus = document.querySelector('[data-demo-status]');
const workflowCopy = [
  ['Plan ready for review', 'Awaiting approval', 'Open preview'],
  ['Change implemented', 'Checks passed', 'Review changes'],
  ['Validation complete', 'No regression findings', 'Open report'],
  ['Preview ready', 'Human approval needed', 'Approve preview'],
  ['Promoted to production', 'Change deployed', 'View audit trail']
];
let activeWorkflow = 0;

function setWorkflowStep(index) {
  activeWorkflow = index;
  workflowSteps.forEach((step, stepIndex) => {
    step.classList.toggle('is-active', stepIndex === index);
    const state = step.querySelector('.step-state');
    if (state) {
      state.textContent = stepIndex < index ? 'Done' : stepIndex === index ? 'Current' : 'Locked';
      state.classList.toggle('is-current', stepIndex === index);
    }
  });
  if (demoTitle) demoTitle.textContent = workflowCopy[index][0];
  if (demoStatus) demoStatus.textContent = workflowCopy[index][1];
  if (demoAction) demoAction.innerHTML = `${workflowCopy[index][2]} <span aria-hidden="true">↗</span>`;
}

workflowSteps.forEach((step) => {
  step.addEventListener('click', () => setWorkflowStep(Number(step.dataset.step)));
});

if (demoAction) {
  demoAction.addEventListener('click', () => {
    const nextStep = Math.min(activeWorkflow + 1, workflowSteps.length - 1);
    setWorkflowStep(nextStep);
  });
}

if (replayButton) {
  replayButton.addEventListener('click', () => {
    setWorkflowStep(0);
    workflowSteps[0]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

const lifeData = [
  ['01', 'Start with intent, not tickets.', 'A PM describes the outcome in plain language. AppPilot turns intent into an explicit, inspectable engineering plan before any files change.'],
  ['02', 'Give the agent the whole application.', 'Source code is only part of the context. Architecture docs, database schema, conventions, tests, and product rules travel with the request.'],
  ['03', 'Make the change in isolation.', 'The agent works in a disposable workspace, making the diff and its impact visible before it can touch a shared environment.'],
  ['04', 'Prove the change from multiple angles.', 'Unit, integration, API, browser, security, and regression checks create evidence that the change behaves as intended.'],
  ['05', 'Keep people in the promotion loop.', 'A human reviews the preview, approves the promotion, and leaves an audit trail for what changed and why.']
];
const lifeSteps = [...document.querySelectorAll('.life-step')];
const lifeIndex = document.querySelector('[data-life-index]');
const lifeTitle = document.querySelector('[data-life-title]');
const lifeCopy = document.querySelector('[data-life-copy]');

lifeSteps.forEach((step) => {
  step.addEventListener('click', () => {
    const index = Number(step.dataset.life);
    lifeSteps.forEach((item) => item.classList.toggle('is-selected', item === step));
    if (lifeIndex) lifeIndex.textContent = lifeData[index][0];
    if (lifeTitle) lifeTitle.textContent = lifeData[index][1];
    if (lifeCopy) lifeCopy.textContent = lifeData[index][2];
  });
});

const header = document.querySelector('[data-header]');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.site-nav a')];

if (header && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach((section) => observer.observe(section));
}

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section-heading, .template-card, .architecture-notes > div, .reliability-list > div, .contact-line').forEach((element) => {
    element.classList.add('reveal');
    revealObserver.observe(element);
  });
}
