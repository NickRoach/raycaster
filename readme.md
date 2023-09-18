#Raycaster

A graphics engine in the style of Doom and Wolfenstein 3D

Men will literally write a graphics engine from scratch instead of going to therapy

I purposely didn't do any research on how to do this, putting myself in the shoes of John Carmack in ca. 1990 when he wrote the engine for
Wolfenstein 3D. I had seen a tutorial on making a raycaster engine in C++ about a year ago, but that's it. I only looked up Javascript features and trigonometry (high school was a long time ago).
I used procedural code only - no classes - and I don't regret it. I am yet to feel the need to encapsulate logic and data together in a class

#In a nutshell:

Scanning from left to right across the field of view, algorithms locate the nearest intersect with a solid block. A vertical line is drawn
in the rendering view with a height corresponding to the distance of that intersect.

#Try it out:

Use Node version >=14.21.3

`npm i` to install packages

`npm start` to transpile, weback and start live server
