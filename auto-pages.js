let fs = require('fs-extra');

let enTemplate = './src/_assets/templates/index_en.html';
let frTemplate = './src/_assets/templates/index_fr.html';

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Name your page ', pageName => {
    let newPageFrLocation = `./src/html/${pageName}_fr.html`;
    let newPageEnLocation = `./src/html/${pageName}_en.html`;
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
            if (!fs.existsSync('src/html')) {
                fs.mkdirSync('src/html');
                populatePages();
            } else {
                populatePages();
            }
        } catch (err) {
            console.error(err)
        }


    } else {
        console.error(`Hey developer!!! You failed to enter a proper page name. This is what you entered '${pageName}'`);
    }
    readline.close();
});