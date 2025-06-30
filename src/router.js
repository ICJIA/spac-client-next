/**
 * @fileoverview Vue Router configuration for the SPAC application.
 * Defines all application routes with lazy loading for optimal performance.
 * Includes route guards and navigation behavior configuration.
 *
 * @author ICJIA
 * @since 1.0.0
 */

import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

/**
 * Local storage key for storing the previous route path.
 * Used for navigation history and back button functionality.
 *
 * @type {string}
 */
const LS_ROUTE_KEY = process.env.VUE_APP_LS_ROUTE_KEY;

/**
 * Vue Router instance configuration with all application routes.
 * Uses history mode for clean URLs and implements lazy loading for code splitting.
 *
 * @type {VueRouter}
 */
const router = new Router({
  mode: "history",
  // base: `${process.env.BASE_URL}`,
  /**
   * Custom scroll behavior for route navigation.
   * Always scrolls to top of page when navigating to a new route.
   *
   * @param {Route} to - Target route object
   * @param {Route} from - Current route being navigated away from
   * @param {Object} savedPosition - Saved scroll position (if any)
   * @returns {Object} Scroll position coordinates
   */
  // eslint-disable-next-line no-unused-vars
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
  routes: [
    /**
     *
     * Home
     *
     */
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        hideBreadcrumb: true
      }
    },
    { path: "/home", redirect: { name: "home" } },

    /**
     *
     * News
     *
     */
    {
      path: "/news/:slug",
      name: "newsSingle",
      component: () =>
        import(/* webpackChunkName: "news" */ "./views/NewsSingle.vue")
    },

    {
      path: "/news",
      name: "news",
      component: () => import(/* webpackChunkName: "news" */ "./views/News.vue")
    },

    /**
     *
     * Biographies
     *
     */

    // {
    //   path: "/about/council-members",
    //   name: "oversightBoard",
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "biographies" */ "./views/CouncilMembers.vue"
    //     )
    // },
    // {
    //   path: "/about/staff",
    //   name: "staff",
    //   component: () =>
    //     import(/* webpackChunkName: "biographies" */ "./views/Staff.vue")
    // },
    // {
    //   path: "/about/biographies/:slug",
    //   name: "biographiesSingle",
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "biographies" */ "./views/BiographiesSingle.vue"
    //     )
    // },
    /**
     *
     * Meetings
     *
     */
    {
      path: "/meetings",
      name: "meetings",
      component: () =>
        import(/* webpackChunkName: "meetings" */ "./views/Meetings.vue")
    },
    {
      path: "/meetings/:category/:slug",
      name: "meetingsSingle",
      component: () =>
        import(/* webpackChunkName: "meetings" */ "./views/MeetingsSingle.vue")
    },
    {
      path: "/meetings/:category",
      name: "meetingsCategory",
      component: () =>
        import(
          /* webpackChunkName: "meetings" */ "./views/MeetingsByCategory.vue"
        )
    },

    /**
     *
     * Tags
     *
     */

    {
      path: "/tags/:slug",
      name: "tagsSingle",

      component: () =>
        import(/* webpackChunkName: "tags" */ "./views/TagsSingle.vue")
    },

    /**
     *
     * Publications
     *
     */

    {
      path: "/publications",
      name: "publications",

      component: () =>
        import(
          /* webpackChunkName: "publications" */ "./views/Publications.vue"
        )
    },
    {
      path: "/publications/:category",
      name: "publicationsByCategory",

      component: () =>
        import(
          /* webpackChunkName: "publications" */ "./views/PublicationsByCategory.vue"
        )
    },
    {
      path: "/publications/:category/:slug",
      name: "publicationsSingle",

      component: () =>
        import(
          /* webpackChunkName: "publications" */ "./views/PublicationsSingle.vue"
        )
    },

    /**
     *
     * Error
     *
     */

    {
      path: "/error",
      name: "error",
      component: () =>
        import(/* webpackChunkName: "error" */ "./views/Error.vue")
    },
    /**
     *
     * Sandbox
     *
     */

    {
      path: "/sandbox",
      name: "sandbox",
      component: () =>
        import(/* webpackChunkName: "sandbox" */ "./views/Sandbox.vue")
    },
    /**
     *
     * Search
     *
     */
    {
      path: "/search",
      name: "search",
      component: () =>
        import(/* webpackChunkName: "search" */ "./views/Search.vue")
    },
    /**
     *
     * Sections/Page
     *
     */

    {
      path: "/:section",
      name: "section",
      component: () =>
        import(/* webpackChunkName: "section" */ "./views/Section.vue")
    },

    {
      path: "/:section/:slug",
      name: "page",
      component: () => import(/* webpackChunkName: "page" */ "./views/Page.vue")
    },
    /**
     *
     * Catch-all
     *
     */

    {
      path: "*",
      name: "redirect",
      component: () =>
        import(/* webpackChunkName: "error" */ "./views/Error.vue")
    }
  ]
});

/**
 * Router afterEach navigation guard.
 * Stores the previous route path in localStorage for navigation history.
 * Handles localStorage errors gracefully by logging them to console.
 *
 * @param {Route} to - Target route object being navigated to
 * @param {Route} from - Current route being navigated away from
 */
router.afterEach((to, from) => {
  try {
    localStorage.setItem(LS_ROUTE_KEY, from.path);
  } catch (e) {
    console.log(e);
  }
});

/**
 * Export the configured Vue Router instance.
 *
 * @type {VueRouter}
 */
export default router;
