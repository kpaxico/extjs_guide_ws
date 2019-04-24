Ext.manifest = Ext.manifest || 'app.json';
Ext = Ext || {};
Ext.Boot = Ext.Boot || function(emptyFn) {
  function Request(cfg) {
    if (cfg.$isRequest) return cfg;
    cfg = cfg.url ? cfg : {
      url: cfg
    };
    var url = cfg.url;
    url = url.charAt ? [url] : url;
    var charset = cfg.charset || Boot.config.charset;
    _apply(this, cfg);
    delete this.url;
    this.urls = url;
    this.charset = charset
  }

  function Entry(cfg) {
    if (cfg.$isEntry) return cfg;
    var charset = cfg.charset || Boot.config.charset,
      manifest = Ext.manifest;
    manifest = manifest && manifest.loader;
    var cache = void 0 !== cfg.cache ? cfg.cache : manifest && manifest.cache,
      buster;
    Boot.config.disableCaching &&
      (void 0 === cache && (cache = !Boot.config.disableCaching), !1 ===
        cache ? buster = +new Date : !0 !== cache && (buster = cache),
        buster && (manifest = manifest && manifest.cacheParam || Boot.config
          .disableCachingParam, buster = manifest + '\x3d' + buster));
    _apply(this, cfg);
    this.charset = charset;
    this.buster = buster;
    this.requests = []
  }
  var doc = document,
    _emptyArray = [],
    _config = {
      disableCaching: /[?&](?:cache|disableCacheBuster)\b/i.test(location
          .search) || !/http[s]?:/i.test(location.href) ||
        /(^|[ ;])ext-cache=1/.test(doc.cookie) ? !1 : !0,
      disableCachingParam: '_dc',
      loadDelay: !1,
      preserveScripts: !0,
      charset: 'UTF-8'
    },
    cssRe = /\.css(?:\?|$)/i,
    resolverEl = doc.createElement('a'),
    isBrowser = 'undefined' !== typeof window,
    _environment = {
      browser: isBrowser,
      node: !isBrowser && 'function' === typeof require,
      phantom: window && (window._phantom || window.callPhantom) ||
        /PhantomJS/.test(window.navigator.userAgent)
    },
    _tags = Ext.platformTags = {},
    _apply = function(object, config, defaults) {
      defaults && _apply(object, defaults);
      if (object && config && 'object' === typeof config)
        for (var i in config) object[i] = config[i];
      return object
    },
    _merge = function() {
      var lowerCase = !1,
        obj = Array.prototype.shift.call(arguments),
        index, i;
      'boolean' === typeof arguments[arguments.length - 1] && (lowerCase =
        Array.prototype.pop.call(arguments));
      var len = arguments.length;
      for (index = 0; index < len; index++) {
        var value = arguments[index];
        if ('object' === typeof value)
          for (i in value) obj[lowerCase ? i.toLowerCase() : i] = value[i]
      }
      return obj
    },
    _getKeys = 'function' == typeof Object.keys ? function(object) {
      return object ? Object.keys(object) : []
    } : function(object) {
      var keys = [],
        property;
      for (property in object) object.hasOwnProperty(property) && keys.push(
        property);
      return keys
    },
    Boot = {
      loading: 0,
      loaded: 0,
      apply: _apply,
      env: _environment,
      config: _config,
      assetConfig: {},
      scripts: {},
      currentFile: null,
      suspendedQueue: [],
      currentRequest: null,
      syncMode: !1,
      useElements: !0,
      listeners: [],
      Request: Request,
      Entry: Entry,
      allowMultipleBrowsers: !1,
      browserNames: {
        ie: 'IE',
        firefox: 'Firefox',
        safari: 'Safari',
        chrome: 'Chrome',
        opera: 'Opera',
        dolfin: 'Dolfin',
        edge: 'Edge',
        webosbrowser: 'webOSBrowser',
        chromeMobile: 'ChromeMobile',
        chromeiOS: 'ChromeiOS',
        silk: 'Silk',
        other: 'Other'
      },
      osNames: {
        ios: 'iOS',
        android: 'Android',
        windowsPhone: 'WindowsPhone',
        webos: 'webOS',
        blackberry: 'BlackBerry',
        rimTablet: 'RIMTablet',
        mac: 'MacOS',
        win: 'Windows',
        tizen: 'Tizen',
        linux: 'Linux',
        bada: 'Bada',
        chromeOS: 'ChromeOS',
        other: 'Other'
      },
      browserPrefixes: {
        ie: 'MSIE ',
        edge: 'Edge/',
        firefox: 'Firefox/',
        chrome: 'Chrome/',
        safari: 'Version/',
        opera: 'OPR/',
        dolfin: 'Dolfin/',
        webosbrowser: 'wOSBrowser/',
        chromeMobile: 'CrMo/',
        chromeiOS: 'CriOS/',
        silk: 'Silk/'
      },
      browserPriority: 'edge opera dolfin webosbrowser silk chromeiOS chromeMobile ie firefox safari chrome'
        .split(' '),
      osPrefixes: {
        tizen: '(Tizen )',
        ios: 'i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS ',
        android: '(Android |HTC_|Silk/)',
        windowsPhone: 'Windows Phone ',
        blackberry: '(?:BlackBerry|BB)(?:.*)Version/',
        rimTablet: 'RIM Tablet OS ',
        webos: '(?:webOS|hpwOS)/',
        bada: 'Bada/',
        chromeOS: 'CrOS '
      },
      fallbackOSPrefixes: {
        windows: 'win',
        mac: 'mac',
        linux: 'linux'
      },
      devicePrefixes: {
        iPhone: 'iPhone',
        iPod: 'iPod',
        iPad: 'iPad'
      },
      maxIEVersion: 12,
      detectPlatformTags: function() {
        var me = this,
          ua = navigator.userAgent,
          isMobile = /Mobile(\/|\s)/.test(ua),
          element =
          document.createElement('div'),
          browsers = function() {
            var browsers = {},
              index, matched;
            var prefix = me.browserPriority.length;
            for (index = 0; index < prefix; index++) {
              var maxIEVersion = me.browserPriority[index];
              if (matched) var value = 0;
              else value = me.browserPrefixes[maxIEVersion], (value = (
                value = ua.match(new RegExp('(' + value +
                  ')([\\w\\._]+)'))) && 1 < value.length ? parseInt(
                value[2]) : 0) && (matched = !0);
              browsers[maxIEVersion] = value
            }
            browsers.ie && (index = document.documentMode, 8 <= index && (
              browsers.ie = index));
            value = browsers.ie || !1;
            maxIEVersion =
              Math.max(value, me.maxIEVersion);
            for (index = 8; index <= maxIEVersion; ++index) prefix = 'ie' +
              index, browsers[prefix + 'm'] = value ? value <= index : 0,
              browsers[prefix] = value ? value === index : 0, browsers[
                prefix + 'p'] = value ? value >= index : 0;
            return browsers
          }(),
          systems = function() {
            var systems = {},
              index, activeCount;
            var keys = _getKeys(me.osPrefixes);
            var len = keys.length;
            for (activeCount = index = 0; index < len; index++) {
              var key = keys[index];
              var value = me.osPrefixes[key];
              var matched = (value = ua.match(new RegExp('(' + value +
                  ')([^\\s;]+)'))) ? value[1] :
                null;
              (value = !matched || 'HTC_' !== matched && 'Silk/' !==
                matched ? value && 1 < value.length ? parseFloat(value[value
                  .length - 1]) : 0 : 2.3) && activeCount++;
              systems[key] = value
            }
            keys = _getKeys(me.fallbackOSPrefixes);
            len = keys.length;
            for (index = 0; index < len; index++) key = keys[index], 0 ===
              activeCount ? (value = me.fallbackOSPrefixes[key], value = ua
                .toLowerCase().match(new RegExp(value)), systems[key] =
                value ? !0 : 0) : systems[key] = 0;
            return systems
          }(),
          devices = function() {
            var devices = {},
              index;
            var keys = _getKeys(me.devicePrefixes);
            var len = keys.length;
            for (index = 0; index < len; index++) {
              var key = keys[index];
              var value = me.devicePrefixes[key];
              value = ua.match(new RegExp(value));
              devices[key] = value ? !0 : 0
            }
            return devices
          }(),
          platformParams = Boot.loadPlatformsParam();
        _merge(_tags, browsers, systems, devices, platformParams, !0);
        _tags.phone = !!(_tags.iphone || _tags.ipod || !_tags.silk && _tags
          .android && (3 > _tags.android || isMobile) || _tags
          .blackberry && isMobile || _tags.windowsphone);
        _tags.tablet = !(_tags.phone || !(_tags.ipad || _tags.android ||
          _tags.silk || _tags.rimtablet || _tags.ie10 &&
          /; Touch/.test(ua)));
        _tags.touch = function(name, tag) {
            name = 'on' + name.toLowerCase();
            tag = name in element;
            !tag && element.setAttribute && element.removeAttribute && (
              element.setAttribute(name, ''), tag = 'function' ===
              typeof element[name], 'undefined' !== typeof element[
              name] && (element[name] = void 0), element.removeAttribute(
                name));
            return tag
          }('touchend') || navigator.maxTouchPoints || navigator
          .msMaxTouchPoints;
        _tags.desktop = !_tags.phone && !_tags.tablet;
        _tags.cordova = _tags.phonegap = !!(window.PhoneGap || window
          .Cordova || window.cordova);
        _tags.webview =
          /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)(?!.*FBAN)/i.test(ua);
        _tags.androidstock = 4.3 >= _tags.android && (_tags.safari || _tags
          .silk);
        _merge(_tags, platformParams, !0)
      },
      loadPlatformsParam: function() {
        var paramsArray = window.location.search.substr(1).split('\x26'),
          params = {},
          i, platforms = {};
        for (i = 0; i < paramsArray.length; i++) {
          var tmpArray = paramsArray[i].split('\x3d');
          params[tmpArray[0]] = tmpArray[1]
        }
        if (params.platformTags)
          for (tmpArray = params.platformTags.split(','), paramsArray =
            tmpArray.length, i =
            0; i < paramsArray; i++) {
            params = tmpArray[i].split(':');
            var name = params[0];
            var enabled = !0;
            1 < params.length && (enabled = params[1], 'false' ===
              enabled || '0' === enabled) && (enabled = !1);
            platforms[name] = enabled
          }
        return platforms
      },
      filterPlatform: function(platform, excludes) {
        platform = _emptyArray.concat(platform || _emptyArray);
        excludes = _emptyArray.concat(excludes || _emptyArray);
        var plen = platform.length,
          elen = excludes.length,
          include = !plen && elen,
          i;
        for (i = 0; i < plen && !include; i++) include = platform[i],
          include = !!_tags[include];
        for (i =
          0; i < elen && include; i++) include = excludes[i], include = !
          _tags[include];
        return include
      },
      init: function() {
        var scriptEls = doc.getElementsByTagName('script'),
          script = scriptEls[0],
          len = scriptEls.length,
          re = /\/ext(\-[a-z\-]+)?\.js$/,
          src, baseUrl, key, n;
        Boot.hasReadyState = 'readyState' in script;
        Boot.hasAsync = 'async' in script;
        Boot.hasDefer = 'defer' in script;
        Boot.hasOnLoad = 'onload' in script;
        Boot.isIE8 = Boot.hasReadyState && !Boot.hasAsync && Boot
          .hasDefer && !Boot.hasOnLoad;
        Boot.isIE9 = Boot.hasReadyState && !Boot.hasAsync && Boot
          .hasDefer &&
          Boot.hasOnLoad;
        Boot.isIE10p = Boot.hasReadyState && Boot.hasAsync && Boot
          .hasDefer && Boot.hasOnLoad;
        Boot.isIE8 ? (Boot.isIE10 = !1, Boot.isIE10m = !0) : (Boot
          .isIE10 = -1 !== navigator.appVersion.indexOf('MSIE 10'), Boot
          .isIE10m = Boot.isIE10 || Boot.isIE9 || Boot.isIE8);
        Boot.isIE11 = Boot.isIE10p && !Boot.isIE10;
        for (n = 0; n < len; n++)
          if (src = (script = scriptEls[n]).src) {
            var state = script.readyState || null;
            !baseUrl && re.test(src) && (baseUrl = src);
            Boot.scripts[key = Boot.canonicalUrl(src)] || new Entry({
              key: key,
              url: src,
              done: null === state || 'loaded' ===
                state || 'complete' === state,
              el: script,
              prop: 'src'
            })
          } baseUrl || (script = scriptEls[scriptEls.length - 1], baseUrl =
          script.src);
        Boot.baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
        Boot.origin = window.location.origin || window.location.protocol +
          '//' + window.location.hostname + (window.location.port ? ':' +
            window.location.port : '');
        Boot.detectPlatformTags();
        Ext.filterPlatform = Boot.filterPlatform
      },
      canonicalUrl: function(url) {
        resolverEl.href = url;
        url = resolverEl.href;
        var dc = _config.disableCachingParam;
        dc = dc ? url.indexOf(dc +
          '\x3d') : -1;
        var c;
        if (0 < dc && ('?' === (c = url.charAt(dc - 1)) || '\x26' === c)) {
          var end = url.indexOf('\x26', dc);
          (end = 0 > end ? '' : url.substring(end)) && '?' === c && (++dc,
            end = end.substring(1));
          url = url.substring(0, dc - 1) + end
        }
        return url
      },
      getConfig: function(name) {
        return name ? Boot.config[name] : Boot.config
      },
      setConfig: function(name, value) {
        if ('string' === typeof name) Boot.config[name] = value;
        else
          for (var s in name) Boot.setConfig(s, name[s]);
        return Boot
      },
      getHead: function() {
        return Boot.docHead || (Boot.docHead = doc.head || doc
          .getElementsByTagName('head')[0])
      },
      create: function(url, key, cfg) {
        cfg = cfg || {};
        cfg.url = url;
        cfg.key = key;
        return Boot.scripts[key] = new Entry(cfg)
      },
      getEntry: function(url, cfg, canonicalPath) {
        var key = canonicalPath ? url : Boot.canonicalUrl(url);
        var entry = Boot.scripts[key];
        entry || (entry = Boot.create(url, key, cfg), canonicalPath && (
          entry.canonicalPath = !0));
        return entry
      },
      registerContent: function(url, type, content) {
        return Boot.getEntry(url, {
          content: content,
          loaded: !0,
          css: 'css' === type
        })
      },
      processRequest: function(request, sync) {
        request.loadEntries(sync)
      },
      load: function(request) {
        request =
          new Request(request);
        if (request.sync || Boot.syncMode) return Boot.loadSync(request);
        Boot.currentRequest ? (request.getEntries(), Boot.suspendedQueue
          .push(request)) : (Boot.currentRequest = request, Boot
          .processRequest(request, !1));
        return Boot
      },
      loadSync: function(request) {
        request = new Request(request);
        Boot.syncMode++;
        Boot.processRequest(request, !0);
        Boot.syncMode--;
        return Boot
      },
      loadBasePrefix: function(request) {
        request = new Request(request);
        request.prependBaseUrl = !0;
        return Boot.load(request)
      },
      loadSyncBasePrefix: function(request) {
        request =
          new Request(request);
        request.prependBaseUrl = !0;
        return Boot.loadSync(request)
      },
      requestComplete: function(request) {
        if (Boot.currentRequest === request)
          for (Boot.currentRequest = null; 0 < Boot.suspendedQueue.length;)
            if (request = Boot.suspendedQueue.shift(), !request.done) {
              Boot.load(request);
              break
            } Boot.currentRequest || 0 != Boot.suspendedQueue.length || Boot
          .fireListeners()
      },
      isLoading: function() {
        return !Boot.currentRequest && 0 == Boot.suspendedQueue.length
      },
      fireListeners: function() {
        for (var listener; Boot.isLoading() && (listener =
            Boot.listeners.shift());) listener()
      },
      onBootReady: function(listener) {
        Boot.isLoading() ? Boot.listeners.push(listener) : listener()
      },
      getPathsFromIndexes: function(indexMap, loadOrder) {
        if (!('length' in indexMap)) {
          var indexArray = [],
            index;
          for (index in indexMap) isNaN(+index) || (indexArray[+index] =
            indexMap[index]);
          indexMap = indexArray
        }
        return Request.prototype.getPathsFromIndexes(indexMap, loadOrder)
      },
      createLoadOrderMap: function(loadOrder) {
        return Request.prototype.createLoadOrderMap(loadOrder)
      },
      fetch: function(url,
        complete, scope, async) {
        async = void 0 === async ?!!complete: async;
        var xhr = new XMLHttpRequest,
          result, status, content, exception = !1,
          readyStateChange = function() {
            xhr && 4 == xhr.readyState && (status = 1223 === xhr.status ?
              204 : 0 !== xhr.status || 'file:' !== (self.location || {})
              .protocol && 'ionp:' !== (self.location || {}).protocol ?
              xhr.status : 200, content = xhr.responseText, result = {
                content: content,
                status: status,
                exception: exception
              }, complete && complete.call(scope, result), xhr
              .onreadystatechange = emptyFn, xhr = null)
          };
        async &&(xhr.onreadystatechange =
          readyStateChange);
        try {
          xhr.open('GET', url, async), xhr.send(null)
        } catch (err) {
          return exception = err, readyStateChange(), result
        }
        async ||readyStateChange();
        return result
      },
      notifyAll: function(entry) {
        entry.notifyRequests()
      }
    };
  Request.prototype = {
    $isRequest: !0,
    createLoadOrderMap: function(loadOrder) {
      var len = loadOrder.length,
        loadOrderMap = {},
        i;
      for (i = 0; i < len; i++) {
        var element = loadOrder[i];
        loadOrderMap[element.path] = element
      }
      return loadOrderMap
    },
    getLoadIndexes: function(item, indexMap, loadOrder, includeUses,
      skipLoaded) {
      var resolved = [],
        queue = [item];
      item = item.idx;
      var len;
      if (indexMap[item]) return resolved;
      for (indexMap[item] = resolved[item] = !0; item = queue.shift();) {
        var entry = item.canonicalPath ? Boot.getEntry(item.path, null, !
          0) : Boot.getEntry(this.prepareUrl(item.path));
        if (!skipLoaded || !entry.done) {
          item = includeUses && item.uses && item.uses.length ? item
            .requires.concat(item.uses) : item.requires;
          var i = 0;
          for (len = item.length; i < len; i++) entry = item[i], indexMap[
            entry] || (indexMap[entry] = resolved[entry] = !0, queue
            .push(loadOrder[entry]))
        }
      }
      return resolved
    },
    getPathsFromIndexes: function(indexes, loadOrder) {
      var paths = [],
        len;
      var index = 0;
      for (len = indexes.length; index < len; index++) indexes[index] &&
        paths.push(loadOrder[index].path);
      return paths
    },
    expandUrl: function(url, loadOrder, loadOrderMap, indexMap, includeUses,
      skipLoaded) {
      return loadOrder && (loadOrderMap = loadOrderMap[url]) && (
          indexMap = this.getLoadIndexes(loadOrderMap, indexMap,
            loadOrder, includeUses, skipLoaded), indexMap.length) ? this
        .getPathsFromIndexes(indexMap, loadOrder) : [url]
    },
    expandUrls: function(urls, includeUses) {
      var loadOrder =
        this.loadOrder,
        expanded = [],
        expandMap = {},
        indexMap = [],
        len, tlen;
      'string' === typeof urls && (urls = [urls]);
      if (loadOrder) {
        var loadOrderMap = this.loadOrderMap;
        loadOrderMap || (loadOrderMap = this.loadOrderMap = this
          .createLoadOrderMap(loadOrder))
      }
      var i = 0;
      for (len = urls.length; i < len; i++) {
        var tmpExpanded = this.expandUrl(urls[i], loadOrder, loadOrderMap,
          indexMap, includeUses, !1);
        var t = 0;
        for (tlen = tmpExpanded.length; t < tlen; t++) {
          var tUrl = tmpExpanded[t];
          expandMap[tUrl] || (expandMap[tUrl] = !0, expanded.push(tUrl))
        }
      }
      0 === expanded.length &&
        (expanded = urls);
      return expanded
    },
    expandLoadOrder: function() {
      var urls = this.urls;
      if (this.expanded) var expanded = urls;
      else expanded = this.expandUrls(urls, !0), this.expanded = !0;
      this.urls = expanded;
      urls.length != expanded.length && (this.sequential = !0);
      return this
    },
    getUrls: function() {
      this.expandLoadOrder();
      return this.urls
    },
    prepareUrl: function(url) {
      return this.prependBaseUrl ? Boot.baseUrl + url : url
    },
    getEntries: function() {
      var entries = this.entries,
        item, i;
      if (!entries) {
        entries = [];
        var urls = this.getUrls();
        if (this.loadOrder) var loadOrderMap =
          this.loadOrderMap;
        for (i = 0; i < urls.length; i++) {
          var entry = this.prepareUrl(urls[i]);
          loadOrderMap && (item = loadOrderMap[entry]);
          entry = Boot.getEntry(entry, {
            buster: this.buster,
            charset: this.charset
          }, item && item.canonicalPath);
          entry.requests.push(this);
          entries.push(entry)
        }
        this.entries = entries
      }
      return entries
    },
    loadEntries: function(sync) {
      var me = this,
        entries = me.getEntries(),
        len = entries.length,
        start = me.loadStart || 0,
        i;
      void 0 !== sync && (me.sync = sync);
      me.loaded = me.loaded || 0;
      me.loading = me.loading || len;
      for (i = start; i < len; i++) {
        var entry =
          entries[i];
        start = entry.loaded ? !0 : entries[i].load(me.sync);
        if (!start) {
          me.loadStart = i;
          entry.onDone(function() {
            me.loadEntries(sync)
          });
          break
        }
      }
      me.processLoadedEntries()
    },
    processLoadedEntries: function() {
      var entries = this.getEntries(),
        len = entries.length,
        start = this.startIndex || 0;
      if (!this.done) {
        for (; start < len; start++) {
          var entry = entries[start];
          if (!entry.loaded) {
            this.startIndex = start;
            return
          }
          entry.evaluated || entry.evaluate();
          entry.error && (this.error = !0)
        }
        this.notify()
      }
    },
    notify: function() {
      var me = this;
      if (!me.done) {
        var error =
          me.error,
          fn = me[error ? 'failure' : 'success'];
        error = 'delay' in me ? me.delay : error ? 1 : Boot.config
          .chainDelay;
        var scope = me.scope || me;
        me.done = !0;
        fn && (0 === error || 0 < error ? setTimeout(function() {
          fn.call(scope, me)
        }, error) : fn.call(scope, me));
        me.fireListeners();
        Boot.requestComplete(me)
      }
    },
    onDone: function(listener) {
      var listeners = this.listeners || (this.listeners = []);
      this.done ? listener(this) : listeners.push(listener)
    },
    fireListeners: function() {
      var listeners = this.listeners,
        listener;
      if (listeners)
        for (; listener = listeners.shift();) listener(this)
    }
  };
  Entry.prototype = {
    $isEntry: !0,
    done: !1,
    evaluated: !1,
    loaded: !1,
    isCrossDomain: function() {
      void 0 === this.crossDomain && (this.crossDomain = 0 !== this
        .getLoadUrl().indexOf(Boot.origin));
      return this.crossDomain
    },
    isCss: function() {
      if (void 0 === this.css)
        if (this.url) {
          var assetConfig = Boot.assetConfig[this.url];
          this.css = assetConfig ? 'css' === assetConfig.type : cssRe
            .test(this.url)
        } else this.css = !1;
      return this.css
    },
    getElement: function(tag) {
      var el = this.el;
      el || (this.isCss() ? (tag = tag || 'link', el = doc.createElement(
          tag), 'link' ==
        tag ? (el.rel = 'stylesheet', this.prop = 'href') : this
        .prop = 'textContent', el.type = 'text/css') : (el = doc
        .createElement(tag || 'script'), el.type = 'text/javascript',
        this.prop = 'src', this.charset && (el.charset = this
        .charset), Boot.hasAsync && (el.async = !1)), this.el = el);
      return el
    },
    getLoadUrl: function() {
      var url = this.canonicalPath ? this.url : Boot.canonicalUrl(this
        .url);
      this.loadUrl || (this.loadUrl = this.buster ? url + (-1 === url
        .indexOf('?') ? '?' : '\x26') + this.buster : url);
      return this.loadUrl
    },
    fetch: function(req) {
      var url = this.getLoadUrl();
      Boot.fetch(url, req.complete, this, !!req.async)
    },
    onContentLoaded: function(response) {
      var status = response.status,
        content = response.content;
      response = response.exception;
      this.getLoadUrl();
      this.loaded = !0;
      !response && 0 !== status || _environment.phantom ? 200 <= status &&
        300 > status || 304 === status || _environment.phantom || 0 ===
        status && 0 < content.length ? this.content = content : this
        .evaluated = this.error = !0 : this.evaluated = this.error = !0
    },
    createLoadElement: function(callback) {
      var me = this,
        el = me.getElement();
      me.preserve = !0;
      el.onerror =
        function() {
          me.error = !0;
          callback && (callback(), callback = null)
        };
      Boot.isIE10m ? el.onreadystatechange = function() {
        'loaded' !== this.readyState && 'complete' !== this
          .readyState || !callback || (callback(), callback = this
            .onreadystatechange = this.onerror = null)
      } : el.onload = function() {
        callback();
        callback = this.onload = this.onerror = null
      };
      el[me.prop] = me.getLoadUrl()
    },
    onLoadElementReady: function() {
      Boot.getHead().appendChild(this.getElement());
      this.evaluated = !0
    },
    inject: function(content, asset) {
      asset = Boot.getHead();
      var url = this.url,
        key = this.key;
      if (this.isCss()) {
        this.preserve = !0;
        var basePath = key.substring(0, key.lastIndexOf('/') + 1);
        var base = doc.createElement('base');
        base.href = basePath;
        asset.firstChild ? asset.insertBefore(base, asset.firstChild) :
          asset.appendChild(base);
        base.href = base.href;
        url && (content += '\n/*# sourceURL\x3d' + key + ' */');
        url = this.getElement('style');
        key = 'styleSheet' in url;
        asset.appendChild(base);
        key ? (asset.appendChild(url), url.styleSheet.cssText = content) :
          (url.textContent = content, asset.appendChild(url));
        asset.removeChild(base)
      } else url &&
        (content += '\n//# sourceURL\x3d' + key), Ext.globalEval(content);
      return this
    },
    loadCrossDomain: function() {
      var me = this;
      me.createLoadElement(function() {
        me.el.onerror = me.el.onload = emptyFn;
        me.el = null;
        me.loaded = me.evaluated = me.done = !0;
        me.notifyRequests()
      });
      me.evaluateLoadElement();
      return !1
    },
    loadElement: function() {
      var me = this;
      me.createLoadElement(function() {
        me.el.onerror = me.el.onload = emptyFn;
        me.el = null;
        me.loaded = me.evaluated = me.done = !0;
        me.notifyRequests()
      });
      me.evaluateLoadElement();
      return !0
    },
    loadSync: function() {
      var me =
        this;
      me.fetch({
        async: !1,
        complete: function(response) {
          me.onContentLoaded(response)
        }
      });
      me.evaluate();
      me.notifyRequests()
    },
    load: function(sync) {
      var me = this;
      if (!me.loaded) {
        if (me.loading) return !1;
        me.loading = !0;
        if (sync) me.loadSync();
        else {
          if (Boot.isIE10 || me.isCrossDomain()) return me
            .loadCrossDomain();
          if (!me.isCss() && Boot.hasReadyState) me.createLoadElement(
            function() {
              me.loaded = !0;
              me.notifyRequests()
            });
          else if (!Boot.useElements || me.isCss() && _environment
            .phantom) me.fetch({
            async: !sync,
            complete: function(response) {
              me.onContentLoaded(response);
              me.notifyRequests()
            }
          });
          else return me.loadElement()
        }
      }
      return !0
    },
    evaluateContent: function() {
      this.inject(this.content);
      this.content = null
    },
    evaluateLoadElement: function() {
      Boot.getHead().appendChild(this.getElement())
    },
    evaluate: function() {
      this.evaluated || this.evaluating || (this.evaluating = !0,
        void 0 !== this.content ? this.evaluateContent() : this.error ||
        this.evaluateLoadElement(), this.evaluated = this.done = !0,
        this.cleanup())
    },
    cleanup: function() {
      var el = this.el,
        prop;
      if (el) {
        if (!this.preserve)
          for (prop in this.el = null,
            el.parentNode.removeChild(el), el) try {
            prop !== this.prop && (el[prop] = null), delete el[prop]
          } catch (cleanEx) {}
        el.onload = el.onerror = el.onreadystatechange = emptyFn
      }
    },
    notifyRequests: function() {
      var requests = this.requests,
        len = requests.length,
        i;
      for (i = 0; i < len; i++) {
        var request = requests[i];
        request.processLoadedEntries()
      }
      this.done && this.fireListeners()
    },
    onDone: function(listener) {
      var listeners = this.listeners || (this.listeners = []);
      this.done ? listener(this) : listeners.push(listener)
    },
    fireListeners: function() {
      var listeners =
        this.listeners,
        listener;
      if (listeners && 0 < listeners.length)
        for (; listener = listeners.shift();) listener(this)
    }
  };
  Ext.disableCacheBuster = function(disable, path) {
    var date = new Date;
    date.setTime(date.getTime() + 864E5 * (disable ? 3650 : -1));
    date = date.toGMTString();
    doc.cookie = 'ext-cache\x3d1; expires\x3d' + date + '; path\x3d' + (
      path || '/')
  };
  Boot.init();
  return Boot
}(function() {});
Ext.globalEval = Ext.globalEval || (this.execScript ? function(code) {
  execScript(code)
} : function($$code) {
  eval.call(window, $$code)
});
Function.prototype.bind || function() {
  var slice = Array.prototype.slice,
    bind = function(me) {
      var args = slice.call(arguments, 1),
        method = this;
      if (args.length) return function() {
        var t = arguments;
        return method.apply(me, t.length ? args.concat(slice.call(t)) :
          args)
      };
      args = null;
      return function() {
        return method.apply(me, arguments)
      }
    };
  Function.prototype.bind = bind;
  bind.$extjs = !0
}();
Ext.setResourcePath = function(poolName, path) {
  var manifest = Ext.manifest || (Ext.manifest = {}),
    paths = manifest.resources || (manifest.resources = {});
  manifest && ('string' !== typeof poolName ? Ext.apply(paths, poolName) :
    paths[poolName] = path, manifest.resources = paths)
};
Ext.getResourcePath = function(path, poolName, packageName) {
  'string' !== typeof path && (poolName = path.pool, packageName = path
    .packageName, path = path.path);
  var manifest = Ext.manifest;
  manifest = manifest && manifest.resources;
  poolName = manifest[poolName];
  var output = [];
  null == poolName && (poolName = manifest.path, null == poolName && (
    poolName = 'resources'));
  poolName && output.push(poolName);
  packageName && output.push(packageName);
  output.push(path);
  return output.join('/')
};
Ext = Ext || window.Ext || {};
Ext.Microloader = Ext.Microloader || function() {
  var Boot = Ext.Boot,
    _warn = function(message) {
      console.log('[WARN] ' + message)
    },
    _privatePrefix = '_ext:' + location.pathname,
    getStorageKey = function(url, profileId) {
      return _privatePrefix + url + '-' + (profileId ? profileId + '-' : '') +
        Microloader.appId
    },
    postProcessor;
  try {
    var _storage = window.localStorage
  } catch (ex) {}
  var _cache = window.applicationCache,
    LocalStorage = {
      clearAllPrivate: function(manifest) {
        if (_storage) {
          _storage.removeItem(manifest.key);
          var removeKeys = [],
            suffix = manifest.profile +
            '-' + Microloader.appId,
            ln = _storage.length;
          for (manifest = 0; manifest < ln; manifest++) {
            var key = _storage.key(manifest);
            0 === key.indexOf(_privatePrefix) && -1 !== key.indexOf(
              suffix) && removeKeys.push(key)
          }
          for (manifest in removeKeys) _storage.removeItem(removeKeys[
            manifest])
        }
      },
      retrieveAsset: function(key) {
        try {
          return _storage.getItem(key)
        } catch (e) {
          return null
        }
      },
      setAsset: function(key, content) {
        try {
          null === content || '' == content ? _storage.removeItem(key) :
            _storage.setItem(key, content)
        } catch (e) {}
      }
    },
    Asset = function(cfg) {
      this.assetConfig =
        'string' === typeof cfg.assetConfig ? {
          path: cfg.assetConfig
        } : cfg.assetConfig;
      this.type = cfg.type;
      this.key = getStorageKey(this.assetConfig.path, cfg.manifest.profile);
      cfg.loadFromCache && this.loadFromCache()
    };
  Asset.prototype = {
    shouldCache: function() {
      return _storage && this.assetConfig.update && this.assetConfig
        .hash && !this.assetConfig.remote
    },
    is: function(asset) {
      return !!asset && this.assetConfig && asset.assetConfig && this
        .assetConfig.hash === asset.assetConfig.hash
    },
    cache: function(content) {
      this.shouldCache() && LocalStorage.setAsset(this.key,
        content || this.content)
    },
    uncache: function() {
      LocalStorage.setAsset(this.key, null)
    },
    updateContent: function(content) {
      this.content = content
    },
    getSize: function() {
      return this.content ? this.content.length : 0
    },
    loadFromCache: function() {
      this.shouldCache() && (this.content = LocalStorage.retrieveAsset(
        this.key))
    }
  };
  var Manifest = function(cfg) {
    this.content = 'string' === typeof cfg.content ? JSON.parse(cfg
      .content) : cfg.content;
    this.assetMap = {};
    this.url = cfg.url;
    this.fromCache = !!cfg.cached;
    this.assetCache = !1 !== cfg.assetCache;
    this.key =
      getStorageKey(this.url);
    this.profile = this.content.profile;
    this.hash = this.content.hash;
    this.loadOrder = this.content.loadOrder;
    this.deltas = this.content.cache ? this.content.cache.deltas : null;
    this.cacheEnabled = this.content.cache ? this.content.cache.enable : !1;
    this.loadOrderMap = this.loadOrder ? Boot.createLoadOrderMap(this
      .loadOrder) : null;
    cfg = this.content.tags;
    var platformTags = Ext.platformTags;
    if (cfg) {
      if (cfg instanceof Array)
        for (var i = 0; i < cfg.length; i++) platformTags[cfg[i]] = !0;
      else Boot.apply(platformTags, cfg);
      Boot.apply(platformTags, Boot.loadPlatformsParam())
    }
    this.js = this.processAssets(this.content.js, 'js');
    this.css = this.processAssets(this.content.css, 'css')
  };
  Manifest.prototype = {
    processAsset: function(assetConfig, type) {
      type = new Asset({
        manifest: this,
        assetConfig: assetConfig,
        type: type,
        loadFromCache: this.assetCache
      });
      return this.assetMap[assetConfig.path] = type
    },
    processAssets: function(assets, type) {
      var results = [],
        ln = assets.length,
        i;
      for (i = 0; i < ln; i++) {
        var assetConfig = assets[i];
        results.push(this.processAsset(assetConfig,
          type))
      }
      return results
    },
    useAppCache: function() {
      return !0
    },
    getAssets: function() {
      return this.css.concat(this.js)
    },
    getAsset: function(path) {
      return this.assetMap[path]
    },
    shouldCache: function() {
      return this.hash && this.cacheEnabled
    },
    cache: function(content) {
      this.shouldCache() && LocalStorage.setAsset(this.key, JSON
        .stringify(content || this.content))
    },
    is: function(manifest) {
      return this.hash === manifest.hash
    },
    uncache: function() {
      LocalStorage.setAsset(this.key, null)
    },
    exportContent: function() {
      return Boot.apply({
          loadOrderMap: this.loadOrderMap
        },
        this.content)
    }
  };
  var _listeners = [],
    _loaded = !1,
    Microloader = {
      init: function() {
        Ext.microloaded = !0;
        var microloaderElement = document.getElementById('microloader');
        Microloader.appId = microloaderElement ? microloaderElement
          .getAttribute('data-app') : '';
        Ext.beforeLoad && (postProcessor = Ext.beforeLoad(Ext
        .platformTags));
        var readyHandler = Ext._beforereadyhandler;
        Ext._beforereadyhandler = function() {
          Ext.Boot !== Boot && (Ext.apply(Ext.Boot, Boot), Ext.Boot =
            Boot);
          readyHandler && readyHandler()
        }
      },
      applyCacheBuster: function(url) {
        var tstamp =
          (new Date).getTime(),
          sep = -1 === url.indexOf('?') ? '?' : '\x26',
          progressive = Ext.manifest.progressive;
        progressive && progressive.serviceWorker || (url = url + sep +
          '_dc\x3d' + tstamp);
        return url
      },
      run: function() {
        Microloader.init();
        var manifest = Ext.manifest;
        if ('string' === typeof manifest) {
          manifest = manifest.indexOf('.json') === manifest.length - 5 ?
            manifest : manifest + '.json';
          var key = getStorageKey(manifest);
          (key = LocalStorage.retrieveAsset(key)) ? (manifest =
            new Manifest({
              url: manifest,
              content: key,
              cached: !0
            }), postProcessor && postProcessor(manifest),
            Microloader.load(manifest)) : 0 === location.href.indexOf(
            'file:/') ? (Manifest.url = Microloader.applyCacheBuster(
            manifest + 'p'), Boot.load(Manifest.url)) : (Manifest.url =
            manifest, Boot.fetch(Microloader.applyCacheBuster(manifest),
              function(result) {
                Microloader.setManifest(result.content)
              }))
        } else manifest = new Manifest({
          content: manifest
        }), Microloader.load(manifest)
      },
      setManifest: function(cfg) {
        cfg = new Manifest({
          url: Manifest.url,
          content: cfg
        });
        cfg.cache();
        postProcessor && postProcessor(cfg);
        Microloader.load(cfg)
      },
      load: function(manifest) {
        Microloader.urls = [];
        Microloader.manifest = manifest;
        Ext.manifest = Microloader.manifest.exportContent();
        var progressive = Ext.manifest.progressive;
        progressive && progressive.serviceWorker && 'serviceWorker' in
          navigator && (navigator.serviceWorker.register('./' + progressive
            .serviceWorker), Ext.Boot.config.disableCaching = !1);
        progressive = manifest.getAssets();
        var cachedAssets = [],
          i, include;
        var len = progressive.length;
        for (i = 0; i < len; i++) {
          var asset$jscomp$0 = progressive[i];
          if (include = Microloader.filterAsset(asset$jscomp$0)) manifest
            .shouldCache() &&
            asset$jscomp$0.shouldCache() && (asset$jscomp$0.content ? (
                include = Boot.registerContent(asset$jscomp$0.assetConfig
                  .path, asset$jscomp$0.type, asset$jscomp$0.content),
                include.evaluated && _warn('Asset: ' + asset$jscomp$0
                  .assetConfig.path +
                  ' was evaluated prior to local storage being consulted.')
                ) : cachedAssets.push(asset$jscomp$0)), Microloader.urls
            .push(asset$jscomp$0.assetConfig.path), Boot.assetConfig[
              asset$jscomp$0.assetConfig.path] = Boot.apply({
              type: asset$jscomp$0.type
            }, asset$jscomp$0.assetConfig)
        }
        if (0 < cachedAssets.length)
          for (Microloader.remainingCachedAssets =
            cachedAssets.length; 0 < cachedAssets.length;) asset$jscomp$0 =
            cachedAssets.pop(), Boot.fetch(asset$jscomp$0.assetConfig.path,
              function(asset) {
                return function(result) {
                  Microloader.onCachedAssetLoaded(asset, result)
                }
              }(asset$jscomp$0));
        else Microloader.onCachedAssetsReady()
      },
      onCachedAssetLoaded: function(asset, result) {
        result = Microloader.parseResult(result);
        Microloader.remainingCachedAssets--;
        if (result.error) _warn(
            "There was an error pre-loading the asset '" + asset.assetConfig
            .path + "'. This asset will be uncached for future loading"),
          asset.uncache();
        else {
          var checksum = Microloader.checksum(result.content, asset
            .assetConfig.hash);
          checksum || (_warn("Cached Asset '" + asset.assetConfig.path +
            "' has failed checksum. This asset will be uncached for future loading"
            ), asset.uncache());
          Boot.registerContent(asset.assetConfig.path, asset.type, result
            .content);
          asset.updateContent(result.content);
          asset.cache()
        }
        if (0 === Microloader.remainingCachedAssets) Microloader
          .onCachedAssetsReady()
      },
      onCachedAssetsReady: function() {
        Boot.load({
          url: Microloader.urls,
          loadOrder: Microloader.manifest.loadOrder,
          loadOrderMap: Microloader.manifest.loadOrderMap,
          sequential: !0,
          success: Microloader.onAllAssetsReady,
          failure: Microloader.onAllAssetsReady
        })
      },
      onAllAssetsReady: function() {
        _loaded = !0;
        Microloader.notify();
        !1 !== navigator.onLine ? Microloader.checkAllUpdates() : window
          .addEventListener && window.addEventListener('online', Microloader
            .checkAllUpdates, !1)
      },
      onMicroloaderReady: function(listener) {
        _loaded ? listener() : _listeners.push(listener)
      },
      notify: function() {
        for (var listener; listener =
          _listeners.shift();) listener()
      },
      patch: function(content, delta) {
        var output = [],
          ln;
        if (0 === delta.length) return content;
        var i = 0;
        for (ln = delta.length; i < ln; i++) {
          var chunk = delta[i];
          'number' === typeof chunk ? output.push(content.substring(chunk,
            chunk + delta[++i])) : output.push(chunk)
        }
        return output.join('')
      },
      checkAllUpdates: function() {
        window.removeEventListener && window.removeEventListener('online',
          Microloader.checkAllUpdates, !1);
        _cache && Microloader.checkForAppCacheUpdate();
        Microloader.manifest.fromCache && Microloader.checkForUpdates()
      },
      checkForAppCacheUpdate: function() {
        _cache.status === _cache.UPDATEREADY || _cache.status === _cache
          .OBSOLETE ? Microloader.appCacheState = 'updated' : _cache
          .status !== _cache.IDLE && _cache.status !== _cache.UNCACHED ? (
            Microloader.appCacheState = 'checking', _cache.addEventListener(
              'error', Microloader.onAppCacheError), _cache
            .addEventListener('noupdate', Microloader.onAppCacheNotUpdated),
            _cache.addEventListener('cached', Microloader
              .onAppCacheNotUpdated), _cache.addEventListener('updateready',
              Microloader.onAppCacheReady),
            _cache.addEventListener('obsolete', Microloader
              .onAppCacheObsolete)) : Microloader.appCacheState = 'current'
      },
      checkForUpdates: function() {
        Boot.fetch(Microloader.applyCacheBuster(Microloader.manifest.url),
          Microloader.onUpdatedManifestLoaded)
      },
      onAppCacheError: function(e) {
        _warn(e.message);
        Microloader.appCacheState = 'error';
        Microloader.notifyUpdateReady()
      },
      onAppCacheReady: function() {
        _cache.swapCache();
        Microloader.appCacheUpdated()
      },
      onAppCacheObsolete: function() {
        Microloader.appCacheUpdated()
      },
      appCacheUpdated: function() {
        Microloader.appCacheState =
          'updated';
        Microloader.notifyUpdateReady()
      },
      onAppCacheNotUpdated: function() {
        Microloader.appCacheState = 'current';
        Microloader.notifyUpdateReady()
      },
      filterAsset: function(asset) {
        asset = asset && asset.assetConfig || {};
        return asset.platform || asset.exclude ? Boot.filterPlatform(asset
          .platform, asset.exclude) : !0
      },
      onUpdatedManifestLoaded: function(result$jscomp$0) {
        result$jscomp$0 = Microloader.parseResult(result$jscomp$0);
        if (result$jscomp$0.error) _warn(
            'Error loading manifest file to check for updates'), Microloader
          .onAllUpdatedAssetsReady();
        else {
          var include, updatingAssets = [],
            manifest = new Manifest({
              url: Microloader.manifest.url,
              content: result$jscomp$0.content,
              assetCache: !1
            });
          Microloader.remainingUpdatingAssets = 0;
          Microloader.updatedAssets = [];
          Microloader.removedAssets = [];
          Microloader.updatedManifest = null;
          Microloader.updatedAssetsReady = !1;
          if (manifest.shouldCache())
            if (Microloader.manifest.is(manifest)) Microloader
              .onAllUpdatedAssetsReady();
            else {
              Microloader.updatedManifest = manifest;
              var currentAssets = Microloader.manifest.getAssets();
              var newAssets =
                manifest.getAssets();
              for (prop in newAssets) {
                result$jscomp$0 = newAssets[prop];
                var currentAsset = Microloader.manifest.getAsset(
                  result$jscomp$0.assetConfig.path);
                (include = Microloader.filterAsset(result$jscomp$0)) && (!
                  currentAsset || result$jscomp$0.shouldCache() && !
                  currentAsset.is(result$jscomp$0)) && updatingAssets.push({
                  _new: result$jscomp$0,
                  _current: currentAsset
                })
              }
              for (prop in currentAssets) currentAsset = currentAssets[
                prop], result$jscomp$0 = manifest.getAsset(currentAsset
                  .assetConfig.path), (include = !Microloader.filterAsset(
                  result$jscomp$0)) &&
                result$jscomp$0 && (!currentAsset.shouldCache() ||
                  result$jscomp$0.shouldCache()) || Microloader
                .removedAssets.push(currentAsset);
              if (0 < updatingAssets.length)
                for (Microloader.remainingUpdatingAssets = updatingAssets
                  .length; 0 < updatingAssets.length;)
                  if (currentAsset = updatingAssets.pop(), result$jscomp$0 =
                    currentAsset._new, currentAsset = currentAsset._current,
                    'full' === result$jscomp$0.assetConfig.update || !
                    currentAsset) Boot.fetch(result$jscomp$0.assetConfig
                    .path,
                    function(asset) {
                      return function(result) {
                        Microloader.onFullAssetUpdateLoaded(asset,
                          result)
                      }
                    }(result$jscomp$0));
                  else {
                    if ('delta' === result$jscomp$0.assetConfig.update) {
                      var prop = manifest.deltas;
                      prop = prop + '/' + result$jscomp$0.assetConfig.path +
                        '/' + currentAsset.assetConfig.hash + '.json';
                      Boot.fetch(prop, function(asset, oldAsset) {
                        return function(result) {
                          Microloader.onDeltaAssetUpdateLoaded(asset,
                            oldAsset, result)
                        }
                      }(result$jscomp$0, currentAsset))
                    }
                  }
              else Microloader.onAllUpdatedAssetsReady()
            }
          else Microloader.updatedManifest = manifest, LocalStorage
            .clearAllPrivate(manifest), Microloader
            .onAllUpdatedAssetsReady()
        }
      },
      onFullAssetUpdateLoaded: function(asset, result) {
        var checksum;
        result = Microloader.parseResult(result);
        Microloader.remainingUpdatingAssets--;
        result.error ? asset.uncache() : (checksum = Microloader.checksum(
            result.content, asset.assetConfig.hash)) ? (asset.updateContent(
            result.content), Microloader.updatedAssets.push(asset)) : asset
          .uncache();
        if (0 === Microloader.remainingUpdatingAssets) Microloader
          .onAllUpdatedAssetsReady()
      },
      onDeltaAssetUpdateLoaded: function(asset, oldAsset, result) {
        var checksum;
        result = Microloader.parseResult(result);
        Microloader.remainingUpdatingAssets--;
        if (result.error) _warn('Error loading delta patch for ' + asset
            .assetConfig.path + ' with hash ' + oldAsset.assetConfig.hash +
            ' . This asset will be uncached for future loading'), asset
          .uncache();
        else try {
          var json = JSON.parse(result.content);
          var content = Microloader.patch(oldAsset.content, json);
          (checksum = Microloader.checksum(content, asset.assetConfig
            .hash)) ? (asset.updateContent(content), Microloader
            .updatedAssets.push(asset)) : asset.uncache()
        } catch (e) {
          _warn('Error parsing delta patch for ' +
              asset.assetConfig.path + ' with hash ' + oldAsset
              .assetConfig.hash +
              ' . This asset will be uncached for future loading'), asset
            .uncache()
        }
        if (0 === Microloader.remainingUpdatingAssets) Microloader
          .onAllUpdatedAssetsReady()
      },
      onAllUpdatedAssetsReady: function() {
        Microloader.updatedAssetsReady = !0;
        if (Microloader.updatedManifest) {
          for (; 0 < Microloader.removedAssets.length;) {
            var asset = Microloader.removedAssets.pop();
            asset.uncache()
          }
          for (Microloader.updatedManifest && Microloader.updatedManifest
            .cache(); 0 < Microloader.updatedAssets.length;) asset =
            Microloader.updatedAssets.pop(), asset.cache()
        }
        Microloader.notifyUpdateReady()
      },
      notifyUpdateReady: function() {
        'checking' !== Microloader.appCacheState && Microloader
          .updatedAssetsReady && ('updated' === Microloader.appCacheState ||
            Microloader.updatedManifest) && (Microloader.appUpdate = {
            updated: !0,
            app: 'updated' === Microloader.appCacheState,
            manifest: Microloader.updatedManifest && Microloader
              .updatedManifest.exportContent()
          }, Microloader.fireAppUpdate())
      },
      fireAppUpdate: function() {
        Ext.GlobalEvents && Ext.defer(function() {
          Ext.GlobalEvents.fireEvent('appupdate',
            Microloader.appUpdate)
        }, 1E3)
      },
      checksum: function(content, hash) {
        if (!content || !hash) return !1;
        var passed = !0,
          hashLn = hash.length,
          checksumType = content.substring(0, 1);
        '/' == checksumType ? content.substring(2, hashLn + 2) !== hash && (
            passed = !1) : 'f' == checksumType ? content.substring(10,
            hashLn + 10) !== hash && (passed = !1) : '.' == checksumType &&
          content.substring(1, hashLn + 1) !== hash && (passed = !1);
        return passed
      },
      parseResult: function(result) {
        var rst = {};
        !result.exception && 0 !== result.status || Boot.env.phantom ?
          200 <= result.status && 300 > result.status ||
          304 === result.status || Boot.env.phantom || 0 === result
          .status && 0 < result.content.length ? rst.content = result
          .content : rst.error = !0 : rst.error = !0;
        return rst
      }
    };
  return Microloader
}();
Ext.manifest = Ext.manifest || 'bootstrap';
Ext.Microloader.run();