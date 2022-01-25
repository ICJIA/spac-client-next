<template>
  <v-alert v-model="alert" text dismissible color="info" class="mb-0">
    <div style="color: #000 !important">
      <v-icon color="red">error</v-icon>

     Anyone, 5 years of age and older, is eligible to receive the COVID-19 vaccine. Find your nearest vaccination location at

      <a
        href="https://vaccines.gov" target="_blank" 
        style="text-decoration: underline;"
        >vaccines.gov</a
      >.
    </div>
  </v-alert>
</template>

<script>
export default {
  data() {
    return {
      alert: true
    };
  },
  methods: {
    reset() {
      this.alert = true;
    }
  }
};
</script>
