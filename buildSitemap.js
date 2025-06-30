/**
 * @fileoverview Build script for generating sitemap.xml and routes.json files.
 * This script fetches all published content from the GraphQL API and generates:
 * 1. A routes.json file containing all application routes
 * 2. A sitemap.xml file for search engine optimization
 *
 * @author ICJIA
 * @since 1.0.0
 */

/* eslint-disable no-console */
const { request } = require("graphql-request");
const jsonfile = require("jsonfile");
const config = require("./src/config.json");
const fs = require("fs");
const sm = require("sitemap");
// const slug = require("slug");
// slug.defaults.mode = "rfc3986";

/**
 * GraphQL API endpoint URL constructed from configuration.
 * @type {string}
 */
const api = `${config.baseURL}/graphql`;

/**
 * Directory path where the routes file will be saved.
 * @type {string}
 */
const apiDir = "./src/api";

/**
 * Filename for the generated routes JSON file.
 * @type {string}
 */
const filename = "routes.json";

/**
 * Array of content sections to process for route generation.
 * @type {string[]}
 */
const sections = ["pages", "news", "tags", "meetings", "publications"];

/**
 * Array to store all generated routes.
 * @type {string[]}
 */
const routes = [];

/**
 * Map to store last modification dates for each route.
 * Used for sitemap generation with proper lastmod values.
 * @type {Map<string, Date>}
 */
const lastModMap = new Map();

/**
 * GraphQL query to fetch all published content for route and sitemap generation.
 * Retrieves slugs and update timestamps for pages, news, publications, meetings, and tags.
 *
 * @type {string}
 */
const query = `{
  pages (where: {isPublished: true}) {
    slug
    updatedAt
    section {
      slug
    }
    
  }

  
  news: posts (where: {isPublished: true}) {
    slug
    updatedAt
  }

   publications (where: {isPublished: true}){
    slug
    category
    updatedAt
  }
  
  meetings (where: {isPublished: true}){
    slug
    category
    updatedAt
  }

 

  tags {
    slug
    updatedAt
  }
  
}`;

/**
 * Ensure the API directory exists before writing files.
 * Creates the directory if it doesn't exist.
 */
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir);
  console.log(`Created: ${apiDir}/`);
}

/**
 * Execute the GraphQL query and process the results to generate routes and sitemap.
 *
 * @async
 * @function
 * @param {string} api - GraphQL API endpoint URL
 * @param {string} query - GraphQL query string
 * @returns {Promise<void>} Promise that resolves when files are generated
 */
request(api, query).then(res => {
  sections.forEach(section => {
    const sectionRoutes = res[section].map(item => {
      let path;
      /**
       *
       * Pages
       *
       */
      if (section === "pages") {
        //   if (item.section.slug && item.section) {
        if (item.slug !== item.section.slug) {
          path = `/${item.section.slug}/${item.slug}`;
        } else {
          path = `/${item.section.slug}`;
        }
        //   }
      }

      /**
       *
       * News
       *
       */
      if (section === "news") {
        path = `/news/${item.slug}`;
      }
      /**
       *
       * Tags
       *
       */
      if (section === "tags") {
        path = `/tags/${item.slug}`;
      }
      /**
       *
       * Publications
       *
       */
      if (section === "publications") {
        const catEnum = config.strapiEnums.publications.filter(cat => {
          return item.category === cat.enum;
        });

        path = `/publications/${catEnum[0].slug}/${item.slug}`;
      }
      /**
       *
       * Meetings
       *
       */
      const catEnum = config.strapiEnums.meetings.filter(cat => {
        return item.category === cat.enum;
      });
      if (section === "meetings") {
        path = `/meetings/${catEnum[0].slug}/${item.slug}`;
      }
      lastModMap.set(`${path}`, item.updatedAt);
      return `${config.publicPath}${path}`;
    });
    routes.push(...sectionRoutes);
  });

  for (const category in config.strapiEnums) {
    const categoryRoutes = config.strapiEnums[category].map(m => {
      const singleRoute = `${config.publicPath}/${category}/${m.slug}`;
      lastModMap.set(`${singleRoute}`, new Date());
      return singleRoute;
    });
    routes.push(...categoryRoutes);
  }

  // remove dupes
  const paths = [...new Set(routes)];
  // add root
  paths.push("/");
  lastModMap.set(`/`, new Date());
  jsonfile.writeFile(`${apiDir}/${filename}`, paths, function(err) {
    if (err) console.error(err);
    console.log(`Created: ${apiDir}/${filename}`);
  });

  const urls = paths.map(route => {
    const obj = {};
    obj.url = route;
    obj.changefreq = "weekly";
    obj.priority = 0.5;
    obj.lastmod = lastModMap.get(route);
    return obj;
  });

  const sitemap = sm.createSitemap({
    hostname: `${config.clientURL}`,
    cacheTime: 600000, // 600 sec (10 min) cache purge period
    urls
  });

  fs.writeFileSync("./public/sitemap.xml", sitemap.toString());
  console.log(`Created: ./public/sitemap.xml`);
});
