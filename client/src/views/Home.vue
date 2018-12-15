<template>
  <v-container v-if="getPosts"
               text-xs-center>
    <v-layout row>
      <v-flex xs12>
        <v-carousel>
          <v-carousel-item v-for="post in getPosts"
                           :key="post._id"
                           :src="post.imageUrl">
            <h1 id="carousel__title">{{post.title}}</h1>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>

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
    return {};
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

<style scoped>
#carousel__title {
  position: absolute;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 0.5em;
  border-radius: 5px 5px 0 0;
}
</style>
