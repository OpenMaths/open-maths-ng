# Copy the www folder over to dist
cp -a www/. dist/

# Get rid of redundant files in a hack
mv -v dist/app/om.js dist && mv -v dist/app/sections dist && rm -r dist/app && mkdir dist/app && mv -v dist/om.js dist/app/om.js && mv -v dist/sections dist/app/sections
mv -v dist/assets/css/screen.min.css dist/assets && rm -r dist/assets/css && mkdir dist/assets/css && mv -v dist/assets/screen.min.css dist/assets/css/screen.min.css

# Make sure we are logged in
divshot push staging