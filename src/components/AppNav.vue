<template>
  <v-app-bar color="white" fixed height="90" class="noprint">
    <v-app-bar-nav-icon
      @click="toggleDrawer"
      class="hidden-md-and-up"
      style="color: black"
      large
    ></v-app-bar-nav-icon>
    <!-- 
    <v-app-bar-nav-icon
      @click="toggleDrawer"
      style="color: black"
      large
    ></v-app-bar-nav-icon> -->

    <div style="width: 15px"></div>

    <img
      :src="require('@/assets/img/spac-purple-default.png')"
      alt="ILLINOIS SENTENCING POLICY ADVISORY COUNCIL"
      :width="logoWidth()"
      style="margin-left: -5px; margin-right: 8px;"
      class="hover"
      @click="
        $router.push('/').catch(err => {
          $vuetify.goTo(0);
        })
      "
    />&nbsp;&nbsp;&nbsp;&nbsp;
    <v-toolbar-title
      class="heavy hover"
      @click="
        $router.push('/').catch(err => {
          $vuetify.goTo(0);
        })
      "
      ><span style="color: purple" class="agency default-font"
        >ILLINOIS SENTENCING POLICY ADVISORY COUNCIL</span
      ></v-toolbar-title
    >

    <div class="flex-grow-1"></div>

    <v-toolbar-items class="hidden-sm-and-down">
      <span v-for="link in sections" :key="link.title" class="flexitem">
        <span
          v-if="
            link.displayNav &&
              link.slug !== 'publications' &&
              link.slug !== 'meetings'
          "
        >
          <v-menu offset-y left eager style="background: yellow">
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="link.hasSubMenus && link.pages.length > 0"
                depressed
                style="height: 99%; margin-bottom: 1px; margin-top: 0px; font-size: 13px; font-family: 'Lato', sans-serif !important; "
                class="heavy white default-font"
                v-on="on"
              >
                {{ link.title }}<v-icon right small>arrow_drop_down</v-icon>
              </v-btn>
              <v-btn
                v-else
                depressed
                style="height: 99%; margin-bottom: 1px; margin-top: 0px; font-size: 13px; font-family: 'Lato', sans-serif !important;"
                class="heavy white default-font"
                :to="`/${link.slug}`"
              >
                {{ link.title }}
              </v-btn>
            </template>

            <v-list nav dense flat elevation="1">
              <v-list-item-group color="primary">
                <div v-for="(subItem, i) in link.pages" :key="i">
                  <v-list-item v-if="subItem.displayNav && subItem.isPublished">
                    <v-list-item-content
                      @click="
                        $router
                          .push(`/${link.slug}/${subItem.slug}`)
                          .catch(err => {
                            $vuetify.goTo(0);
                          })
                      "
                    >
                      <v-list-item-title
                        style="font-size: 14px; font-weight: bold; "
                      >
                        <span v-if="subItem.addDivider">
                          <div class="mb-5">
                            <v-divider></v-divider>
                          </div>
                        </span>
                        {{ subItem.title }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </div>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </span>
        <span v-if="link.displayNav && link.slug === 'publications'">
          <NavPublications></NavPublications>
        </span>
        <span v-if="link.displayNav && link.slug === 'meetings'">
          <NavMeetings></NavMeetings>
        </span>
      </span>
      <v-btn depressed small color="white" to="/search" aria-label="Search SPAC"
        ><v-icon style="color: purple">search</v-icon></v-btn
      >
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
/**
 * @fileoverview Main navigation bar component for the SPAC application.
 * Displays the site logo, title, and primary navigation menu.
 * Includes responsive design with mobile drawer toggle functionality.
 */

/* eslint-disable vue/no-use-v-if-with-v-for */
import { EventBus } from "@/event-bus";
import NavPublications from "@/components/NavPublications";
import NavMeetings from "@/components/NavMeetings";

/**
 * Application navigation bar component.
 * Renders the top navigation with logo, site title, and section links.
 * Adapts to different screen sizes and provides mobile navigation toggle.
 *
 * @vue
 * @displayName AppNav
 */
export default {
  /**
   * Component props definition.
   *
   * @typedef {Object} Props
   * @property {Array} sections - Array of site sections for navigation menu
   */
  props: {
    sections: {
      type: Array,
      default: () => []
    }
  },
  components: {
    NavPublications,
    NavMeetings
  },
  methods: {
    /**
     * Toggles the mobile navigation drawer.
     * Emits an event to the EventBus to open/close the drawer.
     */
    toggleDrawer() {
      EventBus.$emit("toggleDrawer");
    },

    /**
     * Calculates the appropriate logo width based on screen size.
     * Returns smaller width for extra small screens (mobile).
     *
     * @returns {number} Logo width in pixels
     */
    logoWidth() {
      // console.log(this.$vuetify.breakpoint);
      if (this.$vuetify.breakpoint.xs) {
        return 50;
      } else {
        return 70;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
