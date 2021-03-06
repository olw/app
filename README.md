app
===
[![Build Status](https://travis-ci.org/olw/app.svg?branch=develop)](https://travis-ci.org/olw/app) [![Gitter chat](https://badges.gitter.im/olw.png)](https://gitter.im/olw) [trello board](https://trello.com/b/QVlNFXdz/project-board)

Web frontend to our files, communicating with the backend via REST. Based on [ng-boilerplate](https://github.com/ngbp/ngbp).

Getting started
---------------

```bash
# install global cli applications
$ sudo npm install -g grunt-cli karma bower less coffee-script http-server
# clone this repository
$ git clone https://github.com/olw/app
$ cd app
# init git flow branching model
app$ git flow init
# install from configuration files
app$ npm install
app$ bower install
# start grunt
app$ grunt watch --force
# start http-server
app$ http-server build
```

To use this frontend with your own configuration, edit `src/common/olwConfigurationService/olwConfigurationService.js`.