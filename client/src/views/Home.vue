<template>

  <v-container text-xs-center>
    <!-- Loading Spinner -->
    <v-layout row>
      <v-dialog v-model="loading"
                persistent
                fullscreen>
        <v-container fill-height>
          <v-layout row
                    justify-center
                    align-center>
            <v-progress-circular indeterminate
                                 :size="70"
                                 :width="7"
                                 color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <!-- Explore Posts Button -->
    <v-layout class="mt-2 mb-3"
              row
              wrap
              v-if="!loading">
      <v-flex xs12>
        <v-btn class="secondary"
               to="/posts"
               large
               dark>
          Explore Posts
        </v-btn>
      </v-flex>
    </v-layout>

    <!-- Posts Carousel -->
    <v-flex xs12>
      <v-carousel v-if="!loading && posts.length > 0">
        <v-carousel-item v-for="post in posts"
                         :key="post._id"
                         :src="post.imageUrl"
                         @click.native="goToPost(post._id)">
          <h1 id="carousel__title">{{post.title}}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
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
  cursor: pointer;
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
