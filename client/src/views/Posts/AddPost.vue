<template>
  <v-container text-xs-center
               mt-5
               pt-5>
    <v-layout row
              wrap>
      <v-flex xs12
              sm6
              offset-sm3>
        <h1 class="primary--text">Add Post</h1>
      </v-flex>
    </v-layout>

    <!-- Form -->
    <v-layout row
              wrap>
      <v-flex xs12
              sm6
              offset-sm3>

        <v-form @submit.prevent="handleAddPost"
                ref="form"
                lazy-validation
                v-model="isFormValid">

          <v-layout row>
            <v-flex xs12>
              <v-text-field type="text"
                            label="Title"
                            :rules="titleRules"
                            v-model="title"
                            required></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-text-field type="text"
                            label="Image Url"
                            :rules="imageRules"
                            v-model="imageUrl"
                            required></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <img :src="imageUrl"
                   height="300px"
                   alt="">
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-select label="Categories"
                        v-model="categories"
                        :rules="categoriesRules"
                        :items="items"
                        multiple
                        required></v-select>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-textarea label="Description"
                          :rules="descriptionRules"
                          v-model="description"
                          no-resize
                          required></v-textarea>
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
            </v-flex>
          </v-layout>

        </v-form>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AddPost",
  data() {
    return {
      isFormValid: false,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      items: [
        "Art",
        "Education",
        "Travel",
        "Photography",
        "Technology",
        "Food"
      ],
      titleRules: [
        title => !!title || "Title is required",
        title =>
          (title && title.length < 20) ||
          "Title must be less than 20 characters"
      ],
      imageRules: [
        image => !!image || "Image url is required"
        // image => (image && /.@+./.test(image)) || "Image url must be valid"
      ],
      categoriesRules: [
        categories =>
          (categories && categories.length >= 1) ||
          "At least one category is required"
      ],
      descriptionRules: [
        description => !!description || "Description is required",
        description =>
          (description && description.length < 200) ||
          "Description must be less than 200 characters"
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
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("addPost", {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          createdBy: this.user._id
        });
        this.$router.push("/");
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
