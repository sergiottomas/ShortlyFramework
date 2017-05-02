/*
  # DEPENDECY {sQuery}
*/

var Component = function(name, options){
  if(name != undefined && options != undefined){
    this.get = this[name].create(options);
    this[name].init();
  }
};

Component.prototype = {
    alert: {
        create: function(config){
          //configs: (id, class, attr, content)
          if(config){
            var element;
            element = "<p ";
            element += (config.id ? "id = '"+config.id+"' " : "");
            element += (config.tclass ? "class='alert "+config.tclass+"' " : "class='alert'");
            element += (config.attr ? config.attr : "");
            element += ">"+ (config.content ? config.content : "") +"<b class='alt-btn-close'></b></p>";

            return element;
          }
        },
        init: function(){
          //start all items
          var elements = SQ(".alert .alt-btn-close");
          if(elements != undefined){
              elements.on("click", this.close);
          }
        },
        close: function(e){
          var target = e.target || e.srcElement;
          target.parentNode.parentNode.removeChild(target.parentNode);
        }
    },
    table: {
        mountByModel: function(model, tableName, sort, noHeader){
            //enable or disable column sort
            sort = (sort && sort == 'true') ? true : false;

            var dataTable = {};
            var tableHTML = document.createElement("table");

            //mount header from keys
            var header = document.createElement("tr");
            header.setAttribute("class", "tb-header");

            var values = [];

            for(var i = 0; i < model.length; i++){
                var tr = document.createElement("tr");
                var keys = Object.keys(model[i]);

                if(i == 0 && !noHeader){
                    //get columns of table
                    for(var j = 0; j < keys.length; j++){
                        var td = document.createElement("td");
                        var columnName = App.refreshDictionary("{{App."+ tableName.charAt(0).toUpperCase() + tableName.slice(1) +"_"+ keys[j] +"}}");

                        if(sort){
                            td.innerHTML = columnName  +" <button class=\"table-sort\" value=\""+ keys[j] +"\"></button>";
                        }else{
                            td.innerHTML = columnName;
                        }

                        header.appendChild(td);
                    }

                    values.push(header);
                }

                for(var j = 0; j < keys.length; j++){
                    var td = document.createElement("td");
                    td.innerHTML = model[i][keys[j]];
                    tr.appendChild(td);
                }

                values.push(tr);
            }

            if(!noHeader && sort){
                SQ(values)[0].find(".table-sort").on("click", function(e){
                    var target = e.target || e.srcElement;

                    var element = SQ(target.parentNode);

                    if(SQ(target.parentNode.parentNode).find(".active")){
                        SQ(target.parentNode.parentNode).find(".active").removeClass("active");
                        element.addClass("active");
                    }

                    element.toggleClass("active");

                    var component = new Component();
                    component.table.sort(target, target.value);
                });
            }

            return values;
        },
        init: function(){
            var self = this;

            var elements = SQ(".table");

            if(elements != undefined){

                elements.each(function(){
                    while(this.firstChild){
                        this.removeChild(this.firstChild);
                    }

                    //this.append("<thead><th><td>Teste</td></th></thead>")
                    var model = this.getAttribute("data-model");
                    var sort = this.getAttribute("data-sort");

                    if(model){
                        var nodeList = self.mountByModel(App.getDataModel(model), model, sort);
                        for(var i = 0; i < nodeList.length; i++){
                            this.appendChild(nodeList[i]);
                        }
                    }
                });
            }

            var elementsSearch =  SQ(".table-search")

            if(elementsSearch != undefined){
                elementsSearch.each(function(){
                    SQ(this).on("keyup", function(e){
                        var target = e.target || e.srcElement;

                        var dataTarget = target.getAttribute("data-target");
                        if(dataTarget){
                            var elementTarget = SQ("#" + dataTarget);

                            var component = new Component();
                            component.table.search(elementTarget, target.value);
                        }
                    });
                });
            }
        },
        search: function(target, term){
            var self = this;
            var element = SQ(target);
            var model = element.getAttribute("data-model");
            var sort = element.getAttribute("data-sort");

            if(model){
                filteredModel = App.getDataModel(model).filter(function(value){
                    var keys = Object.keys(value);

                    if(!isNaN(term)){
                        term = parseFloat(term);
                    }

                    for(var i = 0; i < keys.length; i++){
                        var key = keys[i];
                        if(typeof(value[key]) == "string"){
                            if(isNaN(term)){
                                if(value[key].search(new RegExp(term, 'i')) >= 0){
                                    return true;
                                }
                            }
                        }else{
                            if(parseFloat(value[key]) == term){
                                return true;
                            }
                        }
                    }

                    if(isNaN(term) && typeof(term) != "string"){
                        return true;
                    }

                    return false;
                });

                if(term == ""){
                    filteredModel = App.getDataModel(model);
                }

                element.dataModel = filteredModel;

                if(filteredModel.length > 0){
                    element.find("tr").each(function(e, item){
                        if(item.classList.indexOf("tb-header") < 0){
                            item.remove();
                        }
                    });

                    var nodeList = self.mountByModel(filteredModel, model, sort, true);
                    for(var i = 0; i < nodeList.length; i++){
                        element.appendChild(nodeList[i]);
                    }
                }
            }
        },
        sort: function(target, term){
            var self = this;
            var element = SQ(target.parentNode.parentNode.parentNode);
            var model = element.getAttribute("data-model");
            var sort = element.getAttribute("data-sort");

            element.find("tr").each(function(e, item){
                if(item.classList.indexOf("tb-header") < 0){
                    item.remove();
                }
            });

            if(model){
                var asc = true;

                SQ(target.parentNode).classList.indexOf("active")
                if(SQ(target.parentNode).classList.indexOf("active") >= 0){
                    asc = false;
                    SQ(target).removeClass("order-desc");
                }else{
                    SQ(target).addClass("order-desc");
                }

                var dataModel;

                if(element.dataModel){
                    dataModel = element.dataModel;
                }else{
                    dataModel = App.getDataModel(model)
                }

                //sort model
                filteredModel = dataModel.sort(function(a, b){
                    if(asc){
                        if(a[term] > b[term]){
                            return 1;
                        }

                        if(a[term] < b[term]){
                            return -1;
                        }
                    }else{
                        if(a[term] > b[term]){
                            return -1;
                        }

                        if(a[term] < b[term]){
                            return 1;
                        }
                    }

                    return 0;
                });

                if(filteredModel.length > 0){
                    var nodeList = self.mountByModel(filteredModel, model, sort, true);
                    for(var i = 0; i < nodeList.length; i++){
                        element.appendChild(nodeList[i]);
                    }
                }
            }
        }
    }
}
