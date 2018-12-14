<template>
  <v-container>
    <h1>Home</h1>
    <ul>
      <li v-for="post in getPosts"
          :key="post._id">
        <p>{{ post.title }}</p>
        <p>{{ post.imageUrl }}</p>
        <p>{{ post.description }}</p>
        <p>{{ post.likes }}</p>
      </li>
    </ul>
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
      `
    }
  }
};
</script>
