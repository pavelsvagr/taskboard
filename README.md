# TaskBoard application
TaskBoard is an application for prioritizing users tasks or projects during product creation.
It helps solve conflicts in deadlines or priorities. It can be also used as team schedule for days,
weeks or months.

## Run locally
### Requirements

- node.js version >= 14.15.1,
- npm version >= 6.14.8 
- Google account
- Installed MongoDB database locally or use official cloud. More details at [MongoDB web page](https://www.mongodb.com/)
- SendGrid account (you can set it up for free). More details at [SendGrid web page](https://sendgrid.com/)
- Registered localhost on google account developer console for oAuth2. More details at [Google DEV page](https://console.cloud.google.com/apis/credentials/oauthclient)

### External data
Application primary uses external data for tasks and projects. The current version supports only
open source ticketing application Redmine, so its required to have its own local or cloud instance available.

### Installation
- Edit `_dev` file in `server/config/_dev` to contain all keys and rename it to `dev`.
- Run `npm i` in root, `server`, `client` and `shared` folder.
- **[optional]** Run `npm run --prefix server seed` to seed database for your account and some test data.
- Run `npm run dev`.
- Application should be running. Try to access it through your browser under `localhost:3000`.  
 
### Tests
Application contains integration test for server api.  
To run integration tests on server side of the application, run `npm run test` in `/server` folder.

## Project structure
Project divides in three parts:
- `/server` is server Node.js app with all database and external logic.
- `/client` contains React app with Ant Design components.
- `/shared` contains all shared code and constant for client and server side.

### Client
Client contains classic Create React app structure. 

- `\client\src` contains all react logic.
    - `actions` redux actions.
    - `reducers` redux reducers.
    - `components` react components.
    - `helpers` contains application logic helpers.
    - `styles` contains sass styles for project.
    - `types` contains PropTypes validation rules for used objects.

### Server
- `\server`
    - `app` contains all data storing and manipulation logic.
        - `controllers` controllers responding to requests.
        - `exceptions` server specific exceptions for error handling.
        - `middlewares` middleware for validation, security and data requirements.
        - `model` all database logic.
        - `routes` api and auth routes configuration.
        - `services` business logic.  
    - `config` server configuration files.
    - `db` database manipulation scripts.  
    - `tests` test for server side.  

## Licences
This project is part of the diploma thesis at FIT ČVUT in Prague.
 
Used libraries are under MIT or Apache Licence Version 2.0. Both licences are permissive.
All licences templates are stored in `/licences` folder.
See licenses of each library inside of its own folder after running `npm install` command.

Redmine logo used in this project was taken from official site of Redmine. It was transformed to black and white version.
Final edited images can be found at:
- [/client/src/images/redmine-logo.png](/client/src/images/redmine-logo.png)
- [/client/src/images/redmine-logo-bw.png](/client/src/images/redmine-logo-bw.png)

These files are also under [Creative Commons Attribution-Share Alike 2.5 Generic license](https://creativecommons.org/licenses/by-sa/2.5)  

Redmine Logo is Copyright (C) 2009 Martin Herr and is licensed under the Creative Commons Attribution-Share Alike 2.5 Generic license.
For more details see [redmine wiki](https://www.redmine.org/projects/redmine/wiki/logo).

---
Rest of contents and code is licensed under the Apache License, Version 2.0. 
For more details see [licence file](LICENCE.md).
