# TaskBoard application
TaskBoard is an application for prioritizing tasks or projects for team members during product creation.
It helps solve conflicts in deadlines or priorities. It can be also used as a team schedule for days,
weeks or months.

## Run locally
### Requirements

- node.js version >= 14.15.1.
- npm version >= 6.14.8. 


- Google account.
- Installed MongoDB database locally or use of official cloud. More details can be found at [MongoDB web page](https://www.mongodb.com/).
- SendGrid account  for email notifications (you can set it up for free). For more details see [SendGrid web page](https://sendgrid.com/).
- Amazon S3 file storage credentials. More details at [AWS S3 web page](https://aws.amazon.com/s3/).
- Registered credentials in google account developer console for oAuth2. More details can be found at [Google DEV page](https://console.cloud.google.com/apis/credentials/oauthclient).

### External data
Application primary uses external data for tasks and projects. The current version supports only
open source ticketing application Redmine. Its required to have its own local or cloud instance 
available for accessing existing projects and issues. For local installation follow [installation steps on Redmine wiki](https://www.redmine.org/projects/redmine/wiki/redmineinstall). 

### Installation
1. Edit [_dev.js file](server/config/_dev.js) in `server/config/_dev.js` to contain all keys and rename it to `dev.js`.
2. Run `npm run install` in root folder to install all dependencies.
3.  **[optional]** Run `npm run --prefix server seed` to seed database for your account and some test data.
4. Run `npm run dev`.
5. Application should be running. Try to access it through your browser under `localhost:3000`.
6. For login use domain whitelist string in `dev.js` file, create your own user in db with `admin` role, 
or use test seeder from step 3.
 
### Tests
Tests require  `testUserAdminGmail` key in `dev.js` file. (more info in [installation section](#installation))

To run all tests for `server`, `client` and `shared` folder, run: 

- ```npm run test```

To run integration tests on specific folder, run: 

- `npm run test --prefix <folder_name>`

## Documentation
Short documentation of server API endpoints can be found in [doc folder](doc/README.md).

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

## Licence
This project is a part of the diploma thesis at FIT ČVUT in Prague.


All the content and code *(except used libraries and Redmine logo, see notices below)*
 are licensed under the FIT ČVUT thesis licence version 4 (December 2020). 
For more details see [LICENCE file](LICENCE.md). Czech version can be found in [LICENCE_CZ file](LICENCE.md).
 
---
 
All licence templates of used libraries can be found in [licences folder](licences). 
See licenses of each library inside of its own folder after running `npm run install` command.

---

Redmine logo is taken from the official site of Redmine. It was resized and changed to white version.
Final edited images can be found at:
- [/client/src/images/redmine-logo.png](/client/src/images/redmine-logo.png)
- [/client/src/images/redmine-logo-bw.png](/client/src/images/redmine-logo-bw.png)

These files are under [Creative Commons Attribution-Share Alike 2.5 Generic license](https://creativecommons.org/licenses/by-sa/2.5)  

Redmine Logo is Copyright (C) 2009 Martin Herr and is licensed under the Creative Commons Attribution-Share Alike 2.5 Generic license.
For more details see [redmine wiki](https://www.redmine.org/projects/redmine/wiki/logo).

