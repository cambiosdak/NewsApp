# Telegram bot crypto news
# About
This bot was made using ```electron``` and ```axios```<br />
This application receive the username of the Twitter account that wants to monitor, proceeds to monitor the profile and retrieve the last tweet sent, if the tweet is different than the last one that was sent, the bot will publish it on a designated channel (which can be added via input text in the UI)
This was developed for a Latin American comunity, so tweets needed to be translated. For this, I scrapped the free version of the Google Translator, make HTTP calls everytime a tweet needs to be posted on Telegram channel and translate it from ANY language to Spanish, translation are high quality and it's sent without any errors
UI was made using templates from bootswatch which uses bootstrap 5
# Install
Install via npm:<br />
```npm i axios```<br />
```npm i dom-parser```<br />
```npm i telegraf``` <br />
after dependecies are installed, run ```npm run start```
# Features
- Add as many users you want to monitor
- Delete an user
- Check if the last tweet is a RT, if it is, it will specify it
- Translated data (powered by Google)
- Simple UI using electron app

# Examples
![UI](https://github.com/cambiosdak/NewsApp/blob/main/examples/Screenshot%202023-04-04%20000425.png)<br />
![](https://github.com/cambiosdak/NewsApp/blob/main/examples/Screenshot%202023-04-04%20000431.png)<br />
![](https://github.com/cambiosdak/NewsApp/blob/main/examples/Screenshot%202023-04-04%20225728.png)
