#! /bin/bash
# Make html pages in both official languages with the desired name

# Vars that contain the location of each template
enTemplate=./src/bs-assets/templates/index_en.html
frTemplate=./src/bs-assets/templates/index_fr.html

# Ask a question and save answer in var pageName
echo "Name your page:"
read pageName

# Create name of new html pages
enPage="${pageName}_en.html"
frPage="${pageName}_fr.html"

# Copy content from template to new pages
cp $enTemplate ./src/content/$enPage 
cp $frTemplate ./src/content/$frPage