<template>
  <div style="" class="searchContainer">
    <v-text-field
      ref="textfield"
      v-model="query"
      class="pt-3"
      dense
      append-icon="search"
      :clearable="true"
      placeholder="Search SPAC"
      label="Search"
      @keyup="instantSearch"
    >
    </v-text-field>

    <v-card
      v-if="query && query.length"
      style="position: absolute; margin-top: -5px; margin-left: -12px; width: 50%; postition: absolute; top: 82px; width: 100%; z-index: 500000; "
      class="py-2 mr-5 text-xs-left"
    >
      <base-list :items="queryResults" empty="">
        <template slot-scope="item">
          <div
            class="px-8 py-2 lato hover background text-left"
            @click="route(item)"
            style="font-size: 14px; font-weight: bold;"
          >
            <span v-if="item.parentPath === '/about/biographies'">
              {{ item.firstName }}&nbsp;{{ item.middleName }}&nbsp;{{
                item.lastName
              }}</span
            >
            <span v-else-if="item.parentPath === '/tags'">
              Tag: {{ item.name }}</span
            >
            <span v-else>
              {{ item.title }}
            </span>
          </div>
        </template>
      </base-list>
      <!-- <v-divider></v-divider>
      <div
        class="px-8 py-2 lato hover background text-left"
        style="font-size: 14px; font-weight: bold;"
      >
        Full site search
      </div> -->
    </v-card>
  </div>
</template>

<script>
/**
 * @fileoverview Mini search component for the SPAC application navigation.
 * Provides a compact search interface with dropdown results and keyboard navigation.
 * Integrates with the main search functionality and EventBus for communication.
 */

import Fuse from "fuse.js";
import BaseList from "@/components/BaseList";
import { getSearchIndex } from "@/services/Search";
import { addAttributeToElement } from "@/services/Utilities";
import { EventBus } from "@/event-bus";

/**
 * Mini search component for navigation bar.
 * Provides compact search with dropdown results and keyboard shortcuts.
 * Loads search index and provides real-time search suggestions.
 *
 * @vue
 * @displayName SearchMini
 */
export default {
  components: {
    BaseList
  },
  async created() {
    this.searchContent = await getSearchIndex();

    this.fuse = await new Fuse(
      this.searchContent,
      this.$store.getters.config.search
    );
  },
  async mounted() {
    // this.$nextTick(() => {
    //   this.$refs.textfield.focus()
    // })
    addAttributeToElement("v-text-field", "aria-label", "Search")();
    addAttributeToElement("v-icon--link", "aria-label", "Search")();
    addAttributeToElement("v-icon", "aria-label", "Search")();
    EventBus.$on("hideQuery", () => {
      this.hideQuery();
    });
    // if (this.searchQuery) {
    //   this.query = this.searchQuery;
    //   this.$nextTick(() => {
    //     this.$refs.textfield.focus();
    //   });
    //   this.instantSearch();
    // }
    window.onscroll = () => {
      /**
       * hide search card on scroll only on md or lg screens
       */
      if (this.$vuetify.breakpoint.md || this.$vuetify.breakpoint.lg) {
        this.hideQuery();
      }
    };
  },
  data() {
    return {
      query: "",
      queryResults: [],
      content: "",
      config: null,
      searchContent: [],
      fuse: null
    };
  },
  methods: {
    instantSearch() {
      this.queryResults = this.fuse.search(this.query).slice(0, 3);
    },
    hideQuery() {
      this.query = "";
      this.queryResults = [];
    },
    route(item) {
      if (!item.slug) return;
      if (item.parentPath === "/") {
        this.$ga.event({
          eventCategory: "Search Conversion (Home)",
          eventAction: "Click",
          eventLabel: "Query: '" + this.query + "' --> " + item.slug
        });
        this.$router.push(`/${item.slug}`);
      } else {
        this.$ga.event({
          eventCategory: "Search Conversion (Home)",
          eventAction: "Click",
          eventLabel:
            "Query: '" +
            this.query +
            "' --> " +
            `${item.parentPath}/${item.slug}`
        });
        this.$router.push(`${item.parentPath}/${item.slug}`);
      }
    }
  }
};
</script>

<style>
.background:hover {
  background: #efefef;
}
.searchContainer {
  z-index: unset;
  left: 16.5%;
  width: 66.66%;
}

@media only screen and (max-width: 600px) {
  .searchContainer {
    left: 0%;
    width: 100%;
  }
}
</style>
