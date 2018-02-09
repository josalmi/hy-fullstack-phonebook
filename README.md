# University of Helsinki – Full stack (TKT21009)

Course material: <https://fullstack-hy.github.io/>

## Week 3 backend

This repository contains source code for week three exercises
of Full stack course held at University of Helsinki. The main
repository lives at <https://github.com/josalmi/hy-fullstack>.

Application is live at https://powerful-oasis-17796.herokuapp.com/

### MongoDB client

Simple CLI for interacting with MongoDB is included in the
repository. Client reads MongoDB connection string from `MONGO_URL`
environment variable. See API below:

- List all persons: `npm run mongo`
- Add new person: `npm run mongo name number`
