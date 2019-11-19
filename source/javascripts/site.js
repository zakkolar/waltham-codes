var PLtranslation=function(){
    var messages = [
        "Translate &#8226; Traducir &#8226; Traduzir &#8226; Tradwi &#8226; 翻译"
        // "Selecciona tu idioma para traducir esta página.",
        // "Selecione seu idioma para traduzir esta página",
        // "Chwazi lang ou an pou tradwi paj sa a",
        // "选择您的语言以翻译此页面",
    ]
    var currentMessage = 0;

    var updateMessage = function(){
        if(currentMessage === messages.length - 1 ){
            currentMessage = 0;
        }
        else{
            currentMessage++;
        }
    }

    var setup = function(){
        var transEl = document.getElementById('google_translate_element');
        var div = transEl.getElementsByClassName('goog-te-gadget')[0];
        var children = div.childNodes;
        var remove = [];
        for(var i=0; i<children.length; i++){
            var child = children[i];
            if(child.nodeType==3){
                remove.push(child);
            }
            if(child.tagName==="SPAN"){
                remove.push(child)
            }
        }

        for(var i=0; i<remove.length; i++){
            remove[i].remove();
        }


        var div = document.getElementById('google_translate_element');
        var select = div.getElementsByTagName('select')[0]


    }

    var showMessage=function(){
        var div = document.getElementById('google_translate_element');
        var select = div.getElementsByTagName('select')[0]
        if(select.length>0 && (document.activeElement !== select)){
            var option = select.getElementsByTagName('option')[0]
            option.innerHTML = messages[currentMessage]
        }

    }

    var run =function(){
        showMessage();
        updateMessage();
        setTimeout(function(){

            run();
        }, 500)
    }
    setup();
    run();
}
