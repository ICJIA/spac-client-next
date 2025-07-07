<template>
  <div>
    <div v-if="!$browserDetect.isIE">
      <home-splash></home-splash>
      <!-- <home-insert></home-insert> -->
      <home-boxes></home-boxes>

      <home-about
        :about="about"
        :upcoming="upcoming"
        v-if="about && upcoming"
      ></home-about>
    </div>

    <div style=" background: #fff">
      <base-content :loading="loading">
        <template v-slot:content>
          <v-container fluid>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="7"
                class="mb-10"
                style="margin-top: -33px"
              >
                <div
                  class="text-xs-left mb-5 px-2"
                  style="display: flex; justify-content: space-between; padding-bottom: 7px; border-bottom: 1px solid #aaa;"
                >
                  <span
                    style="font-size: 32px; color: purple; font-weight: 900; "
                    class="news-title hover"
                    @click="$router.push('/news')"
                    >NEWS & ANALYSIS</span
                  >
                </div>
                <home-news
                  :content="news"
                  v-if="news"
                  data-aos="fade"
                ></home-news>
              </v-col>
              <v-col cols="12" sm="12" md="5" style="margin-top: -33px;">
                <div
                  class="text-xs-left mb-5 px-2"
                  style="display: flex; justify-content: space-between; padding-bottom: 7px; border-bottom: 1px solid #aaa;"
                >
                  <span
                    style="font-size: 32px; color: purple; font-weight: 900; "
                    class="news-title hover"
                    @click="$router.push('/publications')"
                    >FEATURED</span
                  >
                  <span class="hidden-sm-and-down"
                    ><v-btn
                      dark
                      small
                      color="purple lighten-1"
                      class="white--text "
                      style="padding: 0; margin: 0; margin-top: 10px"
                      @click="previousFeatured()"
                      aria-label="Navigate to Previous"
                      ><v-icon dark>navigate_before</v-icon>
                    </v-btn>

                    <v-btn
                      dark
                      small
                      color="purple lighten-1"
                      class="white--text ml-2"
                      style="padding: 0; margin: 0; margin-top: 10px"
                      aria-label="Navigate to Next"
                      @click="nextFeatured()"
                    >
                      <v-icon dark>navigate_next</v-icon>
                    </v-btn></span
                  >
                </div>
                <home-publications
                  :publications="publications"
                  :dots="dots"
                  v-if="publications"
                ></home-publications>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </base-content>
    </div>
  </div>
</template>

<script>
/**
 * @fileoverview Home page view component for the SPAC application.
 * Displays the main landing page with splash section, news, publications, and navigation boxes.
 * Manages content loading, caching, and error handling for the homepage.
 */

import HomeSplash from "@/components/HomeSplash";
import HomeBoxes from "@/components/HomeBoxes";
import HomeNews from "@/components/HomeNews";
import HomePublications from "@/components/HomePublications";
import HomeAbout from "@/components/HomeAbout";

import BaseContent from "@/components/BaseContent";
import moment from "moment";
import { EventBus } from "@/event-bus";
import {
  getPage,
  getFrontPageNews,
  getFrontPagePublications,
  getUpcomingMeetings
} from "@/services/Content";
import { getHash } from "@/services/Utilities";
// import Illinois from "@/components/Illinois";

/**
 * Home page view component for the SPAC application.
 *
 * This is the main landing page component that orchestrates the display of multiple
 * content sections including splash area, news, publications, and about information.
 * It implements intelligent content caching to optimize performance and provides
 * a responsive layout that adapts to different screen sizes.
 *
 * The component fetches data from multiple API endpoints concurrently and caches
 * the results using the Vuex store to minimize redundant network requests.
 * It also handles loading states and provides SEO-friendly metadata.
 *
 * @vue
 * @displayName Home
 * @example
 * // Used as a route component in router configuration
 * {
 *   path: '/',
 *   name: 'Home',
 *   component: Home
 * }
 */
