<template>
  <v-app style="background: #E3E3EE">
    <v-navigation-drawer app
                         temporary
                         v-model="drawer">

      <v-toolbar color="accent"
                 dark
                 flat>

        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>

        <router-link to="/"
                     tag="span"
                     style="cursor: pointer">
          <h1 class="title pl-3">VueShare</h1>
        </router-link>

      </v-toolbar>

      <v-divider></v-divider>

      <!-- Side Navbar Links -->
      <v-list>

        <v-list-tile ripple
                     v-for="item in navItems"
                     :key="item.title"
                     :to="item.link">

          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            {{item.title}}
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="user"
                     to="/profile">
          <v-list-tile-action>
            <v-icon>account_box</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Profile'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="user"
                     @click="handleSignoutUser">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Logout'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>

    </v-navigation-drawer>

    <!-- Horizontal Navbar -->
    <v-toolbar app
               color="primary"
               dark>
      <v-toolbar-side-icon class="hidden-md-and-up"
                           @click="toggleSideNav"></v-toolbar-side-icon>

      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/"
                     tag="span"
                     style="cursor: pointer">VueShare</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-text-field prepend-icon="search"
                    box
                    hide-details
                    single-line
                    color="accent"
                    placeholder="Search posts"
                    clearable></v-text-field>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat
               v-for="item in navItems"
               :key="item.title"
               :to="item.link">
          <v-icon left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>

        <v-btn v-if="user"
               to="/profile"
               flat>
          <v-icon left>account_box</v-icon>
          <v-badge right
                   color="blue darken-2"
                   :class="{'bounce': badgeAnimated}">
            <span v-if="userFavorites.length"
                  slot="badge">{{userFavorites.length}}</span>
            Profile
          </v-badge>
        </v-btn>

        <v-btn v-if="user"
               @click="handleSignoutUser"
               flat>
          <v-icon left>exit_to_app</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>

    </v-toolbar>

    <!-- App content -->
    <v-content>
      <main>
        <transition name="fade">
          <router-view />
        </transition>

        <!-- Auth Snackbar -->
        <v-snackbar v-model="authSnackbar"
                    color="success"
                    :timeout="5000"
                    bottom
                    left>
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn dark
                 flat
                 @click="authSnackbar = false">Close</v-btn>
        </v-snackbar>

        <!-- Auth Error Snackbar -->
        <v-snackbar v-if="authError"
                    v-model="authErrorSnackbar"
                    color="info"
                    :timeout="5000"
                    bottom
                    left>
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{authError.message}}</h3>
          <v-btn dark
                 flat
                 to="/signin"
                 @click="authErrorSnackbar = false">Signin</v-btn>
        </v-snackbar>
      </main>
    </v-content>

  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      drawer: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false
    };
  },
  watch: {
    user(newValue, oldValue) {
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    },
    userFavorites(value) {
      // if user favorites value changed at all
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 1000);
      }
    }
  },
  computed: {
    ...mapGetters(["user", "userFavorites", "authError"]),
    navItems() {
      if (this.user) {
        return [
          { icon: "chat", title: "Posts", link: "/posts" },
          { icon: "stars", title: "Create Post", link: "/post/add" }
        ];
      }
      return [
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
    }
  },
  methods: {
    toggleSideNav() {
      this.drawer = !this.drawer;
    },
    handleSignoutUser() {
      this.$store.dispatch("signoutUser");
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

/* user favorite badge animation */
.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
