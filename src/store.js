/**
 * @fileoverview Vuex store configuration for the SPAC application.
 * Manages global application state including configuration, routes, search index,
 * caching, and API status. Provides centralized state management for all components.
 *
 * @author ICJIA
 * @since 1.0.0
 */

/* eslint-disable no-console */
import Vue from "vue";
import Vuex from "vuex";
const config = require("@/config.json");
const LS_ROUTE_KEY = process.env.VUE_APP_LS_ROUTE_KEY;
// console.log("LS_ROUTE_KEY", LS_ROUTE_KEY);

Vue.use(Vuex);

/**
 * Builds the URL for the status endpoint based on current environment.
 * Uses localhost for development and production URL for deployed environments.
 *
 * @function
 * @returns {string} The complete URL for the status endpoint
 */
// eslint-disable-next-line no-unused-vars
function buildStatusUrl() {
  let url;
  const endpoint = ".netlify/functions/status";
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    url = `http://localhost:9000/${endpoint}`;
  } else {
    url = `${config.clientURL}${config.publicPath}${endpoint}`;
  }

  return url;
}

/**
 * Fetches data from a given endpoint and returns parsed JSON.
 * Generic utility function for making API calls.
 *
 * @async
 * @function
 * @param {string} endpoint - The API endpoint URL to fetch from
 * @returns {Promise<Object>} Parsed JSON response from the endpoint
 */
// eslint-disable-next-line no-unused-vars
async function fetchData(endpoint) {
  // eslint-disable-next-line no-unused-vars
  let data;
  const response = await fetch(endpoint);
  return (data = await response.json());
}

/**
 * Main Vuex store instance for the SPAC application.
 * Manages all global state, mutations, actions, and getters.
 *
 * @type {Store}
 */
