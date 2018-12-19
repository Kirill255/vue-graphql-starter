import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

import { defaultClient as apolloClient } from "./main";
import {
  SIGNUP_USER,
  SIGNIN_USER,
  GET_CURRENT_USER,
  GET_POSTS,
  ADD_POST,
  INFINITE_SCROLL_POSTS,
  SEARCH_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST
} from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    posts: [],
    userPosts: [],
    searchResults: [],
    loading: false,
    error: null,
    authError: null
  },
  getters: {
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    posts: state => state.posts,
    userPosts: state => state.userPosts,
    searchResults: state => state.searchResults,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError
  },
  mutations: {
    setUser: (state, payload) => {
      state.user = payload;
    },
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    clearError: state => (state.error = null),
    clearUser: state => (state.user = null),
    clearSearchResults: state => (state.searchResults = [])
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);

      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          // console.log(data.getCurrentUser);
          commit("setUser", data.getCurrentUser);
          commit("setLoading", false);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    },

    getPosts: ({ commit }) => {
      commit("setLoading", true);

      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          // console.log(data.getPosts);
          commit("setPosts", data.getPosts);
          commit("setLoading", false);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    },

    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          // console.log(data.getUserPosts);
          commit("setUserPosts", data.getUserPosts);
        })
        .catch(err => console.log(err));
    },

    addPost: ({ commit }, payload) => {
      commit("setLoading", true);

      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          // When we add a post, we want it to be reflected in the carousel as well.
          // This carousel uses the initial posts from login, so we add our post to the cached query (called on init)
          update: (cache, { data: { addPost } }) => {
            // first read the query you want to update
            const data = cache.readQuery({ query: GET_POSTS });
            // we have copied the data from the old cached query and added the new posts at the beginning
            data.getPosts.unshift(addPost);
            console.log(data);
            // we write the updated array back to the cache
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          // we use optimitic response to ensure the post is added immediately
          // When using optimistic response, the data is returned immediately, and thus fields added by the backend will not be filled (e.g. createdDate on Posts)
          optimisticResponse: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1,
              ...payload
            }
          },
          // rerun specified queries after performing the mutation in order to get fresh data
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2
              }
            }
          ]
        })
        .then(({ data }) => {
          console.log(data.addPost);
          commit("setLoading", false);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    },

    searchPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          // console.log(data.searchPosts);
          commit("setSearchResults", data.searchPosts);
        })
        .catch(err => console.log(err));
    },

    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          // console.log(state.userPosts);
          // console.log(data.updateUserPost);

          const index = state.userPosts.findIndex(post => post._id === data.updateUserPost._id);
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];

          commit("setUserPosts", userPosts);
        })
        .catch(err => console.log(err));
    },

    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          // console.log(data.deleteUserPost);

          const index = state.userPosts.findIndex(post => post._id === data.deleteUserPost._id);
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];

          commit("setUserPosts", userPosts);
        })
        .catch(err => console.log(err));
    },

    signUpUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);

      // clear token to prevent errors
      // localStorage.setItem("token", "");

      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          // console.log(data.signupUser);
          localStorage.setItem("token", data.signupUser.token);
          commit("setLoading", false);
          // to make sure created is run in main.js - reload the page
          router.go();
        })
        .catch(err => {
          commit("setError", err);
          commit("setLoading", false);
          console.error(err);
        });
    },

    signinUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);

      // clear token to prevent errors
      // localStorage.setItem("token", "");

      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          // console.log(data.signinUser);
          localStorage.setItem("token", data.signinUser.token);
          commit("setLoading", false);
          // to make sure created is run in main.js - reload the page
          router.go();
        })
        .catch(err => {
          commit("setError", err);
          commit("setLoading", false);
          console.error(err);
        });
    },

    signoutUser: async ({ commit }) => {
      // clear user in state

      // commit("setUser", null); // or
      commit("clearUser");

      // remove token in localStorage

      // localStorage.removeItem("token"); // or
      localStorage.setItem("token", "");

      // end session in Apollo

      // console.dir(apolloClient);
      await apolloClient.resetStore();

      // redirect home - kick users out of private pages
      router.push("/");
    }
  }
});
