# BS Custom Templates 💻

ℹ️ Instructions for version 3.2.1

## 1️⃣ Intro

The styles may not be up-to-date so make sure they match the [CSPS Learning Style Guide](https://app.csps-efpc.gc.ca/d2l/le/lessons/9343/units/18152)

* With this "*framework*" you will be able to add BS components next to your custom activities
* Brighstpace will reorganize the `img` tags of the html page once uploaded
  * from: `<img src="./scss/theme/medias/image.png">` to `<img src="/content/enforced/**Course-Code**/Project-Folder/scss/theme/medias/image.png"`
  * This means that your images will most likely not work inside BS once you upload the pages.
  * If your pages is already uploaded to BS and images don't show when you tweak your pages locally, add: `https://app.csps-efpc.gc.ca/content/enforced/**course-code**/**Project-Folder**/**Path to the img**` (more on that later).

## 2️⃣ Dev Environment

### Setup

* Clone the main repo, copy all files from the main repo to your course's repo
* Make sure you have [node](https://nodejs.dev/) installed in your computer
* Then run `npm install` to install all dependencies

### Html

1. Run `npm run dev` to start the dev server
2. The framework will check if you have a `content` directory inside `src`.

   1. If you don't it will create it and immediately ask you to name a page in the terminal. Using the following nomenclature:

      * `m0-1` where m stands for module, the first digit stands for module number and the second digit stands for the page (you can have more than one digits)
      * Add as many pages as you need
      * The framework will automatically create a French and an English version of the file you just named e.g. `m0-1_fr and m0-1_en`
   2. If you already have content inside `src/content/`:

      * The framework will ask you to select which file to open:

      ```js
            Current files:
      {
        '1': 'm0-1_en.html',
        '2': 'm0-1_fr.html',
      }

      ```

      * Select a number in the console to open the corresponding page
3. Add your content in `src/content/*your-page*.html` inside of the div with the classes of `<div class="col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8>`
4. Add your images in `src/content/assets/medias`. That folder will be created when you run `npm run dev`;

```html
<div class="col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
        <!-- ADD your content here -->

        <!-- END of content -->
</div>

```

The `bs-assets` folder contains placeholder images used in the original templates. It is there in case you ever need to use them. It also contains the templates of the pages that will be auto generated

### CSS

With this new version, we are using the new [SASS Module System](https://sass-lang.com/blog/the-module-system-is-launched), which changes:

* * No more `@import`, instead use the `@use` [rule](https://sass-lang.com/blog/the-module-system-is-launched#use-the-heart-of-the-module-system)
  * We use mostly `@use` to import corde from other partials into the one we are working on.
    * In order to use the colors variable you'd add: `@use '../colors';` but using `$school-purple` on its own won't work because `@use` namespaces the imported selectors so `colors.$school-purple` will work
    * You can change the name you want to use by doing the following: `@use '../colors'as c;`. Now `colors.$school-purple` won't work and `c.$school-purple` will
    * To remove namespacing do the following: `@use '../../colors'as *;`. This is not recommended for it *may* cause errors with the the compiler
* You can create more partials in `src/scss/General`.
* * Create a scss [partial](https://sass-lang.com/guide#topic-4) for each component that you are styling or add it inside the `components` directory
* All the partials must be added to the `_index.scss` partial of the folder using the `@forward` rule.

  * E.G. `src/scss/General` has an `_index.scss` that:
  * ```scss
    /* **************************************************
     * Link your scss partials
     * *************************************************/

    @forward "./_text";

    @forward "./icons";
    @forward "./_elements";

    @forward "./reusable";
    @forward "./components";
    ```
* Using the `@forward` rule...

  * you don't need to specify what page to import, just the directory (by doing this sass takes what is inside of `_index.scss`
  * `csps2021_WET.scss` will take the scss and compile the styles

As long as you are running the dev server (`npm run dev`), sass will automatically be watched. You won't need any extension to watch and compile it!

### JS

* Go to `src/js/interactions.js`. That is where you should add your custom scripts
* It is already set up to work with jQuery but you could download other dependencies, maybe play around with [Petite Vue](https://github.com/vuejs/petite-vue)?
* Remember, as mentioned before, if you dynamically add images with JavaScript, you will need to change any img tags that you create.
  * From `<img src="./public/_assets/medias/svgs/envelope-fill.svg" alt="">` to `<img src="https://app.csps-efpc.gc.ca//content/enforced/8653-WMT101-DEV-EN/**Project-Folder**/public/_assets/medias/svgs/envelope-fill.svg" alt="">`
  * Basically just add `https://app.csps-efpc.gc.ca//content/enforced/8653-WMT101-DEV-EN/**Project-Folder**/` before the regular path. Change the relative path before uploading to BS. Will discuss "Project-Folder" in the next section (Uploading to BS)
  * Once you upload the project to BS for testing, the links to images should still work *as long as you don't delete them from the folder in BS*. So you don't have to come back and change everything when you wanna work locally
* You can add as many pages as you want but note that all the js files will be concatenated (merged into one) and minified when building for prod. You can change that by tweaking the **scriptLoad** task in `~/gulpfile.js`

## 3️⃣ Prod Environment

### Building for Production

Run `npm run build` to create a dist folder with the following assets:

1. html pages (`m1-2_en`, `m1-2_fr`, etc)
2. an _assets dir with:
   1. css dir with css concat file
   2. fontawesome dependency dir
   3. js dir with js concat file
   4. a medias dir with your images

Then you'll need to [compress the dist directory](https://www.businessinsider.com/how-to-unzip-files-windows-10), keep it in hand.

### 4️⃣ Uploading to BS

Log in to BS

1. Select your course
2. Go to Course *Admin/Manage Files*
3. Create a directory called `course_code-custom` (This is going to be your *Project-Folder* so don't forget the name)
   1. E.g. `WMT101-custom`
4. Select upload and upload the zip folder you created in step 1
5. Once the zip file is uploaded, click on the down arrow🔽 next to the *Project-Folder* and unzip the folder
6. Go get a warm drink and wait. It will take a while
   1. It is okay to leave the Course Admin section, the process will run in the bg
7. Once you get a notification saying the file was unzipped, go back to Course Admin and make sure everything is there

## 5️⃣ Showing the custom page

1. Go to the content section of the course
   1. If you are in Course *Admin/Manage Files*, click *Content* above the breadcrumbs
2. Select your module and click on **Create New**
3. Select HTML Document
4. Enter a title
5. Click on the down arrow🔽 next to the title and scroll all the way down to the 'Browse for a Template' option
6. Make sure the Submit Form option is set to Course Offering Files
7. Open your *Project-Folder*
8. And Select your html page

There you go, you created and installed your own BS template!

Pasting components from BS to the templates once uploaded should work so as long as you have a static html page, designers will be able to go, add and tweak the page.
