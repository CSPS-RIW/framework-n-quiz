class StyleManager {
    constructor(options) {
        this.parent = options.parent;
        this.styles = [];
        this.library = {};
    }



    init() {
        let that = this;
        //load startup css
        //wait for startup(jquery) to be loaded    
        document.addEventListener("startup-loaded", function (e) {
            that.loadStyles();
        });
        this.initLibrary();
        this.styles["D2L"] = ["fontawesome", "csps2021custom"];


    }


    /* *********************************************************************
     * load styles
     * ************************
     * 
     * THIS WILL NEED SOME WORK
     * this just loads the styles into the head FOR NOW
     * 
     * ********************************************************************/
    loadStyles() {
        const $bootStyle = $("#D2L_style_bootstrap");
        const $d2lStyle = $("#D2L_style_default");
        const $cspsStyle = $("#D2L_style_csps");
        //CHANGE bootstrapt, general and CSPS
        //$bootstyle.attr("href", )


        //list of css styles to add
        let cssList = this.getListFromLibrary("D2L");

        for (let i = 0; i < cssList.length; i++) {
            this.loadStyle(cssList[i]);

        }
    }

    loadStyle(styleObj) {
        //should we add it or replace it?
        if (styleObj.type === "add") {
            //create the link element
            let link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.media = "screen,print";
            link.href = styleObj.src;
            //load into the head
            document.getElementsByTagName("head")[0].appendChild(link);
        } else {
            //we'll assume it'S a replacement
            //check the constants at the top and replace whichever applies
            //maybe it'd be better to generate a name but check if it excists first?

        }
    }
    /* *********************************************************************
     * get list from lib
     * ************************

     * send a list, retrieve a collection
     * ********************************************************************/
    getListFromLibrary(list) {
        let aList = [];
        for (let i = 0; i < this.styles[list].length; i++) {
            aList.push(this.library[this.styles[list][i]]);

        }
        return aList;
    }
    /* *********************************************************************
     * find style from library
     * ************************

     * send a name, retrieve an object
     * ********************************************************************/
    findStyle(name) {
        let objStyle;
        objStyle = this.library[name];

        return (typeof objStyle === "undefined") ? false : objStyle;
    }
    /* *********************************************************************
     * init library
     * ************************

     * list of all css's to load
     * ********************************************************************/
    initLibrary() {
        this.library = {
            "fontawesome": {
                "type": "add",
                "src": this.parent.path + "/_assets/thirdpartylib/fontawesome-free-5.9.0-web/css/all.min.css"
            },
            "csps2021custom": {
                "type": "add",
                "src": this.parent.path + "/_assets/css/custom.css"
            }
        }
    }

}