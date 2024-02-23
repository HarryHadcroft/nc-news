# Northcoders News API

The intention of this project is to mimic the building of a real world backend service (such as Reddit) which should provide information to the front end architecture.

Here is a link to the hosted version: https://nc-news-yxr5.onrender.com/

## Running this project

`node.js version 21.5.0` and `PostgreSQL version 15.5` were used for this project. The project may not work with earlier versions

First you will need to clone this respository by using `git clone https://github.com/HarryHadcroft/nc-news.git` in your terminal

You will then need to create both a `.env.test` file and a `.env.development` file at the top level of the `BE_NC_NEWS` folder.
In each of these files, you will need to add the following code: `PGDATABASE=<database_name>` replacing <database_name> with the correct name for that environment (can be found in /db/setup.sql). Both files should be added to .gitignore

Next, you will need to run `npm install` to install all of the required dependencies

Finally, you will need to create the databases using `npm run seetup-dbs` and seed them with the data using `npm run seed`

### Testing
You can run all tests with `npm test` or use `npm run app-test` for app specific testing