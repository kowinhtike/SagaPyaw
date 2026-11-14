// src/data/tables.json
var tables_default = {
  NUMBER_LITERALS: {
    lakh: "\u101E\u102D\u1014\u103A\u1038",
    decimal: " \u1012\u101E\u1019 ",
    percent: " \u101B\u102C\u1001\u102D\u102F\u1004\u103A\u1014\u103E\u102F\u1014\u103A\u1038",
    kyat: " \u1000\u103B\u1015\u103A"
  },
  constants: {
    KINZI: "\u1004\u103A\u1039",
    INDEP_TO_A: [
      [
        "\u1023",
        "\u1021\u102D"
      ],
      [
        "\u1024",
        "\u1021\u102E"
      ],
      [
        "\u1025",
        "\u1021\u102F"
      ],
      [
        "\u1026",
        "\u1021\u1030"
      ],
      [
        "\u1027",
        "\u1021\u1031"
      ],
      [
        "\u1029",
        "\u1021\u1031\u102C"
      ],
      [
        "\u102A",
        "\u1021\u1031\u102C\u103A"
      ]
    ],
    CONS: "\u1000-\u1021",
    INDEP: "\u1023-\u1027\u1029\u102A",
    ASAT: "\u103A",
    F_K: "\u1000\u1002",
    F_S: "\u1005\u1007",
    F_T: "\u1010\u1012\u1015\u1017\u100B\u100D\u101E",
    F_N: "\u1014\u1019\u100F",
    F_NG: "\u1004",
    F_NY: "\u1009",
    VOWEL_OR_FINAL: "\u102B\u102C\u102D\u102E\u102F\u1030\u1031\u1032\u1036\u1037\u1038\u103A",
    TONES: [
      "\u02C0",
      "\u02E5",
      "\u02E6",
      "\u02E7",
      "\u02E8",
      "\u02E9"
    ],
    MIDSYL: "\u102B\u102C\u102D\u102E\u102F\u1030\u1031\u1032\u1036\u1037\u1038\u103A\u103B\u103C\u103D\u103E",
    MEDIAL_CHARS: "\u102B\u102C\u102D\u102E\u102F\u1030\u1031\u1032\u1036\u1037\u1038\u103A\u103B\u103C\u103D\u103E\uE001",
    VOWEL_ORDER: "\u1031\u102D\u102E\u102F\u1030\u102C\u1032",
    NORMALIZE_OPS: [
      {
        op: "replace",
        from: "\u200B",
        to: ""
      },
      {
        op: "replace",
        from: "\uFEFF",
        to: ""
      },
      {
        op: "replace",
        from: "\u1037\u103A",
        to: "\u103A\u1037"
      },
      {
        op: "replace",
        from: "\u101E\u103C\u1031\u102C\u103A",
        to: "\u102A"
      },
      {
        op: "replace",
        from: "\u101E\u103C",
        to: "\u1029"
      },
      {
        op: "indep"
      },
      {
        op: "replace",
        from: "\u1004\u103A\u1039",
        to: "\u1004\u103A"
      },
      {
        op: "stack"
      },
      {
        op: "replace",
        from: "\u103F",
        to: "\u101E\u103A\u101E"
      },
      {
        op: "replace",
        from: "\u104E\u1004\u103A\u1038",
        to: "\u101C\u100A\u103A\u1038\u1000\u1031\u102C\u1004\u103A\u1038"
      },
      {
        op: "replace",
        from: "\u104C",
        to: "\u1014\u103E\u102D\u102F\u1000\u103A"
      },
      {
        op: "replace",
        from: "\u104D",
        to: "\u101B\u103D\u1031\u1037"
      },
      {
        op: "replace",
        from: "\u104F",
        to: "\u1021\u102D"
      }
    ],
    E001_REPLACEMENTS: [
      "\u1031\u102C\u103A",
      "\u1031\u102B\u103A"
    ],
    E001: "\uE001",
    PARSE_SYLLABLE_PATTERN: "^([\u1000-\u1021])([\u103B\u103C\u103D\u103E]*)([\u102B\u102C\u102D\u102E\u102F\u1030\u1031\u1032]*)(?:([\u1000-\u1021])\u103A)?(\u1036?)(\u1037?)(\u1038?)(\u1037?)$"
  },
  ONSET: {
    \u1000: "k",
    \u1001: "k\u02B0",
    \u1002: "g",
    \u1003: "g",
    \u1004: "\u014B",
    \u1005: "s",
    \u1006: "s\u02B0",
    \u1007: "z",
    \u1008: "z",
    \u100A: "\u0272",
    \u1009: "\u0272",
    \u100B: "t",
    \u100C: "t\u02B0",
    \u100D: "d",
    \u100E: "d",
    \u100F: "n",
    \u1010: "t",
    \u1011: "t\u02B0",
    \u1012: "d",
    \u1013: "d",
    \u1014: "n",
    \u1015: "p",
    \u1016: "p\u02B0",
    \u1017: "b",
    \u1018: "b",
    \u1019: "m",
    \u101A: "j",
    \u101B: "j",
    \u101C: "l",
    \u101D: "w",
    \u101E: "\u03B8",
    \u101F: "h",
    \u1020: "l",
    \u1021: "\u0294"
  },
  VELAR_PAL: {
    k: "t\u0255",
    k\u02B0: "t\u0255\u02B0",
    g: "d\u0291"
  },
  ASPIRATE: {
    m: "m\u0325",
    n: "n\u0325",
    \u0272: "\u0272\u0325",
    \u014B: "\u014B\u030A",
    l: "l\u0325",
    j: "\u0283",
    w: "w\u0325"
  },
  INDEP_SYL: {
    \u1023: [
      "\u0294",
      "i",
      "\u02C0"
    ],
    \u1024: [
      "\u0294",
      "i",
      "\u02E7"
    ],
    \u1025: [
      "\u0294",
      "u",
      "\u02C0"
    ],
    \u1026: [
      "\u0294",
      "u",
      "\u02E7"
    ],
    \u1027: [
      "\u0294",
      "e",
      "\u02E7"
    ],
    \u1029: [
      "\u0294",
      "\u0254",
      "\u02E5"
    ],
    \u102A: [
      "\u0294",
      "\u0254",
      "\u02E7"
    ]
  },
  V: {
    "": [
      "a",
      "\u02C0"
    ],
    "\u102C": [
      "a",
      "\u02E7"
    ],
    "\u102D": [
      "i",
      "\u02C0"
    ],
    "\u102E": [
      "i",
      "\u02E7"
    ],
    "\u102F": [
      "u",
      "\u02C0"
    ],
    "\u1030": [
      "u",
      "\u02E7"
    ],
    "\u1031": [
      "e",
      "\u02E7"
    ],
    "\u1032": [
      "\u025B",
      "\u02E5"
    ],
    "\u1031\u102C": [
      "\u0254",
      "\u02E5"
    ],
    "\u102D\u102F": [
      "o",
      "\u02E7"
    ]
  },
  RHYME_CLOSED: [
    [
      "",
      "F_K",
      "\u025B\u0294"
    ],
    [
      "",
      "F_S",
      "\u026A\u0294"
    ],
    [
      "",
      "F_T",
      "a\u0294"
    ],
    [
      "\u102D",
      "F_T",
      "e\u026A\u0294"
    ],
    [
      "\u102F",
      "F_T",
      "o\u028A\u0294"
    ],
    [
      "\u103D",
      "F_T",
      "\u028A\u0294"
    ],
    [
      "\u102D\u102F",
      "F_K",
      "a\u026A\u0294"
    ],
    [
      "\u1031\u102C",
      "F_K",
      "a\u028A\u0294"
    ],
    [
      "\u103D",
      "F_S",
      "\u026A\u0294"
    ],
    [
      "\u102D",
      "F_S",
      "\u026A\u0294"
    ],
    [
      "\u102F",
      "F_S",
      "\u028A\u0294"
    ],
    [
      "",
      "F_NG",
      "\u026A\u0274"
    ],
    [
      "",
      "F_NY",
      "\u026A\u0274"
    ],
    [
      "",
      "F_N",
      "a\u0274"
    ],
    [
      "\u102C",
      "F_T",
      "a\u0294"
    ],
    [
      "\u102C",
      "F_N",
      "a\u0274"
    ],
    [
      "\u1031",
      "F_T",
      "\u026A\u0294"
    ],
    [
      "\u102F",
      "F_K",
      "o\u028A\u0294"
    ],
    [
      "\u102C",
      "F_NY",
      "\u026A\u0274"
    ],
    [
      "\u102D",
      "F_K",
      "e\u026A\u0294"
    ],
    [
      "\u102D",
      "F_NG",
      "e\u026A\u0274"
    ],
    [
      "\u102D\u102F",
      "F_N",
      "a\u026A\u0274"
    ],
    [
      "\u102D",
      "F_N",
      "e\u026A\u0274"
    ],
    [
      "\u102F",
      "F_N",
      "o\u028A\u0274"
    ],
    [
      "\u103D",
      "F_N",
      "\u028A\u0274"
    ],
    [
      "\u102D\u102F",
      "F_NG",
      "a\u026A\u0274"
    ],
    [
      "\u1031\u102C",
      "F_NG",
      "a\u028A\u0274"
    ]
  ],
  PUNCT: {
    "\u104A": ",",
    "\u104B": ".",
    ",": ",",
    ".": ".",
    "?": "?",
    "!": "!",
    " ": " "
  },
  VOICE_MAP: {
    k: "g",
    k\u02B0: "g",
    s: "z",
    s\u02B0: "z",
    t: "d",
    t\u02B0: "d",
    p: "b",
    p\u02B0: "b",
    t\u0255: "d\u0291",
    t\u0255\u02B0: "d\u0291",
    \u03B8: "\xF0"
  },
  CLASSIFIERS: [
    "\u1000\u1031\u102C\u1004\u103A",
    "\u1000\u103C\u102D\u1019\u103A",
    "\u1001\u1014\u103A\u1038",
    "\u1001\u102B",
    "\u1001\u102F",
    "\u1001\u1031\u102B\u1000\u103A",
    "\u1001\u103B\u1000\u103A",
    "\u1001\u103B\u1031\u102C\u1004\u103A",
    "\u1001\u103B\u1031\u102C\u1004\u103A\u1038",
    "\u1001\u103D\u1014\u103A\u1038",
    "\u1005\u102E\u1038",
    "\u1005\u102F",
    "\u1005\u1031\u102C\u1004\u103A",
    "\u1006\u1030",
    "\u1010\u1014\u103A\u1038",
    "\u1011\u100A\u103A",
    "\u1014\u102C\u101B\u102E",
    "\u1014\u1031\u1037",
    "\u1014\u103E\u1005\u103A",
    "\u1015\u1004\u103A",
    "\u1015\u1010\u103A",
    "\u1015\u102B\u1038",
    "\u1015\u102F\u1012\u103A",
    "\u1016\u1000\u103A",
    "\u1019\u102D\u1014\u1005\u103A",
    "\u1019\u103B\u102D\u102F\u1038",
    "\u101A\u1031\u102C\u1000\u103A",
    "\u101B\u1000\u103A",
    "\u101B\u103D\u1000\u103A",
    "\u101C",
    "\u101C\u1000\u103A",
    "\u101C\u102F\u1036\u1038",
    "\u101C\u103E\u1019\u103A\u1038",
    "\u101D\u102D\u102F\u1004\u103A\u1038",
    "\u101E\u103B\u103E\u1030\u1038",
    "\u1021\u102F\u1015\u103A",
    "\u1026\u1038"
  ],
  CHAR: {
    k: "k",
    g: "\u0261",
    \u014B: "\u014B",
    s: "s",
    z: "z",
    \u0272: "\u0272",
    t: "t",
    d: "d",
    n: "n",
    p: "p",
    b: "b",
    m: "m",
    j: "j",
    r: "r",
    l: "l",
    w: "w",
    \u03B8: "\u03B8",
    \u00F0: "\xF0",
    h: "h",
    \u0294: "\u0294",
    \u0283: "\u0283",
    f: "f",
    k\u02B0: "k\u02B0",
    s\u02B0: "s\u02B0",
    t\u02B0: "t\u02B0",
    p\u02B0: "p\u02B0",
    t\u0255: "\u02A7",
    t\u0255\u02B0: "\u02A7\u02B0",
    d\u0291: "\u02A4",
    m\u0325: "\u02B0m",
    n\u0325: "\u02B0n",
    \u0272\u0325: "\u02B0\u0272",
    \u014B\u030A: "\u02B0\u014B",
    l\u0325: "\u02B0l",
    w\u0325: "w",
    a: "a",
    i: "i",
    u: "u",
    e: "e",
    \u025B: "\u025B",
    \u0254: "\u0254",
    o: "o",
    \u0259: "\u0259",
    \u0274: "\u0274",
    \u0294fin: "\u0294",
    e\u026A: "A",
    o\u028A: "O",
    a\u026A: "I",
    a\u028A: "W",
    "\u02E7": "\u2192",
    "\u02E5": "\u2197",
    \u02C0: "\u2193"
  },
  RHYME_SPLIT: {
    \u026A\u0274: [
      "i",
      "\u0274"
    ],
    a\u0274: [
      "a",
      "\u0274"
    ],
    e\u026A\u0274: [
      "A",
      "\u0274"
    ],
    o\u028A\u0274: [
      "O",
      "\u0274"
    ],
    \u028A\u0274: [
      "u",
      "\u0274"
    ],
    a\u026A\u0274: [
      "I",
      "\u0274"
    ],
    a\u028A\u0274: [
      "W",
      "\u0274"
    ],
    \u026A\u0294: [
      "i",
      "\u0294"
    ],
    \u028A\u0294: [
      "u",
      "\u0294"
    ],
    a\u0294: [
      "a",
      "\u0294"
    ],
    \u025B\u0294: [
      "\u025B",
      "\u0294"
    ],
    e\u026A\u0294: [
      "A",
      "\u0294"
    ],
    o\u028A\u0294: [
      "O",
      "\u0294"
    ],
    a\u026A\u0294: [
      "I",
      "\u0294"
    ],
    a\u028A\u0294: [
      "W",
      "\u0294"
    ],
    a: [
      "a"
    ],
    i: [
      "i"
    ],
    u: [
      "u"
    ],
    e: [
      "e"
    ],
    \u025B: [
      "\u025B"
    ],
    \u0254: [
      "\u0254"
    ],
    o: [
      "o"
    ],
    \u0259: [
      "\u0259"
    ]
  },
  NAME_MAP: {
    ma: "ma\u2192",
    daw: "d\u0254\u2192",
    ko: "ko\u2192",
    u: "\u0294u\u2197",
    tin: "ti\u0274\u2192",
    shwe: "\u0283we\u2192",
    aung: "\u0294a\u028A\u0274\u2192",
    kyaw: "\u02A7\u0254\u2192",
    zaw: "z\u0254\u2192",
    hla: "\u02B0la\u2192",
    htet: "t\u02B0\u025B\u0294",
    naing: "na\u026A\u0274\u2192",
    thu: "\u03B8u\u2192",
    moe: "mo\u2197",
    myat: "mja\u0294",
    min: "mi\u0274\u2192",
    nyunt: "\u0272\u028A\u0274\u2193",
    khin: "k\u02B0i\u0274\u2192",
    mya: "mja\u2197",
    hnin: "\u02B0ni\u0274\u2192",
    su: "su\u2192",
    phyo: "p\u02B0jo\u2197",
    htun: "t\u02B0\u028A\u0274\u2192",
    tun: "t\u028A\u0274\u2192",
    oo: "\u0294u\u2197",
    zin: "zi\u0274\u2192",
    thet: "\u03B8\u025B\u0294",
    nay: "ne\u2192",
    lin: "li\u0274\u2192",
    kaung: "ka\u028A\u0274\u2192",
    shein: "\u0283e\u026A\u0274\u2192",
    hein: "he\u026A\u0274\u2192",
    myo: "mjo\u2197",
    thant: "\u03B8a\u0274\u2193",
    san: "sa\u0274\u2197",
    win: "w\u026A\u0274\u2192",
    may: "me\u2192",
    soe: "so\u2197",
    ye: "j\u025B\u2197",
    wai: "we\u2192",
    thida: "\u03B8i\u2192 d\u0259 \u0261a\u2192"
  },
  AMBIG: [
    "ma",
    "may",
    "san",
    "so",
    "soe",
    "tin",
    "u",
    "win",
    "ye"
  ],
  DIGITS: [
    "\u101E\u102F\u100A",
    "\u1010\u1005\u103A",
    "\u1014\u103E\u1005\u103A",
    "\u101E\u102F\u1036\u1038",
    "\u101C\u1031\u1038",
    "\u1004\u102B\u1038",
    "\u1001\u103C\u1031\u102C\u1000\u103A",
    "\u1001\u102F\u1014\u1005\u103A",
    "\u101B\u103E\u1005\u103A",
    "\u1000\u102D\u102F\u1038"
  ],
  PLACES: {
    "1": "\u1006\u101A\u103A",
    "2": "\u101B\u102C",
    "3": "\u1011\u1031\u102C\u1004\u103A",
    "4": "\u101E\u1031\u102C\u1004\u103A\u1038"
  },
  CREAKY: {
    "\u1006\u101A\u103A": "\u1006\u101A\u1037\u103A",
    \u101B\u102C: "\u101B\u102C\u1037",
    "\u1011\u1031\u102C\u1004\u103A": "\u1011\u1031\u102C\u1004\u1037\u103A"
  }
};

