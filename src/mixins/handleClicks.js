/**
 * @fileoverview Vue mixin for handling dynamic content link clicks.
 * Intercepts anchor tag clicks in dynamic content and provides internal routing
 * and external link handling with Google Analytics tracking.
 */

/**
 * Vue mixin for handling clicks on dynamically generated content links.
 * Provides intelligent routing for internal links and tracking for external files.
 *
 * @mixin
 * @displayName handleClicks
 */
export const handleClicks = {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    /**
     * Handles click events on anchor tags within dynamic content.
     * Intercepts internal links for Vue Router navigation and tracks file downloads.
     * Provides browser compatibility and handles various edge cases.
     *
     * @param {Event} $event - The click event object
     * @example
     * // Used in template with @click="handleClicks"
     * <div @click="handleClicks" class="dynamic-content" v-html="content"></div>
     */
    handleClicks($event) {
      // intercepts <a></a> tag clicks and routes within app
      // console.log($event);
      const { target } = $event;
      const href = $event.target.href;
      const mailto = /mailto/g;

      // console.log(target);
      // handle only links that occur inside the component and do not reference external resources
      if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector;
      }

      if (
        target &&
        target.matches(".dynamic-content a:not([href*='://'])") &&
        target.href &&
        !href.match(mailto)
      ) {
        // some sanity checks taken from vue-router:
        // https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
        const {
          altKey,
          ctrlKey,
          metaKey,
          shiftKey,
          button,
          defaultPrevented
        } = $event;
        // don't handle with control keys
        if (metaKey || altKey || ctrlKey || shiftKey) return;
        // don't handle when preventDefault called
        if (defaultPrevented) return;
        // don't handle right clicks
        if (button !== undefined && button !== 0) return;
        // don't handle if `target="_blank"`
        if (target && target.getAttribute) {
          const linkTarget = target.getAttribute("target");
          if (/\b_blank\b/i.test(linkTarget)) return;
        }
        // don't handle same page links/anchors
        const url = new URL(target.href);
        const to = url.pathname;
        if (window.location.pathname !== to && $event.preventDefault) {
          $event.preventDefault();

          this.$router.push(to);
        }
      }

      if (
        /^.*\.(pdf|doc|docx)$/i.test(href) &&
        href.indexOf("icjia-api.cloud") > 1
      ) {
        $event.preventDefault();
        const filename = href.split("/").pop();
        // console.log("register download event: ", filename);
        this.$ga.event({
          eventCategory: "File",
          eventAction: "Download",
          eventLabel: filename
        });
        const win = window.open(href, "_blank");
        win.focus();
      }
      // TODO: Add YouTube Event tracking
    }
  }
};
