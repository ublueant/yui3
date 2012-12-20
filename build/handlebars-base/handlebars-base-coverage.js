if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/handlebars-base/handlebars-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/handlebars-base/handlebars-base.js",
    code: []
};
_yuitest_coverage["build/handlebars-base/handlebars-base.js"].code=["YUI.add('handlebars-base', function (Y, NAME) {","","/*!","Handlebars.js - Copyright (C) 2011 Yehuda Katz","https://raw.github.com/wycats/handlebars.js/master/LICENSE","*/","/* THIS FILE IS GENERATED BY A BUILD SCRIPT - DO NOT EDIT! */","","// BEGIN(BROWSER)","","/*jshint eqnull:true*/","var Handlebars = {};","","(function(Handlebars) {","","Handlebars.VERSION = \"1.0.rc.1\";","","Handlebars.helpers  = {};","Handlebars.partials = {};","","Handlebars.registerHelper = function(name, fn, inverse) {","  if(inverse) { fn.not = inverse; }","  this.helpers[name] = fn;","};","","Handlebars.registerPartial = function(name, str) {","  this.partials[name] = str;","};","","Handlebars.registerHelper('helperMissing', function(arg) {","  if(arguments.length === 2) {","    return undefined;","  } else {","    throw new Error(\"Could not find property '\" + arg + \"'\");","  }","});","","var toString = Object.prototype.toString, functionType = \"[object Function]\";","","Handlebars.registerHelper('blockHelperMissing', function(context, options) {","  var inverse = options.inverse || function() {}, fn = options.fn;","","","  var ret = \"\";","  var type = toString.call(context);","","  if(type === functionType) { context = context.call(this); }","","  if(context === true) {","    return fn(this);","  } else if(context === false || context == null) {","    return inverse(this);","  } else if(type === \"[object Array]\") {","    if(context.length > 0) {","      return Handlebars.helpers.each(context, options);","    } else {","      return inverse(this);","    }","  } else {","    return fn(context);","  }","});","","Handlebars.K = function() {};","","Handlebars.createFrame = Object.create || function(object) {","  Handlebars.K.prototype = object;","  var obj = new Handlebars.K();","  Handlebars.K.prototype = null;","  return obj;","};","","Handlebars.registerHelper('each', function(context, options) {","  var fn = options.fn, inverse = options.inverse;","  var i = 0, ret = \"\", data;","","  if (options.data) {","    data = Handlebars.createFrame(options.data);","  }","","  if(context && typeof context === 'object') {","    if(context instanceof Array){","      for(var j = context.length; i<j; i++) {","        if (data) { data.index = i; }","        ret = ret + fn(context[i], { data: data });","      }","    } else {","      for(var key in context) {","        if(context.hasOwnProperty(key)) {","          if(data) { data.key = key; }","          ret = ret + fn(context[key], {data: data});","          i++;","        }","      }","    }","  }","","  if(i === 0){","    ret = inverse(this);","  }","","  return ret;","});","","Handlebars.registerHelper('if', function(context, options) {","  var type = toString.call(context);","  if(type === functionType) { context = context.call(this); }","","  if(!context || Handlebars.Utils.isEmpty(context)) {","    return options.inverse(this);","  } else {","    return options.fn(this);","  }","});","","Handlebars.registerHelper('unless', function(context, options) {","  var fn = options.fn, inverse = options.inverse;","  options.fn = inverse;","  options.inverse = fn;","","  return Handlebars.helpers['if'].call(this, context, options);","});","","Handlebars.registerHelper('with', function(context, options) {","  return options.fn(context);","});","","Handlebars.registerHelper('log', function(context) {","  Handlebars.log(context);","});","","}(Handlebars));","","// END(BROWSER)","// This file provides a YUI-specific implementation of Handlebars' lib/utils.js","// file. Handlebars unfortunately creates enclosed references to its utils, so","// we have to maintain a complete fork of this file rather than just overriding","// specific parts.","","var Lang = Y.Lang;","","Handlebars.Exception = function (message) {","    var error = Error.prototype.constructor.apply(this, arguments),","        key;","","    for (key in error) {","        if (error.hasOwnProperty(key)) {","            this[key] = error[key];","        }","    }","","    this.message = error.message;","};","","Handlebars.Exception.prototype = new Error();","","Handlebars.SafeString = function (string) {","    this.string = string;","};","","Handlebars.SafeString.prototype.toString = function () {","    return this.string.toString();","};","","Handlebars.Utils = {","    escapeExpression: function (string) {","        // Skip escaping for empty strings.","        if (string === '') {","            return string;","        }","","        // Don't escape SafeStrings, since they're already (presumed to be)","        // safe.","        if (string instanceof Handlebars.SafeString) {","            return string.toString();","        } else if (string === false || !Lang.isValue(string)) {","            return '';","        }","","        // Unlike Handlebars' escaping implementation, Y.Escape.html() will","        // double-escape existing &amp; entities. This seems much less","        // surprising than avoiding double-escaping, especially since","        // a lack of double-escaping would make it impossible to use Handlebars","        // for things like displaying escaped code snippets.","        return Y.Escape.html(string);","    },","","    isEmpty: function (value) {","        if (value === false","                || !Lang.isValue(value)","                || (Lang.isArray(value) && !value.length)) {","","            return true;","        }","","        return false;","    }","};","/* THIS FILE IS GENERATED BY A BUILD SCRIPT - DO NOT EDIT! */","","// BEGIN(BROWSER)","Handlebars.VM = {","  template: function(templateSpec) {","    // Just add water","    var container = {","      escapeExpression: Handlebars.Utils.escapeExpression,","      invokePartial: Handlebars.VM.invokePartial,","      programs: [],","      program: function(i, fn, data) {","        var programWrapper = this.programs[i];","        if(data) {","          return Handlebars.VM.program(fn, data);","        } else if(programWrapper) {","          return programWrapper;","        } else {","          programWrapper = this.programs[i] = Handlebars.VM.program(fn);","          return programWrapper;","        }","      },","      programWithDepth: Handlebars.VM.programWithDepth,","      noop: Handlebars.VM.noop","    };","","    return function(context, options) {","      options = options || {};","      return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);","    };","  },","","  programWithDepth: function(fn, data, $depth) {","    var args = Array.prototype.slice.call(arguments, 2);","","    return function(context, options) {","      options = options || {};","","      return fn.apply(this, [context, options.data || data].concat(args));","    };","  },","  program: function(fn, data) {","    return function(context, options) {","      options = options || {};","","      return fn(context, options.data || data);","    };","  },","  noop: function() { return \"\"; },","  invokePartial: function(partial, name, context, helpers, partials, data) {","    var options = { helpers: helpers, partials: partials, data: data };","","    if(partial === undefined) {","      throw new Handlebars.Exception(\"The partial \" + name + \" could not be found\");","    } else if(partial instanceof Function) {","      return partial(context, options);","    } else if (!Handlebars.compile) {","      throw new Handlebars.Exception(\"The partial \" + name + \" could not be compiled when running in runtime-only mode\");","    } else {","      partials[name] = Handlebars.compile(partial, {data: data !== undefined});","      return partials[name](context, options);","    }","  }","};","","Handlebars.template = Handlebars.VM.template;","","// END(BROWSER)","// This file contains YUI-specific wrapper code and overrides for the","// handlebars-base module.","","/**","Handlebars is a simple template language inspired by Mustache.","","This is a YUI port of the original Handlebars project, which can be found at","<https://github.com/wycats/handlebars.js>.","","@module handlebars","@main handlebars","@since 3.5.0","*/","","/**","Provides basic Handlebars template rendering functionality. Use this module when","you only need to render pre-compiled templates.","","@module handlebars","@submodule handlebars-base","*/","","/**","Handlebars is a simple template language inspired by Mustache.","","This is a YUI port of the original Handlebars project, which can be found at","<https://github.com/wycats/handlebars.js>.","","@class Handlebars","@since 3.5.0","*/","Y.Handlebars = Handlebars;","","Handlebars.VERSION += '-yui';","","/**","Registers a helper function that will be made available to all templates.","","Helper functions receive the current template context as the `this` object, and","can also receive arguments passed by the template.","","@example","","    Y.Handlebars.registerHelper('linkify', function () {","        return '<a href=\"' + Y.Escape.html(this.url) + '\">' +","            Y.Escape.html(this.text) + '</a>';","    });","","    var source = '<ul>{{#links}}<li>{{{linkify}}}</li>{{/links}}</ul>';","","    Y.Handlebars.render(source, {","        links: [","            {url: '/foo', text: 'Foo'},","            {url: '/bar', text: 'Bar'},","            {url: '/baz', text: 'Baz'}","        ]","    });","","@method registerHelper","@param {String} name Name of this helper.","@param {Function} fn Helper function.","@param {Boolean} [inverse=false] If `true`, this helper will be considered an","    \"inverse\" helper, like \"unless\". This means it will only be called if the","    expression given in the template evaluates to a false or empty value.","*/","","/**","Registers a partial that will be made available to all templates.","","A partial is another template that can be used to render part of a larger","template. For example, a website with a common header and footer across all its","pages might use a template for each page, which would call shared partials to","render the headers and footers.","","Partials may be specified as uncompiled template strings or as compiled template","functions.","","@example","","    Y.Handlebars.registerPartial('header', '<h1>{{title}}</h1>');","    Y.Handlebars.registerPartial('footer', 'Copyright (c) 2011 by Me.');","","    var source = '{{> header}} <p>Mustaches are awesome!</p> {{> footer}}';","","    Y.Handlebars.render(source, {title: 'My Page About Mustaches'});","","@method registerPartial","@param {String} name Name of this partial.","@param {Function|String} partial Template string or compiled template function.","*/","","/**","Converts a precompiled template into a renderable template function.","","@example","","    <script src=\"precompiled-template.js\"></script>","    <script>","    YUI().use('handlebars-base', function (Y) {","        // Convert the precompiled template function into a renderable template","        // function.","        var template = Y.Handlebars.template(precompiledTemplate);","","        // Render it.","        template({pie: 'Pumpkin'});","    });","    </script>","","@method template","@param {Function} template Precompiled Handlebars template function.","@return {Function} Compiled template function.","*/","","// Alias for Y.Handlebars.template(), used by Y.Template.","Handlebars.revive = Handlebars.template;","","// Make Y.Template.Handlebars an alias for Y.Handlebars.","Y.namespace('Template').Handlebars = Handlebars;","","","}, '@VERSION@', {\"requires\": [\"escape\"]});"];
_yuitest_coverage["build/handlebars-base/handlebars-base.js"].lines = {"1":0,"12":0,"14":0,"16":0,"18":0,"19":0,"21":0,"22":0,"23":0,"26":0,"27":0,"30":0,"31":0,"32":0,"34":0,"38":0,"40":0,"41":0,"44":0,"45":0,"47":0,"49":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"57":0,"60":0,"64":0,"66":0,"67":0,"68":0,"69":0,"70":0,"73":0,"74":0,"75":0,"77":0,"78":0,"81":0,"82":0,"83":0,"84":0,"85":0,"88":0,"89":0,"90":0,"91":0,"92":0,"98":0,"99":0,"102":0,"105":0,"106":0,"107":0,"109":0,"110":0,"112":0,"116":0,"117":0,"118":0,"119":0,"121":0,"124":0,"125":0,"128":0,"129":0,"140":0,"142":0,"143":0,"146":0,"147":0,"148":0,"152":0,"155":0,"157":0,"158":0,"161":0,"162":0,"165":0,"168":0,"169":0,"174":0,"175":0,"176":0,"177":0,"185":0,"189":0,"193":0,"196":0,"202":0,"205":0,"210":0,"211":0,"212":0,"213":0,"214":0,"216":0,"217":0,"224":0,"225":0,"226":0,"231":0,"233":0,"234":0,"236":0,"240":0,"241":0,"243":0,"246":0,"248":0,"250":0,"251":0,"252":0,"253":0,"254":0,"255":0,"257":0,"258":0,"263":0,"297":0,"299":0,"380":0,"383":0};
_yuitest_coverage["build/handlebars-base/handlebars-base.js"].functions = {"registerHelper:21":0,"registerPartial:26":0,"(anonymous 3):30":0,"(anonymous 4):40":0,"(anonymous 6):66":0,"(anonymous 7):73":0,"(anonymous 8):105":0,"(anonymous 9):116":0,"(anonymous 10):124":0,"(anonymous 11):128":0,"(anonymous 2):14":0,"Exception:142":0,"SafeString:157":0,"toString:161":0,"escapeExpression:166":0,"isEmpty:188":0,"program:209":0,"(anonymous 12):224":0,"template:203":0,"(anonymous 13):233":0,"programWithDepth:230":0,"(anonymous 14):240":0,"program:239":0,"noop:246":0,"invokePartial:247":0,"(anonymous 1):1":0};
_yuitest_coverage["build/handlebars-base/handlebars-base.js"].coveredLines = 126;
_yuitest_coverage["build/handlebars-base/handlebars-base.js"].coveredFunctions = 26;
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 1);
YUI.add('handlebars-base', function (Y, NAME) {

/*!
Handlebars.js - Copyright (C) 2011 Yehuda Katz
https://raw.github.com/wycats/handlebars.js/master/LICENSE
*/
/* THIS FILE IS GENERATED BY A BUILD SCRIPT - DO NOT EDIT! */

// BEGIN(BROWSER)

/*jshint eqnull:true*/
_yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 12);
var Handlebars = {};

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 14);
(function(Handlebars) {

_yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "(anonymous 2)", 14);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 16);
Handlebars.VERSION = "1.0.rc.1";

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 18);
Handlebars.helpers  = {};
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 19);
Handlebars.partials = {};

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 21);
Handlebars.registerHelper = function(name, fn, inverse) {
  _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "registerHelper", 21);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 22);
