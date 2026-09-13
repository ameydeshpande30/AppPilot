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
const workflow = document.querySelector('[data-workflow]');
const stepDetails = workflowSteps.map((step) => step.querySelector('[data-step-detail]'));
const demoAction = document.querySelector('[data-demo-action]');
const replayButton = document.querySelector('[data-replay]');
const demoTitle = document.querySelector('[data-demo-title]');
const demoStatus = document.querySelector('[data-demo-status]');
const scenarioButtons = [...document.querySelectorAll('[data-scenario]')];
const windowTitleEl = document.querySelector('[data-window-title]');
const requestLabelEl = document.querySelector('[data-request-label]');
const requestTextEl = document.querySelector('[data-request-text]');
const requestAuthorEl = document.querySelector('[data-request-author]');
const requestTimeEl = document.querySelector('[data-request-time]');
const requestAvatarEl = document.querySelector('[data-request-avatar]');

// Each scenario drives the same five-step workflow with different copy.
const scenarios = {
  feature: {
    windowTitle: 'appilot / change-042',
    requestLabel: 'CHANGE REQUEST',
    requestText: 'Add a VIP customer type and show VIP customers as a separate section on the dashboard.',
    requestAuthor: 'Product request',
    requestTime: 'Today, 10:42 AM',
    requestAvatar: 'PM',
    stepDetails: [
      'Schema, code paths, and test impact mapped',
      'Customer type, dashboard query, and UI updated',
      '38 checks passed · no regression findings',
      'Ephemeral environment ready for a human review',
      'Git-based promotion with full audit trail'
    ],
    copy: [
      ['Plan ready for review', 'Awaiting approval', 'Open preview'],
      ['Change implemented', 'Checks passed', 'Review changes'],
      ['Validation complete', 'No regression findings', 'Open report'],
      ['Preview ready', 'Human approval needed', 'Approve preview'],
      ['Promoted to production', 'Change deployed', 'View audit trail']
    ]
  },
  fix: {
    windowTitle: 'appilot / fix-118',
    requestLabel: 'FIX REQUEST',
    requestText: 'The dashboard shows the wrong win rate when a deal is marked lost. Fix it before Monday’s report.',
    requestAuthor: 'Support ticket',
    requestTime: 'Today, 9:05 AM',
    requestAvatar: 'ST',
    stepDetails: [
      'Root cause traced to the win-rate query',
      'Query corrected, edge cases covered',
      '41 checks passed · bug reproduced, then fixed',
      'Preview confirms the dashboard matches reality',
      'Git-based promotion with full audit trail'
    ],
    copy: [
      ['Plan ready for review', 'Awaiting approval', 'Open preview'],
      ['Fix implemented', 'Checks passed', 'Review changes'],
      ['Validation complete', 'Bug confirmed fixed', 'Open report'],
      ['Preview ready', 'Human approval needed', 'Approve preview'],
      ['Promoted to production', 'Fix deployed', 'View audit trail']
    ]
  }
};

let activeScenario = 'feature';
let activeWorkflow = 0;
const workflowStepDelay = 2500;
const approvalStep = 3;
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let workflowTimer = null;
let isWorkflowAutoplaying = false;
let hasUsedViewportAutoplay = false;

function setWorkflowStep(index) {
  activeWorkflow = index;
  const { copy } = scenarios[activeScenario];
  workflowSteps.forEach((step, stepIndex) => {
    step.classList.toggle('is-active', stepIndex === index);
    const state = step.querySelector('.step-state');
    if (state) {
      state.textContent = stepIndex < index ? 'Done' : stepIndex === index ? 'Current' : 'Locked';
      state.classList.toggle('is-current', stepIndex === index);
    }
  });
  if (demoTitle) demoTitle.textContent = copy[index][0];
  if (demoStatus) demoStatus.textContent = copy[index][1];
  if (demoAction) demoAction.innerHTML = `${copy[index][2]} <span aria-hidden="true">↗</span>`;
}

