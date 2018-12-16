import Vue from "vue";
import Vuex from "vuex";

import { defaultClient as apolloClient } from "./main";
import { GET_POSTS, SIGIN_USER } from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    }
  },
  actions: {
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
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    }
  }
});