if(inverse) { fn.not = inverse; }
  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 23);
this.helpers[name] = fn;
};

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 26);
Handlebars.registerPartial = function(name, str) {
  _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "registerPartial", 26);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 27);
this.partials[name] = str;
};

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 30);
Handlebars.registerHelper('helperMissing', function(arg) {
  _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "(anonymous 3)", 30);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 31);
if(arguments.length === 2) {
    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 32);
return undefined;
  } else {
    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 34);
throw new Error("Could not find property '" + arg + "'");
  }
});

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 38);
var toString = Object.prototype.toString, functionType = "[object Function]";

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 40);
Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "(anonymous 4)", 40);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 41);
var inverse = options.inverse || function() {}, fn = options.fn;


  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 44);
var ret = "";
  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 45);
var type = toString.call(context);

  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 47);
if(type === functionType) { context = context.call(this); }

  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 49);
if(context === true) {
    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 50);
return fn(this);
  } else {_yuitest_coverline("build/handlebars-base/handlebars-base.js", 51);
if(context === false || context == null) {
    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 52);
return inverse(this);
  } else {_yuitest_coverline("build/handlebars-base/handlebars-base.js", 53);
if(type === "[object Array]") {
    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 54);
if(context.length > 0) {
      _yuitest_coverline("build/handlebars-base/handlebars-base.js", 55);
return Handlebars.helpers.each(context, options);
    } else {
      _yuitest_coverline("build/handlebars-base/handlebars-base.js", 57);
return inverse(this);
    }
  } else {
    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 60);
