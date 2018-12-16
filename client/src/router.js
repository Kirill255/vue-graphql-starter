import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

import AuthGuard from "./AuthGuard";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/signup",
      name: "signUp",
      component: () => import(/* webpackChunkName: "signUp" */ "./views/Auth/SignUp.vue")
    },
    {
      path: "/signin",
      name: "signIn",
      component: () => import(/* webpackChunkName: "signIn" */ "./views/Auth/SignIn.vue")
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import(/* webpackChunkName: "profile" */ "./views/Auth/Profile.vue"),
      beforeEnter: AuthGuard
    },
    {
      path: "/posts",
      name: "posts",
      component: () => import(/* webpackChunkName: "posts" */ "./views/Posts/Posts.vue"),
      beforeEnter: AuthGuard
    },
    {
      path: "/post/add",
      name: "addPost",
      component: () => import(/* webpackChunkName: "addPost" */ "./views/Posts/AddPost.vue"),
      beforeEnter: AuthGuard
    }
  ]
});
