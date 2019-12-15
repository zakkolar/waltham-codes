export const sbDownloader = function() {
    'use strict';
    // Element references

    const progressBarFill = document.querySelector('#progress-bar-fill');
    const progressBarText = document.querySelector('#progress-bar-text');
    const progressBarContainer = document.querySelector('#progress-bar');
    const downloadLinkEl = document.querySelector('#download-link');


    const searchQuery = getQuery();

    // The last loaded project, if any.
    let lastResult = null;
    // Returns an object containing all the query string parameters
    function getQuery(queryString) {
        queryString = queryString || window.location.search;
        const query = {};
        const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (var i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            const key = decodeURIComponent(pair[0]);
            const value = decodeURIComponent(pair[1] || '');
            // If either key or value is empty, omit it.
            if (key && value) {
                query[key] = value;
            }
        }
        return query;
    }



    // Progress bar methods
    // Sets the current progress. Expects a number between 0 and 1
    function setProgress(progress) {
        progressBarFill.style.width = ( 10 + progress * 90) + '%';
    }
    // Resets the progress bar
    function resetProgress() {
        setProgress(0);
        setProgressState('Loading...', '');
    }
    // Shows the progress bar
    function showProgress() {
        progressBarContainer.classList.remove('hidden');
    }
    // Hides the progress bar
    function hideProgress() {
        progressBarContainer.classList.add('hidden');
    }
    // Sets the text and 'state' of the progress bar (usually changes color)
    function setProgressState(message, state) {
        progressBarText.textContent = message;
        progressBarFill.setAttribute('state', state || '');
    }
    // Install progress hooks
    let finishedTasks = 0;
    let totalTasks = 0;
    function updateProgressBarHooks() {
        setProgress(finishedTasks / totalTasks);
        setProgressState('\u23f3 Downloading project files (' + finishedTasks + '/' + totalTasks + ')');
    }
    SBDL.progressHooks.start = function() {
        finishedTasks = 0;
        totalTasks = 0;
    };
    SBDL.progressHooks.newTask = function() {
        totalTasks++;
        updateProgressBarHooks();
    };
    SBDL.progressHooks.finishTask = function() {
        finishedTasks++;
        updateProgressBarHooks();
    };



    // Project loading and downloading
    // Loads the currently input project
    function loadInput() {
        const type = 'sb3';
        // Ignore all whitespace when getting the project ID
        const id = searchQuery.project;


        resetProgress();
        showProgress();
        downloadProject(id, type)
            .then(() => {
                setProgressState('\u2705 Project ready to download', 'success');
                setProgress(1);
                // setTimeout(function(){hideProgress()},750);
                hideProgress();
                const toggle = document.getElementById('toggle-continue-working-instructions');
                toggle.classList.remove('dn');
                toggle.addEventListener('click',function(e){
                    e.preventDefault();
                    const instructions = document.getElementById('continue-working-instructions');
                    if(instructions.classList.contains('dn')){
                        instructions.classList.remove('dn');
                    }
                    else{
                        instructions.classList.add('dn');
                    }
                })
            })
            .catch((err) => {
                console.error(err);
                setProgressState('\u274c Project is not available as a .' + type, 'error');
                setProgress(1);
            });
    }
    // Starts loading a project. Downloads it when complete.
    function downloadProject(id, type) {
        lastResult = null;
        return SBDL.loadProject(id, type)
            .then((r) => {
                lastResult = r;
                setProgressState('Creating archive...');
                // Convert the result to a Blob so it's easier to download.
                // The result can either give us a list of files to put in an archive, or an ArrayBuffer.
                if (r.type === 'zip') {
                    return SBDL.createArchive(r.files, setProgress);
                } else if (r.type === 'buffer') {
                    return new Blob([r.buffer]);
                } else {
                    throw new Error('unknown type: ' + r.type);
                }
            })
            .then((blob) => {
                // Only display assets if there are some files to preview and they will be visible.

                const url = URL.createObjectURL(blob);
                const filename = lastResult.title + '.' + lastResult.extension;
                const size = blob.size / 1024 / 1024;
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.textContent = 'Download project';
                a.classList.add('button');
                downloadLinkEl.appendChild(a);
            });
    }
    // Load URL paramaters


    if (searchQuery.project) {
        loadInput();
    }
};