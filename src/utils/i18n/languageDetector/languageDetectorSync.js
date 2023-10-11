import * as utils from './utils.js';
import asyncStorage from '../lookups/asyncStorage';

function getDefaults() {
  return {
    order: ['asyncStorage'],
    lookupAsyncStorage: 'i18nextLng',

    // cache user language
    caches: ['asyncStorage'],
    excludeCacheFor: ['cimode'],
    // cookieMinutes: 10,
    // cookieDomain: 'myDomain'

    convertDetectedLanguage: (l) => l
  };
}

class languageDetectorSync {
  constructor(services, options = {}) {
    this.type = 'languageDetector';
    this.detectors = {};

    this.init(services, options);
  }

  init(services, options = {}, i18nOptions = {}) {
    this.services = services || { languageUtils: {} }; // this way the language detector can be used without i18next
    this.options = utils.defaults(options, this.options || {}, getDefaults());
    if (typeof this.options.convertDetectedLanguage === 'string' && this.options.convertDetectedLanguage.indexOf('15897') > -1) {
      this.options.convertDetectedLanguage = (l) => l.replace('-', '_');
    }

    this.i18nOptions = i18nOptions;

    this.addDetector(asyncStorage);
  }

  addDetector(detector) {
    this.detectors[detector.name] = detector;
  }

  detect(detectionOrder) {
    // todo:
    return null;
    if (!detectionOrder) detectionOrder = this.options.order;

    let detected = [];
    detectionOrder.forEach((detectorName) => {
      if (this.detectors[detectorName]) {
        let lookup = this.detectors[detectorName].lookup(this.options).then(lang => {
          let lookup = lang
          if (lookup && typeof lookup === 'string') lookup = [lookup];
          if (lookup) detected = detected.concat(lookup);
        }).catch(err => {})
      }
    });

    detected = detected.map((d) => this.options.convertDetectedLanguage(d));

    if (this.services.languageUtils.getBestMatchFromCodes) return detected; // new i18next v19.5.0
    return detected.length > 0 ? detected[0] : null; // a little backward compatibility
  }

  cacheUserLanguage(lng, caches) {
    if (!caches) caches = this.options.caches;
    if (!caches) return;
    if (this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(lng) > -1) return;
    caches.forEach((cacheName) => {
      if (this.detectors[cacheName]) this.detectors[cacheName].cacheUserLanguage(lng, this.options);
    });
  }
}

languageDetectorSync.type = 'languageDetector';

export default languageDetectorSync;