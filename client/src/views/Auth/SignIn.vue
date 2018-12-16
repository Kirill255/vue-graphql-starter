<template>
  <v-container text-xs-center
               mt-5
               pt-5>
    <v-layout row
              wrap>
      <v-flex xs12
              sm6
              offset-sm3>
        <h1>Login</h1>
      </v-flex>
    </v-layout>

    <!-- Form -->
    <v-layout row
              wrap>
      <v-flex xs12
              sm6
              offset-sm3>
        <v-card color="secondary"
                dark>
          <v-container>

            <v-form @submit.prevent="handleSigninUser"
                    ref="form"
                    lazy-validation
                    v-model="isFormValid">

              <v-layout row>
                <v-flex xs12>
                  <v-text-field prepend-icon="face"
                                type="text"
                                label="Username"
                                :rules="usernameRules"
                                v-model="username"
                                required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field prepend-icon="security"
                                type="password"
                                label="Password"
                                :rules="passwordRules"
                                v-model="password"
                                required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn type="submit"
                         color="accent"
                         :loading="loading"
                         :disabled="!isFormValid || loading">
                    <span class="custom-loader"
                          slot="loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Submit
                  </v-btn>
                  <h3>Don't have an account?
                    <router-link to="/signup">Signup</router-link>
                  </h3>
                </v-flex>
              </v-layout>

            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SignIn",
  data() {
    return {
      isFormValid: false,
      username: "",
      password: "",
      usernameRules: [
        username => !!username || "Username is required",
        username =>
          (username && username.length < 15) ||
          "Username must be less than 15 characters"
      ],
      passwordRules: [
        password => !!password || "Password is required",
        password =>
          (password && password.length >= 3) ||
          "Password must be at least 3 characters"
      ]
    };
  },
  computed: {
    ...mapGetters(["loading"])
  },
  methods: {
    handleSigninUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signinUser", {
          username: this.username,
          password: this.password
        });
      }
    }
  }
};
</script>

<style scoped>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}

@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
