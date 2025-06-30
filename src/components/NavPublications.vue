<template>
  <v-menu offset-y left eager>
    <template v-slot:activator="{ on }">
      <v-btn
        depressed
        style="height: 99%; margin-bottom: 1px; margin-top: 0px; font-size: 13px; font-family: 'Lato', sans-serif !important; "
        class="heavy white default-font"
        v-on="on"
      >
        Publications&nbsp;<v-icon right small>arrow_drop_down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(item, index) in items" :key="index">
        <v-list-item-content
          @click="
            $router.push(`/publications/${item.slug}`).catch(err => {
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
          @click="$router.push('/publications')"
          >All publications</v-list-item-title
        >
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
/**
 * @fileoverview Navigation dropdown component for publications section.
 * Provides a dropdown menu with publication categories and navigation links.
 * Filters and displays available publication types from the store configuration.
 */

/**
 * Publications navigation dropdown component.
 * Displays a dropdown menu with different publication categories.
 * Loads publication types from store configuration and provides navigation.
 *
 * @vue
 * @displayName NavPublications
 */
export default {
  data: () => ({
    items: () => []
  }),
  mounted() {
    this.items = this.$store.getters.config.strapiEnums["publications"].filter(
      pub => {
        return pub.displayNav === true;
      }
    );
  }
};
</script>
