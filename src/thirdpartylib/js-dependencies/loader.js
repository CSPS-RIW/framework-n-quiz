class Loader {
    constructor(location) {
        this.name; //master, heroheader, etc
        this.group; //csps2021
        this.origin; //D2L, LOM, etc
        this.path = location.substring(0, location.lastIndexOf("/"));
    }


    init() {
        this.getDataInfo();
        this.wrapContentNew();

        this.moveContent();
        this.initJsManager();
        // this.initCssManager();
    }
    /* *********************************************************************
     * GET DATA INFO
     * ***************************
     * get the info from the body data
     * this will be useful for the managers (no, not your boss)
     * 
     * ********************************************************************/
    getDataInfo() {
        // detect page information from template
        const vars = document.querySelector('body').dataset;
        this.group = vars.templategroup;
        this.name = vars.templatename;
        this.origin = vars.templateorigin;
    }

    /* *********************************************************************
     * launch the js manager
     * ***************************
     * the script manager will handle all script loading
     * 
     * ********************************************************************/
    initJsManager() {
        let that = this;
        // Create new script element
        const jsManager = document.createElement('script');
        jsManager.src = this.path + '/scriptManager.js';
        // Append to the `head` element
        document.head.appendChild(jsManager);

        jsManager.addEventListener('load', function () {
            //console.log("js manager loaded?")
            // The script is loaded completely
            that.scriptManagerLoaded();
        });

    }
    /* *********************************************************************
     * script manager loaded
     * ***************************
     * will launch the startup scripts (jquery, bootstrap, etc)
     * 
     * ********************************************************************/
    scriptManagerLoaded() {
        let that = this;
        //load startup
        document.addEventListener("startup-loaded", function (e) {
            that.startupLoaded();
        });

        this.jsManager = new ScriptManager({
            parent: this
        });
        this.jsManager.init();
        this.jsManager.execute("startup");
    }

    /* *********************************************************************
     * Startup Scripts are loaded
     * ***********************
     * 
     * ********************************************************************/
    startupLoaded() {
        this.btnCarouselLoader();
    }
    /* ********************************************************************
     * init CSS Manager
     * ***********************
     * asdfasdfa
     * 
     * *******************************************************************/
    // initCssManager() {
    //     let that = this;
    //     // Create new script element
    //     const cssManager = document.createElement('script');
    //     cssManager.src = this.path + '/styleManager.js';
    //     // Append to the `head` element
    //     document.head.appendChild(cssManager);

    //     cssManager.addEventListener('load', function () {
    //         // The script is loaded completely
    //         that.styleManagerLoaded();
    //     });
    // }
    /* ********************************************************************
     * style Manager loaded
     * ***********************
     * asdfasdfa
     * 
     * *******************************************************************/
    // styleManagerLoaded() {
    //     let that = this;


    //     this.cssManager = new StyleManager({
    //         parent: this
    //     });
    //     this.cssManager.init();
    // }
    /* *********************************************************************
     * WRAP the content
     * ***************************
     * add the layout-related html to wrap the content
     * 
     * ********************************************************************/
    wrapContentNew() {

        let org_html = document.body.innerHTML;
        let new_html = "<div class='container-fluid data'><div class='row'>" + org_html + "</div></div>";
        document.body.innerHTML = new_html;
        //append class
        //let layout = "col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8";
        //D2L-template-layout d2l-frame-1
        let frame = document.getElementsByClassName('D2L-template-layout')[0];
        frame.classList.add('col-12', 'offset-md-1', 'col-md-10', 'offset-lg-2', 'col-lg-8');

    }

    moveContent() {
        let mFullWidth = document.getElementsByClassName('D2L-template-move-fullwidth')[0];
        let template = document.getElementsByClassName('D2L-template-layout')[0];

        if (typeof mFullWidth !== "undefined") {
            //newNode.innerHtml = mFullWidth.innerHtml
            template.parentNode.insertBefore(mFullWidth, template);

        }

    }

    btnCarouselLoader() {
        let $carousel = $("#btn-carousel");
        let $display = $("#btn-carousel-display");
        let iconName, addCode;

        if (typeof iconList !== "undefined") {
            //console.log(iconList)
            for (let iconpackName in iconList) {
                //console.log(iconpackName + " -> " + iconList[iconpackName]);
                for (let iconNumber in iconList[iconpackName]) {
                    iconName = iconList[iconpackName][iconNumber];
                    addCode = "class='LOM-show-styles snap-xs ico-" + iconpackName + "-" + iconName + "'";
                    addCode += " data-iconpack='" + iconpackName + "'";
                    addCode += " data-iconname='" + iconName + "'";
                    //console.log(iconName)
                    $("#btn-carousel").append("<button " + addCode + ">" + iconName + "</button>");
                }
            }
            //CLICK
            $(".LOM-show-styles").click(function () {
                let ico = $(this).attr("data-iconname");
                let pack = $(this).attr("data-iconpack");

                $display.html("<h2>Icons for \"" + ico + "\"</h2>");

                $display.append("<h3>Buttons</h3>");
                $display.append("<p><button class='snap-xs ico-" + pack + "-" + ico + "'>XS Button " + ico + "</button></p>");
                $display.append("<p><button class='snap-sm ico-" + pack + "-" + ico + "'>SM Button " + ico + "</button></p>");
                $display.append("<p><button class='snap-md ico-" + pack + "-" + ico + "'>MD Button " + ico + "</button></p>");
                $display.append("<p><button class='snap-lg ico-" + pack + "-" + ico + "'>LG Button " + ico + "</button></p>");
                //$display.append("<p><button class='snap-xl ico-" + pack + "-" + ico + "'>Button " + ico + "</button></p>");
                //ribbons
                $display.append("<h3>Ribbons</h3>");
                $display.append("<div class='LOM-ribbon-top icon-" + ico + "'><h4>Ribbon-Top Style with Heading 4</h4><p>Content Example</p></div>");
                $display.append("<div class='LOM-ribbon icon-" + ico + "'><h4>Ribbon Style with Heading 4</h4><p>Content Example</p></div>");
                $display.append("<div class='LOM-circle-ribbon icon-" + ico + "'><h4>Ribbon Style with Heading 4</h4><p>Content Example</p></div>");
                $display.append("<div class='LOM-palecircle-ribbon icon-" + ico + "'><h4>Circle Icon Style with Heading 4</h4><p>Content Example</p></div>");
                $display.append("<div class='LOM-palesquare-ribbon icon-" + ico + "'><h4>Square Icon Style with Heading 4</h4><p>Content Example</p></div>");
                //iconbox
                $display.append("<div class='LOM-iconbox icon-" + ico + "'><h4>Ribbon Style with Heading 4</h4><p>Content Example</p></div>");
                //class="LOM-element style-result-box icon-exam col-sm-None LOM-iconbox"

            });

        }

    }

}

let loader = new Loader(document.currentScript.src);
loader.init();