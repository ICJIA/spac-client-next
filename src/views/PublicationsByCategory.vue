<template>
  <div>
    <base-content :loading="loading" id="baseContentTop">
      <template v-slot:title>
        <v-container :fluid="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm">
          <v-row>
            <v-col cols="12">
              <h1 class="page-title">{{ categoryTitle }}</h1>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:content>
        <v-container
          id="scrollArea"
          :fluid="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
        >
          <v-row>
            <v-col xs12 order-md="1" order="2" order-sm="2">
              <div
                @click="handleClicks"
                class="dynamic-content"
                v-html="categoryDescription"
              ></div>

              <ListTablePublication
                :items="publicationsSorted"
                :sortBy="title"
                class="mt-8 "
              ></ListTablePublication>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </base-content>
  </div>
</template>

<script>
import BaseContent from "@/components/BaseContent";
import ListTablePublication from "@/components/ListTablePublication";
import { EventBus } from "@/event-bus";
import { getPublicationsByCategory } from "@/services/Content";
import {
  getHash,
  checkIfValidPage,
  strapiSlugToObject
} from "@/services/Utilities";
import { renderToHtml } from "@/services/Markdown";
import { handleClicks } from "@/mixins/handleClicks";
// eslint-disable-next-line no-unused-vars
import { sortBy } from "lodash";

export default {
  mixins: [handleClicks],
  watch: {
    $route: "fetchContent"
  },
  metaInfo() {
    return {
      title: this.computedTitle
    };
  },
  data() {
    return {
      loading: true,
      content: null,
      checkIfValidPage,
      renderToHtml,
      showToc: true,
      sectionContent: null,
      publications: null,
      displayMode: {},
      categoryTitle: "",
      categoryDescription: "undefined",
      title: "",
      publicationsSorted: null
    };
  },
  components: {
    BaseContent,
    ListTablePublication
  },
  created() {
    this.fetchContent();
  },
  mounted() {
    EventBus.$on("toggle", payload => {
      this.displayMode = payload;
    });
  },
  computed: {
    computedTitle() {
      return this.title;
    }
  },

  methods: {
    async fetchContent() {
      this.loading = true;

      const contentMap = new Map();
      const category = strapiSlugToObject(
        "publications",
        this.$route.params.category
      );

      if (category.length) {
        let strapiEnumCategory = category[0].enum;
        this.categoryTitle = category[0].title;
        this.categoryDescription = category[0].description;
        const name = `getPublicationsByCategory-${strapiEnumCategory}`;
        contentMap.set(name, {
          hash: getHash(name),
          query: getPublicationsByCategory,
          params: { strapiEnumCategory }
        });
        await this.$store.dispatch("cacheContent", contentMap);
        this.publications = this.$store.getters.getContentFromCache(
          contentMap,
          name
        );

        this.publicationsSorted = sortBy(
          sortBy(this.publications, "title").reverse(),
          "year"
        ).reverse();
        this.title = category[0].title;
        this.$ga.page({
          page: this.$route.path,
          title: category[0].title,
          location: window.location.href
        });
        this.loading = false;
      } else {
        this.routeToError();
      }
    },
    routeToError() {
      this.content = null;
      this.loading = false;
      this.$router
        .push({
          name: "error",
          params: {
            msg: "Page not found",
            statusCode: 404,
            debug: this.$route.params
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(err => {});
    }
  }
};
</script>

<style></style>
