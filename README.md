# graphql-server-sample
A simple server which serves user data and allows basic operations.  
The idea behind, having a relational database model served as GraphQL.

## Install dependencies

    $ node -v
    v9.5.0
    $ npm i

## Database
Use Docker Compose to run a PostgreSQL database.  

    docker-compose up

The server is using `sequelizejs` as ORM.  

### Migrate

    $ node_modules/.bin/sequelize db:migrate

When something went wrong you can undo all your actions.

    $ node_modules/.bin/sequelize db:migrate:undo:all

### Running seeds

    $ node_modules/.bin/sequelize db:seed:all

Cleaning the database to play with data.  

    $ node_modules/.bin/sequelize db:seed:undo:all

## Run it

    $ npm start

## Token
All requests need a token as header or query param.

    token for user with id 2: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJpYXQiOjE1MTgzODM2MDZ9.I9GbV7a-4VUE8Bbcl8JBz0b4mtiPMJTLpQtzUvT_iOk

## GraphiQL
Is a graphical interactive in-browser GraphQL IDE. 

    http://localhost:3000/graphiql?token=<token>

Some basic operations.
    
    query {
        me {
            id, email, age
        }
    }

    query {
        users {
            email
        }
    }

    query {
        users {
            id, email, age, company { id, name }
        }
    }

    query {
        user(email:"user1@graphql.com") {
            id, email, age
        }
    }

    query {
        companies {
            id, name
        }
    }

    mutation {
        addUser(email:"user@graphql.com",age:22,company:"Company A") {
            id
        }
    }

    mutation {
        updateUser(id:2,email:"new@graphql.com",age:34,company:"Company C") {
            id, email, age
        }
    }

    mutation {
        deleteUser(id:4) {
            email
        }
    }

## Feedback
Star this repo if you found it useful. Use the github issue tracker to give feedback on this repo.