# Dodgeball.tf

Source code of [dodgeball.tf](https://dodgeball.tf)

# Design

The flow of this whole process is fairly simple.

### Microservice

We use a microservice called `@dodgeball/fetchserver` which fetches all of the dodgeball servers we can find from hl2server and caches it, it runs every day 12.

### API

API sends server data to your web client and fetches server data with the help fetch data from `@dodgeball/fetchserver`, we cache this in memory view and send it to our web client.

We can also re cache server data with the endpoint `/servers/serverinfo/:ip/:port`

### Web

The frontend of [dodgeball.tf](https://dodgeball.tf), it fetches `/servers` and get all of the servers and we fetch server info later once we got them all.