return fn(context);
  }}}
});

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 64);
Handlebars.K = function() {};

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 66);
Handlebars.createFrame = Object.create || function(object) {
  _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "(anonymous 6)", 66);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 67);
Handlebars.K.prototype = object;
  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 68);
var obj = new Handlebars.K();
  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 69);
Handlebars.K.prototype = null;
  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 70);
return obj;
};

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 73);
Handlebars.registerHelper('each', function(context, options) {
  _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "(anonymous 7)", 73);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 74);
var fn = options.fn, inverse = options.inverse;
  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 75);
var i = 0, ret = "", data;

  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 77);
if (options.data) {
    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 78);
data = Handlebars.createFrame(options.data);
  }

  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 81);
if(context && typeof context === 'object') {
    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 82);
if(context instanceof Array){
      _yuitest_coverline("build/handlebars-base/handlebars-base.js", 83);
for(var j = context.length; i<j; i++) {
        _yuitest_coverline("build/handlebars-base/handlebars-base.js", 84);
if (data) { data.index = i; }
        _yuitest_coverline("build/handlebars-base/handlebars-base.js", 85);
ret = ret + fn(context[i], { data: data });
      }
    } else {
      _yuitest_coverline("build/handlebars-base/handlebars-base.js", 88);
for(var key in context) {
        _yuitest_coverline("build/handlebars-base/handlebars-base.js", 89);
if(context.hasOwnProperty(key)) {
          _yuitest_coverline("build/handlebars-base/handlebars-base.js", 90);
if(data) { data.key = key; }
          _yuitest_coverline("build/handlebars-base/handlebars-base.js", 91);
ret = ret + fn(context[key], {data: data});
          _yuitest_coverline("build/handlebars-base/handlebars-base.js", 92);
i++;
        }
      }
    }
  }

  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 98);
