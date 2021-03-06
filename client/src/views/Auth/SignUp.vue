<template>
  <v-container text-xs-center
               mt-5
               pt-5>
    <v-layout row
              wrap>
      <v-flex xs12
              sm6
              offset-sm3>
        <h1>Registration</h1>
      </v-flex>
    </v-layout>

    <!-- Error alert -->
    <v-layout v-if="error"
              row
              wrap>
      <v-flex xs12
              sm6
              offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <!-- Form -->
    <v-layout row
              wrap>
      <v-flex xs12
              sm6
              offset-sm3>
        <v-card color="accent"
                dark>
          <v-container>

            <v-form @submit.prevent="handleSignUpUser"
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
                  <v-text-field prepend-icon="email"
                                type="email"
                                label="Email"
                                :rules="emailRules"
                                v-model="email"
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
                  <v-text-field prepend-icon="gavel"
                                type="password"
                                label="Confirm Password"
                                :rules="passwordConfirmRules"
                                v-model="passwordConfirm"
                                required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn type="submit"
                         color="info"
                         :loading="loading"
                         :disabled="!isFormValid || loading">
                    <span class="custom-loader"
                          slot="loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Submit
                  </v-btn>
                  <h3>Already have an account?
                    <router-link to="/signin">Signin</router-link>
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
  name: "SignUp",
  data() {
    return {
      isFormValid: false,
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      usernameRules: [
        username => !!username || "Username is required",
        username =>
          (username && username.length < 15) ||
          "Username must be less than 15 characters"
      ],
      emailRules: [
        email => !!email || "Email is required",
        email => (email && /.@+./.test(email)) || "Email must be valid"
      ],
      passwordRules: [
        password => !!password || "Password is required",
        password =>
          (password && password.length >= 3) ||
          "Password must be at least 3 characters"
      ],
      passwordConfirmRules: [
        passwordConfirm => !!passwordConfirm || "Confirm password is required",
        passwordConfirm =>
          (passwordConfirm && passwordConfirm === this.password) ||
          "Password must match"
      ]
    };
  },
  watch: {
    user(value) {
      // if user values changes, redirect to homepage
      if (value) {
        this.$router.push("/");
      }
    }
  },
  computed: {
    ...mapGetters(["user", "loading", "error"])
  },
  methods: {
    handleSignUpUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signUpUser", {
          username: this.username,
          email: this.email,
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
