import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

import { defaultClient as apolloClient } from "./main";
import { GET_POSTS, SIGIN_USER, GET_CURRENT_USER } from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    posts: [],
    loading: false
  },
  getters: {
    user: state => state.user,
    posts: state => state.posts,
    loading: state => state.loading
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
    }
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

    signinUser: ({ commit }, payload) => {
      commit("setLoading", true);

      apolloClient
        .mutate({
          mutation: SIGIN_USER,
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
          commit("setLoading", false);
          console.error(err);
        });
    }
  }
});