if(i === 0){
    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 99);
ret = inverse(this);
  }

  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 102);
return ret;
});

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 105);
Handlebars.registerHelper('if', function(context, options) {
  _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "(anonymous 8)", 105);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 106);
var type = toString.call(context);
  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 107);
if(type === functionType) { context = context.call(this); }

  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 109);
if(!context || Handlebars.Utils.isEmpty(context)) {
    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 110);
return options.inverse(this);
  } else {
    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 112);
return options.fn(this);
  }
});

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 116);
Handlebars.registerHelper('unless', function(context, options) {
  _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "(anonymous 9)", 116);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 117);
var fn = options.fn, inverse = options.inverse;
  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 118);
options.fn = inverse;
  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 119);
options.inverse = fn;

  _yuitest_coverline("build/handlebars-base/handlebars-base.js", 121);
return Handlebars.helpers['if'].call(this, context, options);
});

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 124);
Handlebars.registerHelper('with', function(context, options) {
  _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "(anonymous 10)", 124);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 125);
return options.fn(context);
});

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 128);
Handlebars.registerHelper('log', function(context) {
  _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "(anonymous 11)", 128);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 129);
Handlebars.log(context);
});

}(Handlebars));

// END(BROWSER)
// This file provides a YUI-specific implementation of Handlebars' lib/utils.js
// file. Handlebars unfortunately creates enclosed references to its utils, so
// we have to maintain a complete fork of this file rather than just overriding
// specific parts.

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 140);
var Lang = Y.Lang;

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 142);
Handlebars.Exception = function (message) {
    _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "Exception", 142);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 143);