// src/data/lexicon_exceptions.tsv
var lexicon_exceptions_default = "\u1000\u103B\u103D\u1014\u103A\u102F\u1015\u103A	t\u0255-\u0259 n-o\u028A\u0294\r\n\u101A\u1031\u102C\u1000\u103A\u103B\u102C\u1038	j-a\u028A\u0294 t\u0255-a-\u02E5\r\n\u1015\u100A\u102C	p-j-\u026A\u0274-\u02E7 \u0272-a-\u02E7\r\n\u1010\u101B\u102F\u1010\u103A	t-\u0259 j-o\u028A\u0294\r\n\u1019\u101C\u1031\u1038\u101B\u103E\u102C\u1038	m-\u0259 l-e-\u02E5 \u0283-a-\u02E5\r\n\u101E\u1004\u103A\u1039\u1018\u1031\u102C	\u03B8-\u026A\u0274-\u02E5 b-\u0254-\u02E5\r\n\u1021\u1004\u103A\u1039\u1000\u103B\u102E	\u0294-e\u026A\u0274-\u02E5 d\u0291-i-\u02E7\r\n\u101B\u1031\u1001\u1032	j-e-\u02E7 g-\u025B-\u02E5\r\n\u1021\u101B\u100A\u103A	\u0294-a-\u02C0 j-e-\u02E7\r\n\u1015\u103C\u103F\u1014\u102C	p-j-a\u0294 \u03B8-\u0259 n-a-\u02E7\r\n\u1019\u1010\u1004\u103A\u1005\u1014\u103A\u1038	m-\u025B\u0294 t-\u026A\u0274-\u02E7 s-a\u0274-\u02E5\r\n\u1019\u1010\u1004\u103A\u100A\u103D\u1014\u1037\u103A	m-\u025B\u0294 t-\u026A\u0274-\u02E7 \u0272-\u028A\u0274-\u02C0\r\n\u1019\u1031\u1038\u101C\u103A	m-e-\u02E5\r\n\u1006\u1031\u102C\u1037\u1016\u103A	s-\u0254-\u02C0\r\n\u101D\u1032\u101C\u103A	w-\u025B-\u02E5\r\n\u1015\u102D\u102F\u1037\u1005\u103A	p-o\u028A-\u02C0\r\n\u101D\u1000\u103A\u1018\u103A	w-\u025B\u0294\r\n\u1019\u1004\u103A\u1039\u1002\u101C\u102C	m-\u026A\u0274-\u02E7 g-\u0259 l-a-\u02E7\r\n\u1019\u101C\u1031\u1038	m-a-\u02E7 l-e-\u02E5\r\n\u1019\u1000\u103C\u102E\u1038	m-a-\u02E7 d\u0291-i-\u02E5\r\n\u1019\u1019\u1000\u103C\u102E\u1038	m-a-\u02C0 m-a-\u02C0 d\u0291-i-\u02E5\r\n\u1019\u1019	m-a-\u02C0 m-a-\u02C0\r\n\u1010\u1036\u1010\u102C\u1038	t-\u0259 d-a-\u02E5\r\n\u1001\u103B\u1031\u102C\u1000\u101C\u1000\u103A	t\u0255\u02B0-\u0254-\u02E7 k-\u0259 l-\u025B\u0294\r\n\u1000\u101C\u1031\u1038	k-\u0259 l-e-\u02E5\r\n\u1019\u100A\u103A\u1038	m-\u025B-\u02E5\r\n\u101E\u100A\u103A\u1038	\u03B8-\u025B-\u02E5\r\n\u101C\u100A\u103A\u1038	l-\u025B-\u02E5\r\n\u1006\u100A\u103A\u1038\u101C\u100A\u103A\u1038	s\u02B0-\u025B-\u02E5 l-\u025B-\u02E5\r\n\u101B\u100A\u103A	j-e-\u02E7\r\n\u1012\u102F\u1000\u1039\u1001	d-o\u028A\u0294 k\u02B0-a-\u02E7\r\n\u1014\u102C\u1019\u100A\u103A	n-a-\u02E7 m-e-\u02E7\r\n\u101C\u100A\u103A	l-e-\u02E7\r\n\u101B\u100A\u103A\u1038\u1005\u102C\u1038	j-i-\u02E5 z-a-\u02E5\r\n\u1019\u103C\u103D\u1031	m-w-e-\u02E7\r\n\u1018\u102F\u101B\u102C\u1038	p\u02B0-\u0259 j-a-\u02E5\r\n\u1021\u1005\u103A\u1000\u102D\u102F	\u0294-\u0259 k-o-\u02E7\r\n\u101C\u100A\u103A\u1038\u1000\u1031\u102C\u1004\u103A\u1038	l-\u0259 g-a\u028A\u0274-\u02E5\r\n\u1015\u101B\u102D\u101E\u1010\u103A	p-\u0259 j-e\u026A\u0294 \u03B8-a\u0294\r\n\u1005\u1000\u102C\u1038	s-\u0259 g-a-\u02E5\r\n\u1005\u100A\u103A\u1038	s-i-\u02E5\r\n\u1005\u100A\u103A	s-i-\u02E7\r\n\u1015\u103C\u100A\u103A	p-j-i-\u02E7\r\n\u1000\u103C\u100A\u1037\u103A	t\u0255-i-\u02C0\r\n\u1000\u103C\u100A\u103A	t\u0255-i-\u02E7\r\n\u1019\u103C\u100A\u103A	m-j-i-\u02E7\r\n\u1010\u100A\u103A	t-i-\u02E7\r\n\u1015\u103C\u100A\u1037\u103A	p-j-i-\u02C0\r\n\u1001\u103B\u100A\u103A	t\u0255\u02B0-i-\u02E7\r\n\u1001\u103C\u100A\u103A	t\u0255\u02B0-i-\u02E7\r\n\u1021\u1019\u100A\u103A	\u0294-\u0259 m-j-i-\u02E7\r\n\u1005\u100A\u103A\u1038\u1000\u1019\u103A\u1038	s-i-\u02E5 g-a\u0274-\u02E5\r\n\u1010\u1036\u1001\u102B\u1038	t-\u0259 g-a-\u02E5\r\n\u1010\u1036\u1006\u102D\u1015\u103A	t-\u0259 z-e\u026A\u0294\r\n\u1010\u1036\u1011\u103D\u1031\u1038	t-\u0259 t\u02B0-w-e-\u02E5\r\n\u1001\u102F\u1014\u1005\u103A	k\u02B0-\u0259 n-\u026A\u0294\r\n\u101E\u1030\u1001\u102D\u102F\u1038	\u03B8-\u0259 k\u02B0-o-\u02E5\r\n\u101E\u1030\u1004\u101A\u103A\u1001\u103B\u1004\u103A\u1038	\u03B8-\u0259 \u014B-\u025B-\u02E7 d\u0291-\u026A\u0274-\u02E5\r\n\u101E\u1030\u1014\u102C\u1015\u103C\u102F	\u03B8-\u0259 n-a-\u02E7 p-j-u-\u02C0\r\n\u1010\u1000\u1030\u1038\u1010\u1000	t-\u0259 g-u-\u02E5 d-\u0259 g-a-\u02C0\r\n\u101E\u1030\u100C\u1031\u1038	\u03B8-\u0259 t\u02B0-e-\u02E5\r\n\u101E\u1030\u1010\u1031\u102C\u1004\u103A\u1038\u1005\u102C\u1038	\u03B8-\u0259 d-a\u028A\u0274-\u02E5 z-a-\u02E5\r\n\u101E\u1030\u1015\u102F\u1014\u103A	\u03B8-\u0259 b-o\u028A\u0274-\u02E7\r\n\u101E\u1030\u101B\u1032	\u03B8-\u0259 j-\u025B-\u02E5\r\n\u101E\u1030\u101C\u103B\u103E\u102D\u102F	\u03B8-\u0259 \u0283-o-\u02C0\r\n\u101E\u1030\u1005\u102D\u1019\u103A\u1038	\u03B8-\u0259 z-e\u026A\u0274-\u02E5\r\n\u1001\u1032\u101C\u102F\u1036\u1038	g-\u025B-\u02E5 l-o\u028A\u0274-\u02E5\r\n\u101E\u1010\u1039\u1010\u101D\u102B	\u03B8-a\u0294 d-\u0259 w-a-\u02E7\r\n\u1004\u102B\u1038\u1001\u103C\u1031\u102C\u1000\u103A	\u014B-\u0259 t\u0255\u02B0-a\u028A\u0294\r\n\u1004\u102B\u1038\u101B\u1036\u1037	\u014B-\u0259 j-a\u0274-\u02C0\r\n\u1004\u102B\u1038\u101B\u103E\u1009\u1037\u103A	\u014B-\u0259 \u0283-\u026A\u0274-\u02C0\r\n\u1004\u102B\u1038\u1015\u102D	\u014B-\u0259 p-i-\u02E7\r\n\u1000\u103B\u103D\u1014\u103A\u1019	t\u0255-\u0259 m-a-\u02C0\r\n\u1000\u103B\u103D\u1014\u103A\u1010\u1031\u102C\u103A	t\u0255-\u0259 n-\u0254-\u02E7\r\n\u1000\u103B\u103D\u1014\u103A\u1010\u1031\u102C\u1037\u103A	t\u0255-\u0259 n-\u0254-\u02C0\r\n\u1015\u101C\u1000\u103A\u1016\u1031\u102C\u1004\u103A\u1038	p-l-\u025B\u0294 f-a\u028A\u0274-\u02E5\r\n\u1015\u101C\u1010\u103A\u1016\u1031\u102C\u1004\u103A\u1038	p-l-\u025B\u0294 f-a\u028A\u0274-\u02E5\r\n\u1010\u102D\u101B\u1005\u1039\u1006\u102C\u1014\u103A	t-\u0259 r-e\u026A\u0294 s\u02B0-a\u0274-\u02E7\r\n\u1010\u102D\u101B\u102D\u1005\u1039\u1006\u102C\u1014\u103A	t-\u0259 r-e\u026A\u0294 s\u02B0-a\u0274-\u02E7\r\n\u1019\u102F\u1006\u102D\u102F\u1038	m-o\u028A\u0294 s\u02B0-o-\u02E5\r\n\u1002\u103B\u1015\u102F	t\u0255-\u0259 p-u-\u02C0\r\n\u1010\u1014\u103A\u1001\u102D\u102F\u1038	t-\u0259 k\u02B0-o-\u02E5\r\n\u101E\u100A\u103A\u1038\u1001\u1036	\u03B8-i-\u02E5 k\u02B0-a\u0274-\u02E7\r\n\u1005\u1004\u103A\u1039\u1000\u102C\u1015\u1030	s-\u026A\u0274-\u02E7 k-\u0259 p-u-\u02E7\r\n\u1015\u102B\u101B\u1005\u1031	p-\u0259 j-a-\u02C0 z-e-\u02E7\r\n";

