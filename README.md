#Relution-livedata-sample-chat
![](http://www.relution.io/de/wp-content/themes/Divi/images/logo.png)
###Dependencies:
- node
- cordova
- mcap-cli
- ruby sass
- gulp

###Installation
#####Server
1.
  ````
    npm i -g mcap-cli
  ````
2.
````
  cd relution-livedata-sample-chat
````
3.
````
    mcap
    add Server
    mcap deploy
````
####Client
go into the folder

````
cd relution-livedata-sample-chat/client
````
add your Server Url in
`````
	relution-livedata-sample-chat/client/app/main/constant/env-dev.json
    "SERVER_URL": "YOUR SERVER URL"
`````
install dependencies:
````
	npm i && bower i
````
start in browser
````
	gulp watch
````
there are many more Gulp Commands are available full Documentation can be read [here](https://github.com/mwaylabs/generator-m)