function updateReplayButton() {
  if (replayButton) replayButton.textContent = isWorkflowAutoplaying ? 'Pause workflow' : 'Replay workflow';
}

function pauseWorkflowAutoplay() {
  if (workflowTimer !== null) window.clearTimeout(workflowTimer);
  workflowTimer = null;
  isWorkflowAutoplaying = false;
  hasUsedViewportAutoplay = true;
  updateReplayButton();
}

function scheduleWorkflowStep() {
  if (!isWorkflowAutoplaying) return;
  if (activeWorkflow >= approvalStep) {
    pauseWorkflowAutoplay();
    return;
  }

  workflowTimer = window.setTimeout(() => {
    workflowTimer = null;
    if (!isWorkflowAutoplaying) return;
    setWorkflowStep(activeWorkflow + 1);
    scheduleWorkflowStep();
  }, workflowStepDelay);
}

function startWorkflowAutoplay() {
  if (reducedMotionQuery.matches || !workflowSteps.length) return;
  if (workflowTimer !== null) window.clearTimeout(workflowTimer);
  hasUsedViewportAutoplay = true;
  isWorkflowAutoplaying = true;
  updateReplayButton();
  scheduleWorkflowStep();
}

function setScenario(id) {
  activeScenario = id;
  const scenario = scenarios[id];
  if (windowTitleEl) windowTitleEl.textContent = scenario.windowTitle;
  if (requestLabelEl) requestLabelEl.textContent = scenario.requestLabel;
  if (requestTextEl) requestTextEl.textContent = scenario.requestText;
  if (requestAuthorEl) requestAuthorEl.textContent = scenario.requestAuthor;
  if (requestTimeEl) requestTimeEl.textContent = scenario.requestTime;
  if (requestAvatarEl) requestAvatarEl.textContent = scenario.requestAvatar;
  stepDetails.forEach((detail, index) => {
    if (detail) detail.textContent = scenario.stepDetails[index];
  });
  scenarioButtons.forEach((button) => {
    const isActive = button.dataset.scenario === id;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });
  setWorkflowStep(0);
}

workflowSteps.forEach((step) => {
  step.addEventListener('click', () => {
    pauseWorkflowAutoplay();
    setWorkflowStep(Number(step.dataset.step));
  });
});

scenarioButtons.forEach((button) => {
  button.addEventListener('click', () => {
    pauseWorkflowAutoplay();
    setScenario(button.dataset.scenario);
  });
});

if (demoAction) {
  demoAction.addEventListener('click', () => {
    pauseWorkflowAutoplay();
    const nextStep = Math.min(activeWorkflow + 1, workflowSteps.length - 1);
    setWorkflowStep(nextStep);
  });
}

if (replayButton) {
  replayButton.addEventListener('click', () => {
    if (isWorkflowAutoplaying) {
      pauseWorkflowAutoplay();
      return;
    }

    setWorkflowStep(0);
    workflowSteps[0]?.scrollIntoView({ behavior: reducedMotionQuery.matches ? 'auto' : 'smooth', block: 'nearest' });
    startWorkflowAutoplay();
  });
}

setWorkflowStep(0);

if (workflow && 'IntersectionObserver' in window && !reducedMotionQuery.matches) {
  const workflowObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (!hasUsedViewportAutoplay) startWorkflowAutoplay();
    });
  }, { threshold: 0.35 });
  workflowObserver.observe(workflow);
}

reducedMotionQuery.addEventListener('change', (event) => {
  if (event.matches && isWorkflowAutoplaying) pauseWorkflowAutoplay();
});

const lifeData = [
  ['01', 'Start with intent, not a ticket queue.', 'Whether it’s a new feature or something broken, describe the outcome in plain language. AppPilot turns intent into an explicit, inspectable engineering plan before any files change.'],
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
