<template>
  <div>
    <base-content :loading="loading" id="baseContentTop">
      <template v-slot:title>
        <v-container
          v-if="content"
          :fluid="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
        >
          <v-row>
            <v-col cols="12">
              <h1 class="page-title">{{ content[0].title }}</h1>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:content>
        <v-container
          v-if="content"
          id="scrollArea"
          :fluid="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
        >
          <v-row>
            <v-col
              cols="12"
              sm="12"
              :md="dynamicFlex()"
              order-md="1"
              order="2"
              order-sm="2"
            >
              <div
                @click="handleClicks"
                class="dynamic-content"
                v-html="renderToHtml(content[0].content)"
                v-if="content[0].content"
              ></div>
              <toggle
                toggleOn="By Category"
                toggleOff="By Year"
                name="meetings"
                class="mt-10"
              ></toggle>
              <div v-if="displayMode.message === 'By Category'">
                <div
                  v-for="category in $store.getters.config.strapiEnums
                    .publications"
                  :key="category.enum"
                >
                  <h2 :id="category.slug" class="mt-8">{{ category.title }}</h2>

                  {{ category.description }}

                  <ListTablePublication
                    :items="filterPublicationData(category.enum)"
                    class="mt-8 "
                    :hideCategory="true"
                    :class="{
                      'pl-6':
                        $vuetify.breakpoint.md ||
                        $vuetify.breakpoint.lg ||
                        $vuetify.breakpoint.xl,
                      'pr-6':
                        $vuetify.breakpoint.md ||
                        $vuetify.breakpoint.lg ||
                        $vuetify.breakpoint.xl
                    }"
                  ></ListTablePublication>
                </div>
              </div>
              <div v-if="displayMode.message === 'By Year'">
                <ListTablePublication
                  :items="publicationsSorted"
                  class="mt-8 "
                  :class="{
                    'pl-6':
                      $vuetify.breakpoint.md ||
                      $vuetify.breakpoint.lg ||
                      $vuetify.breakpoint.xl,
                    'pr-6':
                      $vuetify.breakpoint.md ||
                      $vuetify.breakpoint.lg ||
                      $vuetify.breakpoint.xl
                  }"
                ></ListTablePublication>
              </div>
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="2"
              order-md="2"
              order="1"
              order-sm="1"
              v-if="showToc && displayMode.message === 'By Category'"
              ><TOC
                selector="#scrollArea"
                top="#baseContentTop"
                tocHeading="Categories"
              ></TOC
            ></v-col>
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
// eslint-disable-next-line no-unused-vars
import { sortBy } from "lodash";
import TOC from "@/components/TOC";
import { getPageBySection, getAllPublications } from "@/services/Content";
import { getHash, checkIfValidPage } from "@/services/Utilities";
import { renderToHtml } from "@/services/Markdown";
import { handleClicks } from "@/mixins/handleClicks";
import Toggle from "@/components/Toggle";

export default {
  mixins: [handleClicks],
  metaInfo() {
    return {
      title: this.title
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
      publicationsSorted: null,
      displayMode: {},
      title: ""
    };
  },
  components: {
    BaseContent,
    TOC,
    Toggle,

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
  computed: {},

  methods: {
    async fetchContent() {
      this.loading = true;

      const contentMap = new Map();
      const section = "publications";
      const slug = "publications";

      const name = `getPageBySection-${section}${slug}`;
      contentMap.set(name, {
        hash: getHash(name),
        query: getPageBySection,
        params: { section, slug }
      });

      const publicationsName = "getAllPublications";
      contentMap.set(publicationsName, {
        hash: getHash(publicationsName),
        query: getAllPublications,
        params: {}
      });

      await this.$store.dispatch("cacheContent", contentMap);

      this.sectionContent = this.$store.getters.getContentFromCache(
        contentMap,
        name
      );
      this.content = this.sectionContent[0].pages;

      this.publications = this.$store.getters.getContentFromCache(
        contentMap,
        publicationsName
      );

      this.publicationsSorted = sortBy(
        sortBy(this.publications, "title").reverse(),
        "year"
      ).reverse();
      this.title = "Publications";
      this.$ga.page({
        page: this.$route.path,
        title: "Publications",
        location: window.location.href
      });
      this.loading = false;
    },
    dynamicFlex() {
      if (this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm) {
        return "12";
      } else {
        if (this.displayMode.message === "By Category") {
          return "10";
        } else {
          return "12";
        }
      }
    },
    filterPublicationData(categoryEnum) {
      return this.publicationsSorted.filter(publication => {
        return publication.category === categoryEnum;
      });
    }
  }
};
</script>

<style></style>