// src/data/mined_rules.tsv
var mined_rules_default = "schwa	\u1019\u102E\u1038	\u101E\r\nvoicing	\u1021	\u1010\u103D\u1000\u103A\r\nvoicing	\u1015\u103C\u102E\u1038	\u1010\u1031\u102C\u1037\r\nschwa	\u101E\u102D	\u1019\r\nschwa	\u1000\u102C\u1038	\u1005\r\nschwa	\u101B\u103E\u102D	\u1019\r\nvoicing	\u1006\u102D\u102F	\u1015\u103C\u102E\u1038\r\nvoicing	\u101C\u102D\u102F\u1000\u103A	\u1010\u102C\r\nvoicing	\u1010\u103D\u1031	\u1000\u102D\u102F\r\nvoicing	\u1019\u103B\u102C\u1038	\u1000\u102D\u102F\r\nvoicing	\u1021	\u1000\u103C\u1031\u102C\u1004\u103A\u1038\r\nvoicing	\u1014\u1031	\u1000\u103C\r\nvoicing	\u1010\u102C	\u1015\u1031\u102B\u1037\r\nvoicing	\u1014\u1031	\u1010\u102C\r\nvoicing	\u101C\u102C	\u1001\u1032\u1037\r\nvoicing	\u101C\u102D\u102F\u1000\u103A	\u1010\u101A\u103A\r\nvoicing	\u1010\u103D\u1031	\u1000\r\nvoicing	\u1015\u102B	\u101E\u100A\u103A\r\nschwa	\u1018\u1031\u102C	\u101E\r\nschwa	\u101C\u102D\u102F	\u101E\r\nvoicing	\u101F\u102F\u1010\u103A	\u1015\u102B\r\nvoicing	\u1021	\u1010\u102D\u102F\u1004\u103A\u1038\r\nvoicing	\u101C\u102D\u102F\u1000\u103A	\u1015\u102B\r\nschwa	\u1000\u1031\u102C\u1004\u103A\u1038	\u1019\r\nschwa	\u1000\u101A\u103A	\u1010\r\nvoicing	\u1014\u1031	\u1010\u1032\u1037\r\nvoicing	\u1010\u102C	\u1015\u102B\r\nvoicing	\u1010\u1032\u1037	\u101E\u1030\r\nvoicing	\u1019\u103E\u102C	\u1015\u1031\u102B\u1037\r\nvoicing	\u1010\u102C	\u1000\u102D\u102F\r\nvoicing	\u1000\u103C\u102E\u1038	\u1000\r\nvoicing	\u1010\u102C	\u1015\u1032\r\nvoicing	\u101E\u103D\u102C\u1038	\u1015\u103C\u102E\u1038\r\nvoicing	\u1014\u1031	\u1015\u103C\u102E\u1038\r\nschwa	\u1014\u102C	\u101E\r\nvoicing	\u101C\u100A\u103A\u1038	\u1000\u1031\u102C\u1004\u103A\u1038\r\nvoicing	\u1010\u102C	\u1000\r\nvoicing	\u101E\u1030	\u1000\r\nvoicing	\u1019\u103E\u102C	\u1015\u1032\r\nvoicing	\u1001\u1036	\u1005\u102C\u1038\r\nvoicing	\u1000\u103C\u102D\u102F\u1038	\u1005\u102C\u1038\r\nvoicing	\u101A\u1031\u102C\u1000\u103A	\u1000\r\nvoicing	\u1012\u102B	\u1000\u103C\u1031\u102C\u1004\u103A\u1037\r\nschwa	\u1010\u102D	\u101E\r\nschwa	\u1016\u103C\u1004\u103A\u1037	\u101E\r\nvoicing	\u101C\u102C	\u1015\u103C\u102E\u1038\r\nvoicing	\u1015\u102F\u1036	\u1005\u1036\r\nvoicing	\u1021	\u1010\u103D\u1004\u103A\u1038\r\nvoicing	\u1005\u1009\u103A\u1038	\u1005\u102C\u1038\r\nvoicing	\u1011\u1032	\u1000\r\nvoicing	\u1001\u1032\u1037	\u1000\u103C\r\nvoicing	\u101F\u102F\u1010\u103A	\u1010\u101A\u103A\r\nvoicing	\u101C\u102D\u102F\u1000\u103A	\u1010\u1031\u102C\u1037\r\nvoicing	\u1019\u103B\u102C\u1038	\u101E\u100A\u103A\r\nschwa	\u1014\u1000\u103A	\u1019\r\nvoicing	\u1014\u1031	\u1015\u102B\r\nvoicing	\u101B	\u1015\u102B\r\nvoicing	\u1010\u102D\u102F\u1037	\u1000\r\nvoicing	\u101B\u103E\u102D	\u1015\u102B\r\nschwa	\u101C\u102C\u1038	\u1019\r\nschwa	\u1019\u102C\u1038	\u101E\r\nvoicing	\u101C\u1031\u1038	\u1000\u102D\u102F\r\nvoicing	\u1004\u101A\u103A	\u1001\u103B\u1004\u103A\u1038\r\nvoicing	\u101C\u102D\u102F\u1000\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u1000\u103C\u102E\u1038	\u1000\u102D\u102F\r\nvoicing	\u101C\u1030	\u1000\u103C\u102E\u1038\r\nvoicing	\u1016\u103C\u1005\u103A	\u1010\u101A\u103A\r\nvoicing	\u101C\u1031\u1038	\u1010\u1005\u103A\r\nvoicing	\u1018\u102C	\u101E\u102C\r\nvoicing	\u1006\u1004\u103A	\u1015\u103C\u1031\r\nvoicing	\u1019\u103B\u102C\u1038	\u1000\r\nvoicing	\u1014\u1031	\u1010\u101A\u103A\r\nvoicing	\u1019\u102D	\u101E\u102C\u1038\r\nvoicing	\u101B	\u101E\u100A\u103A\r\nvoicing	\u101C\u1030	\u1010\u1005\u103A\r\nvoicing	\u1012\u102B	\u1015\u1031\r\nvoicing	\u1000\u103C	\u101E\u100A\u103A\r\nvoicing	\u1014\u1031	\u1001\u1032\u1037\r\nschwa	\u101C\u102F\u1015\u103A	\u1019\r\nvoicing	\u101C\u1031\u1038	\u1000\r\nvoicing	\u1000\u103C	\u1015\u102B\r\nvoicing	\u101E\u102C\u1038	\u1005\u102F\r\nvoicing	\u1010\u102D\u102F\u1037	\u1000\u102D\u102F\r\nvoicing	\u101C\u102F\u1015\u103A	\u1015\u1031\u1038\r\nvoicing	\u101E\u103D\u102C\u1038	\u1001\u1032\u1037\r\nschwa	\u1014\u1031	\u1019\r\nvoicing	\u1005\u1031	\u1001\u103B\u1004\u103A\r\nvoicing	\u1001\u1032\u1037	\u1015\u102B\r\nvoicing	\u1000	\u1005\u102C\u1038\r\nschwa	\u1001\u1036	\u1019\r\nvoicing	\u1015\u102D\u102F	\u1015\u103C\u102E\u1038\r\nvoicing	\u101E\u103D\u102C\u1038	\u1000\u103C\r\nschwa	\u1001\u103C\u102C\u1038	\u1010\r\nvoicing	\u1017\u102D\u102F\u1000\u103A	\u1000\r\nvoicing	\u1015\u102B	\u1005\u1031\r\nvoicing	\u101C\u102C	\u1000\u103C\r\nvoicing	\u1010\u1030	\u1010\u1030\r\nvoicing	\u101C\u102D\u102F	\u1001\u103B\u1004\u103A\r\nvoicing	\u1014\u1031	\u101E\u100A\u103A\r\nvoicing	\u101E\u1030	\u1000\u103C\u102E\u1038\r\nschwa	\u1010\u103D\u1031\u1037	\u1019\r\nvoicing	\u101C\u102D\u102F\u1000\u103A	\u1010\u1032\u1037\r\nvoicing	\u1016\u103C\u1005\u103A	\u1010\u102C\r\nvoicing	\u1019	\u1000\u103C\u102C\r\nvoicing	\u1014\u1031	\u101E\r\nvoicing	\u101A\u102F\u1036	\u1000\u103C\u100A\u103A\r\nvoicing	\u101E\u1031\u1038	\u1010\u101A\u103A\r\nvoicing	\u101B\u103E\u102D	\u1010\u1032\u1037\r\nvoicing	\u101A\u1031\u102C\u1000\u103A	\u1000\u102D\u102F\r\nschwa	\u101C\u102D\u102F	\u1019\r\nschwa	\u1014\u1032	\u1001\r\nvoicing	\u1019	\u1000\u103C\u102E\u1038\r\nvoicing	\u1001\u1032\u1037	\u101E\u100A\u103A\r\nvoicing	\u1018\u1000\u103A	\u1000\u102D\u102F\r\nvoicing	\u1000\u103C\u102E\u1038	\u1010\u1005\u103A\r\nschwa	\u101C\u102C	\u1019\r\nvoicing	\u1011\u102C\u1038	\u1015\u103C\u102E\u1038\r\nvoicing	\u1014\u1031\u102C\u1000\u103A	\u1010\u1005\u103A\r\nvoicing	\u101C\u102D\u102F	\u1015\u1032\r\nvoicing	\u101E\u1031\u102C	\u1000\u103C\u1031\u102C\u1004\u103A\u1037\r\nvoicing	\u101B\u103E\u102D	\u1010\u101A\u103A\r\nvoicing	\u1016\u103C\u1005\u103A	\u1010\u1032\u1037\r\nvoicing	\u101B\u102C	\u1000\r\nschwa	\u1010\u1004\u103A\u1038	\u101E\r\nvoicing	\u1015\u103C\u1031\u102C	\u1015\u103C\u102E\u1038\r\nschwa	\u1000\u103C\u102C	\u1019\r\nvoicing	\u101B	\u101E\r\nvoicing	\u1015\u1031\u1038	\u1015\u102B\r\nvoicing	\u1015\u1031\u1038	\u1001\u1032\u1037\r\nvoicing	\u1021	\u1000\u103B\u102D\u102F\u1038\r\nvoicing	\u101C\u102F\u1015\u103A	\u1010\u102C\r\nvoicing	\u1019\u103E\u102C	\u1015\u102B\r\nvoicing	\u101E\u103D\u102C\u1038	\u1015\u102B\r\nschwa	\u101B	\u1019\r\nvoicing	\u1014\u1031	\u1015\u103C\u102E\r\nschwa	\u1019\u103C\u1004\u103A	\u1019\r\nvoicing	\u1015\u102B	\u1015\u103C\u102E\r\nvoicing	\u101E\u103D\u102C\u1038	\u1015\u103C\u102E\r\nvoicing	\u1000\u1032\u1037	\u101E\u102D\u102F\u1037\r\nvoicing	\u1015\u103C\u102E\u1038	\u101E\u102C\u1038\r\nvoicing	\u101B	\u101E\u1031\u1038\r\nvoicing	\u1000\u102D\u102F	\u101E\u102C\r\nvoicing	\u1014\u1031	\u101E\u1031\u102C\r\nvoicing	\u1012\u102E	\u1010\u1005\u103A\r\nvoicing	\u1010\u1036	\u1001\u102B\u1038\r\nvoicing	\u101B\u103E\u102D	\u1001\u1032\u1037\r\nvoicing	\u1000\u103C\u100A\u103A\u1037	\u1015\u103C\u102E\u1038\r\nvoicing	\u1015\u102B\u1038	\u1005\u1015\u103A\r\nschwa	\u1019\u103B\u103E	\u101E\r\nvoicing	\u1010\u102C	\u1000\u103C\u1031\u102C\u1004\u103A\u1037\r\nvoicing	\u1015\u103C\u1031\u102C	\u1015\u102B\r\nvoicing	\u1011\u102C\u1038	\u1001\u1032\u1037\r\nvoicing	\u1001\u102B	\u1000\u103B\r\nschwa	\u1001\u103B\u102D\u102F\u1037	\u1010\r\nvoicing	\u1005\u102E	\u1005\u1009\u103A\r\nvoicing	\u101B\u103E\u102D	\u1010\u102C\r\nvoicing	\u1015\u103C\u100A\u103A	\u101E\u1030\r\nvoicing	\u1015\u102B	\u1015\u1032\r\nvoicing	\u1011\u1030\u1038	\u1006\u1014\u103A\u1038\r\nvoicing	\u1019\u103B\u102D\u102F\u1038	\u101E\r\nvoicing	\u101C\u102C	\u101E\u100A\u103A\r\nvoicing	\u101C\u102D\u102F\u1037	\u1015\u102B\r\nvoicing	\u101B\u102C	\u1000\u102D\u102F\r\nvoicing	\u101B\u1031\u1038	\u1000\u103C\u102E\u1038\r\nschwa	\u101C\u1032	\u1019\r\nvoicing	\u101C\u1031\u1038	\u1010\u103D\u1031\r\nvoicing	\u1013\u102D	\u1000\r\nvoicing	\u1021\u1030\u1038	\u1000\r\nvoicing	\u101B\u103E\u102D	\u101E\u1031\u1038\r\nvoicing	\u1001\u1032\u1037	\u1015\u103C\u102E\u1038\r\nschwa	\u1014\u102C	\u1010\r\nvoicing	\u1015\u103C\u1031\u102C	\u1001\u103B\u1004\u103A\r\nvoicing	\u1015\u103C\u1031\u102C	\u1001\u1032\u1037\r\nvoicing	\u101C\u102D\u102F\u1000\u103A	\u1000\u103C\r\nvoicing	\u1011\u1015\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u101C\u102F\u1036\u1038	\u1000\u102D\u102F\r\nvoicing	\u101D\u1004\u103A	\u1005\u102C\u1038\r\nvoicing	\u101E	\u1010\u1004\u103A\u1038\r\nschwa	\u101E\u103D\u102C\u1038	\u1019\r\nvoicing	\u1013\u102C	\u1000\u102D\u102F\u101A\u103A\r\nvoicing	\u1019	\u1000\u102D\u102F\r\nvoicing	\u101B\u103E\u102D	\u101E\u1031\u102C\r\nvoicing	\u1014\u1031\u102C\u1000\u103A	\u1015\u102D\u102F\u1004\u103A\u1038\r\nvoicing	\u1014\u1031\u102C\u1000\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u1012\u1031	\u101E\r\nvoicing	\u101B	\u1015\u103C\u102E\u1038\r\nvoicing	\u1000\u102D\u102F	\u1015\u1032\r\nvoicing	\u1012\u102E	\u1010\u1031\u102C\u1037\r\nvoicing	\u1021	\u1000\u103C\u102E\u1038\r\nvoicing	\u1010\u102D\u102F\u1037	\u101E\u100A\u103A\r\nvoicing	\u1019\u103B\u102C\u1038	\u1000\u103C\u102E\u1038\r\nvoicing	\u101C\u102F\u1015\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u1010\u100A\u103A\u1038	\u1000\r\nvoicing	\u1010\u1010\u103A	\u1010\u101A\u103A\r\nvoicing	\u1011\u1032	\u1000\u102D\u102F\r\nvoicing	\u101B\u103E\u102D	\u101E\u100A\u103A\r\nvoicing	\u1019	\u1010\u1014\u103A\r\nvoicing	\u1019\u103E\u102F	\u1000\u102D\u102F\r\nvoicing	\u101E\u100A\u103A	\u1000\u102D\u102F\r\nvoicing	\u1021\u102F	\u1015\r\nschwa	\u101C\u102F\u1036\u1038	\u1014\u103E\r\nvoicing	\u101E\u1030	\u1010\u1005\u103A\r\nvoicing	\u101B\u1014\u103A	\u1000\u102F\u1014\u103A\r\nvoicing	\u101C\u102F\u1015\u103A	\u1015\u102B\r\nvoicing	\u1000\u1031	\u101E\u102E\r\nvoicing	\u1015\u1031\u1038	\u1015\u103C\u102E\u1038\r\nvoicing	\u101B\u102F\u1010\u103A	\u1010\r\nvoicing	\u101B\u103E\u102D	\u101E\r\nvoicing	\u1019\u1031\u102C\u1004\u103A	\u1000\u103C\u102E\u1038\r\nvoicing	\u1006\u102D\u102F	\u1010\u1032\u1037\r\nvoicing	\u101E\u102D	\u1001\u103B\u1004\u103A\r\nvoicing	\u1019\u103B\u102C\u1038	\u1010\u103D\u1004\u103A\r\nvoicing	\u1019\u1004\u103A\u1038	\u1000\u103C\u102E\u1038\r\nvoicing	\u101A\u1030	\u1015\u103C\u102E\u1038\r\nvoicing	\u101C\u102F\u1015\u103A	\u1000\u103C\r\nvoicing	\u1015\u102B	\u1000\r\nschwa	\u1014\u102C\u1038	\u101E\r\nvoicing	\u1012\u1031\u102B	\u101E\r\nvoicing	\u101B\u102C	\u1000\u103C\u102E\u1038\r\nvoicing	\u101E\u1000\u103A	\u1015\u103C\u102E\u1038\r\nschwa	\u1014\u1031\u1037	\u1019\r\nvoicing	\u1019\u103B\u102C\u1038	\u1005\u103D\u102C\r\nvoicing	\u1010\u103D\u1031\u1037	\u1001\u1032\u1037\r\nvoicing	\u1014\u1031\u102C\u1000\u103A	\u1000\r\nvoicing	\u1019\u103B\u102D\u102F\u1038	\u101E\u102C\u1038\r\nvoicing	\u1012\u102B	\u1000\r\nvoicing	\u1005\u102C\u1038	\u1001\u103B\u1004\u103A\r\nschwa	\u101C\u102C\u1038	\u101E\r\nvoicing	\u1015\u103C\u1031\u102C	\u1005\r\nschwa	\u1015\u103C\u1031	\u1019\r\nschwa	\u1011\u1004\u103A	\u1019\r\nvoicing	\u1011\u102C\u1038	\u101E\u1031\u102C\r\nvoicing	\u1000\u103B	\u101E\u103D\u102C\u1038\r\nvoicing	\u101E\u103D\u102C\u1038	\u101E\u100A\u103A\r\nvoicing	\u1010\u103D\u1031	\u1015\u102B\r\nvoicing	\u1000\u103B\u102F\u1015\u103A	\u1010\u102D\u102F\u1037\r\nvoicing	\u1000\u1031\u102C\u1004\u103A\u1038	\u1006\u102F\u1036\u1038\r\nschwa	\u1006\u102D\u102F	\u1019\r\nvoicing	\u1019	\u1000\u103B\r\nvoicing	\u101E\u102D	\u1015\u102B\r\nvoicing	\u1021\u1014\u103A	\u1010\u102E\r\nvoicing	\u1000\u102F	\u101E\u102D\u102F\u101C\u103A\r\nschwa	\u1010\u1030	\u1019\r\nvoicing	\u101B	\u101E\u1031\u102C\r\nschwa	\u101B\u1032	\u101E\r\nvoicing	\u1019\u103C\u103D\u1031	\u1000\u103C\u102E\u1038\r\nschwa	\u1005\u102C\u1038	\u1019\r\nvoicing	\u1011\u102C\u1038	\u101E\u100A\u103A\r\nvoicing	\u1010\u1010\u103A	\u1010\u1032\u1037\r\nvoicing	\u1021\u102C\u1038	\u1015\u1031\u1038\r\nvoicing	\u101C\u102F\u1015\u103A	\u1010\u103D\u1031\r\nvoicing	\u101B\u103E\u102D	\u1010\u1031\u102C\u1037\r\nvoicing	\u101B\u103E\u102D	\u1000\u103C\r\nvoicing	\u1015\u102D\u102F\u1037	\u1015\u1031\u1038\r\nvoicing	\u101B\u103E\u102D	\u1015\u103C\u102E\u1038\r\nvoicing	\u101C\u1030	\u1011\u102F\r\nvoicing	\u1019	\u1000\u103C\u100A\u103A\u1037\r\nvoicing	\u1013\u102C\u1010\u103A	\u1015\u102F\u1036\r\nvoicing	\u101C\u1031	\u101E\u100A\u103A\r\nvoicing	\u1015\u1031\u1038	\u1001\u103B\u1004\u103A\r\nschwa	\u101C\u1031\u102C\u1000\u103A	\u101E\r\nvoicing	\u101B\u102C	\u101E\u102E\r\nvoicing	\u101C\u102F\u1015\u103A	\u1010\u1032\u1037\r\nvoicing	\u1012\u102B	\u1000\u102D\u102F\r\nvoicing	\u1000\u102C\u1038	\u1000\u102D\u102F\r\nvoicing	\u1005\u100A\u103A\u1038	\u1000\u1019\u103A\u1038\r\nvoicing	\u1000\u103C\u1031\u102C\u1004\u103A\u1038	\u1000\u102D\u102F\r\nvoicing	\u1000\u103C	\u1015\u103C\u102E\u1038\r\nvoicing	\u1005	\u1015\u103C\u102E\u1038\r\nvoicing	\u1005\u102C\u1038	\u1000\u103C\r\nvoicing	\u1005\u102C\u1038	\u1015\u103C\u102E\u1038\r\nvoicing	\u101E\u102F\u1036\u1038	\u1015\u103C\u102F\r\nvoicing	\u1010\u1031\u102C\u1037	\u1015\u102B\r\nvoicing	\u1016\u103C\u1005\u103A	\u101E\u100A\u103A\r\nvoicing	\u1010\u101A\u103A	\u1015\u1031\u102B\u1037\r\nschwa	\u101C\u1032	\u101E\r\nvoicing	\u1016\u103C\u1005\u103A	\u1010\u1031\u102C\u1037\r\nvoicing	\u1019	\u1000\u103C\u102C\u1038\r\nvoicing	\u1010\u102D	\u1015\u1031\u1038\r\nvoicing	\u101D\u1014\u103A\u1038	\u1000\u103B\u1004\u103A\r\nvoicing	\u1012\u102F	\u1010\u102D\r\nschwa	\u1011\u102C\u1038	\u1019\r\nvoicing	\u1015\u103C\u1031\u102C	\u101E\u100A\u103A\r\nvoicing	\u101E\u1010\u103A	\u1010\r\nvoicing	\u1015\u103C\u101E\u103A	\u101E\r\nvoicing	\u1015\u103C\u1031\u102C	\u1000\u103C\r\nvoicing	\u101C\u102C	\u101E\r\nvoicing	\u1019\u102D\u102F	\u1000\r\nvoicing	\u101C\u102C	\u1015\u102B\r\nvoicing	\u101E\u1005\u103A	\u1015\u1004\u103A\r\nvoicing	\u101C\u1030	\u1010\u103D\u1031\r\nvoicing	\u101B	\u1005\u1031\r\nschwa	\u1014\u1031\u102C\u1000\u103A	\u1021\r\nvoicing	\u1011\u102C\u1038	\u1000\u103C\r\nvoicing	\u101B\u1031\u102C\u1000\u103A	\u1010\u1032\u1037\r\nvoicing	\u1018\u1031\u102C	\u1000\u103B\r\nvoicing	\u1019\u103B\u102C\u1038	\u1005\u102F\r\nvoicing	\u1010\u1005\u103A	\u1005\u102F\u1036\r\nvoicing	\u101B\u102E\u1038	\u101E\u103D\u102C\u1038\r\nvoicing	\u1015\u103C\u1031\u102C	\u101E\r\nvoicing	\u1015\u1010\u103A	\u101E\u1000\u103A\r\nvoicing	\u1000\u103C\u102E\u1038	\u1010\u103D\u1031\r\nvoicing	\u101B\u102C	\u1010\u103D\u1004\u103A\r\nvoicing	\u101E\u102F	\u1010\r\nvoicing	\u1019\u103E\u102C	\u1000\r\nschwa	\u1015\u103C\u102F	\u1019\r\nvoicing	\u1005\u102C\u1038	\u1005\r\nvoicing	\u1014\u1031\u1037	\u1000\r\nvoicing	\u1014\u1031\u102C\u1000\u103A	\u1000\u103B\r\nvoicing	\u1014\u1031	\u1000\u103B\r\nvoicing	\u1019\u102C	\u1015\u103C\u100A\u103A\r\nvoicing	\u101E\u1031\u1038	\u101E\u100A\u103A\r\nschwa	\u1010\u100A\u103A\u1038	\u1000\r\nvoicing	\u1001\u1032\u1037	\u101E\u1031\u102C\r\nvoicing	\u101F\u102F\u1010\u103A	\u1015\u103C\u102E\r\nvoicing	\u1005\u102D\u1010\u103A	\u1010\u103D\u1031\r\nvoicing	\u1015\u102B	\u101E\r\nvoicing	\u101D	\u1010\r\nvoicing	\u1000\u102D\u102F	\u1015\u102B\r\nvoicing	\u1010\u103D\u1000\u103A	\u1000\u102D\u102F\r\nvoicing	\u1014\u1031\u102C\u1000\u103A	\u1000\u102D\u102F\r\nschwa	\u1019\u1032	\u1021\r\nvoicing	\u101C\u1031\u102C\u1000\u103A	\u1015\u1032\r\nschwa	\u1000\u103C\u100A\u103A\u1037	\u1019\r\nvoicing	\u1014\u102D\u102F\u1004\u103A	\u101E\u100A\u103A\r\nvoicing	\u1015\u103C\u100A\u103A\u1037	\u1005\u102F\u1036\r\nvoicing	\u1015\u1031\u1038	\u1016\u102D\u102F\u1037\r\nvoicing	\u1010	\u1015\u100A\u103A\u1037\r\nvoicing	\u101B\u103D\u102C	\u101E\u102C\u1038\r\nvoicing	\u1021\u1031\u100A\u103A\u1037	\u101E\u100A\u103A\r\nvoicing	\u1010\u102F\u1014\u103A\u1038	\u1000\r\nvoicing	\u101F\u102D\u102F	\u1010\u101A\u103A\r\nvoicing	\u101B\u100A\u103A\u1038	\u1005\u102C\u1038\r\nvoicing	\u101E\u102C\u1038	\u101E\r\nvoicing	\u1014\u1031	\u1001\u103B\u1004\u103A\r\nvoicing	\u101E\u1031\u1010\u103A	\u1010\u102C\r\nvoicing	\u1021\u1030\u1038	\u1000\u102D\u102F\r\nschwa	\u1000\u103B	\u1019\r\nvoicing	\u101C\u1030	\u101E\u102C\u1038\r\nvoicing	\u1015\u1014\u103A\u1038	\u1000\u1014\u103A\r\nvoicing	\u1005	\u1000\r\nvoicing	\u1014\u1032\u1037	\u1010\u1005\u103A\r\nschwa	\u1015\u100A\u103A\u1037	\u1010\r\nvoicing	\u1010\u103D\u1010\u103A	\u1015\u102E\r\nschwa	\u1010\u1010\u103A	\u1019\r\nvoicing	\u1006\u1036	\u1015\u1004\u103A\r\nschwa	\u1000\u103C\u102C\u1038	\u1019\r\nschwa	\u101E\u1031	\u1019\r\nvoicing	\u1014\u1031	\u1010\u1031\u102C\u1037\r\nschwa	\u1000\u103C\u102D\u102F\u1000\u103A	\u1019\r\nschwa	\u1000\u103B\u1031	\u1019\r\nvoicing	\u1011\u102D\u102F\u1037	\u1000\u103C\u1031\u102C\u1004\u103A\u1037\r\nvoicing	\u1001\u102F	\u1000\r\nvoicing	\u1000	\u101E\u102D\u102F\u101C\u103A\r\nvoicing	\u101C\u102D\u102F\u1000\u103A	\u1015\u102D\u102F\u1037\r\nvoicing	\u101C\u1031\u1038	\u1005\u102C\u1038\r\nvoicing	\u1015\u103C\u1031\u102C	\u1005\u1019\u103A\u1038\r\nvoicing	\u101C\u102D\u102F	\u1015\u102B\r\nvoicing	\u101E\u1032	\u101E\u1032\r\nvoicing	\u101C\u102C	\u101E\u1031\u102C\r\nvoicing	\u1005\u102C	\u1001\u103B\u102F\u1015\u103A\r\nvoicing	\u1015\u103C\u102E\u1038	\u101E\u103D\u102C\u1038\r\nvoicing	\u101C\u102D\u102F\u1037	\u1015\u1032\r\nvoicing	\u1021\u1004\u103A	\u1000\u103B\u102E\r\nvoicing	\u1019\u1032	\u101E\u102C\u1038\r\nvoicing	\u1014\u1032\u1037	\u1015\u1032\r\nvoicing	\u1005\u102F\u1036	\u1005\u1019\u103A\u1038\r\nvoicing	\u1001\u1032\u1037	\u1016\u1030\u1038\r\nvoicing	\u1010\u103D\u1031	\u1015\u1032\r\nvoicing	\u101B\u103E\u102D	\u101E\u100A\u103A\u1037\r\nvoicing	\u1000\u102D\u102F	\u1000\u103C\u102E\u1038\r\nvoicing	\u1010\u1010\u103A	\u1015\u102B\r\nschwa	\u1010\u1014\u103A	\u1019\r\nvoicing	\u1006\u102E	\u1000\r\nvoicing	\u1015\u103C\u102E\u1038	\u1015\u103C\u102E\r\nvoicing	\u1005	\u101E\r\nvoicing	\u101C\u1031\u102C\u1000\u103A	\u1010\u1031\u102C\u1004\u103A\r\nvoicing	\u101E\u1030	\u1015\u103C\u1031\u102C\r\nvoicing	\u1017\u102D\u102F\u101C\u103A	\u1000\u1031\r\nvoicing	\u1015\u102B	\u101E\u1031\u1038\r\nvoicing	\u1006\u102D\u102F	\u101E\u100A\u103A\r\nvoicing	\u101B\u1031	\u1001\u1032\r\nvoicing	\u1015\u103C\u1014\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u1012\u102E	\u1010\u102D\u102F\u1004\u103A\u1038\r\nschwa	\u1001\u1004\u103A	\u101E\r\nvoicing	\u1019\u102D\u102F\u1000\u103A	\u1000\u101A\u103A\r\nvoicing	\u100A	\u1000\r\nvoicing	\u1011\u102C\u1038	\u1015\u102B\r\nschwa	\u101B\u102C\u1038	\u1010\r\nvoicing	\u1014\u1031	\u101E\u1031\u1038\r\nvoicing	\u101C\u102F\u1015\u103A	\u1010\u101A\u103A\r\nvoicing	\u1019\u1004\u103A\u1038	\u1000\r\nvoicing	\u1005\u102D\u1010\u103A	\u1000\r\nschwa	\u1016\u103C\u100A\u103A\u1038	\u1010\r\nvoicing	\u101B	\u1001\u103C\u1004\u103A\u1038\r\nvoicing	\u1021\u102C\u1038	\u1000\u102D\u102F\u1038\r\nvoicing	\u1000\u102D\u102F	\u1000\r\nvoicing	\u1006\u102D\u102F	\u1015\u102B\r\nvoicing	\u1000\u102C	\u1000\u103D\u101A\u103A\r\nvoicing	\u1011\u100A\u103A\u1037	\u1015\u1031\u1038\r\nvoicing	\u1021\u1014\u103A	\u1000\u101A\u103A\r\nvoicing	\u101D\u102B	\u101E\r\nvoicing	\u101E\u1030	\u101E\u100A\u103A\r\nvoicing	\u1014\u1031	\u1005\r\nvoicing	\u101E\u102C	\u101E\r\nvoicing	\u1011\u102C\u1038	\u101E\r\nvoicing	\u1005\u1031	\u1010\r\nvoicing	\u1000\u103C\u102C	\u1001\u1004\u103A\r\nvoicing	\u1014\u102D\u102F\u1004\u103A	\u1001\u1032\u1037\r\nvoicing	\u1000\u103C\u100A\u103A\u1037	\u1005\u1019\u103A\u1038\r\nvoicing	\u101E\u1004\u103A	\u1015\u1031\u1038\r\nvoicing	\u101B	\u1001\u1032\u1037\r\nvoicing	\u1011\u1030\u1038	\u1001\u103C\u102C\u1038\r\nvoicing	\u1016\u103C\u1005\u103A	\u101E\u103D\u102C\u1038\r\nvoicing	\u101E\u103D\u102C\u1038	\u101E\r\nvoicing	\u1015\u1031\u1038	\u1000\u103C\r\nvoicing	\u101E\u1000\u103A	\u1000\u102D\u102F\r\nvoicing	\u1018\u1030\u1038	\u1015\u1031\u102B\u1037\r\nschwa	\u1011\u103D\u1000\u103A	\u1019\r\nschwa	\u101C\u1031	\u1010\r\nvoicing	\u1005\u102F\u1036	\u1010\u1005\u103A\r\nvoicing	\u1014\u1031	\u1010\u1010\u103A\r\nvoicing	\u101E\u1031	\u101E\u1031\r\nvoicing	\u1015\u103C\u1014\u103A	\u1015\u103C\u1031\u102C\r\nvoicing	\u101C	\u1000\u102C\u1038\r\nvoicing	\u101C\u102F\u1036\u1038	\u1000\r\nvoicing	\u1019\u1031\u1038	\u1001\u103D\u1014\u103A\u1038\r\nvoicing	\u1019	\u1015\u103C\u102E\u1038\r\nvoicing	\u1005\u100A\u103A\u1038	\u1010\u103D\u1031\r\nvoicing	\u1010\u103D\u1031\u1037	\u1001\u103B\u1004\u103A\r\nvoicing	\u1019\u102E\u1038	\u1010\u1005\u103A\r\nvoicing	\u1005	\u1000\u102D\u102F\r\nvoicing	\u1000\u103C\u102E\u1038	\u101E\u100A\u103A\r\nvoicing	\u101E\u102C	\u101E\u102C\r\nvoicing	\u1018\u102C	\u1000\u103C\u1031\u102C\u1004\u103A\u1037\r\nschwa	\u1019	\u1000\u103B\r\nvoicing	\u1014\u1032\u1037	\u1010\u1030\r\nvoicing	\u1001\u103C\u1004\u103A\u1038	\u101E\u100A\u103A\r\nvoicing	\u1010\u1010\u103A	\u1010\u102C\r\nvoicing	\u1021	\u101E\u1004\u103A\u1038\r\nvoicing	\u1006\u102E	\u1000\u102D\u102F\r\nvoicing	\u1016\u103C\u1005\u103A	\u1000\u103C\u1031\u102C\u1004\u103A\u1038\r\nvoicing	\u101B\u102C	\u1010\u103D\u1010\u103A\r\nvoicing	\u1010\u1010\u103A	\u1000\u103C\r\nvoicing	\u1010\u1031\u102C\u1037	\u101E\u100A\u103A\r\nschwa	\u1018\u102C	\u101E\r\nvoicing	\u101E\u102C\u1038	\u1000\r\nvoicing	\u1019\u102E\u1038	\u1016\u102D\u102F\r\nvoicing	\u101B\u103D\u102C	\u1000\r\nvoicing	\u1019\u102D	\u1001\u1004\u103A\r\nvoicing	\u101D	\u1000\u102D\u102F\r\nvoicing	\u101C\u1000\u103A	\u1010\u103D\u1031\r\nvoicing	\u1005\u102C\u1038	\u1001\u1032\u1037\r\nvoicing	\u1001\u1032\u1037	\u1001\u103C\u1004\u103A\u1038\r\nvoicing	\u1010\u1032\u1037	\u1005\r\nvoicing	\u1005\u1031	\u1001\u1032\u1037\r\nvoicing	\u101D\u1004\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u101C\u102C	\u1015\u103C\u102E\r\nvoicing	\u1000\u103C\u102E\u1038	\u1015\u1032\r\nvoicing	\u1011\u1032	\u101E\u102D\u102F\u1037\r\nvoicing	\u1021	\u1010\u103D\u1031\u1038\r\nvoicing	\u101C\u102D\u102F\u1037	\u101E\u102C\r\nvoicing	\u1015\u102F\u1036	\u1000\u102D\u102F\r\nvoicing	\u1019\u103E\u1010\u103A	\u1010\u1019\u103A\u1038\r\nvoicing	\u1019\u102D	\u101E\u100A\u103A\r\nvoicing	\u101E\u102D	\u101E\u102C\r\nvoicing	\u1016\u103C\u1005\u103A	\u1000\u103C\r\nvoicing	\u1000	\u101E\u102C\r\nvoicing	\u1015\u103C	\u1015\u103C\u102E\u1038\r\nvoicing	\u1000\u103C\u100A\u103A\u1037	\u1015\u102B\r\nvoicing	\u101C\u1031\u102C\u1000\u103A	\u1010\u1031\u102C\u1037\r\nvoicing	\u101F\u102D\u102F	\u1010\u1005\u103A\r\nschwa	\u101A\u102F\u1036	\u1019\r\nvoicing	\u1014\u1031	\u101E\u1030\r\nvoicing	\u1005\u102C	\u1000\u102D\u102F\r\nvoicing	\u1019\u1004\u103A\u1038	\u101E\r\nvoicing	\u101B	\u1010\r\nvoicing	\u1006\u102D\u102F	\u1015\u1031\r\nschwa	\u1014\u102C	\u1019\r\nschwa	\u101C\u1031\u1038	\u1010\r\nvoicing	\u101C\u102D\u102F\u1000\u103A	\u101E\u100A\u103A\r\nvoicing	\u1021\u1031\u1038	\u1015\u102B\r\nvoicing	\u1018\u102D\u102F	\u1000\u1031\r\nvoicing	\u1005\u1031\u102C	\u1010\u1004\u103A\r\nvoicing	\u1004\u102B	\u1000\r\nvoicing	\u101C\u102F\u1015\u103A	\u1010\u1031\u102C\u1037\r\nvoicing	\u101E\u102D	\u1000\u103C\r\nvoicing	\u1000\u103B\u1014\u103A	\u1001\u1032\u1037\r\nvoicing	\u101E\u103D\u102C\u1038	\u1001\u103B\u1004\u103A\r\nvoicing	\u101E\u100A\u103A	\u1000\r\nvoicing	\u1001\u103B\u102D\u102F\u1037	\u1000\r\nvoicing	\u1014\u102D\u102F\u1004\u103A	\u1015\u102B\r\nvoicing	\u1019	\u101E\u1014\u103A\r\nvoicing	\u1000\u103C	\u101E\r\nvoicing	\u1011\u1030\u1038	\u101E\r\nvoicing	\u1005\u102C\u1038	\u1000\u103C\u100A\u103A\u1037\r\nvoicing	\u1021	\u1015\u102D\u102F\u1004\u103A\u1038\r\nschwa	\u1000\u103C\u1031\u102C\u1000\u103A	\u1019\r\nvoicing	\u1000	\u1000\u103B\r\nvoicing	\u1000\u1031	\u1000\r\nschwa	\u1000\u101A\u103A\u1037	\u1010\r\nvoicing	\u1010	\u1000\u102C\r\nvoicing	\u1011\u102F\u1036\u1038	\u1005\u1036\r\nvoicing	\u1014\u1031	\u1006\u1032\r\nvoicing	\u101C\u1030	\u1000\r\nvoicing	\u1015\u103C\u1031\u102C	\u1010\u1010\u103A\r\nvoicing	\u1015\u1031\u1038	\u1010\u102C\r\nvoicing	\u1001\u1032\u1037	\u1010\u1032\u1037\r\nvoicing	\u1001\u1032\u1037	\u101E\r\nvoicing	\u1000	\u1015\u1032\r\nvoicing	\u101B\u102E\u1038	\u1005\u1009\u103A\r\nvoicing	\u101E\u102D\u1015\u103A	\u1015\u1036\r\nvoicing	\u1015\u103C\u1031\u102C	\u101E\u103D\u102C\u1038\r\nvoicing	\u1014\u1031	\u1001\u103C\u1004\u103A\u1038\r\nvoicing	\u1019\u1004\u103A\u1038	\u101E\u102C\u1038\r\nvoicing	\u1011\u103D\u1000\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u1006\u102D\u102F	\u101E\r\nvoicing	\u1014\u1031\u1037	\u1005\u1009\u103A\r\nvoicing	\u1001\u103C\u1004\u103A\u1038	\u1000\u102D\u102F\r\nvoicing	\u1021\u102D\u1019\u103A	\u1000\u102D\u102F\r\nvoicing	\u1000\u1031\u102C\u1004\u103A\u1038	\u1010\u102D\u102F\u1037\r\nvoicing	\u101B	\u1015\u103C\u102E\r\nvoicing	\u1019\u103E	\u1015\u1032\r\nvoicing	\u1010\u1005\u103A	\u1015\u102B\u1038\r\nvoicing	\u1015\u103C\u1014\u103A	\u1015\u1031\u1038\r\nvoicing	\u101A\u1030	\u101E\u103D\u102C\u1038\r\nvoicing	\u1021	\u101E\u1031\r\nschwa	\u101C\u102F\u1036\u1038	\u1005\r\nvoicing	\u1010\u103D\u1031	\u1011\u1032\r\nvoicing	\u101B\u102C	\u1010\u102D\u102F\u1037\r\nvoicing	\u1015\u103C\u1004\u103A	\u101E\u1005\u103A\r\nvoicing	\u1000\u103C\u102E\u1038	\u1015\u102B\r\nvoicing	\u1019\u103E\u102C	\u1015\u1004\u103A\r\nvoicing	\u101C\u1031\u1038	\u1015\u102B\r\nvoicing	\u101E\u1036	\u1000\u102D\u102F\r\nvoicing	\u1000\u103C\u102D\u102F	\u1010\u1004\u103A\r\nvoicing	\u100A\u102D\u102F	\u1000\r\nvoicing	\u101E\u1000\u103A	\u1000\u103C\u102E\u1038\r\nvoicing	\u1011\u103D\u1000\u103A	\u101E\u103D\u102C\u1038\r\nvoicing	\u1021\u102D\u1019\u103A	\u101E\u102C\r\nvoicing	\u101E\u1000\u103A	\u101E\u1000\u103A\r\nvoicing	\u1004\u103D\u1031	\u1000\u103C\u1031\u1038\r\nvoicing	\u1001\u103B\u1005\u103A	\u1010\u102C\r\nvoicing	\u1013\u102D\u1015\u103A	\u1015\u102C\u101A\u103A\r\nvoicing	\u101E\u102D\u1015\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u1000\u103C	\u101E\u1031\u1038\r\nvoicing	\u101C\u103D\u101A\u103A	\u1000\u1030\r\nvoicing	\u1006\u102D\u102F\u1004\u103A	\u1000\u101A\u103A\r\nvoicing	\u1000\u103C\u102E\u1038	\u1010\u102D\u102F\u1037\r\nvoicing	\u1019\u102D	\u1015\u102B\r\nvoicing	\u1001\u1036	\u1001\u1032\u1037\r\nvoicing	\u1000\u103C	\u101E\u1031\u102C\r\nvoicing	\u101B\u103E\u102D	\u101E\u1030\r\nvoicing	\u1015\u102B\u1038	\u1015\u102B\u1038\r\nvoicing	\u1015\u102B	\u101E\u103D\u102C\u1038\r\nvoicing	\u101C\u102C	\u101E\u1031\u1038\r\nvoicing	\u1021	\u1000\u103C\u102C\r\nvoicing	\u1014\u1031\u1037	\u1010\u1005\u103A\r\nvoicing	\u101D\u101A\u103A	\u1015\u1031\u1038\r\nvoicing	\u101B	\u101E\u1030\r\nvoicing	\u1021\u1015\u103A	\u1010\u1032\u1037\r\nvoicing	\u1006\u102D\u102F	\u101E\u1031\u102C\r\nvoicing	\u101C\u1031	\u1010\u1031\u102C\u1037\r\nvoicing	\u101C\u102C	\u1015\u1031\u1038\r\nvoicing	\u1000\u1031	\u101E\u102E\u1037\r\nvoicing	\u101C\u102F\u1015\u103A	\u101E\r\nvoicing	\u1001\u1031\u102B\u1004\u103A\u1038	\u1006\u1031\u102C\u1004\u103A\r\nvoicing	\u101B\u1031\u1038	\u1000\u102D\u102F\r\nvoicing	\u1019\u103E\u1014\u103A	\u1010\r\nvoicing	\u1000\u102D\u102F\u101A\u103A	\u1000\u102D\u102F\r\nvoicing	\u1011\u102D\u102F	\u1005\u1009\u103A\r\nvoicing	\u101E\u102C	\u1005\r\nvoicing	\u1000\u102C\u1038	\u1000\r\nvoicing	\u101B\u1031\u102C	\u1015\r\nvoicing	\u1011\u102F\u1010\u103A	\u1015\u1031\u1038\r\nvoicing	\u101C\u103E	\u1015\r\nvoicing	\u1000\u103B\u1031\u102C\u1004\u103A\u1038	\u101E\u102C\u1038\r\nvoicing	\u1010\u102D\u102F\u1037	\u101E\r\nvoicing	\u1000\u102D\u102F\u101A\u103A	\u1000\r\nvoicing	\u101B	\u101E\u102C\r\nschwa	\u1015\u103B\u1000\u103A	\u1019\r\nschwa	\u101C\u100A\u103A	\u1019\r\nvoicing	\u101C\u1031\u102C	\u1006\u101A\u103A\r\nvoicing	\u1000\u103C\u100A\u103A\u1037	\u1000\u102C\r\nvoicing	\u1015\u103D\u1032	\u1000\u102D\u102F\r\nvoicing	\u1000\u103C\u100A\u103A\u1037	\u1000\u103C\r\nvoicing	\u1010	\u1000\r\nvoicing	\u1016\u1014\u103A	\u1010\u102E\u1038\r\nschwa	\u101C\u102D\u102F\u1037	\u1019\r\nvoicing	\u1014\u1031	\u1005\u1019\u103A\u1038\r\nvoicing	\u1015\u103C\u102F	\u1005\u102F\r\nvoicing	\u101E\u1036	\u1000\u103C\u102C\u1038\r\nvoicing	\u1012\u102E	\u1005\r\nvoicing	\u1004\u1036	\u1001\u103C\u102C\u1038\r\nvoicing	\u101C\u102F\u1036	\u1001\u103C\u102F\u1036\r\nvoicing	\u1019\u102D	\u1016\u102F\r\nvoicing	\u101B	\u101E\u100A\u103A\u1037\r\nvoicing	\u1019\u1031\u102C\u1004\u103A	\u1000\r\nvoicing	\u101A\u102C	\u1000\r\nvoicing	\u1018\u102C	\u1015\u1032\r\nvoicing	\u101E\u1031\u1038	\u1015\u102B\r\nvoicing	\u1021\u1030\u1038	\u1010\u103D\u1010\u103A\r\nvoicing	\u1014\u102D\u102F\u1004\u103A	\u101E\u100A\u103A\u1037\r\nvoicing	\u1019\u103B\u102D\u102F\u1038	\u1000\u102D\u102F\r\nvoicing	\u101C\u1031\u1038	\u1010\u102D\u102F\u1037\r\nvoicing	\u101E\u1036	\u1000\r\nvoicing	\u1019\u102D	\u1010\u101A\u103A\r\nvoicing	\u1006\u102F	\u1010\u1031\u102C\u1004\u103A\u1038\r\nvoicing	\u1011\u102C\u1038	\u1015\u1031\u1038\r\nvoicing	\u101A\u1030	\u1001\u1032\u1037\r\nvoicing	\u101B	\u101E\u103D\u102C\u1038\r\nvoicing	\u101B\u103D\u101A\u103A	\u1001\u103B\u1000\u103A\r\nvoicing	\u1001\u102F	\u1015\u1032\r\nvoicing	\u1015\u103C\u102E	\u1015\u1031\u102B\u1037\r\nschwa	\u1014\u102D\u102F\u1038	\u1005\r\nvoicing	\u101C\u1032	\u101E\u103D\u102C\u1038\r\nvoicing	\u101E\u102E	\u1000\r\nvoicing	\u1001\u1036	\u1015\u103C\u102E\u1038\r\nvoicing	\u1014\u102F	\u1015\r\nschwa	\u1014\u102E\u1038	\u1007\r\nvoicing	\u1014\u102D\u102F\u1004\u103A	\u1000\u103C\r\nvoicing	\u1019\u103E\u102C	\u1010\u1031\u102C\u1037\r\nvoicing	\u1001\u103C\u1031	\u1001\u1036\r\nvoicing	\u101E\u103D\u102C\u1038	\u101E\u1031\u102C\r\nvoicing	\u1010\u102C	\u1010\u1005\u103A\r\nvoicing	\u101D\u1004\u103A	\u1001\u1032\u1037\r\nschwa	\u101A\u1030	\u1019\r\nvoicing	\u101C\u103E\u100A\u103A\u1037	\u1000\u103C\u100A\u103A\u1037\r\nvoicing	\u101C\u1031\u1038	\u1015\u1032\r\nvoicing	\u1000\u103C\u102D\u102F\u1000\u103A	\u1010\u102C\r\nvoicing	\u101B	\u1016\u102D\u102F\u1037\r\nvoicing	\u1015\u102B	\u1015\u102B\r\nvoicing	\u1014\u1031	\u1015\u103C\u1014\u103A\r\nvoicing	\u1015\u1032	\u1015\u103C\u1031\u102C\r\nvoicing	\u1000\u1031\u102C\u1004\u103A	\u1000\r\nvoicing	\u101C\u102F\u1036\u1038	\u101E\u102C\u1038\r\nvoicing	\u1015\u103C\u102F	\u1015\u103C\u102E\u1038\r\nvoicing	\u1014\u1031	\u1005\u1009\u103A\r\nvoicing	\u1019\u103E\u102F	\u1000\r\nvoicing	\u1001\u103B\u102F\u1015\u103A	\u1000\u103C\u102E\u1038\r\nvoicing	\u101D\u1014\u103A	\u1000\u103C\u102E\u1038\r\nvoicing	\u1011\u100A\u103A\u1037	\u1015\u103C\u102E\u1038\r\nvoicing	\u1000\u103C\u102E\u1038	\u1006\u102F\u1036\u1038\r\nvoicing	\u1011\u102D\u102F	\u101E\u1030\r\nvoicing	\u1015\u103C	\u1001\u103B\u1004\u103A\r\nvoicing	\u101C\u103D\u1014\u103A	\u1001\u1032\u1037\r\nschwa	\u1014\u1005\u103A	\u1005\r\nvoicing	\u1012\u102E	\u1000\u102D\u102F\r\nvoicing	\u1010	\u1000\u102C\u1038\r\nvoicing	\u1011\u102C\u1038	\u101E\u100A\u103A\u1037\r\nvoicing	\u1019\u102D	\u101E\u103D\u102C\u1038\r\nvoicing	\u101C	\u1005\u102C\r\nvoicing	\u1000\u103C	\u1015\u103C\u102E\r\nvoicing	\u1021	\u1000\u103B\r\nvoicing	\u1005\u102C\u1038	\u1016\u102D\u102F\u1037\r\nvoicing	\u1014	\u1000\r\nvoicing	\u1010\u103D\u1000\u103A	\u1010\u1031\u102C\u1037\r\nvoicing	\u101E\u1031\u1038	\u1010\u102C\r\nvoicing	\u1014\u1031	\u101E\u100A\u103A\u1037\r\nvoicing	\u1011\u1032	\u1010\u103D\u1004\u103A\r\nvoicing	\u1000\u103C\u100A\u103A\u1037	\u1010\u1031\u102C\u1037\r\nvoicing	\u101E\u1030	\u1000\u102D\u102F\r\nschwa	\u1014\u102F	\u1021\r\nvoicing	\u1019\u103B\u102D\u102F\u1038	\u1005\u102F\u1036\r\nschwa	\u1005\u1009\u103A\u1038	\u1019\r\nvoicing	\u1019\u102D	\u1010\u102C\r\nvoicing	\u1015\u1031\u1038	\u101E\u100A\u103A\r\nvoicing	\u1000\u103C\u102D\u102F	\u1006\u102D\u102F\r\nvoicing	\u1011\u102D\u102F	\u101E\u102D\u102F\u1037\r\nvoicing	\u1005\u1005\u103A	\u1015\u103D\u1032\r\nschwa	\u1014\u102D\u102F\u1004\u103A	\u1021\r\nvoicing	\u101E\u103D\u102C\u1038	\u1016\u102D\u102F\u1037\r\nschwa	\u101C\u103E	\u1019\r\nvoicing	\u101E\u1031\u1038	\u101E\u1031\u1038\r\nvoicing	\u1018	\u101E\u102C\r\nvoicing	\u1011\u102C\u1038	\u1001\u103C\u1004\u103A\u1038\r\nvoicing	\u1000\u103B\u1004\u103A\u1038	\u1015\r\nvoicing	\u1019\u102E\u1038	\u1000\u102D\u102F\r\nvoicing	\u1021\u1031\u1038	\u1001\u103B\u1019\u103A\u1038\r\nvoicing	\u1014\u102D\u102F\u1004\u103A	\u101E\u1031\u102C\r\nvoicing	\u1000\u1031\u102C\u1004\u103A\u1038	\u101E\u100A\u103A\r\nschwa	\u1019\u1031\u1037	\u1019\r\nvoicing	\u101B\u103E\u102C	\u1015\u103C\u102E\u1038\r\nvoicing	\u1019\u103B\u102C\u1038	\u1015\u102B\r\nvoicing	\u1010\u1031\u102C\u1037	\u101E\r\nvoicing	\u101B\u103D\u102C	\u1000\u102D\u102F\r\nvoicing	\u1019\u103C\u1031	\u1015\u102F\u1036\r\nvoicing	\u1005\u1031\u102C	\u1000\u103C\u102E\u1038\r\nvoicing	\u1000\u103C\u102E\u1038	\u1011\u1032\r\nvoicing	\u1010\u1004\u103A\u1038	\u1015\u1031\u102B\u1000\u103A\r\nvoicing	\u101E\u102C	\u1015\u1030\r\nvoicing	\u1014\u100A\u103A\u1038	\u1015\u102B\u1038\r\nvoicing	\u1010\u103D\u1000\u103A	\u1000\u103C\u1031\u102C\u1004\u103A\u1037\r\nvoicing	\u1021\u102D\u1019\u103A	\u1000\r\nschwa	\u101E\u1004\u103A	\u1019\r\nvoicing	\u101E	\u1015\u102D\u1010\u103A\r\nvoicing	\u101C\u1031	\u101E\r\nschwa	\u1010\u1000\u103A	\u1019\r\nvoicing	\u101E\u103D\u102C\u1038	\u1005\u1031\r\nvoicing	\u1016	\u1001\u1004\u103A\r\nvoicing	\u1000\u103B	\u1015\u103C\u102E\u1038\r\nvoicing	\u1015\u103C\u1031\u1038	\u101E\u103D\u102C\u1038\r\nschwa	\u1000\u102C	\u1010\r\nvoicing	\u1014\u102D\u102F\u1004\u103A	\u101E\r\nvoicing	\u1014\u102D\u102F\u1004\u103A	\u101E\u1031\u1038\r\nvoicing	\u1016\u102E	\u1006\u1014\u103A\r\nvoicing	\u101B\u1004\u103A	\u1000\r\nvoicing	\u1014\u103E\u102C	\u1000\u102D\u102F\r\nvoicing	\u101E\u1004\u103A	\u101E\u100A\u103A\r\nvoicing	\u1014\u1031	\u1010\u102F\u1014\u103A\u1038\r\nvoicing	\u101C\u1031\u102C\u1000\u103A	\u1000\r\nvoicing	\u1021	\u1000\u103B\u101A\u103A\r\nschwa	\u1015\u103C	\u1019\r\nvoicing	\u101B\u102C	\u101E\u102D\u102F\u1037\r\nvoicing	\u1019\u103E\u102F	\u1000\u103C\u1031\u102C\u1004\u103A\u1037\r\nvoicing	\u101D	\u1000\r\nvoicing	\u1010	\u1000\u103C\u102E\u1038\r\nvoicing	\u1010\u1005\u103A	\u1005\u102F\r\nvoicing	\u1019\u102D	\u1000\r\nvoicing	\u101B\u102C\u1038	\u1000\u102D\u102F\r\nvoicing	\u101E\u103D\u102C\u1038	\u1001\u103C\u1004\u103A\u1038\r\nvoicing	\u1016\u102D\u102F\u1037	\u1000\r\nvoicing	\u1014\u1032\u1037	\u1000\r\nvoicing	\u1019\u100A\u103A	\u101E\u102D\u102F\u1037\r\nvoicing	\u101B\u1031\u1038	\u1015\u102B\r\nvoicing	\u101C\u1019\u103A\u1038	\u1010\u1005\u103A\r\nvoicing	\u1021\u1031\u102C\u1000\u103A	\u1000\r\nvoicing	\u1005\u102C\u1038	\u1015\u102B\r\nvoicing	\u1010\u1005\u103A	\u1005\r\nvoicing	\u1001\u103C\u102C\u1038	\u101E\u1031\u102C\r\nvoicing	\u101B\u1031\u102C\u1000\u103A	\u101E\u103D\u102C\u1038\r\nvoicing	\u1000\u102D\u102F	\u1015\u1004\u103A\r\nvoicing	\u101C\u1030	\u1000\u102D\u102F\r\nvoicing	\u101F\u102C	\u1000\r\nvoicing	\u1019\u103E\u102C	\u1000\u103B\r\nvoicing	\u100A	\u1005\u102C\r\nvoicing	\u1000\u103C\u102D\u102F\u1000\u103A	\u1010\u1032\u1037\r\nvoicing	\u101E\u1036	\u101E\r\nvoicing	\u1016\u103C\u1005\u103A	\u1016\u103C\u1005\u103A\r\nvoicing	\u1015\u103C\u102F\u1010\u103A	\u1000\u103B\r\nvoicing	\u1021\u1030\u1038	\u1000\u103C\u102E\u1038\r\nvoicing	\u1019\u103D\u1031\u1038	\u1005\u102C\u1038\r\nvoicing	\u1016\u102D\u102F\u1037	\u1015\u1032\r\nvoicing	\u1000\u103C\u1036	\u1005\u100A\u103A\r\nvoicing	\u1011\u102D\u102F\u1038	\u1015\u103C\u102E\u1038\r\nvoicing	\u1014\u1031	\u1015\u1031\r\nschwa	\u101C\u102D\u102F\u1000\u103A	\u1019\r\nvoicing	\u1005\u102F	\u1000\r\nvoicing	\u1014\u1031	\u1000\r\nvoicing	\u1019\u103C\u1031	\u1000\u103C\u102E\u1038\r\nvoicing	\u1021\u1031\u102C\u1000\u103A	\u1000\u102D\u102F\r\nvoicing	\u1019\u103C\u1014\u103A	\u1006\u102F\u1036\u1038\r\nvoicing	\u101B\u1014\u103A	\u101E\u1030\r\nschwa	\u100F\u102E	\u1015\r\nvoicing	\u1021\u102C\u1038	\u1005\u102F\r\nvoicing	\u1010\u1014\u103A	\u1016\u102D\u102F\u1038\r\nvoicing	\u101C\u102C	\u1001\u103C\u1004\u103A\u1038\r\nvoicing	\u1010\u102D	\u1010\u102D\r\nvoicing	\u101E\u102D	\u101E\u102D\r\nvoicing	\u1015\u103C\u1004\u103A	\u1015\r\nvoicing	\u1021\u102F	\u1010\u102F\r\nvoicing	\u1014\u1036	\u1015\u102B\u1010\u103A\r\nvoicing	\u1021	\u1015\u102B\r\nvoicing	\u1010\u1005\u103A	\u1005\u102E\u1038\r\nvoicing	\u1001\u1031\u102B\u1004\u103A\u1038	\u1000\u102D\u102F\r\nvoicing	\u1001\u103D\u1004\u103A\u1037	\u1015\u1031\u1038\r\nvoicing	\u1021\u1030\u1038	\u101E\u100A\u103A\r\nvoicing	\u1016\u1000\u103A	\u1000\u102D\u102F\r\nvoicing	\u101E\u102C\u1038	\u1000\u1031\u102C\u1004\u103A\r\nvoicing	\u101B	\u1015\u1031\r\nvoicing	\u1019\u103B\u102C\u1038	\u1006\u102F\u1036\u1038\r\nvoicing	\u1019\u1010\u103A	\u1010\u1015\u103A\r\nvoicing	\u101C\u1031\u1037	\u1000\u103B\u1004\u103A\u1037\r\nvoicing	\u101C\u1031\u102C\u1000\u103A	\u1000\u102D\u102F\r\nvoicing	\u101E\u1000\u103A	\u101E\u1031\r\nvoicing	\u1001\u103B	\u1015\u1031\u1038\r\nvoicing	\u1010\u1030	\u1015\u102B\r\nvoicing	\u1014\u100A\u103A\u1038	\u1006\u102F\u1036\u1038\r\nvoicing	\u1015\u103C\u1031\u102C	\u1000\u103C\u102C\u1038\r\nvoicing	\u1005\u102E\u1038	\u1015\u103D\u102C\u1038\r\nschwa	\u1015\u103C\u1010\u103A	\u1019\r\nvoicing	\u101C\u1031\u102C\u1000\u103A	\u1015\u102B\r\nvoicing	\u1010\u103D\u1031\u1037	\u1000\u103C\r\nvoicing	\u101A\u1031\u102C\u1000\u103A	\u1015\u1032\r\nvoicing	\u1000\u1031\u102C\u1004\u103A\u1038	\u1000\u1004\u103A\r\nvoicing	\u101E\u1031\u102C\u1000\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u1015\u103C\u1004\u103A	\u1000\u102D\u102F\r\nvoicing	\u101E\u102D	\u1015\u103C\u102E\u1038\r\nvoicing	\u1014\u1031\u1037	\u1000\u103B\r\nvoicing	\u101E\u102C	\u1000\u102D\u102F\r\nvoicing	\u1001\u103B\u1004\u103A	\u101E\r\nvoicing	\u1012\u102E	\u1015\r\nvoicing	\u1019\u1014\u103A	\u1010\r\nvoicing	\u101E\u1000\u103A	\u1010\u1032\u1037\r\nschwa	\u1011\u1030\u1038	\u1019\r\nvoicing	\u101B\u103E\u1004\u103A\u1038	\u1015\u1031\u1038\r\nvoicing	\u1005\u102C\u1038	\u1015\u103D\u1032\r\nvoicing	\u1010\u103D\u1031\u1037	\u1015\u103C\u102E\u1038\r\nvoicing	\u1000\u103C\u102E\u1038	\u1010\u1032\u1037\r\nvoicing	\u1000\u102F\u1014\u103A	\u101E\u100A\u103A\r\nvoicing	\u1005\u102D\u102F\u1000\u103A	\u1015\u103B\u102D\u102F\u1038\r\nvoicing	\u1006\u1036	\u1015\u1031\u1038\r\nvoicing	\u1010\u1010\u103A	\u101E\u100A\u103A\r\nvoicing	\u1021\u102C\u1038	\u1000\r\nschwa	\u1000\u103B\u1014\u103A	\u1019\r\nvoicing	\u101E\u102C\u1038	\u1000\u103C\u102E\u1038\r\nvoicing	\u1006\u1031\u1038	\u1001\u1014\u103A\u1038\r\nvoicing	\u1021	\u1015\u102D\u102F\u1004\u103A\r\nvoicing	\u101C\u103D\u1004\u103A	\u1000\r\nschwa	\u1005\u102D\u102F\u1000\u103A	\u1019\r\nvoicing	\u101B\u103D\u102C	\u101E\u1030\r\nvoicing	\u101C\u1030	\u1005\u102F\r\nvoicing	\u1015\u1032	\u1015\u1031\u102B\u1037\r\nvoicing	\u1000	\u1010\u100A\u103A\u1038\r\nvoicing	\u1014\u102C\u1038	\u1000\u102D\u102F\r\nvoicing	\u1010	\u1000\u103B\r\nvoicing	\u1019\u103C\u1004\u103A	\u1016\u1030\u1038\r\nvoicing	\u101C\u102C	\u1005\u1031\r\nvoicing	\u1011\u102F	\u1000\u102D\u102F\r\nvoicing	\u1019\u103B\u102C\u1038	\u101E\u1031\u102C\r\nvoicing	\u101F\u102F\u1010\u103A	\u1010\u1032\u1037\r\nvoicing	\u1021\u1014\u103A	\u1010\r\nvoicing	\u1021	\u1000\u103C\u102F\u1036\r\nvoicing	\u101A\u1031\u102C\u1000\u103A	\u1015\u102B\r\nvoicing	\u101C\u1031	\u101E\u1036\r\nvoicing	\u101C\u1031\u1038	\u1006\u102E\r\nvoicing	\u1004\u101A\u103A	\u1000\r\nvoicing	\u101F\u102F\u1010\u103A	\u1015\u102B\u1037\r\nvoicing	\u1021\u1030\u1038	\u1005\u102E\u1038\r\nvoicing	\u101E\u1031\u1038	\u1005\u102D\u1010\u103A\r\nvoicing	\u1021\u102F\u1015\u103A	\u1000\r\nvoicing	\u101C\u103E	\u1015\u102B\r\nvoicing	\u101C\u103E	\u101E\u100A\u103A\r\nschwa	\u101B\u1031\u102C\u1000\u103A	\u1019\r\nvoicing	\u1010\u1005\u103A	\u1000\u103C\u102D\u1019\u103A\r\nvoicing	\u101B\u1030\u1038	\u1000\u103C\u102E\u1038\r\nvoicing	\u1005	\u1010\u102F\r\nvoicing	\u1015\u103C\u102E\u1038	\u1001\u1032\u1037\r\nvoicing	\u101B\u103E\u1031\u1037	\u1000\r\nvoicing	\u101C\u100A\u103A	\u1015\u1010\u103A\r\nvoicing	\u1010\u1032\u1037	\u101E\r\nvoicing	\u1000\u103B\u103D\u1019\u103A\u1038	\u1000\u103B\u1004\u103A\r\nvoicing	\u1000\u102D\u102F\u101A\u103A	\u1005\u102C\u1038\r\nvoicing	\u1014\u1031	\u1016\u102D\u102F\u1037\r\nvoicing	\u1021\u1015\u103A	\u1015\u102B\r\nschwa	\u1014\u1032	\u1000\r\nvoicing	\u1006\u102D\u102F	\u1001\u1032\u1037\r\nvoicing	\u1000\u103C\u102C\u1038	\u1016\u1030\u1038\r\nvoicing	\u1000\u103D\u1032	\u1015\u103C\u102C\u1038\r\nvoicing	\u1015\u103C\u1031\u102C	\u1015\u1031\u1038\r\nschwa	\u1015\u102D\u1010\u103A	\u101E\r\nvoicing	\u1019\u102E\u1038	\u1001\u102D\u102F\u1038\r\nvoicing	\u1015\u103C	\u1015\u102B\r\nvoicing	\u101B\u1000\u103A	\u1010\u103D\u1031\r\nvoicing	\u1014\u102C	\u1000\u103B\u1004\u103A\r\nvoicing	\u1019\u102E\u1038	\u1010\u102D\u102F\u1037\r\nvoicing	\u1000\u103C\u100A\u103A\u1037	\u1001\u103B\u1004\u103A\r\nvoicing	\u1019\u103C\u102D\u102F\u1037	\u1000\r\nvoicing	\u1012\u102E	\u101E\r\nvoicing	\u101C\u102C	\u1000\r\nvoicing	\u1014\u102C\u1038	\u1000\r\nvoicing	\u1016\u103C\u1005\u103A	\u101E\u1030\r\nvoicing	\u101B\u1031\u102C\u1000\u103A	\u1010\u102C\r\nvoicing	\u1018\u101A\u103A	\u1000\r\nvoicing	\u1006\u102D\u102F	\u1000\u103C\r\nschwa	\u101E\u102F\u1036\u1038	\u1019\r\nvoicing	\u1015\u103C\u1031	\u101E\u103D\u102C\u1038\r\nvoicing	\u101E\u102D\u102F\u1037	\u101E\u1031\u102C\r\nvoicing	\u101C\u1031	\u1010\u101A\u103A\r\nvoicing	\u1015\u103C\u102E\u1038	\u1010\u102C\r\nvoicing	\u1000\u103B\u102D\u102F\u1038	\u1000\u102D\u102F\r\nschwa	\u101C\u103D\u101A\u103A	\u1019\r\nvoicing	\u1010\u1000\u103A	\u1015\u102F\r\nvoicing	\u1015\u102F	\u1000\r\nvoicing	\u1000\u1014\u103A\u1037	\u1000\u103D\u1000\u103A\r\nvoicing	\u101C\u102D\u102F\u1000\u103A	\u1015\u1031\u102B\u1037\r\nvoicing	\u1021	\u1015\u103C\u102C\u1038\r\nschwa	\u1000\u102D\u102F\u1004\u103A	\u1019\r\nschwa	\u1014\u102C	\u1012\r\nvoicing	\u1000\u1031\u102C\u1004\u103A	\u1000\u102D\u102F\r\nvoicing	\u1010\u100A\u103A\u1037	\u1010\u100A\u103A\u1037\r\nschwa	\u1014\u100A\u103A\u1038	\u1019\r\nvoicing	\u1000\u102C\u1038	\u1000\u103C\u1031\u102C\u1004\u103A\u1037\r\nvoicing	\u1014\u1031	\u1015\u102F\u1036\r\nvoicing	\u101C	\u1000\u102C\r\nvoicing	\u101C\u102C	\u101E\u1030\r\nvoicing	\u101E\u102C	\u101E\u1030\r\nvoicing	\u1005\u1009\u103A	\u1000\r\nvoicing	\u101C\u102F\u1015\u103A	\u1015\u103C\r\nvoicing	\u1021	\u1000\u103C\u102C\u1038\r\nvoicing	\u1011\u1030\u1038	\u1011\u1030\u1038\r\nvoicing	\u1016\u1019\u103A\u1038	\u1006\u102E\u1038\r\nvoicing	\u1010\u103D\u1031	\u1000\u103C\u102C\u1038\r\nvoicing	\u101C\u1032	\u1000\u103B\r\nvoicing	\u101B\u103E\u102D	\u1005\u1031\r\nvoicing	\u1021	\u101E\u102F\r\nvoicing	\u1015\u102B	\u101E\u1031\u102C\r\nvoicing	\u1010\u1014\u103A	\u1000\u103C\u102C\r\nvoicing	\u101A\u1030	\u1000\u102C\r\nvoicing	\u101B\u103E\u100A\u103A	\u1000\r\nvoicing	\u101E\u102D	\u101E\u1031\u1038\r\nvoicing	\u1001\u1004\u103A	\u1000\r\nvoicing	\u1015\u103C\u1014\u103A	\u101E\u100A\u103A\r\nvoicing	\u1001\u102B\u1038	\u1000\u102D\u102F\r\nvoicing	\u101C\u102D\u102F	\u101E\u100A\u103A\r\nvoicing	\u1010\u102D\u102F\u1004\u103A\u1038	\u1000\u102D\u102F\r\nvoicing	\u1000\u103C\u102C\u1038	\u1001\u1032\u1037\r\nvoicing	\u1019\u100A\u103A	\u101E\u100A\u103A\u1037\r\nvoicing	\u1014\u102D\u102F\u1004\u103A	\u1016\u102D\u102F\u1037\r\nvoicing	\u1000\u102D\u102F	\u1010\u103D\u1010\u103A\r\nvoicing	\u1000\u103C\u100A\u103A\u1037	\u1000\u103C\u100A\u103A\u1037\r\nvoicing	\u1000\u101A\u103A	\u1000\u102D\u102F\r\nvoicing	\u1010\u102C	\u1000\u102D\u102F\u1038\r\nschwa	\u1011\u102D	\u1019\r\nvoicing	\u1001\u103C\u102C\u1038	\u101E\u1030\r\nvoicing	\u1004\u103E\u1000\u103A	\u1015\u103B\u1031\u102C\r\nschwa	\u1012\u1031	\u1015\r\nvoicing	\u1014\u1031\u102C\u1000\u103A	\u1010\u1031\u102C\u1037\r\nvoicing	\u1010\u1000\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u101B\u1000\u103A	\u1000\u103B\r\nvoicing	\u1014\u102C	\u1000\u102D\u102F\r\nvoicing	\u1018\u102C	\u1000\u102D\u102F\r\nvoicing	\u1019\u102D	\u1000\u103C\r\nvoicing	\u101B\u1015\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u1015\u1004\u103A	\u1000\u103C\u102E\u1038\r\nvoicing	\u1019\u103E\u1014\u103A	\u101E\r\nvoicing	\u100A\u102E	\u101E\u1031\u102C\r\nvoicing	\u1005\u102F	\u1000\u102D\u102F\r\nvoicing	\u101C\u1031\u1038	\u101E\u100A\u103A\r\nvoicing	\u101C\u102C	\u1001\u103B\u1004\u103A\r\nschwa	\u1000\u103C\u102E\u1038	\u1010\r\nvoicing	\u101E\u1005\u103A	\u1010\u103D\u1031\r\nvoicing	\u1014\u1000\u103A	\u1000\u103B\r\nvoicing	\u100A\u102C	\u1010\u1010\u103A\r\nvoicing	\u101E\u1031\u102C	\u101E\u1030\r\nvoicing	\u1005\u102E\u1038	\u1005\u102E\u1038\r\nvoicing	\u1016\u1030\u1038	\u1010\u1032\u1037\r\nvoicing	\u1014\u102C	\u1005\r\nvoicing	\u101E\u102D	\u1001\u1032\u1037\r\nschwa	\u1019\u103E\u1014\u103A	\u1019\r\nvoicing	\u101E\u103D\u102C\u1038	\u1005\r\nvoicing	\u1021\u1014\u103A	\u1010\u102E\u1037\r\nvoicing	\u101B\u1031	\u1000\u1014\u103A\r\nvoicing	\u1019\u102D	\u1015\u103C\u102E\u1038\r\nvoicing	\u1004\u1031\u1038	\u1000\u103C\u100A\u103A\u1037\r\nvoicing	\u1010\u103D\u1004\u103A\u1038	\u101E\u102D\u102F\u1037\r\nvoicing	\u101C\u1019\u103A\u1038	\u1000\u102D\u102F\r\nvoicing	\u1000\u103B	\u1000\u103B\r\nvoicing	\u1010	\u1000\u103D\r\nvoicing	\u100F	\u1000\u103C\u102C\r\nvoicing	\u1010\u1031\u102C	\u101E\u102C\u1038\r\nvoicing	\u1019\u100A\u103A	\u1000\u103C\u102E\u1038\r\nvoicing	\u101E\u1000\u103A	\u1010\u1019\u103A\u1038\r\nvoicing	\u101F\u1030	\u101E\u1031\u102C\r\nvoicing	\u101C\u103E	\u101E\u1031\u102C\r\nvoicing	\u101C\u103D\u103E\u1010\u103A	\u1015\u1031\u1038\r\nvoicing	\u1010\u1031\u102C\u1004\u103A	\u1000\u103C\u102E\u1038\r\nvoicing	\u1015\u103C\u102E\u1038	\u1000\r\nvoicing	\u1019\u103B\u103E	\u1000\u102D\u102F\r\nvoicing	\u1000\u103C\u102E\u1038	\u1000\u103B\u1031\u102C\u1004\u103A\u1038\r\nvoicing	\u1014\u102D\u102F\u1004\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u101C\u102D\u1015\u103A	\u1010\u103D\u1031\r\nvoicing	\u101B\u1000\u103A	\u1015\u102D\u102F\u1004\u103A\u1038\r\nvoicing	\u1001\u103C\u1004\u103A\u1038	\u1000\u103C\u1031\u102C\u1004\u103A\u1037\r\nvoicing	\u1000	\u1000\u103C\u102E\u1038\r\nvoicing	\u101B\u1004\u103A	\u1006\u102F\u1036\u1038\r\nvoicing	\u1001\u103C\u1031	\u101E\u1036\r\nvoicing	\u101C\u102C	\u101E\u100A\u103A\u1037\r\nvoicing	\u1014\u102D\u102F\u1004\u103A	\u1005\u103D\u1019\u103A\u1038\r\nvoicing	\u1010\u100A\u103A\u1038	\u101E\u1031\u102C\r\nvoicing	\u1010\u102C	\u1010\u1031\u102C\u1037\r\nvoicing	\u1006\u1031\u102C\u1004\u103A	\u1015\u1031\u1038\r\nvoicing	\u101B	\u1000\r\nvoicing	\u101C\u102D\u102F\u1000\u103A	\u1000\u103C\u100A\u103A\u1037\r\nvoicing	\u1019\u102D	\u101E\u1031\u1038\r\nvoicing	\u101B\u100A\u103A	\u1000\u102D\u102F\r\nvoicing	\u101B\u1004\u103A\u1038	\u1000\r\nvoicing	\u1015\u103C	\u101E\u100A\u103A\r\nvoicing	\u101B\u102C	\u1015\u102B\r\nvoicing	\u101C\u103E\u1031	\u1000\u102C\u1038\r\nvoicing	\u1016\u103C\u1005\u103A	\u1010\u1010\u103A\r\nvoicing	\u1011\u102F\u1010\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u1000\u102D\u102F\u1038	\u1000\u103D\u101A\u103A\r\nvoicing	\u1001\u103B\u1031	\u1015\u103C\u102E\r\nschwa	\u1001\u103B\u1005\u103A	\u1019\r\nvoicing	\u1021\u1030\u1038	\u1006\u102F\u1036\u1038\r\nvoicing	\u101E\u102D	\u101E\r\nvoicing	\u101B	\u1015\u103C\u1014\u103A\r\nvoicing	\u1006\u1000\u103A	\u1010\u102C\r\nvoicing	\u1019\u1031\u102C\u1004\u103A	\u101E\u100A\u103A\r\nvoicing	\u101F\u102C	\u1000\u102D\u102F\r\nvoicing	\u1019\u103E\u1010\u103A	\u1015\u103C\u102F\r\nvoicing	\u1006\u102D\u102F	\u1000\u102C\r\nvoicing	\u1015\u1031\u1038	\u1005\r\nvoicing	\u1010\u1005\u103A	\u1015\u102F\u1012\u103A\r\nvoicing	\u101C\u1030	\u1006\u102D\u102F\u1038\r\nvoicing	\u100A	\u1000\u103B\r\nvoicing	\u1015\u1014\u103A\u1038	\u1001\u103B\u102E\r\nvoicing	\u1016\u103C\u100A\u103A\u1038	\u1001\u103B\u1004\u103A\u1038\r\nvoicing	\u1018\u102F\u1014\u103A\u1038	\u1000\u103C\u102E\u1038\r\nvoicing	\u1000\u102D\u102F\u101A\u103A	\u1015\u102D\u102F\u1004\u103A\r\nvoicing	\u1000\u103C\u100A\u103A\u1037	\u101E\u100A\u103A\r\nvoicing	\u1010\u102D\u102F\u1037	\u1015\u102B\r\nvoicing	\u1005\u1031\u102C	\u1000\r\nvoicing	\u101E\u1030	\u1015\u1032\r\nvoicing	\u101B\u103E\u1004\u103A	\u1000\r\nvoicing	\u101E\u1004\u103A	\u1000\u103C\u102C\u1038\r\nvoicing	\u101B\u102E\u1038	\u101E\u100A\u103A\r\nvoicing	\u1015\u103C\u102E\u1038	\u101E\u1031\u1038\r\nvoicing	\u1014\u1031	\u1010\u1005\u103A\r\nvoicing	\u1021\u1031\u100A\u103A\u1037	\u1001\u1014\u103A\u1038\r\nvoicing	\u101C\u102D\u102F\u1037	\u1015\u1031\u102B\u1037\r\nvoicing	\u101B\u1015\u103A	\u1010\u100A\u103A\r\nvoicing	\u1019\u102E\u1038	\u1000\r\nschwa	\u1010\u102D\u102F\u1004\u103A	\u1019\r\nvoicing	\u1019\u103B\u102D\u102F\u1038	\u1000\r\nvoicing	\u101E\u1000\u103A	\u101E\u102C\r\nvoicing	\u101B\u102C\u1038	\u1005\u102C\r\nvoicing	\u1019\u102D	\u1000\u102D\u102F\r\nvoicing	\u101D\u102B	\u1000\u103C\u102E\u1038\r\nvoicing	\u1014\u103E\u1005\u103A	\u1015\u1031\u102B\u1004\u103A\u1038\r\nvoicing	\u101B\u100A\u103A	\u1006\u102D\u102F\u1004\u103A\r\nvoicing	\u1018\u102C	\u1000\u103C\u102E\u1038\r\nvoicing	\u1010\u1005\u103A	\u1015\u102F\u1036\r\nvoicing	\u1001\u103B\u102F\u1015\u103A	\u1000\u102D\u102F\r\nvoicing	\u101B\u1015\u103A	\u1010\u103D\u1031\r\nvoicing	\u1001\u103B\u1005\u103A	\u101E\u1030\r\nvoicing	\u1021\u102D\u1019\u103A	\u1000\u103C\u102E\u1038\r\nschwa	\u1010\u1032\u1037	\u101E\r\nvoicing	\u1014\u102E\u1038	\u1005\u1015\u103A\r\nvoicing	\u1019\u103B\u102C\u1038	\u1000\u103C\u102C\u1038\r\nvoicing	\u1000\u103C\u102C	\u1000\u103C\u102C\r\nvoicing	\u1001\u1032\u1037	\u1015\u103C\u102E\r\nschwa	\u1006\u102D\u102F\u1038	\u1019\r\nvoicing	\u1010\u103D\u1031	\u1015\u1031\u102B\u1037\r\nvoicing	\u101C\u103E\u100A\u103A\u1037	\u1015\u1010\u103A\r\nvoicing	\u1014\u1032\u1037	\u1015\u1031\u102B\u1037\r\nvoicing	\u101C\u103D\u1004\u103A	\u1000\u102D\u102F\r\nvoicing	\u1000\u103C\u102E\u1038	\u1000\u103B\u101A\u103A\r\nvoicing	\u101B\u103E\u102D	\u1000\u103C\u1031\u102C\u1004\u103A\u1038\r\nvoicing	\u1011\u102C\u1038	\u1000\u102D\u102F\r\nvoicing	\u1019\u103E\u102C	\u1000\u102D\u102F\r\nschwa	\u101F\u102F	\u1017\r\nvoicing	\u1021\u102E	\u1010\r\nvoicing	\u1019	\u101E\u1032\r\nvoicing	\u1019	\u101E\u102E\u1038\r\nvoicing	\u1015\u1031\u1038	\u1001\u103C\u1004\u103A\u1038\r\nvoicing	\u101C\u1030	\u1000\u1031\u102C\u1004\u103A\u1038\r\nschwa	\u1014\u102C\u1038	\u1019\r\nvoicing	\u1010\u102D\u102F\u1037	\u1000\u103C\u1031\u102C\u1004\u103A\u1037\r\nvoicing	\u1006\u102E	\u101E\u102D\u102F\u1037\r\nvoicing	\u1010\u103D\u1031	\u1000\u103B\r\nvoicing	\u1019\u103E	\u101E\u102C\r\nvoicing	\u1019\u101A\u103A	\u1015\u1031\u102B\u1037\r\nvoicing	\u1012\u102B	\u1015\u1032\r\nvoicing	\u101B\u1031\u102C\u1000\u103A	\u1010\u101A\u103A\r\nvoicing	\u1010\u1005\u103A	\u101E\u1000\u103A\r\nvoicing	\u101C\u102C	\u1015\u103C\u1014\u103A\r\nvoicing	\u101C\u1031\u1038	\u1011\u1032\r\nvoicing	\u101C\u103D\u1032	\u1015\u103C\u102E\u1038\r\nschwa	\u101C\u102D\u1015\u103A	\u1002\r\nvoicing	\u1021\u102F\u1015\u103A	\u1000\u103C\u102E\u1038\r\nvoicing	\u101C\u102C	\u1000\u102C\r\nvoicing	\u1000\u102D\u102F	\u1015\u102D\u102F\r\nschwa	\u1019\u1014\u103A	\u1010\r\nvoicing	\u1019\u102D\u1010\u103A	\u1010\u102C\r\nvoicing	\u1015\u102D\u102F\u1004\u103A\u1038	\u1000\u102D\u102F\r\nvoicing	\u1011\u102D\u102F\u1004\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u1010\u102D\u102F\u1037	\u1015\u103C\u100A\u103A\r\nvoicing	\u1010\u102D\u102F\u1000\u103A	\u1015\u103D\u1032\r\nschwa	\u1000\u103B	\u1010\r\nvoicing	\u1010\u1030	\u1010\u101A\u103A\r\nvoicing	\u1001\u103B\u102D\u1014\u103A	\u1015\u1031\u1038\r\nvoicing	\u101C\u1019\u103A\u1038	\u1000\u103C\u1031\u102C\u1004\u103A\u1038\r\nvoicing	\u101C\u1031\u102C\u1000\u103A	\u1000\u103C\u102C\r\nvoicing	\u1014\u103E\u1004\u103A\u1038	\u1006\u102E\r\nvoicing	\u1010\u1036	\u1006\u102D\u1015\u103A\r\nvoicing	\u1015\u1031	\u101E\u100A\u103A\r\nvoicing	\u1021	\u1010\u102C\r\nvoicing	\u1010\u1004\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u101C\u102D\u102F\u1000\u103A	\u1010\u102D\u102F\u1004\u103A\u1038\r\nvoicing	\u1014\u1032\u1037	\u1000\u102D\u102F\r\nvoicing	\u1005\u1004\u103A	\u1005\u1005\u103A\r\nvoicing	\u1010\u101A\u103A	\u1010\u1032\u1037\r\nvoicing	\u1006\u103D\u1032	\u1015\u103C\u102E\u1038\r\nvoicing	\u1010\u1036	\u1010\u102C\u1038\r\nvoicing	\u101C\u1031	\u1000\u103B\r\nvoicing	\u1015\u102B\u1038	\u1000\u102D\u102F\r\nvoicing	\u1021\u102D\u1015\u103A	\u1010\u1031\u102C\u1037\r\nvoicing	\u100A\u102D\u102F	\u1000\u103C\u102E\u1038\r\nvoicing	\u1019\u103E\u102F	\u1010\u103D\u1031\r\nvoicing	\u1015\u1004\u103A	\u1000\u102D\u102F\r\nvoicing	\u1014\u1031	\u1000\u102F\u1014\u103A\r\nvoicing	\u101B\u102F\u1015\u103A	\u1000\u102D\u102F\r\nvoicing	\u1010\u102D\u102F\u1000\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u1014\u1031	\u1015\u1030\r\nvoicing	\u101C\u100A\u103A	\u101E\u103D\u102C\u1038\r\nvoicing	\u1015\u102D\u102F\u1004\u103A	\u1001\u103D\u1004\u103A\u1037\r\nvoicing	\u1000\u103C\u102D\u102F\u1000\u103A	\u1010\u101A\u103A\r\nvoicing	\u1010\u1004\u103A	\u1010\u1004\u103A\r\nvoicing	\u101C\u1031\u1038	\u1015\u103C\u1031\u102C\r\nvoicing	\u1001\u103B\u102D\u1014\u103A	\u1000\r\nvoicing	\u1019\u102D\u102F\u1038	\u1000\r\nvoicing	\u1019\u100A\u103A	\u1000\u102D\u102F\r\nvoicing	\u1010\u102C	\u1000\u103C\u102E\u1038\r\nvoicing	\u1001\u1000\u103A	\u1010\u101A\u103A\r\nvoicing	\u1021\u1015\u103A	\u1010\u102C\r\nvoicing	\u1000\u103B	\u101E\u1031\u102C\r\nvoicing	\u101C\u102F\u1036\u1038	\u1000\u103C\u102E\u1038\r\nvoicing	\u101B\u1019\u103A\u1038	\u1000\u102D\u102F\r\nvoicing	\u1005\u102C\u1038	\u101E\r\nvoicing	\u1000\u102D\u102F\u101A\u103A	\u1005\u102E\r\nvoicing	\u1010\u102D\u1010\u103A	\u1010\u102D\u1010\u103A\r\nvoicing	\u1019\u1004\u103A\u1038	\u1006\u102D\u102F\u1004\u103A\r\nvoicing	\u1000\u103C\u102E\u1038	\u1010\u102C\r\nvoicing	\u1005	\u101E\u100A\u103A\r\nvoicing	\u1019\u102D	\u101E\r\nvoicing	\u101B\u103E\u102C	\u1015\u1031\u1038\r\nvoicing	\u101C\u102C	\u1010\u1010\u103A\r\nvoicing	\u1000\u103C	\u1005\u1019\u103A\u1038\r\nvoicing	\u1010\u102C	\u1010\u1031\u102C\u1004\u103A\r\nvoicing	\u1001\u103B\u102F\u1015\u103A	\u1000\r\nvoicing	\u1019\u1031\u1037	\u101E\u103D\u102C\u1038\r\nvoicing	\u1000\u103C\u1031\u102C\u1000\u103A	\u1015\u102B\r\nvoicing	\u1019\u103B\u102D\u102F\u1038	\u1015\u1031\u102B\u1037\r\nvoicing	\u1021\u102C\u1038	\u1000\u103C\u102E\u1038\r\nvoicing	\u101C\u101A\u103A	\u101E\r\nvoicing	\u1014\u102C\u1038	\u1005\r\nvoicing	\u101C\u1030	\u1010\u102D\u102F\u1004\u103A\u1038\r\nvoicing	\u101E\u103D\u102C\u1038	\u101E\u1031\u1038\r\nvoicing	\u1010\u102C	\u1000\u103B\r\nvoicing	\u1004\u1036	\u101E\u102C\u1038\r\nvoicing	\u101B	\u1005\r\nvoicing	\u1018\u1031\u102C	\u1010\r\nvoicing	\u1000\u1030	\u1015\u1031\u1038\r\nvoicing	\u1000\u102D\u102F	\u1000\u103B\r\nvoicing	\u1015\u1030	\u1015\u102B\r\nvoicing	\u101E\u102C	\u1015\u102B\r\nvoicing	\u1000\u103C\u100A\u103A\u1037	\u1010\u102C\r\nvoicing	\u1015\u1004\u103A	\u1015\u1014\u103A\u1038\r\nvoicing	\u101C\u1031\u102C\u1000\u103A	\u1000\u103C\u102E\u1038\r\nvoicing	\u1014\u1031	\u101E\u102C\r\nvoicing	\u1001\u1032\u1037	\u101E\u100A\u103A\u1037\r\nvoicing	\u101C\u102D\u102F	\u1015\u1031\u102B\u1037\r\nvoicing	\u1019\u103C\u1004\u103A	\u1000\u103D\u1004\u103A\u1038\r\nvoicing	\u1014\u103E\u1005\u103A	\u1000\r\nvoicing	\u101C\u100A\u103A	\u1015\u1004\u103A\u1038\r\nvoicing	\u1019\u103E\u102C	\u101E\u102C\r\nvoicing	\u101B\u101A\u103A	\u101E\u1036\r\nvoicing	\u1011\u102D	\u1000\u102D\u102F\r\nvoicing	\u1000\u102F\u1014\u103A	\u1000\u103C\r\nvoicing	\u1015\u1036	\u1015\r\nvoicing	\u1019\u103E\u102F	\u101E\u100A\u103A\r\nvoicing	\u1000\u103C	\u101E\u100A\u103A\u1037\r\nvoicing	\u1000\u1032\u1037	\u1015\u102B\r\nvoicing	\u1011\u1000\u103A	\u1010\u1031\u102C\u1004\u103A\r\nvoicing	\u1015\u103C\u102E\u1038	\u1010\u1032\u1037\r\nvoicing	\u101E\u102C\u1038	\u1015\u1032\r\nvoicing	\u101B\u1032	\u1000\u103C\u102E\u1038\r\nvoicing	\u101B\u100A\u103A	\u1005\u1030\u1038\r\nvoicing	\u1004\u101A\u103A	\u1000\u102D\u102F\r\nvoicing	\u101B\u1031\u1038	\u1000\r\nvoicing	\u1015\u103C\u1014\u103A	\u1000\u103C\r\nvoicing	\u1010\u102D	\u1000\u103B\r\nvoicing	\u1000\u103C\u102D\u1019\u103A	\u1000\u103C\u102D\u1019\u103A\r\nvoicing	\u1005\u1030\u1038	\u1005\u1019\u103A\u1038\r\nvoicing	\u1019\u102D	\u1010\u1032\u1037\r\nvoicing	\u1016\u103C\u1005\u103A	\u101E\u1031\u102C\r\nschwa	\u1010\u102D\u102F\u1000\u103A	\u1019\r\nvoicing	\u1016\u103D\u1032\u1037	\u1005\u100A\u103A\u1038\r\nvoicing	\u1000	\u1015\u102B\r\nvoicing	\u1019\u103B\u102C\u1038	\u1000\u103C\u1031\u102C\u1004\u103A\u1037\r\nvoicing	\u101B\u102C\u1038	\u1010\r\nvoicing	\u101D\u101A\u103A	\u1015\u103C\u102E\u1038\r\nvoicing	\u1021\u1030\u1038	\u1001\u1031\u102B\u1004\u103A\u1038\r\nvoicing	\u1019\u103B\u102C\u1038	\u101E\u102C\r\nvoicing	\u1007\u102C\u1010\u103A	\u1000\u102C\u1038\r\nvoicing	\u101C\u102D\u102F	\u1005\r\nvoicing	\u1021	\u1010\u102D\u102F\u1038\r\nvoicing	\u1019\u103B\u102D\u102F\u1038	\u1006\u1000\u103A\r\nvoicing	\u1010\u100A\u103A\u1038	\u1015\u1032\r\nvoicing	\u101B\u103E\u102D	\u1015\u1031\r\nvoicing	\u1017\u103B\u102C\u1038	\u1000\r\nschwa	\u101C\u103D\u1010\u103A	\u1019\r\nvoicing	\u101B\u103E\u102C	\u1000\u103C\r\nvoicing	\u1011\u102D\u102F\u1038	\u1015\u1031\u1038\r\nvoicing	\u101C\u102D\u102F\u1000\u103A	\u101E\u1031\u102C\r\nvoicing	\u101C\u102D\u102F	\u101E\u1031\u102C\r\nvoicing	\u101E\u1030	\u1015\u102B\r\nvoicing	\u101B\u1031	\u1005\u1000\u103A\r\nschwa	\u1000\u1032\u1037	\u101E\r\nvoicing	\u101E\u103D\u102C\u1038	\u1015\u1031\u1038\r\nvoicing	\u1005\u102F	\u1015\u103C\u102E\u1038\r\nvoicing	\u1001\u103B\u102D\u102F\u1037	\u101E\u1031\u102C\r\nvoicing	\u1015	\u1010\u1031\u1037\r\nvoicing	\u1001\u103B\u1004\u103A	\u101E\u100A\u103A\r\nvoicing	\u1012\u102E	\u1000\u103B\u103D\u1014\u103A\u1038\r\nvoicing	\u1000\u103C\u1036	\u1015\u1031\u1038\r\nvoicing	\u1000\u103C\u102C	\u1015\u103C\u102E\r\nvoicing	\u1005\u102C\u1038	\u1010\u1010\u103A\r\nvoicing	\u1001\u1032\u1037	\u1015\u1031\r\nvoicing	\u101E\u102E\u1038	\u101E\u1014\u103A\u1037\r\nvoicing	\u1011\u102C\u1038	\u101E\u1031\u1038\r\nvoicing	\u1015\u103B\u1000\u103A	\u1010\u103D\u1031\r\nvoicing	\u1012\u102E	\u1000\u103C\u102C\u1038\r\nvoicing	\u1019\u1004\u103A\u1038	\u1006\u102E\r\nvoicing	\u1000\u102C\u1038	\u101E\r\nvoicing	\u101B\u102F\u1010\u103A	\u1015\u103C\u100A\u103A\r\nvoicing	\u1010	\u1000\u1030\r\nvoicing	\u1005\u102C	\u1000\r\nvoicing	\u101B\u103D\u1000\u103A	\u1010\u103D\u1031\r\nschwa	\u1010\u103D\u1031\u1038	\u1019\r\nschwa	\u1011	\u1019\r\nvoicing	\u1015\u103B\u1031\u102C	\u101E\u102E\u1038\r\nvoicing	\u1006\u102F\u1036\u1038	\u101E\u1031\u102C\r\nvoicing	\u1015\u102F\u1036	\u1010\u1005\u103A\r\nvoicing	\u1011\u1031\u102C\u1004\u103A	\u1005\u102F\r\nvoicing	\u100C\u1031\u1038	\u1000\u103C\u102E\u1038\r\nvoicing	\u1004\u102B\u1038	\u1015\u102B\u1038\r\n";

