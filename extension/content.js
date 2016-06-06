'use strict';
/* globals Mousetrap */
const $ = document.querySelector.bind(document);
const isRedmine = () => $('meta[content="Redmine"]') || $('a[href*="http://www.redmine.org/"]') || $('a[href*="http://www.redmine.org/guide"]');
const isFormTextarea = target => target.type === 'textarea' && /wiki-edit/.test(target.className);
const isHidden = el => el.offsetParent === null;

// Global navigation items
// can work from anywhere in Redmine
function registerGlobalShortcuts(basePath) {
  Mousetrap.bind('g h', () => {
    $('#top-menu .pleasure a.home').click();
  });

  Mousetrap.bind('g m', () => {
    $('#top-menu .pleasure a[href*="/my/page"]').click();
  });

  Mousetrap.bind('g p', () => {
    $('#top-menu .pleasure a[href*="/projects"]').click();
  });

  Mousetrap.bind('g e', () => {
    $('#top-menu .pleasure a[href*="/people"]').click();
  });

  Mousetrap.bind('g a', () => {
    $('#top-menu .pleasure a[href*="/admin"]').click();
  });

  Mousetrap.bind('g /', () => {
    $('#top-menu .pleasure a[href*="redmine.org/guide"]').click();
  });

  Mousetrap.bind('g i', () => {
    window.location = `${basePath}issues`;
  });

  // focus on search
  Mousetrap.bind('/', e => {
    $('form[action*="/search"] input[type="text"]').focus();
    e.preventDefault();
  });

  // create new project
  Mousetrap.bind('n p', () => {
    window.location = `${basePath}projects/new`;
  });

  // toggle quick show list for projects
  Mousetrap.bindGlobal('ctrl+space', () => {
    toggleQuickShow();
  });

  Mousetrap.bindGlobal('esc', () => {
    // hide quick jump to project if shown
    if ($('#quick-jump-container.show')) {
      toggleQuickShow();
    }
  });
}

// Project-related items
// must be in a project
function registerProjectShortcuts() {
  Mousetrap.bind('p h', () => {
    $('#main-menu a.overview').click();
  });

  Mousetrap.bind('p a', () => {
    $('#main-menu a[href*="/activity"]').click();
  });

  Mousetrap.bind('p i', () => {
    $('#main-menu a[href*="/issues"]').click();
  });

  Mousetrap.bind('p n', () => {
    $('#main-menu a[href*="/news"]').click();
  });

  Mousetrap.bind('p w', () => {
    $('#main-menu a[href*="/wiki"]').click();
  });

  Mousetrap.bind('p f', () => {
    $('#main-menu a[href*="/files"]').click();
  });

  Mousetrap.bind('p s', () => {
    $('#main-menu a[href*="/settings"]').click();
  });

  // new issue
  Mousetrap.bind('n i', () => {
    $('#main-menu a[href*="/issues/new"]').click();
  });
}

// Issue-related items
function registerIssueShortcuts() {
  // edit issue
  Mousetrap.bind('e', e => {
    e.preventDefault();
    $('.contextual a[href*="/edit"]').click();
  });

  // watch issue
  Mousetrap.bind('w', () => {
    $('.contextual a[href*="/watch"]').click();
  });

  // copy issue to new issue
  Mousetrap.bind('c', () => {
    $('.contextual a[href*="/copy"]').click();
  });

  // delete issue
  Mousetrap.bind('d', () => {
    $('.contextual a[data-method="delete"]').click();
  });
}

// Formatting/Editing Issues Shortcuts
function registerFormattingShortcuts() {
  // bold
  Mousetrap.bindGlobal('command+b', e => {
    if (isFormTextarea(e.target)) {
      insertStyleSnippet(e.target, '**');
    }
  });

  // underline
  Mousetrap.bindGlobal('command+u', e => {
    if (isFormTextarea(e.target)) {
      insertStyleSnippet(e.target, '++');
    }
  });

  // italics
  Mousetrap.bindGlobal('command+i', e => {
    if (isFormTextarea(e.target)) {
      insertStyleSnippet(e.target, '__');
    }
  });

  // external link
  Mousetrap.bindGlobal('command+k', e => {
    if (isFormTextarea(e.target)) {
      insertStyleSnippet(e.target, '[]()', -1);
    }
  });

  // inline code block
  Mousetrap.bindGlobal('command+shift+2', e => {
    if (isFormTextarea(e.target)) {
      insertStyleSnippet(e.target, '@@');
    }
  });

  // pre block
  Mousetrap.bindGlobal('command+shift+p', e => {
    if (isFormTextarea(e.target)) {
      insertStyleSnippet(e.target, '<pre></pre>');
    }
  });

  Mousetrap.bindGlobal('command+enter', () => {
    const inputs = document.querySelectorAll('form:not(#new-relation-form) input[name="commit"]');
    Array.from(inputs).forEach(el => {
      if (!isHidden(el)) {
        el.click();
      }
    });
  });

  Mousetrap.bindGlobal('command+shift+enter', () => {
    $('form input[name="continue"]').click();
  });
}

function insertStyleSnippet(el, snippet, positionShift = 0) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const text = el.value;
  const before = text.substring(0, start);
  const after = text.substring(end, text.length);
  const selectedText = window.getSelection().toString();
  const snippetCursorPosition = (snippet.length / 2) + positionShift;
  const snippetBeginning = snippet.substring(0, snippetCursorPosition);
  const snippetEnding = snippet.substring(snippetCursorPosition, snippet.length);

  el.value = (before + snippetBeginning + selectedText + snippetEnding + after);
  el.selectionStart = start + snippetBeginning.length;
  el.selectionEnd = end + snippetBeginning.length;
  el.focus();
}

function initQuickJump(projectList) {
  const quickJumpContainer = document.createElement('div');
  quickJumpContainer.id = 'quick-jump-container';

  // create title for quick jump popover
  const title = document.createElement('p');
  title.innerHTML = 'Go to Project:';
  quickJumpContainer.appendChild(title);

  Array.from(projectList).forEach((el, index) => {
    const projectLink = document.createElement('a');
    projectLink.id = `projectLink-${index}`;
    projectLink.href = el.value;
    projectLink.innerHTML = `<p><kbd>${index + 1}</kbd> ${el.innerHTML}</p>`;
    quickJumpContainer.appendChild(projectLink);

    // bind shortcuts for each project
    Mousetrap.bind((index + 1).toString(), () => {
      $(`#quick-jump-container.show #projectLink-${index}`).click();
    });
  });

  $('body').appendChild(quickJumpContainer);
}

function toggleQuickShow() {
  $('#quick-jump-container').classList.toggle('show');
}

document.addEventListener('DOMContentLoaded', () => {
  if (isRedmine()) {
    const basePath = $('#top-menu a.home').href;
    const isProject = /(project\-(\w+|\d+|\-)+)/.test($('body').className);
    const isIssue = /\/issues\/\d+$/.test(window.location.pathname.replace(/\/$/, ''));
    const isNewIssue = /\/issues\/new$/.test(window.location.pathname.replace(/\/$/, ''));
    const projectList = document.querySelectorAll('#project_quick_jump_box option[value*="/projects/"]');

    registerGlobalShortcuts(basePath);

    initQuickJump(projectList);

    if (isProject) {
      registerProjectShortcuts();
    }

    if (isIssue || isNewIssue) {
      registerIssueShortcuts();
    }

    registerFormattingShortcuts();
  }
});
