'use strict';
/* globals Mousetrap */
const $ = document.querySelector.bind(document);
const isRedmine = () => $('meta[content="Redmine"]') || $('a[href*="http://www.redmine.org/"]') || $('a[href*="http://www.redmine.org/guide"]');
const isProject = /\/projects\/\w+/.test(window.location.pathname);
const [, , currentProject] = window.location.pathname.split('/');
const isFormTextarea = target => target.type === 'textarea' && /wiki-edit/.test(target.className);

function registerShortcuts() {
  // Global navigation items
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

  // Project subnavigation
  Mousetrap.bind('p h', () => {
    if (isProject) {
      window.location.href = `/projects/${currentProject}`;
    }
  });

  Mousetrap.bind('p a', () => {
    if (isProject) {
      window.location.href = `/projects/${currentProject}/activity`;
    }
  });

  Mousetrap.bind('p i', () => {
    if (isProject) {
      window.location.href = `/projects/${currentProject}/issues`;
    }
  });

  Mousetrap.bind('p n', () => {
    if (isProject) {
      window.location.href = `/projects/${currentProject}/news`;
    }
  });

  Mousetrap.bind('p w', () => {
    if (isProject) {
      window.location.href = `/projects/${currentProject}/wiki`;
    }
  });

  Mousetrap.bind('p s', () => {
    if (isProject) {
      window.location.href = `/projects/${currentProject}/settings`;
    }
  });

  // Project actions
  Mousetrap.bind('n p', () => {
    window.location.href = `/projects/new`;
  });

  Mousetrap.bind('n i', () => {
    if (isProject) {
      window.location.href = `/projects/${currentProject}/issues/new`;
    }
  });

  // Formatting
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

function init() {
  registerShortcuts();
}

document.addEventListener('DOMContentLoaded', () => {
  if (isRedmine()) {
    init();
  }
});
