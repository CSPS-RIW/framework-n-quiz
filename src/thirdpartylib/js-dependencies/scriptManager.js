class ScriptManager {

    constructor(options) {

        this.parent = options.parent;

        this.scripts = []; //a 3d array for bunches of scripts
    }


    init() {
        //load startup scripts
        this.scripts["startup"] = [
            'https://app.csps-efpc.gc.ca/shared/LCS_HTML_Templates/CSPS_Template_2021/_assets/thirdpartylib/jquery/jquery-3.4.1.min.js',
            'https://app.csps-efpc.gc.ca/shared/LCS_HTML_Templates/CSPS_Template_2021/_assets/thirdpartylib/popper-js/popper.min.js',
            'https://app.csps-efpc.gc.ca/shared/LCS_HTML_Templates/CSPS_Template_2021/_assets/thirdpartylib/bootstrap-4.3.1/js/bootstrap.min.js',
            'https://app.csps-efpc.gc.ca/shared/LCS_HTML_Templates/CSPS_Template_2021/_assets/js/scripts.min.js'

        ];
    }


    /* *********************************************************************
     * This is where things get started
     * ***************************
     * make a list of all the scripts to load right off the bat 
     * and git'r done
     * ********************************************************************/
    execute(scriptLibrary) {
        let that = this;
        // load a bunch of scripts
        let promises = [];
        this.scripts[scriptLibrary].forEach(function (url) {
            promises.push(that.loadScript(url));
        });

        //execute the promises
        Promise.all(promises)
            .then(function () {
                //All promises fulfilled
                that.scriptsLoaded(scriptLibrary);
            }).catch(function (script) {
                //there were some complications
                console.log(script + ' failed to load');


            })
    };
    /* *********************************************************************
     * LoadScript
     * *******************
     * This will need to be sent to another file somewhere
     * eventually replaced with a dependancy engin
     * 
     * this loads scripts, lots of them.
     * ********************************************************************/
    loadScript(url) {
        return new Promise(function (resolve, reject) {
            let script = document.createElement('script');
            script.src = url;
            script.async = false;
            script.onload = function () {
                resolve(url);
            };
            script.onerror = function () {
                reject(url);
            };
            document.body.appendChild(script);
        });
    }
    /* *********************************************************************
     * LoadScript
     * *******************
     * This will need to be sent to another file somewhere
     * eventually replaced with a dependancy engin
     * 
     * this loads scripts, lots of them.
     * ********************************************************************/
    scriptsLoaded(scriptLibrary) {
        //trigger the event
        let event = new CustomEvent(scriptLibrary + "-loaded", {
            "detail": "Example of an event"
        });
        document.dispatchEvent(event);
    }



}