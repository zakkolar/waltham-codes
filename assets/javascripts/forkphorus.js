export const forkphorus = function(){
    var getParams = function (url) {
        var params = {};
        var parser = document.createElement('a');
        parser.href = url;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
    };
    var params = getParams(window.location);

    var project = null;
    if(params.project){
        project = params.project;


        var caption = document.createElement('p');
        caption.innerText="Your student coded this project using a language called Scratch:";
        document.getElementById('projectCaption').append(caption);




        var phosphorus = "/javascripts/forkphorus/embed.js?id="+project+"&auto-start=true&light-content=false&w=480&h=360"


        var script = document.createElement('script');
        script.setAttribute('type','text/javascript');
        script.setAttribute('src',phosphorus);
        document.getElementById('projectEmbed').appendChild(script);



    }
}