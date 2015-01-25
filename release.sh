#!/bin/bash

branch_name=$(git symbolic-ref -q HEAD)
branch_name=${branch_name##refs/heads/}
branch_name=${branch_name:-HEAD}

if [ $branch_name == "release" ]; then

	printf "\nDo you wish to make a new release tagged ${1}?\nThe release message is: ${2}\n"
	printf "\nGit status is:\n"

	git status

	printf "\n\n"

	select yn in "Yes" "No"; do
		case $yn in
			Yes )
			# Runs all the git commands
			git push origin release

			git tag -a $1 -m "${2}"
			git push --tags

			printf "\n\nThe release has been made successfully!\n"

			break;;
			No )
			echo "Ok, maybe next time :-)"
			exit;;
	    esac
	done

else
	echo "You need to checkout to branch release before making a release!"
fi
