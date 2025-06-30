<template>
  <v-app id="page-top">
    <app-nav :sections="sections"></app-nav>
    <app-drawer :sections="sections"></app-drawer>

    <breadcrumb></breadcrumb>
    <!-- <outdated-browser v-if="$browserDetect.isIE"></outdated-browser> -->
    <div v-if="!loading">
      <v-main
        id="content-top"
        aria-live="polite"
        style="background: #fafafa; min-height: 100vh"
      >
        <!-- <Corona ref="alert" />
        <Census :key="$route.path"></Census> -->
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-main>

      <app-footer :sections="sections"></app-footer>
    </div>
    <div v-if="loading">
      <v-container>
        <v-row>
          <v-col class="text-center">
            <div style="margin-top: 150px;">
              <loader></loader>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script>
/**
 * @fileoverview Root Vue component for the SPAC application.
 * Manages application initialization, loading states, and provides the main layout structure.
 * Handles configuration loading, search index setup, and section data management.
 */

import AppNav from "@/components/AppNav";
// import Census from "@/components/Census";
import AppDrawer from "@/components/AppDrawer";
import AppFooter from "@/components/AppFooter";
import Breadcrumb from "@/components/Breadcrumb";
import Loader from "@/components/Loader";
// import Corona from "@/components/Corona";
// import OutdatedBrowser from "@/components/OutdatedBrowser";
import { getAllSections } from "@/services/Content";

/**
 * Root Vue component that serves as the main application wrapper.
 * Initializes the application state, loads configuration and content,
 * and provides the base layout structure for all pages.
 *
 * @vue
 * @displayName App
 */
export default {
  name: "App",
  /**
   * Vue Meta configuration for SEO and document head management.
   * Sets default title, meta tags, and canonical URL for the application.
   *
   * @returns {Object} Meta information object for vue-meta
   */
  metaInfo() {
    return {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: "Illinois Sentencing Policy Advisory Council",
      // all titles will be injected into this template
      titleTemplate: "SPAC | %s",
      htmlAttrs: {
        lang: "en"
      },
      link: [{ rel: "canonical", href: this.canonical }],
      meta: [
        { charset: "utf-8" },
        {
          vmid: "robots",
          name: "robots",
          content: "index, follow"
        },
        {
          vmid: "description",
          name: "description",
          content:
            "The Illinois Sentencing Policy Advisory Council (SPAC) was created to more accurately determine the consequences of sentencing policy decisions. "
        }
      ]
    };
  },
  components: {
    AppNav,
    AppDrawer,
    AppFooter,
    Breadcrumb,
    Loader
  },
  methods: {},
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      this.canonical = this.$store.getters.config.clientURL + this.$route.path;
      console.log("Canonical: ", this.canonical);
      if (this.$refs.alert) this.$refs.alert.reset();
    }
  },
  async mounted() {},
  /**
   * Vue created lifecycle hook - initializes the application.
   * Loads configuration, search index, sections data, and sets up the store.
   * Only runs if the application hasn't been initialized yet.
   *
   * @async
   */
  async created() {
    this.loading = true;

    if (!this.$store.state.isAppReady) {
      const configPromise = process.BROWSER_BUILD
        ? import("@/config.json")
        : Promise.resolve(require("@/config.json"));
      const config = await configPromise;
      this.$store.dispatch("setConfig", config);
      this.sections = config.sections;
      this.canonical = config.clientURL + this.$route.path;

      // eslint-disable-next-line no-console
      console.log("Debug: ", this.$store.getters.debug);
      // const routesPromise = process.BROWSER_BUILD
      //   ? import("@/api/routes.json")
      //   : Promise.resolve(require("@/api/routes.json"));
      // let routes = await routesPromise;
      // this.$store.dispatch("setRoutes", routes);

      const searchIndexPromise = process.BROWSER_BUILD
        ? import("@/api/searchIndex.json")
        : Promise.resolve(require("@/api/searchIndex.json"));
      const searchIndex = await searchIndexPromise;
      this.$store.dispatch("setSearchIndex", searchIndex);

      this.sections = await getAllSections();

      // Change 'News' label to 'Announcements' in navigation
      this.sections.forEach(section => {
        if (section.slug === "news") {
          section.title = "Announcements";
        }
      });

      this.$store.dispatch("setSections", this.sections);

      await this.$store.dispatch("setApiStatus");

      this.$store.dispatch("initApp");
      this.loading = false;
    }
  },
  data() {
    return {
      sections: [],
      loading: true,
      test: [],
      env: process.env.NODE_ENV,
      canonical: null
    };
  }
};
</script>
<style></style>
