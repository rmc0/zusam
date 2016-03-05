#!/bin/bash

loc=`pwd`
JS="JS"
LIBJS="LibJS"

# first, clean the JS directory
rm $JS/*.min.js

if [[ "$1" == "compress" ]]
then
	opt="--compress drop_console --mangle"
else
	opt="--beautify"
fi

A=(`echo $JS/*`)
for p in "${A[@]}";
do
	if [[ -d "$p" ]]
	then
		libname=$(basename "$p")
		b=`echo ".min.js"`
		if [[ -f "$p/uglify.order" ]]
		then
cat $(cat "$p/uglify.order" | sed -r "s/[a-zA-Z0-9_.]+/$JS\/${libname}\/&/g") | uglifyjs - $opt --wrap=$libname --export-all > $JS'/'$libname$b
		else
uglifyjs $JS/$libname/*.js $opt --wrap=$libname --export-all > $JS'/'$libname$b
		fi
	fi
done
A=(`echo $LIBJS/*`)
for p in "${A[@]}";
do
	if [[ -d "$p" ]]
	then
		libname=$(basename "$p")
		b=`echo ".min.js"`
		if [[ -f "$p/uglify.order" ]]
		then
cat $(cat "$p/uglify.order" | sed -r "s/[a-zA-Z0-9_.]+/$LIBJS\/${libname}\/&/g") | uglifyjs - $opt --wrap=$libname --export-all > $LIBJS'/'$libname$b
		else
uglifyjs $LIBJS/$libname/*.js $opt --wrap=$libname --export-all > $LIBJS'/'$libname$b
		fi
	fi
done
cat $JS/*.js | uglifyjs - $opt > "JS.js"
cat $LIBJS/*.js | uglifyjs - $opt > "LIBJS.js"
