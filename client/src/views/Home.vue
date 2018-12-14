<template>
  <v-container>
    <h1>Home</h1>

    <ApolloQuery :query="getPostsQuery">

      <template slot-scope="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading">Loading...</div>

        <!-- Error -->
        <div v-else-if="error">An error occured. {{error.message}}</div>

        <!-- Result -->
        <div v-else-if="data">
          <ul>
            <li v-for="post in data.getPosts"
                :key="post._id">
              <p>{{ post.title }}</p>
              <p>{{ post.imageUrl }}</p>
              <p>{{ post.description }}</p>
              <p>{{ post.likes }}</p>
            </li>
          </ul>
        </div>

        <!-- No result -->
        <div v-else>No result :(</div>

      </template>

    </ApolloQuery>

  </v-container>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

import { gql } from "apollo-boost";

export default {
  name: "Home",
  components: {
    // HelloWorld
  },
  data() {
    return {
      getPostsQuery: gql`
        query {
          getPosts {
            _id
            title
            imageUrl
            description
            likes
          }
        }
      `
    };
  }
};
</script>
