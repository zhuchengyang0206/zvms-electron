<template>
  <v-container>
    <v-card color="rgba(255, 255, 255, 0.8)" style="backdrop-filter: blur(2px);">
      <v-card-title>这是标题</v-card-title>
      <v-card-text>这是内容啊</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "home",

  mounted: function () {
    this.redirectLogin();
  },
  methods: {
    redirectLogin: function () {
      if (this.$store.state.isLogined == false) {
        this.$router.push("/login");
      } else {
        this.$router.push("/me");
      }
    },
  },
};
</script>