export default {
  /**
   * Child components used in this view.
   * Each component handles a specific section of the homepage layout.
   *
   * @type {Object}
   */
  components: {
    /** Navigation boxes component for quick access to main sections */
    HomeBoxes,
    /** News articles display component */
    HomeNews,
    /** Featured publications carousel component */
    HomePublications,
    /** About section with upcoming meetings */
    HomeAbout,
    /** Hero/splash section component */
    HomeSplash,
    /** Base content wrapper with loading states */
    BaseContent
  },

  /**
   * Component's reactive data properties.
   * Manages loading states and content from various API endpoints.
   *
   * @returns {Object} The component's reactive data
   * @returns {boolean} returns.loading - Global loading state for the entire page
   * @returns {Object|null} returns.about - About page content and metadata
   * @returns {Array|null} returns.news - Array of featured news articles for homepage
   * @returns {Array|null} returns.publications - Array of featured publications for carousel
   * @returns {Array|null} returns.upcoming - Array of upcoming meetings and events
   * @returns {number} returns.dots - Number of pagination dots for publications carousel
   */
  data() {
    return {
      loading: true,
      about: null,
      news: null,
      publications: null,
      upcoming: null,
      dots: 0
    };
  },
  /**
   * Component methods for handling user interactions and component lifecycle.
   * These methods manage the featured publications carousel navigation and
   * component readiness states.
   */
  methods: {
    /**
     * Callback method triggered when featured publications component is mounted.
     * Sets the component ready state to enable user interactions.
     * This method is currently not actively used but maintained for future functionality.
     *
     * @method
     * @returns {void}
     */
    featuredPubsMounted() {
      this.ready = true;
    },

    /**
     * Navigates to the previous set of featured publications.
     * Emits an event through the EventBus to trigger carousel navigation
     * in the HomePublications component.
     *
     * @method
     * @returns {void}
     * @example
     * // Triggered by clicking the previous navigation button
     * this.previousFeatured();
     */
    previousFeatured() {
      EventBus.$emit("previousFeatured");
    },

    /**
     * Navigates to the next set of featured publications.
     * Emits an event through the EventBus to trigger carousel navigation
     * in the HomePublications component.
     *
     * @method
     * @returns {void}
     * @example
     * // Triggered by clicking the next navigation button
     * this.nextFeatured();
     */
    nextFeatured() {
      EventBus.$emit("nextFeatured");
    }
  },

  /**
   * Vue lifecycle hook - Component creation and data initialization.
   *
   * This async method orchestrates the loading of all homepage content by:
   * 1. Setting up content queries with caching keys
   * 2. Dispatching concurrent API requests through the Vuex store
   * 3. Extracting cached results and updating component data
   * 4. Calculating pagination dots for the publications carousel
   * 5. Setting up Google Analytics page tracking
   *
   * The method uses a Map-based approach to organize multiple API calls
   * with their respective caching strategies, enabling efficient content
   * loading and reducing redundant network requests.
   *
   * @async
   * @method
   * @returns {Promise<void>} Resolves when all content has been loaded and processed
   * @throws {Error} May throw if API requests fail or store operations encounter errors
   * @example
   * // This method is automatically called by Vue during component creation
   * // No manual invocation required
   */
  async created() {
    this.loading = true;

    // Create a Map to organize API queries with their caching configurations
    const contentMap = new Map();

    /**
     * Configure the about page content query.
     * Fetches the home page content including description and metadata.
     */
    contentMap.set("getPage", {
      hash: getHash("getPage-home"),
      query: getPage,
      params: { slug: "home" }
    });

    /**
     * Configure the front page news query.
     * Fetches a limited number of recent news articles for homepage display.
     * The limit is controlled by the application configuration.
     */
    contentMap.set("getFrontPageNews", {
      hash: getHash("getFrontPageNews-home"),
      query: getFrontPageNews,
      params: { limit: this.$store.getters.config.frontPageItems.news }
    });

    /**
     * Configure the front page publications query.
     * Fetches featured publications for the homepage carousel.
     */
    contentMap.set("getFrontPagePublications", {
      hash: getHash("getFrontPagePublications-home"),
      query: getFrontPagePublications,
      params: {}
    });

    /**
     * Calculate target date for upcoming meetings query.
     * Uses yesterday's date to ensure we capture meetings starting today.
     */
    const targetDate = moment()
      .subtract(1, "d")
      .format();

    /**
     * Configure the upcoming meetings query.
     * Fetches meetings and events occurring after the target date.
     */
    contentMap.set("getUpcomingMeetings", {
      hash: getHash("getUpcomingMeetings-home"),
      query: getUpcomingMeetings,
      params: { targetDate }
    });

    // Dispatch all content queries concurrently and cache the results
    await this.$store.dispatch("cacheContent", contentMap);

    /**
     * Extract cached content and assign to component data properties.
     * The store's getContentFromCache getter handles error states and
     * returns appropriate fallback values if content is unavailable.
     */
    this.about = this.$store.getters.getContentFromCache(contentMap, "getPage");

    this.news = this.$store.getters.getContentFromCache(
      contentMap,
      "getFrontPageNews"
    );

    this.publications = this.$store.getters.getContentFromCache(
      contentMap,
      "getFrontPagePublications"
    );

    this.upcoming = this.$store.getters.getContentFromCache(
      contentMap,
      "getUpcomingMeetings"
    );

    /**
     * Calculate the number of pagination dots for the publications carousel.
     * This determines how many dots appear in the carousel navigation
     * based on the total number of publications and items per page.
     */
    this.dots = Math.ceil(
      this.publications.length /
        this.$store.getters.config.frontPageItems.publications
    );

    /**
     * Set up Google Analytics page tracking for the homepage.
     * Tracks page views, title, and current URL for analytics reporting.
     */
    this.$ga.page({
      page: this.$route.path,
      title: "Home",
      location: window.location.href
    });

    // Content loading complete - hide loading indicators
    this.loading = false;
  }
};
</script>

<style>
.news-title:hover {
  text-decoration: underline;
}
</style>