export default new Vuex.Store({
  /**
   * Application state object containing all global state properties.
   *
   * @type {Object}
   * @property {boolean} isAppReady - Whether the application has finished initialization
   * @property {Object|null} config - Application configuration object
   * @property {Array|null} routes - Available routes data from API
   * @property {Array|null} sections - Site sections data
   * @property {Array|null} searchIndex - Search index data for site search
   * @property {string|null} lastDeploy - Timestamp of last deployment
   * @property {string|null} lastBuild - Timestamp of last build
   * @property {number|null} apiStatus - Current API status code
   * @property {Map} cache - Map object for caching API responses
   * @property {Object|null} selectedCountyData - Currently selected county data
   * @property {string} jwt - JWT token from localStorage
   * @property {Object|string} userMeta - User metadata from localStorage
   */
  state: {
    isAppReady: false,
    config: null,
    routes: null,
    sections: null,
    searchIndex: null,
    lastDeploy: null,
    lastBuild: null,
    apiStatus: null,
    cache: new Map(),
    selectedCountyData: null,
    jwt: localStorage.getItem("jwt") || "",
    userMeta: JSON.parse(localStorage.getItem("userMeta")) || ""
  },
  /**
   * Vuex mutations for synchronously modifying state.
   * All state changes must go through mutations to maintain reactivity.
   */
  mutations: {
    /**
     * Clears the application cache Map.
     *
     * @param {Object} state - Vuex state object
     */
    CLEAR_CACHE(state) {
      state.cache.clear();
      if (state.config.debug) {
        console.log("Cache cleared");
      }
    },

    /**
     * Removes the route key from localStorage.
     *
     * @param {Object} state - Vuex state object
     */
    CLEAR_LOCAL_STORAGE(state) {
      localStorage.removeItem(LS_ROUTE_KEY);
      if (state.config.debug) {
        console.log("Local storage cleared");
      }
    },

    /**
     * Sets the application ready state.
     *
     * @param {Object} state - Vuex state object
     * @param {boolean} bool - Whether the app is ready
     */
    SET_APP_READY(state, bool) {
      state.isAppReady = bool;
      if (state.config.debug) {
        console.log("isAppReady", bool);
      }
    },
    /**
     * Sets the application configuration.
     *
     * @param {Object} state - Vuex state object
     * @param {Object} config - Configuration object
     */
    SET_CONFIG(state, config) {
      state.config = config;
      if (state.config.debug) {
        console.log("Config loaded");
      }
    },

    /**
     * Sets the routes data from API.
     *
     * @param {Object} state - Vuex state object
     * @param {Array} routes - Routes array from API
     */
    SET_ROUTES(state, routes) {
      state.routes = routes;
      if (state.config.debug) {
        console.log("Routes loaded");
      }
    },

    /**
     * Sets the search index data.
     *
     * @param {Object} state - Vuex state object
     * @param {Array} searchIndex - Search index array
     */
    SET_SEARCH_INDEX(state, searchIndex) {
      state.searchIndex = searchIndex;
      if (state.config.debug) {
        console.log("Search index loaded");
      }
    },
    /**
     * Caches a query result with its hash key.
     *
     * @param {Object} state - Vuex state object
     * @param {Object} payload - Cache payload object
     * @param {string} payload.hash - Hash key for the cached item
     * @param {*} payload.query - Query result to cache
     */
    SET_CACHE(state, { hash, query }) {
      state.cache.set(hash, query);
      // console.log(hash, ": cached");
    },

    /**
     * Sets the sections data.
     *
     * @param {Object} state - Vuex state object
     * @param {Array} sections - Sections array
     */
    SET_SECTIONS(state, sections) {
      state.sections = sections;
      if (state.config.debug) {
        console.log("Sections loaded");
      }
    },

    /**
     * Sets the API status code.
     *
     * @param {Object} state - Vuex state object
     * @param {number} apiStatus - HTTP status code
     */
    SET_API_STATUS(state, apiStatus) {
      state.apiStatus = apiStatus;
      if (state.config.debug) {
        console.log("API status code: ", apiStatus);
      }
    },

    /**
     * Sets the selected county data.
     *
     * @param {Object} state - Vuex state object
     * @param {Object} payload - County data object
     */
    SET_SELECTED_COUNTY_DATA(state, payload) {
      state.selectedCountyData = payload;
      // console.log("Selected county data: ", payload);
    }
  },
  actions: {
    async initApp({ commit }) {
      commit("CLEAR_CACHE");
      commit("CLEAR_LOCAL_STORAGE");
      commit("SET_APP_READY", true);
    },
    async setApiStatus({ state, commit }) {
      // try {
      //   let status = await fetchData(buildStatusUrl());
      //   let apiStatus = status.filter(server => {
      //     if (server.server === "api") {
      //       return server;
      //     }
      //   });
      //   if (apiStatus.length) {
      //     console.log("Successfully connected to status server.");
      //     commit("SET_API_STATUS", apiStatus[0]["status"]);
      //   } else {
      //     console.error("Status server error");
      //     commit("SET_API_STATUS", 500);
      //   }
      // } catch (e) {
      //   console.log("Can't connect to status server.");
      //   console.log(e);
      //   commit("SET_API_STATUS", 500);
      // }
      commit("SET_API_STATUS", 200);
      if (state.config.debug) {
        console.log("status server bypassed");
      }
    },
    setConfig({ commit }, config) {
      commit("SET_CONFIG", config);
    },
    setRoutes({ commit }, routes) {
      commit("SET_ROUTES", routes);
    },
    setSearchIndex({ commit }, searchIndex) {
      commit("SET_SEARCH_INDEX", searchIndex);
    },
    setSections({ commit }, sections) {
      commit("SET_SECTIONS", sections);
    },
    setSelectedCountyData({ commit }, payload) {
      commit("SET_SELECTED_COUNTY_DATA", payload);
    },
    // eslint-disable-next-line no-unused-vars
    async cacheContent({ commit, state, getters }, contentMap) {
      const start = new Date();
      // eslint-disable-next-line prefer-const
      let queries = [],
        res,
        end,
        // eslint-disable-next-line prefer-const
        hashes = [];

      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of contentMap.entries()) {
        let params;
        if (!value.hash) {
          throw "Hash must be specified";
        }
        if (!value.query) {
          throw "Query must be specified";
        }

        value.params ? (params = value.params) : (params = {});
        if (!getters.inCache(value.hash, state.cache)) {
          hashes.push(value.hash);
          queries.push(value.query.call(this, params));
        } else {
          // console.log("already in cache");
        }
      }

      if (queries.length) {
        res = await Promise.all(queries);
        res.forEach((query, index) => {
          const cacheObj = {};
          cacheObj.hash = hashes[index];
          cacheObj.query = query;
          commit("SET_CACHE", cacheObj);
        });
        end = new Date() - start;

        const metaInfo = {
          itemsCached: res.length,
          totalCacheSize: state.cache.size,
          millisecondsToComplete: end,
          previouslyCached: false
        };

        if (state.config.debug) {
          console.log(metaInfo);
        }

        return metaInfo;
      } else {
        end = new Date() - start;
        const metaInfo = {
          itemsCached: queries.length,
          totalCacheSize: state.cache.size,
          millisecondsToComplete: end,
          previouslyCached: true
        };
        if (state.config.debug) {
          console.log(metaInfo);
        }
        return metaInfo;
      }
    }
  },
  getters: {
    // eslint-disable-next-line no-unused-vars
    inCache: state => hash => {
      return state.cache.has(hash);
    },
    isApiReady: state => {
      if (state.apiStatus === 200 || state.apiStatus === 204) {
        return true;
      } else {
        return false;
      }
    },
    config: state => {
      return state.config;
    },
    selectedCountyData: state => {
      return state.selectedCountyData;
    },
    sections: state => {
      return state.sections;
    },
    debug: state => {
      return state.config.debug;
    },
    getContentFromCache: state => (map, key) => {
      if (map.get(key)) {
        const content = state.cache.get(map.get(key).hash);
        return content;
      } else {
        return [];
      }
    }
  }
});