var error = Error.prototype.constructor.apply(this, arguments),
        key;

    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 146);
for (key in error) {
        _yuitest_coverline("build/handlebars-base/handlebars-base.js", 147);
if (error.hasOwnProperty(key)) {
            _yuitest_coverline("build/handlebars-base/handlebars-base.js", 148);
this[key] = error[key];
        }
    }

    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 152);
this.message = error.message;
};

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 155);
Handlebars.Exception.prototype = new Error();

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 157);
Handlebars.SafeString = function (string) {
    _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "SafeString", 157);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 158);
this.string = string;
};

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 161);
Handlebars.SafeString.prototype.toString = function () {
    _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "toString", 161);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 162);
return this.string.toString();
};

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 165);
Handlebars.Utils = {
    escapeExpression: function (string) {
        // Skip escaping for empty strings.
        _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "escapeExpression", 166);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 168);
if (string === '') {
            _yuitest_coverline("build/handlebars-base/handlebars-base.js", 169);
return string;
        }

        // Don't escape SafeStrings, since they're already (presumed to be)
        // safe.
        _yuitest_coverline("build/handlebars-base/handlebars-base.js", 174);
if (string instanceof Handlebars.SafeString) {
            _yuitest_coverline("build/handlebars-base/handlebars-base.js", 175);
return string.toString();
        } else {_yuitest_coverline("build/handlebars-base/handlebars-base.js", 176);
if (string === false || !Lang.isValue(string)) {
            _yuitest_coverline("build/handlebars-base/handlebars-base.js", 177);
return '';
        }}

        // Unlike Handlebars' escaping implementation, Y.Escape.html() will
        // double-escape existing &amp; entities. This seems much less
        // surprising than avoiding double-escaping, especially since
        // a lack of double-escaping would make it impossible to use Handlebars
        // for things like displaying escaped code snippets.
        _yuitest_coverline("build/handlebars-base/handlebars-base.js", 185);
