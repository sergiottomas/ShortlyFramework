var App = {
  version : "1.0",
  debug : true,
  name : "Shortly Framework",
  state : "dev"
}

App.models = {};

App.initialize = function(configs){
    if(configs === undefined || !configs.dictionaryPath ){
        this.dictionary = {};
    }else{
        this.dictionary = new DataDictionary(configs.dictionaryPath).mount();
        this.initDictionary();
    }

    this.initComponentes();
}

App.changeLanguage = function(lang){
  var date = new Date();
  date.setTime(+ date + (5000 * 86400000)); //24 * 60 * 60 * 1000

  document.cookie = "appLang="+lang+"; expires=" + date.toGMTString() + ";";
  location.reload();
}

App.initDictionary = function(){
  var terms = this.dictionary;
  for(var i in terms){
    document.body.innerHTML = document.body.innerHTML.replace(new RegExp('{{App.'+ terms[i].key +'}}', 'g'), terms[i].value);
  }
}

App.refreshDictionary = function(data){
    var terms = this.dictionary;
    for(var i = 0; i < terms.length; i++){
        if(typeof(data) == "string"){
            data = data.replace(new RegExp('{{App.'+ terms[i].key +'}}', 'g'), terms[i].value);
        }else if(typeof(data) == "object"){
            data.innerHTML = data.innerHTML.replace(new RegExp('{{App.'+ terms[i].key +'}}', 'g'), terms[i].value);
        }
    }

    if(typeof(data) == "string"){
        return data;
    }
}

App.setDataModel = function(name, data){
    this.models[name] = data;
}

App.getDataModel = function(name){
    return this.models[name];
}

App.loadContentPrototype = function(url){
  var response;

  sQuery.get({
    url: url,
    rAsync: false,
    onSuccess: function(data){
      response = data.responseText;
    },
    onError: function(data, xhr){
      console.log(data);
    }
  });

  return response;
}

App.loadContent = function(path){
  var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest : new ActiveXObject("MSXML2.XMLHTTP.3.0");
  if (xhr != null) {
      xhr.open("GET", path, false);
      xhr.send();
      return xhr.responseText;
  }
  else {
      window.console.log("AJAX (XMLHTTP) not supported.");
  }
}

App.initComponentes = function(){
  this.components = new Component();
  this.components.alert.init();
  this.components.table.init();
}
