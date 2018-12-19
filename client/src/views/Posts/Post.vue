<template>
  <v-container v-if="getPost"
               class="mt-3"
               flexbox
               center>

    <!-- Post Card -->
    <v-layout row
              wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn v-if="user"
                   @click="debounceHandleToggleLikePost"
                   large
                   icon>
              <v-icon large
                      :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'">favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{getPost.likes}} LIKES</h3>
            <v-spacer></v-spacer>
            <v-icon @click="goToPreviousPage"
                    color="info"
                    large>arrow_back</v-icon>
          </v-card-title>

          <v-tooltip right>
            <span>Click to enlarge image</span>
            <v-img slot="activator"
                   @click="toggleImageDialog"
                   id="post__image"
                   :src="getPost.imageUrl"
                   :lazy-src="getPost.imageUrl"></v-img>
          </v-tooltip>

          <!-- Post Image Dialog -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl"
                     :lazy-src="getPost.imageUrl"
                     height="80vh"></v-img>
            </v-card>
          </v-dialog>

          <v-card-text>
            <span v-for="(category, index) in getPost.categories"
                  :key="index">
              <v-chip class="mb-3"
                      color="accent"
                      text-color="white">{{category}}</v-chip>
            </span>
            <h3>{{getPost.description}}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Messages Section -->
    <div class="mt-3">
      <!-- Message Input -->
      <v-layout v-if="user"
                class="mb-3">
        <v-flex xs12>
          <v-form @submit.prevent="handleAddPostMessage"
                  ref="form"
                  lazy-validation
                  v-model="isFormValid">
            <v-layout row>
              <v-flex xs12>
                <v-text-field @click:append-outer="handleAddPostMessage"
                              :append-outer-icon="messageBody && 'send'"
                              prepend-icon="email"
                              type="text"
                              label="Add Message"
                              :rules="messageRules"
                              v-model="messageBody"
                              clearable
                              required></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <!-- Messages -->
      <v-layout row
                wrap>
        <v-flex xs12>
          <v-list two-line
                  subheader>
            <v-subheader>Messages ({{getPost.messages.length}})</v-subheader>

            <template v-for="message in getPost.messages">
              <v-divider :key="message._id"></v-divider>

              <v-list-tile avatar
                           inset
                           :key="message.title">
                <v-list-tile-avatar>
                  <img :src="message.messageUser.avatar">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>
                    {{message.messageBody}}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{message.messageUser.username}}
                    <span class="grey--text text--lighten-1 hidden-xs-only">
                      {{getTimeFromNow(message.messageDate)}}
                    </span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action class='hidden-xs-only'>
                  <v-icon :color="checkIfOwnMessage(message) ? 'accent' : 'grey'">chat_bubble</v-icon>
                </v-list-tile-action>

              </v-list-tile>
            </template>
          </v-list>
        </v-flex>
      </v-layout>

    </div>

  </v-container>
</template>

<script>
import debounce from "lodash.debounce";
import moment from "moment";
import { mapGetters } from "vuex";
import {
  GET_POST,
  ADD_POST_MESSAGE,
  LIKE_POST,
  UNLIKE_POST
} from "../../queries";

export default {
  name: "Post",
  props: ["postId"],
  data() {
    return {
      isFormValid: false,
      dialog: false,
      postLiked: false,
      messageBody: "",
      messageRules: [
        message => !!message || "Message is required",
        message =>
          (message && message.length < 100) ||
          "Message must be less than 100 characters"
      ]
    };
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user", "userFavorites"])
  },
  methods: {
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    },
    goToPreviousPage() {
      this.$router.go(-1);
    },
    handleAddPostMessage() {
      if (this.$refs.form.validate()) {
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,
          postId: this.postId
        };

        this.$apollo
          .mutate({
            mutation: ADD_POST_MESSAGE,
            variables,
            update: (cache, { data: { addPostMessage } }) => {
              const data = cache.readQuery({
                query: GET_POST,
                variables: {
                  postId: this.postId
                }
              });

              // console.log("from update: ", data);
              // console.log("from update: ", data.addPostMessage);

              data.getPost.messages.unshift(addPostMessage);

              cache.writeQuery({
                query: GET_POST,
                variables: {
                  postId: this.postId
                },
                data
              });
            }
          })
          .then(({ data }) => {
            // console.log(data.addPostMessage);
            this.$refs.form.reset();
          })
          .catch(err => console.error(err));
      }
    },
    checkIfOwnMessage(message) {
      return this.user && this.user._id === message.messageUser._id;
    },
    handleToggleLikePost() {
      if (this.postLiked) {
        this.handleUnlikePost();
      } else {
        this.handleLikePost();
      }
    },
    handleLikePost() {
      this.$apollo
        .mutate({
          mutation: LIKE_POST,
          variables: {
            postId: this.postId,
            username: this.user.username
          },
          update: (cache, { data: likePost }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: {
                postId: this.postId
              }
            });

            data.getPost.likes += 1;

            cache.writeQuery({
              query: GET_POST,
              variables: {
                postId: this.postId
              },
              data
            });
          }
        })
        .then(({ data }) => {
          // console.log(this.user);
          // console.log(data.likePost);

          const updatedUser = {
            ...this.user,
            favorites: data.likePost.favorites
          };
          this.$store.commit("setUser", updatedUser);
        })
        .catch(err => console.error(err));
    },
    handleUnlikePost() {
      this.$apollo
        .mutate({
          mutation: UNLIKE_POST,
          variables: {
            postId: this.postId,
            username: this.user.username
          },
          update: (cache, { data: unlikePost }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: {
                postId: this.postId
              }
            });

            data.getPost.likes -= 1;

            cache.writeQuery({
              query: GET_POST,
              variables: {
                postId: this.postId
              },
              data
            });
          }
        })
        .then(({ data }) => {
          // console.log(this.user);
          // console.log(data.likePost);

          const updatedUser = {
            ...this.user,
            favorites: data.unlikePost.favorites
          };
          this.$store.commit("setUser", updatedUser);
        })
        .catch(err => console.error(err));
    },
    checkIfPostLiked(postId) {
      if (!this.userFavorites) {
        return;
      }
      const isIfPostLiked =
        this.userFavorites &&
        this.userFavorites.some(fave => fave._id === postId);

      if (isIfPostLiked) {
        this.postLiked = true;
        return true;
      } else {
        this.postLiked = false;
        return false;
      }
    },
    getTimeFromNow(time) {
      return moment(new Date(time)).fromNow();
    },
    debounceHandleToggleLikePost: debounce(function() {
      this.handleToggleLikePost();
    }, 300)
  }
};
</script>

<style scoped>
#post__image {
  height: 400px !important;
}
</style>
