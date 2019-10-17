import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  //base: `${process.env.BASE_URL}`,
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

    {
      path: "/about/council-members",
      name: "oversightBoard",
      component: () =>
        import(
          /* webpackChunkName: "biographies" */ "./views/CouncilMembers.vue"
        )
    },
    {
      path: "/about/staff",
      name: "staff",
      component: () =>
        import(/* webpackChunkName: "biographies" */ "./views/Staff.vue")
    },
    {
      path: "/about/biographies/:slug",
      name: "biographiesSingle",
      component: () =>
        import(
          /* webpackChunkName: "biographies" */ "./views/BiographiesSingle.vue"
        )
    },
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
