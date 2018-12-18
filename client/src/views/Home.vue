<template>
  <v-container text-xs-center>

    <v-layout v-if="!loading"
              row>
      <v-flex xs12>
        <v-carousel v-if="posts.length">
          <v-carousel-item v-for="post in posts"
                           :key="post._id"
                           :src="post.imageUrl"
                           @click.native="goToPost(post._id)">
            <h1 id="carousel__title">{{post.title}}</h1>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>

    <v-layout v-else
              row>
      <v-flex xs12
              class="pt-5">
        <v-progress-circular indeterminate
                             :size="100"
                             :width="7"
                             color="purple"></v-progress-circular>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    // HelloWorld
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["posts", "loading"])
  },
  methods: {
    handleGetCarouselPosts() {
      this.$store.dispatch("getPosts");
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  },
  created() {
    this.handleGetCarouselPosts();
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
