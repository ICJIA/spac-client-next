<template>
  <div>
    <base-content :loading="loading" id="baseContentTop">
      <template v-slot:content>
        <v-container
          id="scrollArea"
          :fluid="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
        >
          <v-row>
            <v-col xs12 order-md="1" order="2" order-sm="2">
              <PubPreview :item="publication[0]"></PubPreview>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </base-content>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import BaseContent from "@/components/BaseContent";
import PubPreview from "@/components/PubPreview";
import { EventBus } from "@/event-bus";
import { getSinglePublication } from "@/services/Content";
import { getHash, checkIfValidPage } from "@/services/Utilities";
import { renderToHtml } from "@/services/Markdown";
import { handleClicks } from "@/mixins/handleClicks";

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

      publication: null,
      displayMode: {},
      title: ""
    };
  },
  components: {
    BaseContent,
    PubPreview
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
      const slug = this.$route.params.slug;

      const name = `getSinglePublication-${slug}`;
      contentMap.set(name, {
        hash: getHash(name),
        query: getSinglePublication,
        params: { slug }
      });
      await this.$store.dispatch("cacheContent", contentMap);
      this.publication = this.$store.getters.getContentFromCache(
        contentMap,
        name
      );
      if (!this.publication.length) {
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

      this.title = this.publication[0].title;
      this.$ga.page({
        page: this.$route.path,
        title: this.title,
        location: window.location.href
      });

      this.loading = false;
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
