/*
  # LIB CREATED BY SERGIO TOMAS
  # COMPATIBILITY WITH IE8 AND CHROME
  # DEPENDECY {prototypes.js}
*/

var sQuery = {
  eventTypes: {
    click : { 0: "click", 1: "onclick"},
    dblclick: { 0: "dblclick", 1: "ondblclick"},
    mouseover: { 0: "mouseover", 1: "onmouseover"},
    mouseout: { 0: "mouseout", 1: "onmouseout"},
    mousemove: { 0: "mousemove", 1: "onmousemove"},
    mousedown: { 0: "mousedown", 1: "onmousedown"},
    mouseup: { 0: "mouseup", 1: "onmouseup"},
    blur: { 0: "blur", 1: "onblur"},
    focus: { 0: "focus", 1: "onfocus"},
    change: { 0: "change", 1: "onchange"},
    reset: { 0: "reset", 1: "onreset"},
    select: { 0: "select", 1: "onselect"},
    submit: { 0: "submit", 1: "onsubmit"},
    keyup: { 0: "keyup", 1: "onkeyup"},
    keydown: { 0: "keydown", 1: "onkeydown"},
    keypress: { 0: "keypress", 1: "onkeypress"},
    abort: { 0: "abort", 1: "onabort"},
    load: { 0: "load", 1: "onload"},
    unload: { 0: "unload", 1: "onunload"},
    addCustomEvent: function(name){
      //remove especial caracters
      name = name.replace(/[^a-z0-9-]/g, '');
      this[name] = {0: name, 1: "on" + name}
    }
  },
    trigger: function(eventName){
        var eventType = sQuery.eventTypes[eventName];

        var event;
        if(typeof window.customEvent === 'function'){
          event = new CustomEvent(eventName);
        }else if(document.createEvent){
          event = document.createEvent('HTMLEvents');
          event.initEvent(eventName, true, true);
        }else if(document.createEventObject){
          event = document.createEventObject();
          event.eventType = eventType[1];
        }

        event.eventName = eventType[1];

        if(this.dispatchEvent){
          this.dispatchEvent(event);
        }else if(this.fireEvent && eventType[1]){
          this.fireEvent(eventType[1], event);
        }else if(this[eventName]){
          this[eventName]();
        }else if(this[eventType[1]]){
          this[eventType[1]]();
        }

        return this;
    },
    removeFromArray: function(array, term){
        newArray = array.filter(function(value){
          return value != term;
        });

        return newArray;
    },
    removeFromObjectArray: function(array, key, term){
    newArray = array.filter(function(value){
      if(value[key] != term){
        return true;
      }

      return false;
    });

    return newArray;
    },
    searchInArray: function(array, term, getArray){
        newArray = array.filter(function(value){
          return value == term;
        });

        if(!getArray){
          if(newArray.length > 0)
            return true;
          else {
            return false;
          }
        }else{
          return newArray;
        }
    },
    searchInObjectArray: function(array, key, term, getArray){
        var itemKey = null;
        newArray = array.filter(function(value){
          if(value[key] == term){
            itemKey = array.indexOf(value);
            return true;
          }

          return false;
        });

        if(!getArray){
          if(newArray.length > 0)
            return {found: true, key: itemKey};
          else {
            return {found: false, key: itemKey};
          }
        }else{
          return newArray;
        }
    },
    addClass: function(name){
        var checkClassStatus = function(className, element){
          var classString = element.getAttribute("class");

          if(classString){
            if(!sQuery.searchInArray(element.classList, name)){
              classString = classString + " " + className;
            }
          }else{
            classString = className;
          }

          return classString;
        }

        if(name){
          if(this.length > 1){
            for(var i = 0; i < this.length; i++){
              this[i].setAttribute("class", checkClassStatus(name, this[i]));
            }
          }else{
            this.setAttribute("class", checkClassStatus(name, this));
          }

          return this;
        }else{
            console.error("Its necessary a className for add new class");
        }
    },
    removeClass: function(name){
        var checkClassStatus = function(className, element){
          var classString = element.getAttribute("class");

          if(classString){
            var newClassList = sQuery.removeFromArray(element.classList, className);
            classString = newClassList.join(" ");
          }else{
            classString = className;
          }

          return classString;
        }

        if(name){
          if(this.length > 1){
            for(var i = 0; i < this.length; i++){
              this[i].setAttribute("class", checkClassStatus(name, this[i]));
            }
          }else{
            this.setAttribute("class", checkClassStatus(name, this));
          }

        }else{
          if(this.length > 1){
            for(var i = 0; i < this.length; i++){
              this[i].removeAttribute("class");
            }
          }else{
            this.removeAttribute("class");
          }
        }

        return this;
    },
    toggleClass: function(name){
        if(name && name.indexOf(" ") < 0){
          if(this.length > 1){
            for(var i = 0; i < this.length; i++){
              var classFound = false;
              for(var j = 0; j < this[i].classList.length; j++){
                if(this[i].classList[j] == name){
                  this[i].classList.remove(name);
                  classFound = true;
                }
              }

              if(!classFound){
                this[i].classList.add(name);
              }

            }
          }else{
            var classFound = false;
            for(var j = 0; j < this.classList.length; j++){
              if(this.classList[j] == name){
                this.removeClass(name);
                classFound = true;
              }
            }
            if(!classFound){
              this.addClass(name);
            }
          }
        }

        return this;
    },
    info:{
    version: '1.0',
    author: 'Sergio de Souza Tomas, MAT: 182416',
    name: 'SQuery (Sergio Query)',
    get: function(){
      alert(
        "Version: " + this.version + "\n" +
        "Author: " + this.author + "\n" +
        "Name: " + this.name + "\n"
      );
    }
    },
    on: function(eventType, callback){
        if(this == "undefined"){
            return;
        }

        if(sQuery.eventTypes[eventType]){
          var eventType = sQuery.eventTypes[eventType];
          var eventlistener = {callback: callback};

          if(this.length > 1){
            for(var i = 0; i < this.length; i++){
              if(this[i].addEventListener){
                this[i].addEventListener(eventType[0], callback);
                eventlistener.name = eventType[0];
              }else{
                this[i].attachEvent(eventType[1], callback);
                eventlistener.name = eventType[1];
              }

              if(this[i].eventListeners){
                var search = sQuery.searchInObjectArray(this[i].eventListeners, "name", eventlistener.name);
                if(search.found){
                  this[i].eventListeners[search.key].callback = callback;
                }else{
                  this[i].eventListeners.push(eventlistener);
                }
              }else{
                this[i].eventListeners = [eventlistener]
              }
            }
          }else{
            if(this.addEventListener){
              this.addEventListener(eventType[0], callback);
              eventlistener.name = eventType[0];
            }else{
              this.attachEvent(eventType[1], callback);
              eventlistener.name = eventType[1];
            }

            if(this.eventListeners){
              var search = sQuery.searchInObjectArray(this.eventListeners, "name", eventlistener.name);
              if(search.found){
                this.eventListeners[search.key].callback = callback;
              }else{
                this.eventListeners.push(eventlistener);
              }
            }else{
              this.eventListeners = [eventlistener]
            }
          }

          return this;
        }else{
          console.error("Event not find in SQEvent list.");
        }
    },
    off: function(eventType, callback){
    var eventType = sQuery.eventTypes[eventType];
    if(this.length > 1){
      for(var i = 0; i < this.length; i++){
        if(this[i].removeEventListener){
          var search = sQuery.searchInObjectArray(this[i].eventListeners, "name", eventType[0]);
          if(search.found){
              var listener = this[i].eventListeners[search.key];
              this[i].removeEventListener(listener.name, listener.callback);
              this[i].eventListeners.splice(search.key, 1);
          }
        }else{
          var search = sQuery.searchInObjectArray(this[i].eventListeners, "name", eventType[1]);
          if(search.found){
              var listener = this[i].eventListeners[search.key];
              this[i].detachEvent(listener.name, listener.callback);
              this[i].eventListeners.splice(search.key, 1);
          }
        }
      }
    }else{
      if(this.removeEventListener){
        var search = sQuery.searchInObjectArray(this.eventListeners, "name", eventType[0]);
        if(search.found){
            var listener = this.eventListeners[search.key];
            this.removeEventListener(listener.name, listener.callback);
            this.eventListeners.splice(search.key, 1);
        }
      }else{
        var search = sQuery.searchInObjectArray(this.eventListeners, "name", eventType[1]);
        if(search.found){
            var listener = this.eventListeners[search.key];
            this.detachEvent(listener.name, listener.callback);
            this.eventListeners.splice(search.key, 1);
        }
      }
    }

    return this;
    },
    remove: function(){
      if(this.length > 1){
          for(var i = 0; i < this.length; i++){
              this[i].parentNode.removeChild(this[i]);
          }
      }else{
        this.parentNode.removeChild(this);
      }

    },
    each: function(callback){
      if(this.length){
          for(var i = 0; i < this.length; i++){
            if(callback)
                callback.call(this[i], i, this[i]);
          }
      }else{
          if(callback){
              callback.call(this, 0, this);
          }
      }


    return this;
    },
    val: function(value){
    if(this.length > 1){
      for(var i = 0; i < this.length; i++){
        if(value){
          this[i].value = value;
        }
      }

      return this;
    }else{
      if(value){
        this.value = value;
        return this;
      }

      return this.value;
    }
    },
    text: function(value){
    if(this.length > 1){
      for(var i = 0; i < this.length; i++){
        if(value){
          this[i].innerText = value;
        }
      }

      return this;
    }else{
      if(value){
        this.innerText = value;
        return this;
      }

      return this.innerText;
    }
    },
    html: function(value){
    if(this.length > 1){
      for(var i = 0; i < this.length; i++){
        if(value){
          this[i].innerHTML = value;
        }
      }

      return this;
    }else{
      if(value){
        this.innerHTML = value;
        return this;
      }

      return this.innerHTML;
    }
    },
    append: function(element){
    if(this.length > 1){
      console.error("append failed, use append only unique element")
      return this;
    }else{
      if(typeof(element) === "object"){
        this.appendChild(element);
      }else{
        var el = document.createElement("div");
        el.innerHTML = element;
        for(var i = 0; i < el.childNodes.length; i++){
          this.appendChild(el.childNodes[i]);
        }
      }

      return this;
    }
    },
    prepend: function(element){
    if(this.length > 1){
      console.error("append failed, use append only unique element")
      return this;
    }else{
      if(typeof(element) === "object"){
        this.insertBefore(element, this.childNodes[0]);
      }else{
        var el = document.createElement("div");
        el.innerHTML = element;
        for(var i = 0; i < el.childNodes.length; i++){
          this.insertBefore(el.childNodes[i], this.childNodes[0]);
        }
      }

      return this;
    }
    },
    get: function(options){
        if(options){

          var url = options.url != undefined ? options.url : null;
          var rAsync = options.rAsync != undefined ? options.rAsync : true;
          var success = options.onSuccess  != undefined ? options.onSuccess : null;
          var error = options.onError  != undefined ? options.onError : null;

          var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest : new ActiveXObject("MSXML2.XMLHTTP.3.0");
          if (xhr != null) {
            try{
              xhr.open("GET", url, rAsync);
              xhr.onreadystatechange = function(e){
                if(xhr.readyState == 4){
                  if(xhr.status == 200){
                    success.call(this, xhr, e);
                  }else{

                  }
                }
              }
              xhr.send();
            }catch(handler){
              error.call(xhr, handler);
            }
          }
          else {
              window.console.log("AJAX (XMLHTTP) not supported.");
          }

          return this;
        }
    },
    find: function(selector){
        if(!this.length){
            if(typeof(selector) != "object"){
                if(selector.indexOf(" > ") < 0)
                    selector = selector.replace(" ", " > ");

                element = this.querySelectorAll(selector);
            }else{
                element = selector;
            }

            return SQ(element);
        }else{
            return SQ(selector);
        }
    }
}

var SQ = function(selector){
    var element;

    if(typeof(selector) != "object"){
        if(selector.indexOf(" > ") < 0)
            selector = selector.replace(" ", " > ");

        element = document.querySelectorAll(selector);
    }else{
        element = selector;
    }

    if(element != undefined){
        for(var eIndex = 0; eIndex < element.length; eIndex++)
        {
            element[eIndex].extend(sQuery);
        }

        element.extend(sQuery);

        if(element.length <= 1)
            element =  element[0];
    }


    return element;
}
