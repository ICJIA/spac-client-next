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
            <v-col :[dynamicFlex]="true" order-md="1" order="2" order-sm="2">
              <div
                @click="handleClicks"
                class="dynamic-content"
                v-html="renderToHtml(content[0].content)"
                v-if="content[0].content"
              ></div>

              <div
                v-for="category in $store.getters.config.strapiEnums
                  .publications"
                :key="category.enum"
              >
                <h2 :id="category.slug" class="mt-8">{{ category.title }}</h2>

                {{ category.description }}

                <DetailTablePublication
                  :publications="filterPublicationData(category.enum)"
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
                ></DetailTablePublication>
              </div>
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="2"
              order-md="2"
              order="1"
              order-sm="1"
              v-if="showToc"
              ><TOC selector="#scrollArea" top="#baseContentTop"></TOC
            ></v-col>
          </v-row>
        </v-container>
      </template>
    </base-content>
  </div>
</template>

<script>
import BaseContent from "@/components/BaseContent";
import DetailTablePublication from "@/components/DetailTablePublication";
import { EventBus } from "@/event-bus";
import TOC from "@/components/TOC";
import { getPageBySection, getAllPublications } from "@/services/Content";
import { getHash, checkIfValidPage } from "@/services/Utilities";
import { renderToHtml } from "@/services/Markdown";
import { handleClicks } from "@/mixins/handleClicks";

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
      displayMode: {},
      title: ""
    };
  },
  components: {
    BaseContent,
    TOC,

    DetailTablePublication
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
    dynamicFlex() {
      if (this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm) {
        return "xs12";
      } else if (this.displayMode.message === "By Date") {
        return "xs12";
      } else {
        return this.showToc ? "xs10" : "xs12";
      }
    }
  },

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
      this.title = "Publications";
      this.$ga.page({
        page: this.$route.path,
        title: "Publications",
        location: window.location.href
      });
      this.loading = false;
    },
    filterPublicationData(categoryEnum) {
      return this.publications.filter(publication => {
        return publication.category === categoryEnum;
      });
    }
  }
};
</script>

<style></style>
