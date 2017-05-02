//Data for dictionary functions

var DataDictionary = function(XMLPath){
  this.terms = [];
  this.defaultLang = "pt"
  this.XMLPath = XMLPath;
};

DataDictionary.prototype = {
  mount: function(){
    var xml = this.getFile(this.XMLPath, "XML");
    var xmlTerms = xml.getElementsByTagName("terms")[0].childNodes;

    for(var i = 0; i < xmlTerms.length; i++){
      var xmlTerm = xmlTerms[i];

      if(xmlTerm.nodeType == 1){
        this.terms.push({
          key: xmlTerm.attributes[0] ? xmlTerm.attributes[0].value : "",
          value: xmlTerm.attributes[1] ? xmlTerm.attributes[1].value : "",
          lang: xmlTerm.attributes[2] ? xmlTerm.attributes[2].value : this.defaultLang
        });

        //remove term if key is empty
        if(this.terms[this.terms.length-1].key === ""){
          this.terms.pop();
        }
      }
    }

    var lang = this.defaultLang;

    if(document.cookie != ""){
      var cookies = document.cookie.split("; ");
      var keys = [];

      for(var i = 0; i < cookies.length; i++){
        var cookie = cookies[i].split("=");
        keys[cookie[0]] = cookie[1];
      }

      lang = keys.appLang ? keys.appLang : this.defaultLang;
    }

    //change selectedBox to changed language
    var slcLanguage = document.getElementById("slcLanguage");
    for(var i = 0; i < slcLanguage.options.length; i++){
      if(slcLanguage.options[i].value == lang){
        slcLanguage.options[i].setAttribute("selected", "selected");
        break;
      }
    }

    return this.terms.filter(function(value){
      return value.lang == lang;
    });
  },
  getFile: function(path, responseType){
    var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest : new ActiveXObject("MSXML2.XMLHTTP.3.0");
    if (xhr != null) {
        xhr.open("GET", path, false);
        //xhr.async = false;
        xhr.onreadystatechange = function(){
          if(xhr.readyState == 4){
            if(xhr.status == 200){
              if(responseType == "XML")
                callback = xhr.responseXML;
              else
                callback =  xhr.responseText;
            }
          }
        };
        xhr.send();

        return callback;
    }
    else {
        window.console.log("AJAX (XMLHTTP) not supported.");
    }
  }
}
