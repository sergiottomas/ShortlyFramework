//array indexOf
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

//array filter
if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisp */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, t))
          res.push(val);
      }
    }

    return res;
  };
}

Object.defineProperty(Element.prototype, 'classList', {
    get: function() {
        var self = this, bValue = self.className.split(" ")

        bValue.add = function (){
            var b;
            for(i in arguments){
                b = true;
                for (var j = 0; j<bValue.length;j++)
                    if (bValue[j] == arguments[i]){
                        b = false
                        break
                    }
                if(b)
                    self.className += (self.className?" ":"")+arguments[i]
            }
        }
        bValue.remove = function(){
            self.className = ""
            for(i in arguments)
                for (var j = 0; j<bValue.length;j++)
                    if(bValue[j] != arguments[i])
                        self.className += (self.className?" " :"")+bValue[j]
        }

        return bValue;
    },
    enumerable: false
});

var extendFunctionality = function(obj) {
   for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
         this[i] = obj[i];
      }
   }
};

//for IE
if(typeof StaticNodeList != "undefined")
  StaticNodeList.prototype.extend = extendFunctionality;

//IE and Chrome
Array.prototype.extend = extendFunctionality;
Element.prototype.extend = extendFunctionality
Object.prototype.extend = extendFunctionality

// De https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys chamado de non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}