// src/data.ts
var T = tables_default;
var C = T.constants;
var KINZI = C.KINZI;
var CONS = C.CONS;
var INDEP = C.INDEP;
var ASAT = C.ASAT;
var INDEP_TO_A = C.INDEP_TO_A.map(
  (p) => [p[0], p[1]]
);
var NORMALIZE_OPS = C.NORMALIZE_OPS;
var E001 = C.E001;
var E001_REPLACEMENTS = C.E001_REPLACEMENTS;
var PARSE_SYLLABLE_PATTERN = C.PARSE_SYLLABLE_PATTERN;
var NUMBER_LITERALS = T.NUMBER_LITERALS;
var MEDIAL_CHARS = C.MEDIAL_CHARS;
var MIDSYL = new Set(Array.from(C.MIDSYL));
var VOWEL_ORDER = C.VOWEL_ORDER;
var VOWEL_OR_FINAL = new Set(Array.from(C.VOWEL_OR_FINAL));
var TONES = new Set(C.TONES);
var FINAL_CLASSES = {
  F_K: C.F_K,
  F_S: C.F_S,
  F_T: C.F_T,
  F_N: C.F_N,
  F_NG: C.F_NG,
  F_NY: C.F_NY
};
var ONSET = new Map(Object.entries(T.ONSET));
var VELAR_PAL = new Map(Object.entries(T.VELAR_PAL));
var ASPIRATE = new Map(Object.entries(T.ASPIRATE));
var INDEP_SYL = new Map(Object.entries(T.INDEP_SYL));
var V = new Map(Object.entries(T.V));
var PUNCT = new Map(Object.entries(T.PUNCT));
var VOICE_MAP = new Map(Object.entries(T.VOICE_MAP));
var CLASSIFIERS = new Set(T.CLASSIFIERS);
var CHAR = new Map(Object.entries(T.CHAR));
var RHYME_SPLIT = new Map(Object.entries(T.RHYME_SPLIT));
var NAME_MAP = new Map(Object.entries(T.NAME_MAP));
var AMBIG = new Set(T.AMBIG);
var DIGITS = T.DIGITS;
var PLACES = new Map(
  Object.entries(T.PLACES).map(([k, v]) => [Number(k), v])
);
var CREAKY = new Map(Object.entries(T.CREAKY));
var RHYME_CLOSED = new Map(
  T.RHYME_CLOSED.map(([vkey, fc, rhyme]) => [`${vkey}\0${fc}`, rhyme])
);
var STACK = /([\u1000-\u1021])\u1039/g;
var LEXICON_TSV = lexicon_exceptions_default;
var MINED_TSV = mined_rules_default;

