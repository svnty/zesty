import type { Locale } from './config';

type Dictionary = {
  [key: string]: string;
};

import en from "./translations/en.json";
import es from "./translations/es.json";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  es,
  zh: {},
  hi: {},
  fr: {},
  ar: {},
  bn: {},
  pt: {},
  ru: {},
  ur: {},
  id: {},
  de: {},
  ja: {},
  mr: {},
  te: {},
  tr: {},
  ta: {},
  yue: {},
  vi: {},
  fil: {},
  ko: {},
  ha: {},
  arz: {},
  jv: {},
  it: {},
  nl: {},
  el: {},
  sv: {},
  no: {},
  pl: {},
  th: {},
  uk: {},
  ro: {},
  cs: {},
  hu: {},
  fi: {},
  da: {},
  bg: {},
  sk: {},
  hr: {},
  lt: {},
  sl: {},
  lv: {},
  et: {},
  is: {},
  sq: {},
  sr: {},
  mk: {},
  bs: {},
  cnr: {},
  mt: {},
  hb: {}
};

export const getDictionary = (locale: Locale): Dictionary => {
  return dictionaries[locale] || dictionaries.en;
};
