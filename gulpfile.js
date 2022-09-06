const {
    src,
    dest,
    watch,
    series
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const inject = require('gulp-inject');
const browsersync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const fs = require('fs-extra');

/* *********************************************
 * DEV Workflow
 * To start working on alread made html pages
 * ********************************************/

// Create assets/medias directory
const mkMediasDir = (cb) => {
    let mediasdir = './src/content/assets/medias';
    fs.mkdir(mediasdir, {
        recursive: true
    }, (err) => {
        if (err) {
            throw err;
        }
    });
    cb();
}


// On create a new html page based on template
const createTemplate = (cb) => {
    let enTemplate = './src/bs-assets/templates/index_en.html';
    let frTemplate = './src/bs-assets/templates/index_fr.html';

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('Name your page ', pageName => {
        let newPageFrLocation = `./src/content/${pageName}_fr.html`;
        let newPageEnLocation = `./src/content/${pageName}_en.html`;
        global.startPageEN = `${pageName}_en.html`;
        global.startPageFR = `${pageName}_fr.html`;
        const populatePages = () => {
            // English Content
            fs.readFile(`${enTemplate}`, 'utf-8', (err, data) => {
                try {
                    fs.writeFileSync(newPageEnLocation, data);
                } catch (err) {
                    console.error(`Oops, that thing didn't work. Here is why: ${err}`)

                }
            });

            // Contenu en français 
            fs.readFile(`${frTemplate}`, 'utf-8', (err, data) => {
                try {
                    fs.writeFileSync(newPageFrLocation, data);
                } catch (err) {
                    console.error(`Oups, cette chose n'a pas fonctionné. Voici pourquoi : ${err}`)
                }
            });
        }

        // Make sure there is user input 
        if (pageName !== '') {
            try {
                if (!fs.existsSync('src/content')) {
                    fs.mkdirSync('src/content');
                    populatePages();
                } else {
                    populatePages();
                }
            } catch (err) {
                console.error(err)
            }


            cb();
        } else {
            console.error(`Hey developer!!! You failed to enter a proper page name. This is what you entered '${pageName}'`);
        }
        readline.close();
    });
}

// Setup server on Start
const startBrowserSync = (cb) => {
    browsersync.init({
        server: {
            baseDir: 'src',
        },
        port: 8080,
        // ! change to global.startPageFR to launch fr page
        startPath: `/content/${global.startPageEN}`
    });
    cb();
}

// Choose a page to open in dev server 
const openTemplate = (cb) => {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let indexArray = [];
    let fileArray = [];
    let pagesObject = {};

    // List files in .src/content
    console.log('Current files:');
    fs.readdirSync('./src/content').forEach((file, index) => {
        if (file !== 'assets') {
            indexArray.push(index);
            fileArray.push(file);
        }
    });
    indexArray.forEach((key, i) => {
        pagesObject[key] = fileArray[i];
    })

    // Show all available pages
    console.log(pagesObject);

    // Ask for input
    readline.question('Select a number to open the corresponding page ', pageName => {

        if (pageName !== '' && pagesObject[pageName] !== undefined) {
            global.devPageName = pagesObject[pageName];
            cb();
        } else {
            global.devPageName = 'error';
            console.error(`Hey developer!!! You failed to select an existing page. Please try again!`);
        }
        readline.close();

    });
}

const devBrowserSync = (cb) => {
    if (global.devPageName !== 'error') {
        browsersync.init({
            server: {
                baseDir: 'src',
            },
            port: 8080,
            startPath: `/content/${global.devPageName}`
        });
        cb();
    } else {
        console.error(`You didn't enter a proper page name`);
    }
}

/* *********************************************
 * BUILD WORKFLOW (npm run build)
 * ********************************************/
// Concatenate and minify scripts in prod
const scriptLoad = () => {
    return src('./src/js/*.js', {
            sourcemaps: true
        })
        .pipe(concat('csps-app.js'))
        .pipe(terser())
        .pipe(dest('./dist/assets/js/'))
        .pipe(dest('./assets/js/'));
}

// create html pages in prod package (ignore index_en and index_fr), inject proper css and js paths to  concat and mimified files
const createHtml = () => {
    let paths = {
        html: ['./src/content/*.html', '!./src/content/index_en.html', '!./src/content/index_fr.html'],
    }
    return src(paths.html)
        .pipe(inject(src(['./assets/fontawesome-free-5.9.0-web/css/all.min.css', './assets/css/csps-app.css', './assets/js/csps-app.js'], {
            read: false
        }), {
            // relative: true,
            addRootSlash: false
        }))
        .pipe(dest('./dist'));
}

const moveMedias = (cb) => {
    let devMediasLocation = 'src/content/assets/';
    let prodMediasLocation = `dist/assets/`;

    fs.copy(`${devMediasLocation}`, `${prodMediasLocation}`, err => {
        if (err) return console.error(err)
    })
    cb();
}

/* *********************************************
 * CSS/SASS related stuff
 * ********************************************/
// Compile sass to css
const sassTransform = () => {
    return src('./src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('./'))
        .pipe(dest('./src/css'));
}

// Concatenate and minify css in prod package
const cssToOne = () => {
    return src(['./src/css/*.css', '!./src/css/*.map'])
        .pipe(concat('csps-app.css'))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('./dist/assets/css/'))
        .pipe(dest('./assets/css/'));
}

/* *********************************************
 * FONT AWESOME related stuff
 * ********************************************/

// Move font awesome dependencies to prod package
const fontAwesomeReplace = () => {
    return src('./src/thirdpartylib/fontawesome-free-5.9.0-web/css/all.min.css')
        .pipe(dest('./dist/assets/fontawesome-free-5.9.0-web/css/'))
        .pipe(dest('./assets/fontawesome-free-5.9.0-web/css/'));
}

const moveFonts = () => {
    return src(['./src/thirdpartylib/fontawesome-free-5.9.0-web/webfonts/*.eot', 'src/thirdpartylib/fontawesome-free-5.9.0-web/webfonts/*.svg', 'src/thirdpartylib/fontawesome-free-5.9.0-web/webfonts/*.woff', 'src/thirdpartylib/fontawesome-free-5.9.0-web/webfonts/*.tff', 'src/thirdpartylib/fontawesome-free-5.9.0-web/webfonts/*.woff2'])
        .pipe(dest('dist/assets/fontawesome-free-5.9.0-web/webfonts'))
        .pipe(dest('./assets/fontawesome-free-5.9.0-web/webfonts'));

}

/* *********************************************
 * BROWSER RELOAD / WATCH
 * ********************************************/

// reload page
const browserReload = (cb) => {
    browsersync.reload();
    cb();
}

// Watch for changes in files
const watching = () => {
    // watch('src/content/*.html', browserReload);
    watch(['src/content/*.html', 'src/js/**/*.js'], browserReload)
    watch('src/scss/**/*.scss', series(sassTransform, browserReload));
}

/* *********************************************
 * EXPORTS
 * ********************************************/

// if there are no files in src/content create dir and template
// else ask what page to load
if (!fs.existsSync('src/content')) {
    exports.dev = series(
        createTemplate,
        mkMediasDir,
        sassTransform,
        startBrowserSync,
        watching,
    );
} else {
    exports.dev = series(
        openTemplate,
        mkMediasDir,
        sassTransform,
        devBrowserSync,
        watching,
    );
}

// Create new Page and start server
exports.createNewPage = series(
    createTemplate,
    mkMediasDir,
    sassTransform,
    startBrowserSync,
    watching,
)

// Prod Workflow (npm run build)
// Run when project is ready to 
// be uploaded to bs
exports.build = series(
    sassTransform,
    cssToOne,
    fontAwesomeReplace,
    moveFonts,
    moveMedias,
    scriptLoad,
    createHtml,
);

// To compile sass run: npm run sass-compile
exports.sass = sassTransform;