# README #

## Dependancies ##

* Node (v10.0.0 recommended)
* NPM
* grunt-cli
* git
* wget
* imagemagick
* wine (mac)
* xquartz (for wine)
* safari webdriver
* java
* python (windows only)
* composer
* jq
* ftp (mac high sierra)

If on a mac, this is the suggested route.

* Install brew - [http://brew.sh/]() - then use to install
	* brew install wget
	* brew install git
	* brew install imagemagick
	* brew install wine
	* brew install jq
	* brew install cask
	* brew install tnftp tnftpd telnet telnetd
		* brew cask install java
		* brew cask install xquartz
* Install NVM - [https://github.com/creationix/nvm]() - then use to install
	* nvm install 10.0.0
	* npm install grunt-cli -g
* Install safari webdriver - [http://selenium-release.storage.googleapis.com/index.html?path=2.48/]() - download SafariDriver.safariextz, click it and click trust
* Install composer [https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx]()

Congratulations, you now have everything you need, windows you're on your own, i will suggest [https://chocolatey.org/]() as a pretty good package manager

Targets Folder

* mkdir ~/targets

Create the following files - the json content can be found on gitlab snippets under "Setting up a new gitlab runner"

* .ftppass
* dumbledore.json
* vidaHost-fishawack.json
* vidaHost-meeting.json
* fishawack.json