return Y.Escape.html(string);
    },

    isEmpty: function (value) {
        _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "isEmpty", 188);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 189);
if (value === false
                || !Lang.isValue(value)
                || (Lang.isArray(value) && !value.length)) {

            _yuitest_coverline("build/handlebars-base/handlebars-base.js", 193);
return true;
        }

        _yuitest_coverline("build/handlebars-base/handlebars-base.js", 196);
return false;
    }
};
/* THIS FILE IS GENERATED BY A BUILD SCRIPT - DO NOT EDIT! */

// BEGIN(BROWSER)
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 202);
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "template", 203);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 205);
var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "program", 209);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 210);
var programWrapper = this.programs[i];
        _yuitest_coverline("build/handlebars-base/handlebars-base.js", 211);
if(data) {
          _yuitest_coverline("build/handlebars-base/handlebars-base.js", 212);
return Handlebars.VM.program(fn, data);
        } else {_yuitest_coverline("build/handlebars-base/handlebars-base.js", 213);
if(programWrapper) {
          _yuitest_coverline("build/handlebars-base/handlebars-base.js", 214);
return programWrapper;
        } else {
          _yuitest_coverline("build/handlebars-base/handlebars-base.js", 216);
programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          _yuitest_coverline("build/handlebars-base/handlebars-base.js", 217);
return programWrapper;
        }}
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
    };

    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 224);
return function(context, options) {
      _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "(anonymous 12)", 224);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 225);
options = options || {};
      _yuitest_coverline("build/handlebars-base/handlebars-base.js", 226);
return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
    };
  },

  programWithDepth: function(fn, data, $depth) {
    _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "programWithDepth", 230);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 231);
var args = Array.prototype.slice.call(arguments, 2);

    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 233);
return function(context, options) {
      _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "(anonymous 13)", 233);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 234);
options = options || {};

      _yuitest_coverline("build/handlebars-base/handlebars-base.js", 236);
return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "program", 239);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 240);
return function(context, options) {
      _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "(anonymous 14)", 240);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 241);
options = options || {};

      _yuitest_coverline("build/handlebars-base/handlebars-base.js", 243);
return fn(context, options.data || data);
    };
  },
  noop: function() { _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "noop", 246);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 246);
return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    _yuitest_coverfunc("build/handlebars-base/handlebars-base.js", "invokePartial", 247);
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 248);
var options = { helpers: helpers, partials: partials, data: data };

    _yuitest_coverline("build/handlebars-base/handlebars-base.js", 250);
