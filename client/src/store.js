import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

import { defaultClient as apolloClient } from "./main";
import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER, SIGNUP_USER } from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    posts: [],
    loading: false,
    error: null,
    authError: null
  },
  getters: {
    user: state => state.user,
    posts: state => state.posts,
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
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    clearError: state => (state.error = null),
    clearUser: state => (state.user = null)
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
