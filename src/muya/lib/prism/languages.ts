/** @format */

const languages = {
  markup: {
    title: 'Markup',
    alias: ['html', 'xml', 'svg', 'mathml'],
    aliasTitles: {
      html: 'HTML',
      xml: 'XML',
      svg: 'SVG',
      mathml: 'MathML',
    },
    option: 'default',
    ext: ['html'],
  },
  css: {
    title: 'CSS',
    option: 'default',
    peerDependencies: 'markup',
    ext: ['css'],
  },
  clike: {
    title: 'C-like',
    option: 'default',
    overrideExampleHeader: true,
    ext: ['c', 'h', 'ino'],
  },
  javascript: {
    title: 'JavaScript',
    require: 'clike',
    peerDependencies: 'markup',
    alias: 'js',
    option: 'default',
    ext: ['js'],
  },
  abap: {
    title: 'ABAP',
    ext: ['absp'],
  },
  abnf: {
    title: 'Augmented Backus–Naur form',
    ext: [],
  },
  actionscript: {
    title: 'ActionScript',
    require: 'javascript',
    peerDependencies: 'markup',
    ext: ['as'],
  },
  ada: {
    title: 'Ada',
    ext: [],
  },
  apacheconf: {
    title: 'Apache Configuration',
    ext: [],
  },
  apl: {
    title: 'APL',
    ext: ['dyalog', 'apl'],
  },
  applescript: {
    title: 'AppleScript',
    ext: [],
  },
  arduino: {
    title: 'Arduino',
    require: 'cpp',
    ext: [],
  },
  arff: {
    title: 'ARFF',
    ext: [],
  },
  asciidoc: {
    alias: 'adoc',
    title: 'AsciiDoc',
    ext: [],
  },
  asm6502: {
    title: '6502 Assembly',
    ext: [],
  },
  aspnet: {
    title: 'ASP.NET (C#)',
    require: ['markup', 'csharp'],
    ext: [],
  },
  autohotkey: {
    title: 'AutoHotkey',
    ext: [],
  },
  autoit: {
    title: 'AutoIt',
    ext: [],
  },
  bash: {
    title: 'Bash',
    alias: 'shell',
    aliasTitles: {
      shell: 'Shell',
    },
    ext: ['sh', 'ksh', 'bash'],
  },
  basic: {
    title: 'BASIC',
    ext: [],
  },
  batch: {
    title: 'Batch',
    ext: [],
  },
  bison: {
    title: 'Bison',
    require: 'c',
    ext: [],
  },
  bnf: {
    title: 'Backus–Naur form',
    alias: 'rbnf',
    aliasTitles: {
      rbnf: 'Routing Backus–Naur form',
    },
    ext: [],
  },
  brainfuck: {
    title: 'Brainfuck',
    ext: ['b', 'bf'],
  },
  bro: {
    title: 'Bro',
    ext: [],
  },
  c: {
    title: 'C',
    require: 'clike',
    ext: ['c', 'h', 'ino'],
  },
  csharp: {
    title: 'C#',
    require: 'clike',
    alias: 'dotnet',
    ext: ['cs'],
  },
  cpp: {
    title: 'C++',
    require: 'c',
    ext: ['cpp', 'c++', 'cc', 'cxx', 'hpp', 'h++', 'hh', 'hxx'],
  },
  cil: {
    title: 'CIL',
    ext: [],
  },
  coffeescript: {
    title: 'CoffeeScript',
    require: 'javascript',
    alias: 'coffee',
    ext: ['coffee'],
  },
  cmake: {
    title: 'CMake',
    ext: [],
  },
  clojure: {
    title: 'Clojure',
    ext: ['clj', 'cljc', 'cljx'],
  },
  crystal: {
    title: 'Crystal',
    require: 'ruby',
    ext: ['cr'],
  },
  csp: {
    title: 'Content-Security-Policy',
    ext: [],
  },
  'css-extras': {
    title: 'CSS Extras',
    require: 'css',
    ext: [],
  },
  d: {
    title: 'D',
    require: 'clike',
    ext: ['d'],
  },
  dart: {
    title: 'Dart',
    require: 'clike',
    ext: ['dart'],
  },
  diff: {
    title: 'Diff',
    ext: ['diff', 'patch'],
  },
  django: {
    title: 'Django/Jinja2',
    require: 'markup-templating',
    alias: 'jinja2',
    ext: [],
  },
  docker: {
    title: 'Docker',
    alias: 'dockerfile',
    ext: [],
  },
  ebnf: {
    title: 'Extended Backus–Naur form',
    ext: [],
  },
  eiffel: {
    title: 'Eiffel',
    ext: ['e'],
  },
  ejs: {
    title: 'EJS',
    require: ['javascript', 'markup-templating'],
    ext: [],
  },
  elixir: {
    title: 'Elixir',
    ext: [],
  },
  elm: {
    title: 'Elm',
    ext: ['elm'],
  },
  erb: {
    title: 'ERB',
    require: ['ruby', 'markup-templating'],
    ext: ['erb'],
  },
  erlang: {
    title: 'Erlang',
    ext: ['erl'],
  },
  fsharp: {
    title: 'F#',
    require: 'clike',
    ext: ['fs'],
  },
  flow: {
    title: 'Flow',
    require: 'javascript',
    ext: [],
  },
  fortran: {
    title: 'Fortran',
    ext: ['f', 'for', 'f77', 'f90'],
  },
  gcode: {
    title: 'G-code',
    ext: [],
  },
  gedcom: {
    title: 'GEDCOM',
    ext: [],
  },
  gherkin: {
    title: 'Gherkin',
    ext: ['feature'],
  },
  git: {
    title: 'Git',
    ext: [],
  },
  glsl: {
    title: 'GLSL',
    require: 'clike',
    ext: [],
  },
  gml: {
    title: 'GameMaker Language',
    alias: 'gamemakerlanguage',
    require: 'clike',
    ext: [],
  },
  go: {
    title: 'Go',
    require: 'clike',
    ext: ['go'],
  },
  graphql: {
    title: 'GraphQL',
    ext: [],
  },
  groovy: {
    title: 'Groovy',
    require: 'clike',
    ext: ['groovy', 'gradle'],
  },
  haml: {
    title: 'Haml',
    require: 'ruby',
    peerDependencies: ['css', 'coffeescript', 'erb', 'javascript', 'less', 'markdown', 'ruby', 'scss', 'textile'],
    ext: ['haml'],
  },
  handlebars: {
    title: 'Handlebars',
    require: 'markup-templating',
    ext: ['html', 'htm', 'handlebars', 'hbs'],
  },
  haskell: {
    title: 'Haskell',
    alias: 'hs',
    ext: ['hs'],
  },
  haxe: {
    title: 'Haxe',
    require: 'clike',
    ext: ['hx'],
  },
  hcl: {
    title: 'HCL',
    ext: [],
  },
  http: {
    title: 'HTTP',
    peerDependencies: ['javascript', 'markup'],
    ext: [],
  },
  hpkp: {
    title: 'HTTP Public-Key-Pins',
    ext: [],
  },
  hsts: {
    title: 'HTTP Strict-Transport-Security',
    ext: [],
  },
  ichigojam: {
    title: 'IchigoJam',
    ext: [],
  },
  icon: {
    title: 'Icon',
    ext: [],
  },
  inform7: {
    title: 'Inform 7',
    ext: [],
  },
  ini: {
    title: 'Ini',
    ext: ['properties', 'ini', 'in'],
  },
  io: {
    title: 'Io',
    ext: [],
  },
  j: {
    title: 'J',
    ext: [],
  },
  java: {
    title: 'Java',
    require: 'clike',
    ext: ['java'],
  },
  javadoc: {
    title: 'JavaDoc',
    require: ['markup', 'java', 'javadoclike'],
    peerDependencies: ['scala'],
    ext: [],
  },
  javadoclike: {
    title: 'JavaDoc-like',
    peerDependencies: ['java', 'javascript', 'php'],
    ext: [],
  },
  javastacktrace: {
    title: 'Java stack trace',
    ext: [],
  },
  jolie: {
    title: 'Jolie',
    require: 'clike',
    ext: [],
  },
  jsdoc: {
    title: 'JSDoc',
    require: ['javascript', 'javadoclike'],
    peerDependencies: ['actionscript', 'coffeescript'],
    ext: [],
  },
  'js-extras': {
    title: 'JS Extras',
    require: 'javascript',
    peerDependencies: ['actionscript', 'coffeescript', 'flow', 'n4js', 'typescript'],
    ext: [],
  },
  json: {
    title: 'JSON',
    ext: ['json', 'map'],
  },
  jsonp: {
    title: 'JSONP',
    require: 'json',
    ext: [],
  },
  json5: {
    title: 'JSON5',
    require: 'json',
    ext: [],
  },
  julia: {
    title: 'Julia',
    ext: ['jl'],
  },
  keyman: {
    title: 'Keyman',
    ext: [],
  },
  kotlin: {
    title: 'Kotlin',
    require: 'clike',
    ext: ['kt'],
  },
  latex: {
    title: 'LaTeX',
    alias: ['math'],
    ext: ['text', 'ltx', 'tex'],
  },
  less: {
    title: 'Less',
    require: 'css',
    ext: ['less'],
  },
  liquid: {
    title: 'Liquid',
    ext: [],
  },
  lisp: {
    title: 'Lisp',
    alias: ['emacs', 'elisp', 'emacs-lisp'],
    ext: ['cl', 'lisp', 'el'],
  },
  livescript: {
    title: 'LiveScript',
    ext: ['ls'],
  },
  lolcode: {
    title: 'LOLCODE',
    ext: [],
  },
  lua: {
    title: 'Lua',
    ext: ['lua'],
  },
  makefile: {
    title: 'Makefile',
    ext: [],
  },
  markdown: {
    title: 'Markdown',
    require: 'markup',
    alias: 'md',
    ext: ['markdown', 'md', 'mkd'],
  },
  'markup-templating': {
    title: 'Markup templating',
    require: 'markup',
    ext: [],
  },
  matlab: {
    title: 'MATLAB',
    ext: [],
  },
  mel: {
    title: 'MEL',
    ext: [],
  },
  mizar: {
    title: 'Mizar',
    ext: [],
  },
  monkey: {
    title: 'Monkey',
    ext: [],
  },
  n1ql: {
    title: 'N1QL',
    ext: [],
  },
  n4js: {
    title: 'N4JS',
    require: 'javascript',
    peerDependencies: ['jsdoc'],
    alias: 'n4jsd',
    ext: [],
  },
  'nand2tetris-hdl': {
    title: 'Nand To Tetris HDL',
    ext: [],
  },
  nasm: {
    title: 'NASM',
    ext: [],
  },
  nginx: {
    title: 'nginx',
    require: 'clike',
    ext: [],
  },
  nim: {
    title: 'Nim',
    ext: [],
  },
  nix: {
    title: 'Nix',
    ext: [],
  },
  nsis: {
    title: 'NSIS',
    ext: ['nsh', 'nsi'],
  },
  objectivec: {
    title: 'Objective-C',
    require: 'c',
    ext: ['m', 'mm'],
  },
  ocaml: {
    title: 'OCaml',
    ext: ['ml', 'mli', 'mll', 'mly'],
  },
  opencl: {
    title: 'OpenCL',
    require: 'cpp',
    peerDependencies: ['c', 'cpp'],
    overrideExampleHeader: true,
    ext: [],
  },
  oz: {
    title: 'Oz',
    ext: ['oz'],
  },
  parigp: {
    title: 'PARI/GP',
    ext: [],
  },
  parser: {
    title: 'Parser',
    require: 'markup',
    ext: [],
  },
  pascal: {
    title: 'Pascal',
    alias: 'objectpascal',
    aliasTitles: {
      objectpascal: 'Object Pascal',
    },
    ext: ['p', 'pas'],
  },
  perl: {
    title: 'Perl',
    ext: ['pl', 'pm'],
  },
  php: {
    title: 'PHP',
    require: ['clike', 'markup-templating'],
    ext: ['php', 'php3', 'php4', 'php5', 'php7', 'phtml'],
  },
  phpdoc: {
    title: 'PHPDoc',
    require: ['php', 'javadoclike'],
    ext: [],
  },
  'php-extras': {
    title: 'PHP Extras',
    require: 'php',
    ext: [],
  },
  plsql: {
    title: 'PL/SQL',
    require: 'sql',
    ext: ['pls'],
  },
  powershell: {
    title: 'PowerShell',
    ext: ['ps1', 'psd1', 'psm1'],
  },
  processing: {
    title: 'Processing',
    require: 'clike',
    ext: [],
  },
  prolog: {
    title: 'Prolog',
    ext: [],
  },
  properties: {
    title: '.properties',
    ext: ['properties', 'ini', 'in'],
  },
  protobuf: {
    title: 'Protocol Buffers',
    require: 'clike',
    ext: ['proto'],
  },
  pug: {
    title: 'Pug',
    require: ['markup', 'javascript'],
    peerDependencies: ['coffeescript', 'ejs', 'handlebars', 'less', 'livescript', 'markdown', 'scss', 'stylus', 'twig'],
    ext: ['jade', 'pug'],
  },
  puppet: {
    title: 'Puppet',
    ext: ['pp'],
  },
  pure: {
    title: 'Pure',
    peerDependencies: ['c', 'cpp', 'fortran'],
    ext: [],
  },
  python: {
    title: 'Python',
    alias: 'py',
    ext: ['pyx', 'pxd', 'pxi'],
  },
  q: {
    title: 'Q (kdb+ database)',
    ext: ['q'],
  },
  qore: {
    title: 'Qore',
    require: 'clike',
    ext: [],
  },
  r: {
    title: 'R',
    ext: ['r', 'R'],
  },
  jsx: {
    title: 'React JSX',
    require: ['markup', 'javascript'],
    peerDependencies: ['jsdoc', 'js-extras'],
    ext: ['jsx'],
  },
  tsx: {
    title: 'React TSX',
    require: ['jsx', 'typescript'],
    ext: ['tsx'],
  },
  renpy: {
    title: "Ren'py",
    ext: [],
  },
  reason: {
    title: 'Reason',
    require: 'clike',
    ext: [],
  },
  regex: {
    title: 'Regex',
    peerDependencies: ['actionscript', 'coffeescript', 'flow', 'javascript', 'typescript', 'vala'],
    ext: [],
  },
  rest: {
    title: 'reST (reStructuredText)',
    ext: [],
  },
  rip: {
    title: 'Rip',
    ext: [],
  },
  roboconf: {
    title: 'Roboconf',
    ext: [],
  },
  ruby: {
    title: 'Ruby',
    require: 'clike',
    alias: 'rb',
    ext: ['rb'],
  },
  rust: {
    title: 'Rust',
    ext: ['rs'],
  },
  sas: {
    title: 'SAS',
    ext: ['sas'],
  },
  sass: {
    title: 'Sass (Sass)',
    require: 'css',
    ext: ['sass'],
  },
  scss: {
    title: 'Sass (Scss)',
    require: 'css',
    ext: ['scss'],
  },
  scala: {
    title: 'Scala',
    require: 'java',
    ext: ['scala'],
  },
  scheme: {
    title: 'Scheme',
    ext: ['scm', 'ss'],
  },
  smalltalk: {
    title: 'Smalltalk',
    ext: ['st'],
  },
  smarty: {
    title: 'Smarty',
    require: 'markup-templating',
    ext: ['tpl'],
  },
  sparql: {
    title: 'SPARQL',
    require: 'turtle',
    ext: [],
  },
  sql: {
    title: 'SQL',
    ext: ['cql'],
  },
  soy: {
    title: 'Soy (Closure Template)',
    require: 'markup-templating',
    ext: ['soy'],
  },
  stylus: {
    title: 'Stylus',
    ext: ['styl'],
  },
  swift: {
    title: 'Swift',
    require: 'clike',
    ext: ['swift'],
  },
  tap: {
    title: 'TAP',
    require: 'yaml',
    ext: [],
  },
  tcl: {
    title: 'Tcl',
    ext: ['tcl'],
  },
  textile: {
    title: 'Textile',
    require: 'markup',
    peerDependencies: 'css',
    ext: ['textile'],
  },
  toml: {
    title: 'TOML',
    ext: [],
  },
  tt2: {
    title: 'Template Toolkit 2',
    require: ['clike', 'markup-templating'],
    ext: [],
  },
  turtle: {
    title: 'Turtle',
    ext: [],
  },
  twig: {
    title: 'Twig',
    require: 'markup',
    ext: [],
  },
  typescript: {
    title: 'TypeScript',
    require: 'javascript',
    alias: 'ts',
    ext: ['ts'],
  },
  't4-cs': {
    title: 'T4 Text Templates (C#)',
    require: ['t4-templating', 'csharp'],
    alias: 't4',
    ext: [],
  },
  't4-vb': {
    title: 'T4 Text Templates (VB)',
    require: ['t4-templating', 'visual-basic'],
    ext: [],
  },
  't4-templating': {
    title: 'T4 templating',
    ext: [],
  },
  vala: {
    title: 'Vala',
    require: 'clike',
    ext: [],
  },
  vbnet: {
    title: 'VB.Net',
    require: 'basic',
    ext: ['vb'],
  },
  velocity: {
    title: 'Velocity',
    require: 'markup',
    ext: ['vtl'],
  },
  verilog: {
    title: 'Verilog',
    ext: ['v', 'sv', 'svh'],
  },
  vhdl: {
    title: 'VHDL',
    ext: ['vhd', 'vhdl'],
  },
  vim: {
    title: 'vim',
    ext: [],
  },
  'visual-basic': {
    title: 'Visual Basic',
    alias: 'vb',
    ext: [],
  },
  wasm: {
    title: 'WebAssembly',
    ext: [],
  },
  wiki: {
    title: 'Wiki markup',
    require: 'markup',
    ext: [],
  },
  xeora: {
    title: 'Xeora',
    require: 'markup',
    alias: 'xeoracube',
    aliasTitles: {
      xeoracube: 'XeoraCube',
    },
    ext: [],
  },
  xojo: {
    title: 'Xojo (REALbasic)',
    ext: [],
  },
  xquery: {
    title: 'XQuery',
    require: 'markup',
    ext: ['xy', 'xquery'],
  },
  yaml: {
    title: 'YAML',
    alias: 'yml',
    ext: ['yaml', 'yml'],
  },
}

const languageMaps: Record<
  string,
  {
    title: string
    alias?: Array<string> | string
    aliasTitles?: Record<string, string>
    option?: string
    ext: Array<string>
    require?: string | Array<string>
    peerDependencies?: string | Array<string>
  }
> = languages

export default languageMaps
