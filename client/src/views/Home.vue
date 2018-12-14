<template>
  <v-container>
    <h1>Home</h1>
    <div v-if="$apollo.loading">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="post in getPosts"
            :key="post._id">
          <p>{{ post.title }}</p>
          <p>{{ post.imageUrl }}</p>
          <p>{{ post.description }}</p>
          <p>{{ post.likes }}</p>
        </li>
      </ul>
    </div>
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
      posts: []
    };
  },
  apollo: {
    getPosts: {
      query: gql`
        query {
          getPosts {
            _id
            title
            imageUrl
            description
            likes
          }
        }
      `,
      // result(args) { console.dir(args) }
      result({ data, loading, networkStatus }) {
        if (!loading) {
          this.posts = data.getPosts;
          // networkStatus: 7 -ok, 8 - err
          console.log("networkStatus: ", networkStatus);
        }
      },
      error(err) {
        console.error("We've got an error!", err);
        console.dir(err);
      }
    }
  }
};
</script>
