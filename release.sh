cp -a www/. dist/

mv -v dist/app/om.js dist && rm -r dist/app && mkdir dist/app && mv -v dist/om.js dist/app/om.js
mv -v dist/assets/css/screen.min.css dist/assets && rm -r dist/assets/css && mkdir dist/assets/css && mv -v dist/assets/screen.min.css dist/assets/css/screen.min.css

divshot login
divshot push staging