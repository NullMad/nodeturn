Setting up nodeturn:
This is a WebStorm 7 project, but the actual project files are not checked in. Just use "create from folder" in WebStorm and it should more or less sort itself out. Don't forget to install Node.JS on your machine and add it to the WebStorms node.js integration (in options or the hexagonal JS button on the main toolbar). 
In thewebstorm's node.js config it should should you packages that this install wants. install them all. they don't get checked in with the project. package.json hold the list that the project is using and npm (part of Node.js) can sort the stuff out for you. 

At this point you should be able to create a run configuration out of server.js (make a new node.js server config). If you point your browser at http://localhost:8081/ it should just work and you get a lame login page. Enter something in the box and hit login and it "should"* take you to the main game page. 

The pages can be found under /views in form of .jade files. login.jade for first page and lobby.jade for the second. jade is a glorified html so it's fairly legible by itself. searching for npm jade should get you to page that describes it pretty well. 

All the other files (basically the library) live in static. 
In the root you'll find js files for the pages. CSS in CSS. 
Libraries holds 3rd party libraries I use, and glengine is sort of main thing at the moment. Not much to it but basic "scene" which is a glorified webgl demo mod. 

* as far as "should" work: besides the usual setup hickups there is one(as if only one) issue which i haven't really addressed. Depending on which version of windows you are running you server will be defaulted to either ipv4 or ipv6. Look for the line var server = app.listen(port,"::1"); in server.js. The ::1 is "localhost" for ipv6. If that resolves to nothing than try replacing that with "localhost".

That's all i can think of right now. 

* ps: looking from the fact that .idea folder is here, this is actually a fully checked in legit webstorm project. Anyway. Instruction is the same
