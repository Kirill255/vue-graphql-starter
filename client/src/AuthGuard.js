import store from "./store";

export default (to, from, next) => {
  if (!store.getters.user) {
    next({
      path: "/signin?signinError=true"
    });
  } else {
    next();
  }
};
