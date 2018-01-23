#!/bin/bash

path=./
j=0

for i in `ls $path | grep '^image[0-9]*\.png$'`
do
	$((j = ${j}+1))
	echo $j
	echo $i
	name=`echo $i | sed 's/^image[0-9]*/image'$j'/g'`      
	echo $name
       	#mv $i  $name
done

