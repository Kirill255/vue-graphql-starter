<template>
  <v-container fluid
               grid-list-xl>

    <!-- Post Cards -->
    <v-layout row
              wrap
              v-if="infiniteScrollPosts">
      <v-flex xs12
              sm6
              v-for="post in infiniteScrollPosts.posts"
              :key="post._id">
        <v-card hover
                @click.native="goToPost(post._id)">
          <v-img :src="post.imageUrl"
                 :lazy-src="post.imageUrl"
                 height="30vh"
                 lazy></v-img>
          <v-card-actions>
            <v-card-title primary>
              <div>
                <div class="headline">{{post.title}}</div>
                <span class="grey--text">{{post.likes}} likes - {{post.messages.length}} comments</span>
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn @click="showPostAuthor = !showPostAuthor"
                   icon>
              <v-icon>{{`keyboard_arrow_${showPostAuthor ? "up" : "down"}`}}</v-icon>
            </v-btn>
          </v-card-actions>

          <!-- Post Creator Tile -->
          <v-slide-y-transition>
            <v-card-text v-show="showPostAuthor"
                         class="grey lighten-4">
              <!-- <v-list> -->
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="post.createdBy.avatar">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title class="text--primary">{{post.createdBy.username}}</v-list-tile-title>
                  <v-list-tile-sub-title class="font-weight-thin">Added {{post.createDate}}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn icon
                         ripple>
                    <v-icon color="grey lighten-1">info</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <!-- </v-list> -->
            </v-card-text>
          </v-slide-y-transition>

        </v-card>
      </v-flex>
    </v-layout>

    <!-- Fetch More Button -->
    <v-layout v-if="showMoreEnabled"
              column>
      <v-flex xs12>
        <v-layout justify-center
                  row>
          <v-btn color="info"
                 @click="showMorePosts">Show More</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { INFINITE_SCROLL_POSTS } from "../../queries";
const pageSize = 2;

export default {
  name: "Posts",
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
      showPostAuthor: false
    };
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize
      }
    }
  },
  methods: {
    showMorePosts() {
      this.pageNum += 1;
      // fetch more data and transform original result
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          pageNum: this.pageNum, // pageNum incremented by 1
          pageSize
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          // console.log("prevresult : ", prevResult.infiniteScrollPosts.posts);
          // console.log("fetchmore : ", fetchMoreResult);

          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;

          this.showMoreEnabled = hasMore;

          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts], // Merge previous posts with new posts
              hasMore
            }
          };
        }
      });
      // .then(({ data }) => {
      //   this.showMoreEnabled = data.infiniteScrollPosts.hasMore;
      // })
      // .catch(error => console.error(error));
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  }
};
</script>

<style scoped>
</style>
