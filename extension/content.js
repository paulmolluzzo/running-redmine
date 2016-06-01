'use strict';
/* globals Mousetrap */
const $ = document.querySelector.bind(document);
const isRedmine = () => $('meta[content="Redmine"]') || $('a[href*="http://www.redmine.org/"]') || $('a[href*="http://www.redmine.org/guide"]');
const isFormTextarea = target => target.type === 'textarea' && /wiki-edit/.test(target.className);

// Global navigation items
// can work from anywhere in Redmine
function registerGlobalShortcuts() {
  Mousetrap.bind('g h', () => {
    window.location.href = '/';
  });

  Mousetrap.bind('g m', () => {
    window.location.href = '/my/page';
  });

  Mousetrap.bind('g p', () => {
    window.location.href = '/projects';
  });

  Mousetrap.bind('g e', () => {
    window.location.href = '/people';
  });

  Mousetrap.bind('g a', () => {
    window.location.href = '/admin';
  });

  Mousetrap.bind('g /', () => {
    window.location.href = 'http://www.redmine.org/guide';
  });

  Mousetrap.bind('g i', () => {
    window.location.href = '/issues';
  });

  // focus on search
  Mousetrap.bind('/', e => {
    $('form[action*="/search"] input[type="text"]').focus();
    e.preventDefault();
  });

  // create new project
  Mousetrap.bind('n p', () => {
    window.location.href = `/projects/new`;
  });
}

// Project-related items
// must be in a project
function registerProjectShortcuts(currentProject) {
  Mousetrap.bind('p h', () => {
    window.location.href = `/projects/${currentProject}`;
  });

  Mousetrap.bind('p a', () => {
    window.location.href = `/projects/${currentProject}/activity`;
  });

  Mousetrap.bind('p i', () => {
    window.location.href = `/projects/${currentProject}/issues`;
  });

  Mousetrap.bind('p n', () => {
    window.location.href = `/projects/${currentProject}/news`;
  });

  Mousetrap.bind('p w', () => {
    window.location.href = `/projects/${currentProject}/wiki`;
  });

  Mousetrap.bind('p s', () => {
    window.location.href = `/projects/${currentProject}/settings`;
  });

  // new issue
  Mousetrap.bind('n i', () => {
    window.location.href = `/projects/${currentProject}/issues/new`;
  });
}

// Issue-related items
function registerIssueShortcuts() {
  // edit issue
  Mousetrap.bind('e', () => {
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

  // pre block
  Mousetrap.bindGlobal('command+shift+p', e => {
    if (isFormTextarea(e.target)) {
      insertStyleSnippet(e.target, '<pre></pre>');
    }
  });

  Mousetrap.bindGlobal('command+enter', () => {
    $('form input[name="commit"]').click();
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

document.addEventListener('DOMContentLoaded', () => {
  if (isRedmine()) {
    const isProject = /(project\-(\w+|\d+|\-)+)/.test($('body').className);
    const isIssue = /\/issues\/\d+$/.test(window.location.pathname.replace(/\/$/, ''));
    const isNewIssue = /\/issues\/new$/.test(window.location.pathname.replace(/\/$/, ''));

    registerGlobalShortcuts();

    if (isProject) {
      const projectName = /(project\-(\w+|\d+|\-)+)/.exec($('body').className)[0].split('project-')[1];
      registerProjectShortcuts(projectName);
    }

    if (isIssue || isNewIssue) {
      registerIssueShortcuts();
    }

    registerFormattingShortcuts();
  }
});
