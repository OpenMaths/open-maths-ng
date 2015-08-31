#!/usr/bin/env bash
printf "\n\n\nDo you wish to release to staging?\n\n"

select yn in "Yes" "No"; do
	case $yn in
		Yes )
			gulp concatVendor typescript && gulp test

			divshot login

			rm -r dist
			mkdir dist && mkdir dist/app && mkdir dist/app/dist

			cp app/dist/app.js dist/app/dist && cp app/dist/vendor.js dist/app/dist
			cp index.html dist/index.html

			tar -v -cf open-maths-ng.tar.gz app/ .gitignore bower.json gulpfile.js index.html package.json
            mv open-maths-ng.tar.gz dist/open-maths-ng.tar.gz

			divshot push staging

			printf "\n\n\nSuccessfully released to staging\n\n"

			break;;
		No )
			printf "\n\n\nOk, maybe next time :-)\n\n"
			break;;
	esac
done

printf "\n\n\nDo you wish to update production with latest staging release?\n\n"

select yn in "Yes" "No"; do
	case $yn in
		Yes )
			divshot promote staging production

			printf "\n\n\nSuccessfully released to production\n\n"

			break;;
		No )
			printf "\n\n\nOk, maybe next time :-)\n\n"
			exit;;
	esac
done