# vue-graphql-starter

https://github.com/reedbarger/fullstack-vue-graphql-starter

https://swapi.co/

https://graphql.org/swapi-graphql/

### Deploy to [now](https://zeit.co/now)

1. Change port in server.js in server(main)!!! folder

```
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
```

Set variable PORT `PORT=80` in .env file

2. Deploy from server(main)!!! folder `now --dotenv=.env`

3. Change uri in ApolloClient configuration in main.js in client!!! folder with the received link

from:

```
uri: "http://localhost:4000/graphql",
```

to your adress:

```
...
uri: "https://fullstack-vue-graphql-starter-jwhxjdepzv.now.sh/graphql",
...
```

4. In router.js in client!!! folder add option `base`

```
base: process.env.BASE_URL,
```

5. Create `now.json` file in client!!! folder [click](https://cli.vuejs.org/guide/deployment.html#now)

```
{
  "name": "my-vue-share",
  "type": "static",
  "static": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "alias": "vue-share",
  "files": [
    "dist"
  ]
}
```

6. Add the deployment script to package.json in client!!! folder

```
"deploy": "npm run build && now --public && now alias"
```

6. Go to client!!! folder and run `npm run deploy`

### Related link

https://github.com/Kresten/udemycourses/tree/master/fullstack_vue_graphql

or just search on github with `Full-Stack Vue with GraphQL`
