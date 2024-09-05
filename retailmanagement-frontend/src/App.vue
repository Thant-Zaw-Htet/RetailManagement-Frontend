<template>
  <v-app>
    <v-main class="white-background">
      <router-view />
      
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
.white-background {
  background-color: white;
  min-height: 100vh; 
}
</style>