// src/g2pMy.ts
var SylParseError = class extends Error {
  constructor(syllable) {
    super(`cannot parse syllable: ${syllable}`);
    this.syllable = syllable;
    this.name = "SylParseError";
  }
};
var MissingKeyError = class extends Error {
  constructor(key) {
    super(`missing key: ${key}`);
    this.key = key;
    this.name = "MissingKeyError";
  }
};
var SYL_START = new RegExp("^[" + CONS + INDEP + "]");
var PARSE_SYLLABLE = new RegExp(PARSE_SYLLABLE_PATTERN);
var LATIN_START = /[A-Za-z]/;
var LATIN_BODY = /[A-Za-z']/;
var TONE_MID = "\u02E7";
var TONE_HIGH = "\u02E5";
var TONE_CREAKY = "\u02C0";
var VOWEL_AA = "\u102B";
var VOWEL_AA_LONG = "\u102C";
function normalize(text) {
  let s = text;
  for (const op of NORMALIZE_OPS) {
    if (op.op === "replace") {
      s = s.split(op.from).join(op.to);
    } else if (op.op === "indep") {
      for (const [a, b] of INDEP_TO_A) s = s.split(a).join(b);
    } else {
      s = s.replace(STACK, "$1" + ASAT);
    }
  }
  return s;
}
function splitSyllables(text) {
  const chars = Array.from(text);
  const out = [];
  let cur = "";
  let i = 0;
  const n = chars.length;
  while (i < n) {
    const ch = chars[i];
    if (SYL_START.test(ch)) {
      const isFinal = i + 1 < n && chars[i + 1] === ASAT;
      if (cur && !isFinal) {
        out.push(cur);
        cur = ch;
      } else {
        cur += ch;
      }
      i += 1;
    } else if (MEDIAL_CHARS.includes(ch)) {
      cur += ch;
      i += 1;
    } else {
      if (cur) {
        out.push(cur);
        cur = "";
      }
      if (LATIN_START.test(ch)) {
        let j = i + 1;
        while (j < n && LATIN_BODY.test(chars[j])) j += 1;
        out.push(chars.slice(i, j).join(""));
        i = j;
        continue;
      }
      out.push(ch);
      i += 1;
    }
  }
  if (cur) out.push(cur);
  return out;
}
function finalClass(c) {
  if (FINAL_CLASSES.F_K.includes(c)) return "F_K";
  if (FINAL_CLASSES.F_S.includes(c)) return "F_S";
  if (FINAL_CLASSES.F_T.includes(c)) return "F_T";
  if (FINAL_CLASSES.F_N.includes(c)) return "F_N";
  if (FINAL_CLASSES.F_NG.includes(c)) return "F_NG";
  if (FINAL_CLASSES.F_NY.includes(c)) return "F_NY";
  return null;
}
function parseSyllable(s) {
  const indep = INDEP_SYL.get(s);
  if (indep) return `${indep[0]}-${indep[1]}-${indep[2]}`;
  const m = PARSE_SYLLABLE.exec(s);
  if (!m) throw new SylParseError(s);
  const base = m[1];
  const meds = m[2];
  const vowsRaw = m[3];
  const fin = m[4];
  const anusvara = m[5];
  const dot1 = m[6];
  const visarga = m[7];
  const dot2 = m[8];
  const dot = dot1 || dot2;
  let onset = ONSET.get(base);
  if (onset === void 0) throw new MissingKeyError(base);
  let medial = "";
  if (meds.includes("\u103E")) {
    onset = ASPIRATE.get(onset) ?? onset;
  }
  if (meds.includes("\u103B") || meds.includes("\u103C")) {
    if (VELAR_PAL.has(onset)) {
      onset = VELAR_PAL.get(onset);
    } else if (onset === "\u014B") {
      onset = "\u0272";
    } else if (onset === "\u0283") {
    } else if (onset === "j") {
    } else {
      medial = "j";
    }
  }
  let hasW = meds.includes("\u103D");
  const vows = vowsRaw.split(VOWEL_AA).join(VOWEL_AA_LONG);
  const vkey = Array.from(vows).sort((a, b) => VOWEL_ORDER.indexOf(a) - VOWEL_ORDER.indexOf(b)).join("");
  let rhyme;
  let tone;
  if (fin || anusvara) {
    const fc = anusvara ? "F_N" : finalClass(fin);
    if (fin && "\u101A".includes(fin)) {
      rhyme = vkey === "\u102D\u102F" ? "o" : "\u025B";
      tone = TONE_MID;
    } else if (fin && "\u101C\u101F".includes(fin)) {
      const v = V.get(vkey);
      if (!v) throw new SylParseError(s);
      rhyme = v[0];
      tone = TONE_MID;
    } else if (fin && fin === "\u100A") {
      rhyme = vkey === "\u1031" ? "\u025B" : "e";
      tone = TONE_MID;
    } else if (fc) {
      const wkey = hasW && RHYME_CLOSED.has(`\u103D\0${fc}`) && !vkey ? "\u103D" : vkey;
      if (wkey === "\u103D") hasW = false;
      const r = RHYME_CLOSED.get(`${wkey}\0${fc}`);
      if (r === void 0) throw new SylParseError(s);
      rhyme = r;
      if (base === "\u101D" && !vkey) {
        rhyme = rhyme === "a\u0294" ? "\u028A\u0294" : rhyme === "a\u0274" ? "\u028A\u0274" : rhyme;
      }
      tone = rhyme.endsWith("\u0294") ? null : TONE_MID;
    } else {
      throw new SylParseError(s);
    }
  } else {
    const v = V.get(vkey);
    if (!v) throw new SylParseError(s);
    rhyme = v[0];
    tone = v[1];
  }
  if (tone !== null) {
    if (visarga) tone = TONE_HIGH;
    else if (dot) tone = TONE_CREAKY;
  }
  const parts = [onset];
  if (hasW) medial = medial ? medial + "w" : "w";
  if (medial) parts.push(medial);
  parts.push(rhyme);
  if (tone) parts.push(tone);
  return parts.join("-");
}
var pairKey = (ctx, syl) => `${ctx}\0${syl}`;
function loadLexicon(tsv = LEXICON_TSV) {
  const lex = /* @__PURE__ */ new Map();
  for (const line of tsv.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const [k0, v] = line.split("	");
    if (v === void 0) continue;
    let k = normalize(k0);
    for (const e of E001_REPLACEMENTS) k = k.split(e).join(E001);
    lex.set(k, v);
  }
  return lex;
}
function loadMined(tsv = MINED_TSV) {
  const voicing = /* @__PURE__ */ new Set();
  const schwa = /* @__PURE__ */ new Set();
  for (const line of tsv.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const [kind, ctx, syl] = line.split("	");
    if (syl === void 0) continue;
    (kind === "voicing" ? voicing : schwa).add(pairKey(ctx, syl));
  }
  return { voicing, schwa };
}
function titReduces(chunk, i) {
  const nxt = chunk[i + 1];
  if (CLASSIFIERS.has(nxt)) return true;
  if (i > 0) {
    const big = [chunk[i - 1], chunk[i]].join("\0");
    if ([chunk[i + 1], chunk[i + 2]].join("\0") === big) return false;
    if (i >= 3 && [chunk[i - 3], chunk[i - 2]].join("\0") === big) return false;
    if (chunk[i - 1] === nxt) return false;
  }
  return true;
}
function applyMined(chunk, parses, mined2) {
  const out = parses.slice();
  for (let i = 0; i < chunk.length; i += 1) {
    const syl = chunk[i];
    const p = out[i];
    if (p === null) continue;
    const parts = p.split("-");
    if (syl === "\u1010\u1005\u103A" && i + 1 < chunk.length && titReduces(chunk, i)) {
      out[i] = "t-\u0259";
      continue;
    }
    if (i > 0 && mined2.voicing.has(pairKey(chunk[i - 1], syl)) && VOICE_MAP.has(parts[0])) {
      parts[0] = VOICE_MAP.get(parts[0]);
      out[i] = parts.join("-");
    }
    if (i + 1 < chunk.length && mined2.schwa.has(pairKey(chunk[i + 1], syl))) {
      out[i] = parts[0] + "-\u0259";
    }
  }
  return out;
}
function g2p(text, lex, mined2) {
  const lexicon2 = lex ?? loadLexicon();
  const rules = mined2 ?? loadMined();
  let s = normalize(text);
  for (const e of E001_REPLACEMENTS) s = s.split(e).join(E001);
  const out = [];
  const errors = [];
  const keys = Array.from(lexicon2.keys()).map((k) => ({ k, cps: Array.from(k) })).sort((a, b) => b.cps.length - a.cps.length);
  const chars = Array.from(s);
  const chunks = [];
  let i = 0;
  const n = chars.length;
  while (i < n) {
    let hit = null;
    for (const entry of keys) {
      const kc = entry.cps;
      if (i + kc.length > n) continue;
      let match = true;
      for (let x = 0; x < kc.length; x += 1) {
        if (chars[i + x] !== kc[x]) {
          match = false;
          break;
        }
      }
      if (!match) continue;
      const j = i + kc.length;
      if (j < n && MIDSYL.has(chars[j])) continue;
      hit = entry;
      break;
    }
    if (hit) {
      chunks.push(["PHON", lexicon2.get(hit.k)]);
      i += hit.cps.length;
    } else {
      chunks.push(["RAW", chars[i]]);
      i += 1;
    }
  }
  const flush = (buf2) => {
    const syls = splitSyllables(buf2);
    let runsyl = [];
    const closeRun = () => {
      if (!runsyl.length) return;
      const parses = [];
      for (const syl of runsyl) {
        try {
          if (syl === E001) {
            parses.push("\u0294-\u0254-" + TONE_MID);
          } else if (syl.includes(E001)) {
            const p = parseSyllable(syl.split(E001).join("\u1031\u102C"));
            parses.push(p.replace(/\u0254-\u02e5$/, "\u0254-" + TONE_MID));
          } else {
            parses.push(parseSyllable(syl));
          }
        } catch (err) {
          if (err instanceof SylParseError || err instanceof MissingKeyError) {
            parses.push(null);
            errors.push(syl);
          } else {
            throw err;
          }
        }
      }
      for (const p of applyMined(runsyl, parses, rules)) {
        if (p !== null) out.push(p);
      }
      runsyl = [];
    };
    for (const syl of syls) {
      if (SYL_START.test(syl) || syl.includes(E001)) {
        runsyl.push(syl);
      } else {
        closeRun();
        const p = PUNCT.get(syl);
        if (p !== void 0) out.push(p);
        else if (syl.trim()) out.push(syl);
        else out.push(" ");
      }
    }
    closeRun();
  };
  let buf = "";
  for (const [kind, val] of chunks) {
    if (kind === "RAW") {
      buf += val;
    } else {
      if (buf) {
        flush(buf);
        buf = "";
      }
      out.push(val);
    }
  }
  if (buf) flush(buf);
  const isEn = (tok) => !tok.includes("-") && /[A-Za-z\u00e6\u00f0\u03b8\u014b\u0292\u0250-\u02ef\u1d7b\u02c8\u02cc\u02d0]/.test(tok);
  const merged = [];
  for (let idx = 0; idx < out.length; idx += 1) {
    const tok = out[idx];
    if (tok === " ") {
      let nxt = null;
      for (let k = idx + 1; k < out.length; k += 1) {
        if (out[k] !== " ") {
          nxt = out[k];
          break;
        }
      }
      if (merged.length && ![",", ".", "?", "!"].includes(merged[merged.length - 1]) && !isEn(merged[merged.length - 1]) && (nxt === null || !isEn(nxt))) {
        merged.push(",");
      }
    } else if ([".", "?", "!", ","].includes(tok)) {
      if (merged.length && merged[merged.length - 1] === ",") {
        merged[merged.length - 1] = tok;
      } else if (merged.length && [".", "?", "!"].includes(merged[merged.length - 1])) {
        if (tok !== merged[merged.length - 1]) merged.push(tok);
      } else {
        merged.push(tok);
      }
    } else {
      merged.push(tok);
    }
  }
  while (merged.length && merged[merged.length - 1] === ",") merged.pop();
  while (merged.length && [",", ".", "?", "!"].includes(merged[0])) merged.shift();
  return { phon: merged.join(" "), errors };
}

// src/charMap.ts
var TONE_KEYS = /* @__PURE__ */ new Set(["\u02E7", "\u02E5", "\u02C0"]);
function charOf(key) {
  const v = CHAR.get(key);
  if (v === void 0) throw new MissingKeyError(key);
  return v;
}
function sylToChars(syl) {
  const parts = syl.split("-");
  const last = parts[parts.length - 1];
  const tone = TONE_KEYS.has(last) ? last : null;
  const core = tone ? parts.slice(0, -1) : parts;
  const onset = core[0];
  const meds = core.slice(1, -1);
  const rhyme = core[core.length - 1];
  const out = [charOf(onset)];
  for (const m of meds) out.push(charOf(m));
  const rhymeParts = RHYME_SPLIT.get(rhyme);
  if (rhymeParts === void 0) throw new MissingKeyError(rhyme);
  for (const c of rhymeParts) out.push(CHAR.has(c) ? CHAR.get(c) : c);
  if (tone) out.push(charOf(tone));
  return out.join("");
}

// src/myNumbers.ts
var DIGITS2 = DIGITS;
var L = NUMBER_LITERALS;
var PY_WORD = "[\\p{L}\\p{N}_]";
var PY_B = `(?:(?<=${PY_WORD})(?!${PY_WORD})|(?<!${PY_WORD})(?=${PY_WORD}))`;
var MY2ASCII = /* @__PURE__ */ new Map();
Array.from("\u1040\u1041\u1042\u1043\u1044\u1045\u1046\u1047\u1048\u1049").forEach((c, i) => {
  MY2ASCII.set(c, String(i));
});
var WA_RUN = /(?:[\u1040-\u1049]|\u101d(?![\u102b-\u103e]))+/g;
var HAS_MY_DIGIT = /[\u1040-\u1049]/;
var DIGIT_CLASS = "[0-9\\u1040-\\u1049]";
var NUM_RE = new RegExp(
  `(?<int>${DIGIT_CLASS}{1,3}(?:,${DIGIT_CLASS}{3})+|${DIGIT_CLASS}+)(?:\\.(?<frac>${DIGIT_CLASS}+))?(?<k>[kK](?![A-Za-z]))?(?<pct>\\s?%)?(?<cur>\\s?(?:Ks|KS|ks|MMK|mmk|Kyats?|kyats?)${PY_B})?`,
  "gu"
);
var HAS_DIGIT = /[0-9\u1040-\u1049]/;
function translate(s) {
  return Array.from(s).map((c) => MY2ASCII.get(c) ?? c).join("");
}
function replaceAll(text, re, fn) {
  const out = [];
  let last = 0;
  re.lastIndex = 0;
  for (; ; ) {
    const m = re.exec(text);
    if (m === null) break;
    out.push(text.slice(last, m.index), fn(m));
    last = m.index + m[0].length;
    if (m[0].length === 0) re.lastIndex += 1;
  }
  out.push(text.slice(last));
  return out.join("");
}
function belowLakh(n) {
  const s = String(n);
  const parts = [];
  for (let i = 0; i < s.length; i += 1) {
    const d = Number(s[i]);
    const place = s.length - 1 - i;
    if (d) parts.push([d, place]);
  }
  const words = [];
  for (let j = 0; j < parts.length; j += 1) {
    const [d, place] = parts[j];
    if (place === 0) {
      words.push(DIGITS2[d]);
      continue;
    }
    let unit = PLACES.get(place);
    if (unit === void 0) throw new Error(`unsupported place: ${place}`);
    if (j < parts.length - 1) unit = CREAKY.get(unit) ?? unit;
    const lead = d === 1 && place === 1 && j === 0 ? "" : DIGITS2[d];
    words.push(lead + unit);
  }
  return words.join("");
}
function numberWords(n) {
  if (n === 0) return DIGITS2[0];
  if (n < 1e5) return belowLakh(n);
  const lakhs = Math.floor(n / 1e5);
  const rest = n % 1e5;
  return numberWords(lakhs) + L.lakh + (rest ? belowLakh(rest) : "");
}
function digitByDigit(s) {
  return Array.from(s).map((c) => DIGITS2[Number(c)]).join(" ");
}
function say(m) {
  const g = m.groups;
  const raw = translate(g.int).split(",").join("");
  const frac = g.frac;
  let out;
  if (raw.length > 1 && raw[0] === "0" && !frac || raw.length > 10) {
    out = digitByDigit(raw);
  } else {
    let n = Number(raw);
    if (g.k) n *= 1e3;
    out = numberWords(n);
    if (frac) out += L.decimal + digitByDigit(translate(frac));
  }
  if (g.pct) out += L.percent;
  if (g.cur) out += L.kyat;
  return ` ${out} `;
}
function verbalize(text) {
  if (!HAS_DIGIT.test(text)) return text;
  let s = text.replace(
    WA_RUN,
    (m0) => HAS_MY_DIGIT.test(m0) ? m0.split("\u101D").join("\u1040") : m0
  );
  s = replaceAll(s, NUM_RE, say);
  s = s.replace(/[ \t]{2,}/g, " ");
  return s.replace(/ (?=[!?.,\u104b\u104a])/g, "").trim();
}

// src/naraNames.ts
var PY_WORD2 = "[\\p{L}\\p{N}_]";
var PY_B2 = `(?:(?<=${PY_WORD2})(?!${PY_WORD2})|(?<!${PY_WORD2})(?=${PY_WORD2}))`;
var NAME_WORD = new RegExp(`${PY_B2}[A-Z][a-z]+${PY_B2}|${PY_B2}U${PY_B2}`, "gu");
function replaceNames(text) {
  const words = Array.from(text.matchAll(NAME_WORD));
  const keep = /* @__PURE__ */ new Set();
  for (let i = 0; i < words.length; i += 1) {
    const m = words[i];
    const w = m[0].toLowerCase();
    if (!NAME_MAP.has(w)) continue;
    if (AMBIG.has(w)) {
      const prev = words[i - 1];
      const next = words[i + 1];
      const prevOk = prev !== void 0 && NAME_MAP.has(prev[0].toLowerCase()) && text.slice((prev.index ?? 0) + prev[0].length, m.index).trim() === "";
      const nextOk = next !== void 0 && NAME_MAP.has(next[0].toLowerCase()) && text.slice((m.index ?? 0) + m[0].length, next.index).trim() === "";
      if (!prevOk && !nextOk) continue;
    }
    keep.add(i);
  }
  const out = [];
  let last = 0;
  for (let i = 0; i < words.length; i += 1) {
    if (!keep.has(i)) continue;
    const m = words[i];
    const start = m.index ?? 0;
    out.push(text.slice(last, start), NAME_MAP.get(m[0].toLowerCase()));
    last = start + m[0].length;
  }
  out.push(text.slice(last));
  return out.join("");
}

// src/english.ts
var LATIN = /[A-Za-z]/;
var LATIN_RUN = /[A-Za-z][A-Za-z'\-. ]*[A-Za-z]|[A-Za-z]/g;
var englishG2P = null;
var missingWarnings = 0;
function setEnglishG2P(fn) {
  englishG2P = fn;
}
function hasEnglishG2P() {
  return englishG2P !== null;
}
function missingEnglishCount() {
  return missingWarnings;
}
function resetMissingEnglishCount() {
  missingWarnings = 0;
}
function toTokens(text) {
  if (!LATIN.test(text)) return text;
  if (englishG2P === null) {
    missingWarnings += 1;
    return text;
  }
  const out = [];
  let last = 0;
  LATIN_RUN.lastIndex = 0;
  for (; ; ) {
    const m = LATIN_RUN.exec(text);
    if (m === null) break;
    out.push(text.slice(last, m.index));
    out.push(englishG2P(m[0]).split("\u0329").join("").trim());
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out.join("").replace(/ {2,}/g, " ").trim();
}

// src/chars.ts
var IPA_RE = /[A-Za-z\u00e6\u00f0\u03b8\u014b\u0292\u0250-\u02ef\u1d7b\u02c8\u02cc\u02d0]/;
var WORDISH_RE = /[\p{L}\p{Nl}\p{No}_]/u;
function isLetterStart(token) {
  const first = Array.from(token)[0];
  if (first === void 0) return false;
  if (/\d/.test(first)) return false;
  return WORDISH_RE.test(first);
}

// src/frontend.ts
var PUNCT_TOKENS = /* @__PURE__ */ new Set([",", ".", "?", "!"]);
var lexCache = null;
var minedCache = null;
function lexicon() {
  if (lexCache === null) lexCache = loadLexicon();
  return lexCache;
}
function mined() {
  if (minedCache === null) minedCache = loadMined();
  return minedCache;
}
function prepareNames(text) {
  return replaceNames(text);
}
function phonemize(text) {
  return phonemizeDetailed(text).phon;
}
function phonemizeDetailed(text) {
  const { phon, errors } = g2p(text, lexicon(), mined());
  const out = [];
  for (const tok of phon.split(/\s+/).filter(Boolean)) {
    try {
      if (PUNCT_TOKENS.has(tok)) {
        out.push(tok);
      } else if (tok.includes("-") || RHYME_SPLIT.has(tok)) {
        out.push(tok.includes("-") ? sylToChars(tok) : tok);
      } else if (IPA_RE.test(tok)) {
        out.push(tok);
      } else if (isLetterStart(tok)) {
        out.push(sylToChars(tok));
      }
    } catch (err) {
      if (err instanceof MissingKeyError) continue;
      throw err;
    }
  }
  return { phon: out.join(" "), errors };
}

// src/inference.ts
function cpLength(s) {
  return Array.from(s).length;
}
function planChunks(text, limit = 200, firstLimit = 22) {
  const pieces = splitSpeech(text, limit);
  if (pieces.length === 0 || firstLimit <= 0) return pieces;
  const first = pieces[0];
  if (cpLength(first) <= firstLimit) return pieces;
  const chars = Array.from(first);
  const floor = Math.max(1, Math.floor(firstLimit * 0.4));
  let cut = -1;
  for (let i = Math.min(firstLimit, chars.length - 1); i >= floor; i -= 1) {
    if (/\s/.test(chars[i])) {
      cut = i;
      break;
    }
  }
  if (cut <= 0) return pieces;
  const head = chars.slice(0, cut).join("").trim();
  const tail = chars.slice(cut).join("").trim();
  if (!head || !tail) return pieces;
  return [head, tail, ...pieces.slice(1)];
}
var SENTENCE_END = /* @__PURE__ */ new Set(["\u104B", "!", "?", "\u2026", "\n"]);
var CLAUSE_END = /* @__PURE__ */ new Set(["\u104A"]);
function splitAfter(text, terminators) {
  const chars = Array.from(text);
  const parts = [];
  let cur = "";
  for (let i = 0; i < chars.length; i += 1) {
    cur += chars[i];
    if (!terminators.has(chars[i])) continue;
    while (i + 1 < chars.length && /\s/.test(chars[i + 1])) i += 1;
    parts.push(cur);
    cur = "";
  }
  if (cur) parts.push(cur);
  return parts;
}
function splitSpeech(text, limit = 200) {
  const units = [];
  for (const sentence of splitAfter(text, SENTENCE_END)) {
    for (const rawClause of splitAfter(sentence, CLAUSE_END)) {
      let clause = rawClause;
      while (Array.from(clause).length > limit) {
        const chars = Array.from(clause);
        let cut = -1;
        for (let i = limit - 1; i >= 0; i -= 1) {
          if (chars[i] === " ") {
            cut = i;
            break;
          }
        }
        if (cut <= 0) cut = limit;
        units.push(chars.slice(0, cut).join(""));
        clause = chars.slice(cut).join("").trim();
      }
      if (clause.trim()) units.push(clause.trim());
    }
  }
  const pieces = [];
  let current = "";
  for (const unit of units) {
    if (current && Array.from(current).length + 1 + Array.from(unit).length > limit) {
      pieces.push(current);
      current = unit;
    } else {
      current = `${current} ${unit}`.trim();
    }
  }
  if (current) pieces.push(current);
  return pieces;
}
function encodeWav(samples, sampleRate) {
  const bytes = new Uint8Array(44 + samples.length * 2);
  const view = new DataView(bytes.buffer);
  const ascii = (offset, s) => {
    for (let i = 0; i < s.length; i += 1) view.setUint8(offset + i, s.charCodeAt(i));
  };
  ascii(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  ascii(8, "WAVE");
  ascii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  ascii(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i += 1) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, v < 0 ? v * 32768 : v * 32767, true);
  }
  return bytes;
}
var SagaSynthesizer = class _SagaSynthesizer {
  constructor(ort, encoder, decoder, metadata) {
    this.ort = ort;
    this.encoder = encoder;
    this.decoder = decoder;
    this.metadata = metadata;
  }
  static async create(ort, model, sessionOptions = {}) {
    const [encoder, decoder] = await Promise.all([
      ort.InferenceSession.create(model.encoder, sessionOptions),
      ort.InferenceSession.create(model.decoder, sessionOptions)
    ]);
    return new _SagaSynthesizer(ort, encoder, decoder, model.metadata);
  }
  /**
   * Build from sessions the caller created itself. Lets a browser load one graph
   * at a time and drop its bytes before the next one, which halves peak memory.
   */
  static fromSessions(ort, encoder, decoder, metadata) {
    return new _SagaSynthesizer(ort, encoder, decoder, metadata);
  }
  get sampleRate() {
    return this.metadata.sample_rate;
  }
  /** Same validation the reference performs, so failures surface identically. */
  pickStyle(count) {
    const { centers, styles } = this.metadata;
    let best = 0;
    let bestDelta = Infinity;
    for (let i = 0; i < centers.length; i += 1) {
      const delta = Math.abs(centers[i] - count);
      if (delta < bestDelta) {
        bestDelta = delta;
        best = i;
      }
    }
    return styles[best];
  }
  /** Run encoder + decoder for one chunk of text. */
  async runPiece(piece, signal) {
    const { phon } = phonemizeDetailed(toTokens(prepareNames(piece)));
    const tokens = [];
    for (const ch of phon) {
      const id = this.metadata.vocab[ch];
      if (id !== void 0) tokens.push(id);
    }
    if (!tokens.length) throw new Error("a passage produced no phonemes");
    if (tokens.length > 508) throw new Error("a passage exceeds the phoneme context limit");
    const style = this.pickStyle(tokens.length);
    const ids = new BigInt64Array(tokens.length + 2);
    for (let i = 0; i < tokens.length; i += 1) ids[i + 1] = BigInt(tokens[i]);
    const tEnc = Date.now();
    const enc = await this.encoder.run({
      tokens: new this.ort.Tensor("int64", ids, [1, tokens.length + 2]),
      style: new this.ort.Tensor("float32", Float32Array.from(style), [1, style.length])
    });
    const durations = enc.durations.data;
    const prosody = enc.prosody.data;
    const textOut = enc.text.data;
    const frames = durations.length;
    let total = 0;
    let minDur = Infinity;
    for (let i = 0; i < frames; i += 1) {
      const d = Number(durations[i]);
      if (d < minDur) minDur = d;
      total += d;
    }
    if (minDur < 1 || total < 1 || total > 2e4) throw new Error("invalid predicted duration");
    const cProsody = enc.prosody.dims[1];
    const cText = enc.text.dims[1];
    const expandedProsody = new Float32Array(cProsody * total);
    const expandedText = new Float32Array(cText * total);
    for (let c = 0; c < cProsody; c += 1) {
      let at = c * total;
      const row = c * frames;
      for (let t = 0; t < frames; t += 1) {
        const d = Number(durations[t]);
        expandedProsody.fill(prosody[row + t], at, at + d);
        at += d;
      }
    }
    for (let c = 0; c < cText; c += 1) {
      let at = c * total;
      const row = c * frames;
      for (let t = 0; t < frames; t += 1) {
        const d = Number(durations[t]);
        expandedText.fill(textOut[row + t], at, at + d);
        at += d;
      }
    }
    if (signal?.aborted) return null;
    const tDec = Date.now();
    const out = await this.decoder.run({
      prosody: new this.ort.Tensor("float32", expandedProsody, [1, cProsody, total]),
      text: new this.ort.Tensor("float32", expandedText, [1, cText, total]),
      style: new this.ort.Tensor("float32", Float32Array.from(style), [1, style.length])
    });
    const audio = out[Object.keys(out)[0]].data;
    if (audio.length < 2400) throw new Error("the model produced invalid audio");
    for (let i = 0; i < audio.length; i += 1) {
      if (!Number.isFinite(audio[i])) throw new Error("the model produced invalid audio");
    }
    return {
      samples: audio.slice(),
      phon,
      text: piece,
      tokens: tokens.length,
      frames,
      encoderMs: tDec - tEnc,
      decoderMs: Date.now() - tDec
    };
  }
  /**
   * Stream a passage chunk by chunk. Each yielded chunk is playable on its own.
   *
   * With `firstLimit: 0` the chunk plan matches `synthesize()`, so the two agree
   * on sample count. They are not bit-identical: the WASM kernels are not
   * reproducible run to run (mean |Δ| ≈ 0.005 against a 0.11 RMS signal, i.e.
   * about −27 dB, inaudible but measurable).
   */
  async *synthesizeStream(text, options = {}) {
    const { normalizeNumbers = true, gapSamples = 4800, limit = 200, firstLimit = 22, signal } = options;
    const spoken = normalizeNumbers ? verbalize(text) : text;
    const pieces = planChunks(spoken, limit, firstLimit);
    if (!pieces.length) throw new Error("text must contain speech");
    for (let index = 0; index < pieces.length; index += 1) {
      if (signal?.aborted) return;
      const piece = pieces[index];
      const result = await this.runPiece(piece, signal);
      if (!result) return;
      const last = index === pieces.length - 1;
      const samples = last ? result.samples : (() => {
        const padded = new Float32Array(result.samples.length + gapSamples);
        padded.set(result.samples, 0);
        return padded;
      })();
      for (let i = 0; i < samples.length; i += 1) {
        samples[i] = Math.max(-1, Math.min(1, samples[i]));
      }
      yield { ...result, samples, index, total: pieces.length };
    }
  }
  async synthesize(text, options = {}) {
    const parts = [];
    let length = 0;
    for await (const chunk of this.synthesizeStream(text, { ...options, firstLimit: 0 })) {
      parts.push(chunk.samples);
      length += chunk.samples.length;
    }
    const merged = new Float32Array(length);
    let at = 0;
    for (const part of parts) {
      merged.set(part, at);
      at += part.length;
    }
    return merged;
  }
};

// src/index.ts
function textToPhonemes(text, options = {}) {
  const { normalizeNumbers = true } = options;
  const spoken = normalizeNumbers ? verbalize(text) : text;
  return phonemizeDetailed(toTokens(prepareNames(spoken)));
}
export {
  IPA_RE,
  MissingKeyError,
  SagaSynthesizer,
  SylParseError,
  WORDISH_RE,
  encodeWav,
  finalClass,
  g2p,
  hasEnglishG2P,
  isLetterStart,
  loadLexicon,
  loadMined,
  missingEnglishCount,
  normalize,
  numberWords,
  parseSyllable,
  phonemize,
  phonemizeDetailed,
  planChunks,
  prepareNames,
  replaceNames,
  resetMissingEnglishCount,
  setEnglishG2P,
  splitSpeech,
  splitSyllables,
  sylToChars,
  textToPhonemes,
  toTokens,
  verbalize
};
