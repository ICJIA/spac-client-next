<template>
  <v-sheet
    :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
    class="px-3 pt-3 pb-3"
  >
    <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
  </v-sheet>
</template>

<script>
export default {
  // Vuetify components provide
  // a theme variable that is
  // used to determine dark
  inject: ["theme"]
};
</script>
