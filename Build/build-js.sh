#!/bin/bash

loc=`pwd`
JS="JS"
LIBJS="LibJS"
rnd=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)

#CLEAN
{
	rm $JS/*.min.js 
	rm $LIBJS/*.min.js
} &> /dev/null

if [[ "$1" == "compress" ]]
then
	opt="--compress drop_console --mangle"
else
	opt="--beautify"
fi

#JS
A=(`echo $JS/*`)
for p in "${A[@]}";
do
	if [[ -d "$p" ]]
	then
		libname=$(basename "$p")
		b=`echo ".min.js"`
		#if [[ -f "$p/uglify.order" ]]
		#then
		#	cat $(cat "$p/uglify.order" | sed -r "s/[a-zA-Z0-9_.]+/$JS\/${libname}\/&/g") > "tmp/$rnd"
		#	echo $rnd
		#	cat "tmp/$rnd" | uglifyjs - $opt --wrap=$libname --export-all > $JS'/'$libname$b
		#else
			echo "$JS/$libname"
			uglifyjs $JS/$libname/*.js $opt --wrap=$libname --export-all > $JS'/'$libname$b
		#fi
	fi
done

# LIBJS
A=(`echo $LIBJS/*`)
for p in "${A[@]}";
do
	if [[ -d "$p" ]]
	then
		libname=$(basename "$p")
		b=`echo ".min.js"`
		#if [[ -f "$p/uglify.order" ]]
		#then
#cat $(cat "$p/uglify.order" | sed -r "s/[a-zA-Z0-9_.]+/$LIBJS\/${libname}\/&/g") | uglifyjs - $opt --wrap=$libname --export-all > $LIBJS'/'$libname$b
		#else
			echo "$JS/$libname"
			uglifyjs $LIBJS/$libname/*.js $opt --wrap=$libname --export-all > $LIBJS'/'$libname$b
		#fi
	fi
done

#ASSEMBLE
cat $JS/*.js > "/tmp/$rnd"
echo "/tmp/$rnd"
cat "/tmp/$rnd" | uglifyjs - $opt > "JS.js"
cat $LIBJS/*.js | uglifyjs - $opt > "LIBJS.js"

#CLEAN
{
	rm $JS/*.min.js 
	rm $LIBJS/*.min.js
} &> /dev/null
