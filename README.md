# SYNC
## Status [![Build Status](https://travis-ci.org/chickenPopcorn/ASE-Group-Project.svg?branch=master)](https://travis-ci.org/chickenPopcorn/ASE-Group-Project) [![Codacy grade](https://img.shields.io/codacy/grade/17ede08ebf51447296922d6f2b1ee83c.svg "Codacy grade")](https://www.codacy.com/app/rxie25/ASE-Group-Project?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=chickenPopcorn/ASE-Group-Project&amp;utm_campaign=Badge_Grade) [![Coverage Status](https://coveralls.io/repos/github/chickenPopcorn/ASE-Group-Project/badge.svg?time=20161216)](https://coveralls.io/github/chickenPopcorn/ASE-Group-Project)

## Overview
This is the group project of for Advanced Software Engineering. We built an web application providing url shortening service, statistics report, and many social features. The goal of the project is to develop the product as up to industry standard as possible. 

## System Architecture

![alt tag](https://github.com/chickenPopcorn/not-so-tiny-url/blob/master/doc/system.jpg)

### Backend
Project developed using MEAN stack(`MongoDB`, `Express`, `AngularJS`, `NodeJS`). Using docker container service to docker-compose a cluster of back end servers, all connected to cache `Redis` and load balancer using `Nginx` and [`ip hashing`](http://socket.io/docs/using-multiple-nodes/). We deployed the application using AWS Elastic Container Service(`ECS`) and "docker-compose" on a cluster. We also built a test suites and continuously integrated with project using `Travis CI`. Then coverage information is sent to `coverall.io`. 

### Frontend
Users can register and login into our application, and then share and shorten any valide url links either publicly or privately. Application will generate a card for each url justl like twitter and facebook. Other users can view publicly shared urls in main feed page and like, comment or share on other social network including twitter, facebook, pinterest and google+. Each shortened url also has a statistics page that users can be view that show real-time data using `socket.io` of the links' activity.

## App Demo
