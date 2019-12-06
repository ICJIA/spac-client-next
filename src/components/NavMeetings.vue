<template>
  <v-menu offset-y left eager>
    <template v-slot:activator="{ on }">
      <v-btn
        depressed
        style="height: 99%; margin-bottom: 1px; margin-top: 0px; font-size: 13px; font-family: 'Lato', sans-serif !important; "
        class="heavy white default-font"
        v-on="on"
      >
        Meetings&nbsp;<v-icon right small>arrow_drop_down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(item, index) in items" :key="index">
        <v-list-item-content
          @click="
            $router.push(`/meetings/${item.slug}`).catch(err => {
              $vuetify.goTo(0);
            })
          "
        >
          <v-list-item-title
            style="font-size: 14px; font-weight: bold; "
            class="hover"
          >
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-title
          style="font-size: 14px; font-weight: bold; "
          class="hover"
          @click="
            $router.push(`/meetings`).catch(err => {
              $vuetify.goTo(0);
            })
          "
          >All meetings</v-list-item-title
        >
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    items: () => []
  }),
  mounted() {
    this.items = this.$store.getters.config.strapiEnums["meetings"].filter(
      m => {
        return m.displayNav === true;
      }
    );
  }
};
</script>
