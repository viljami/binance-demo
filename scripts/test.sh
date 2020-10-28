#!/bin/sh

for filename in ./src/**/*.test.js
do
    echo "\n---\nFile: ${filename}\n";
    node --no-warnings "${filename}"
done
