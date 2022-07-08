# Toms NC-News API

This is an api built to supply useless news!

The api includes:
* Search system for articles/topics/users/comments
* comment system for articles
* voting system for articles.

## Hosted using heroku
[Link to hosted version of Toms NC-News](https://tomnews.herokuapp.com/api)

## Setup

### Clone the repo
'git clone https://github.com/oregan1/NC-news.git' OR fork and clone your own version

### Install dependencies
'npm init'     
'npm i pg supertest jest-sorted express dotenv jest'

### Seeding local database
'npm run setupdbs && npm run seed'

### Create initial environment variables
create a .env.test & .env.development file and populate them with 'PGDATABASE=nc_news_test' & 'PGDATABASE=nc_news' respectively.

## Requirements
### Recommended:
- npm 8.x
- node 18.x