if(partial === undefined) {
      _yuitest_coverline("build/handlebars-base/handlebars-base.js", 251);
throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else {_yuitest_coverline("build/handlebars-base/handlebars-base.js", 252);
if(partial instanceof Function) {
      _yuitest_coverline("build/handlebars-base/handlebars-base.js", 253);
return partial(context, options);
    } else {_yuitest_coverline("build/handlebars-base/handlebars-base.js", 254);
if (!Handlebars.compile) {
      _yuitest_coverline("build/handlebars-base/handlebars-base.js", 255);
throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      _yuitest_coverline("build/handlebars-base/handlebars-base.js", 257);
partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      _yuitest_coverline("build/handlebars-base/handlebars-base.js", 258);
return partials[name](context, options);
    }}}
  }
};

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 263);
Handlebars.template = Handlebars.VM.template;

// END(BROWSER)
// This file contains YUI-specific wrapper code and overrides for the
// handlebars-base module.

/**
Handlebars is a simple template language inspired by Mustache.

This is a YUI port of the original Handlebars project, which can be found at
<https://github.com/wycats/handlebars.js>.

@module handlebars
@main handlebars
@since 3.5.0
*/

/**
Provides basic Handlebars template rendering functionality. Use this module when
you only need to render pre-compiled templates.

@module handlebars
@submodule handlebars-base
*/

/**
Handlebars is a simple template language inspired by Mustache.

This is a YUI port of the original Handlebars project, which can be found at
<https://github.com/wycats/handlebars.js>.

@class Handlebars
@since 3.5.0
*/
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 297);
Y.Handlebars = Handlebars;

_yuitest_coverline("build/handlebars-base/handlebars-base.js", 299);
Handlebars.VERSION += '-yui';

/**
Registers a helper function that will be made available to all templates.

Helper functions receive the current template context as the `this` object, and
can also receive arguments passed by the template.

@example

    Y.Handlebars.registerHelper('linkify', function () {
        return '<a href="' + Y.Escape.html(this.url) + '">' +
            Y.Escape.html(this.text) + '</a>';
    });

    var source = '<ul>{{#links}}<li>{{{linkify}}}</li>{{/links}}</ul>';

    Y.Handlebars.render(source, {
        links: [
            {url: '/foo', text: 'Foo'},
            {url: '/bar', text: 'Bar'},
            {url: '/baz', text: 'Baz'}
        ]
    });

@method registerHelper
@param {String} name Name of this helper.
@param {Function} fn Helper function.
@param {Boolean} [inverse=false] If `true`, this helper will be considered an
    "inverse" helper, like "unless". This means it will only be called if the
    expression given in the template evaluates to a false or empty value.
*/

/**
Registers a partial that will be made available to all templates.

A partial is another template that can be used to render part of a larger
template. For example, a website with a common header and footer across all its
pages might use a template for each page, which would call shared partials to
render the headers and footers.

Partials may be specified as uncompiled template strings or as compiled template
functions.

@example

    Y.Handlebars.registerPartial('header', '<h1>{{title}}</h1>');
    Y.Handlebars.registerPartial('footer', 'Copyright (c) 2011 by Me.');

    var source = '{{> header}} <p>Mustaches are awesome!</p> {{> footer}}';

    Y.Handlebars.render(source, {title: 'My Page About Mustaches'});

@method registerPartial
@param {String} name Name of this partial.
@param {Function|String} partial Template string or compiled template function.
*/

/**
Converts a precompiled template into a renderable template function.

@example

    <script src="precompiled-template.js"></script>
    <script>
    YUI().use('handlebars-base', function (Y) {
        // Convert the precompiled template function into a renderable template
        // function.
        var template = Y.Handlebars.template(precompiledTemplate);

        // Render it.
        template({pie: 'Pumpkin'});
    });
    </script>

@method template
@param {Function} template Precompiled Handlebars template function.
@return {Function} Compiled template function.
*/

// Alias for Y.Handlebars.template(), used by Y.Template.
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 380);
Handlebars.revive = Handlebars.template;

// Make Y.Template.Handlebars an alias for Y.Handlebars.
_yuitest_coverline("build/handlebars-base/handlebars-base.js", 383);
Y.namespace('Template').Handlebars = Handlebars;


}, '@VERSION@', {"requires": ["escape"]});
