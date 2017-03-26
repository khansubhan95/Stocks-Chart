# Chart Stock Data

A web application that displays stock prices of companies in chart form. The application syncs in real time across clients, i.e. what one client adds or removes is reflected in the other clients browser, without need of refreshing the browser. This is accomplished by using WebSockets. Libraries and APIs used include socket.io (for WebSocket), Quandl API (for getting stock prices) and Highstock API (for displaying charts of stock prices) 

## Getting Started

### Prerequisites

1. [node](https://nodejs.org/en/)
2. [npm](https://www.npmjs.com)
3. [mongodb](https://www.mongodb.com/)

### Installation
Clone the project

```git
git clone https://github.com/khansubhan95/chart-stock.git
```

run

```
npm install
```

to install the dependencies

### Development
Rename .env.template to .env

Sign up on Quandl and insert into .env the generated API key

The project uses MongoDB to store data so make sure you have it installed. Use the MONGO_URI to access a DB from the app.

## Deployment
This application was deployed on gomix. To deploy, create a GitHub repository, push the project to the repo. Create a new gomix application, and import the repo into it by going to project_name > Advanced Options > Import from GitHub . Do this process everytime, you change your repo. Copy contents of .env to env.

**MONGO_URI**
Use a third party service like [mLab](https://mlab.com/) to make a MongoDB database and note down the access point. Insert this URI into the mongo variable in .env

## Builtwith
1. [socket.io](http://socket.io)      
2. [Quandl](https://www.quandl.com/)
3. [Highstock](http://mongoosejs.com/)
4. [ejs](www.embeddedjs.com/)

View other dependencies in package.json

## Contributing
1. Fork it
2. Create your branch
3. Commit your changes
4. Push to branch
5. Submit a pull request