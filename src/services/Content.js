/**
 * @fileoverview Content service for the SPAC application.
 * Provides functions to fetch various types of content from the GraphQL API including
 * pages, news posts, publications, meetings, biographies, and site descriptions.
 * All functions include XSS protection and error handling with EventBus notifications.
 *
 * @author ICJIA
 * @since 1.0.0
 */

/* eslint-disable no-console */
/* eslint-disable no-unreachable */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { EventBus } from "@/event-bus";
const config = require("@/config.json");
const xss = require("xss");

const axios = require("axios");

/**
 * Axios instance configured for GraphQL API requests.
 * Includes base URL from configuration and 10-second timeout.
 *
 * @type {AxiosInstance}
 */
const api = axios.create({
  baseURL: config.baseURL,
  timeout: 10000
});

/**
 * Request interceptor to start NProgress loading indicator.
 *
 * @param {Object} config - Axios request configuration
 * @returns {Object} Modified request configuration
 */
api.interceptors.request.use(config => {
  NProgress.start();
  return config;
});

/**
 * Response interceptor to complete NProgress loading indicator.
 *
 * @param {Object} response - Axios response object
 * @returns {Object} Unmodified response object
 */
api.interceptors.response.use(response => {
  NProgress.done();
  return response;
});

/**
 * Generic function to execute GraphQL queries against the API.
 *
 * @async
 * @function
 * @param {string} query - GraphQL query string
 * @returns {Promise<Object>} API response containing query results
 */
async function queryEndpoint(query) {
  const content = await api({
    url: "/graphql",
    method: "post",
    data: {
      query
    }
  });
  return content;
}

/**
 * Builds GraphQL query to fetch a single page by slug.
 *
 * @function
 * @param {string} slug - Page slug identifier
 * @returns {string} GraphQL query string
 */
const getPageQuery = slug => {
  return `{
  pages (where: {slug: "${slug}", isPublished: true}) {
    id
    createdAt
    updatedAt
    title
    showToc
    addDivider
    slug
    content
    isPublished
    summary
    displayNav
    tags {
      name
      slug
    }
    
    
  }
}`;
};

/**
 * Builds GraphQL query to fetch a single news post by slug.
 *
 * @function
 * @param {string} slug - Post slug identifier
 * @returns {string} GraphQL query string
 */
const getPostQuery = slug => {
  return `{
  posts  (where: {slug: "${slug}", isPublished: true}) {
    id
    createdAt
    updatedAt
    title
    slug
    content
    isPublished
    summary
    tags {
      name
      slug
    }
    
    
  }
}`;
};

const getFrontPageNewsQuery = limit => {
  return `{
  posts(sort: "createdAt:desc", limit: ${limit}, where: {isPublished: true}) {
    title
    isPublished
    slug
    tags {
      name
      slug
    }
    summary
    content
    createdAt
    updatedAt
    displayReadMore
    isPublished
    
  }
}`;
};

const getAllNewsQuery = () => {
  return `{
  posts(sort: "createdAt:desc", where: {isPublished: true}, limit: ${config.maxResults}) {
    title
    slug
    isPublished
    tags {
      name
      slug
    }
    summary
    content
    createdAt
    updatedAt
    isPublished
    
  }
}`;
};

const getContentByTagQuery = slug => {
  return `
  {
  tags(where: { slug: "${slug}" }) {
    name
    slug
    content

    

    meetings (sort: "scheduledDate:desc", where: {isPublished: true},limit: ${config.maxResults}) {
    createdAt
    updatedAt
    title
    slug
    scheduledDate
    summary
    category
    content
    meetingMaterial {
      name
      summary
      file {
        name
        hash
        url
      }
    }
    
    
     tags {
      name
      slug
    }
  }

    pages(sort: "title:asc", where: { isPublished: true },limit: ${config.maxResults}) {
      title
      slug
      summary
      content
      addDivider
      showToc
      isPublished
      updatedAt
      createdAt
      section {
      title
      slug
    }
      tags {
        name
        slug
      }
    }




    publications(
    sort: "year:desc"
    where: { isPublished: true },limit: ${config.maxResults}
  ) {
    createdAt
    updatedAt
    title
    year
    isPublished
    slug
    searchMeta
    summary
    category
     tags {
      name
      slug
    }
    
    mediaMaterial {
      summary
      thumbnail {
        name
        url
      }
      file {
        name
        url
        hash
      }
    }
  }







    biographies(sort: "alphabetizeBy:asc", where: { isPublished: true }) {
      firstName
      middleName
      lastName
      membership
      order
      boldTitle
      slug
      prefix
      suffix
      title
      content
      category
      tags {
        name
        slug
      }
      alphabetizeBy
      headshot {
        url
        name
      }
    }






    news: posts(sort: "createdAt:desc", where: { isPublished: true },limit: ${config.maxResults}) {
      title
      slug
      isPublished
      tags {
        name
        slug
      }
      summary
      content
      createdAt
      updatedAt
      isPublished
    }
  }
}
  
  `;
};

const getAllSectionsQuery = () => {
  return `{
  sections (sort: "order:asc" where: { isPublished: true}) {
    title
    slug
    isPublished
    summary
    searchMeta
    summary
    order
    hasSubMenus
    displayNav
    displayFooter
    displayDrawer
    
    pages (sort: "order:asc", where: { isPublished: true}) {
      title
      slug
      order
      isPublished
      displayNav
      summary
      addDivider
    }
  }
}`;
};

const getPageBySectionQuery = (section, slug) => {
  return `{
  sections(where: { slug: "${section}" }) {
    title
    slug
    summary
    hasSubMenus
    searchMeta
    pages(where: { isPublished: true, slug: "${slug}" }) {
      id
      createdAt
      updatedAt
      title
      showToc
      addDivider
      slug
      content
      isPublished
      summary
      tags {
        name
        slug
      }
      
    }
  }
}`;
};

const getSiteDescriptionQuery = slug => {
  return `{
  sites (where: {isPublished: true, slug: "${slug}"}){
    id
    title
    slug
    summary
    content
    siteType
    createdAt
    updatedAt
    tags {
      name
      slug
    }
  }
}`;
};

const getAllSiteDescriptionsQuery = () => {
  return `{
  sites (sort: "title:asc", where: {isPublished: true}){
    id
    title
    slug
    summary
    content
    siteType
    showToc
     createdAt
    updatedAt
    tags {
      name
      slug
    }
  }
}`;
};

const getAllBiographiesQuery = () => {
  return `
  {
  biographies (sort: "alphabetizeBy:asc", where: {isPublished: true}){
    isPublished,
    firstName
    middleName
    lastName
    boldTitle
    membership
    order
    slug
    prefix
    suffix
    title
    content
    category
    tags {
      name
      slug
    }
    alphabetizeBy
     headshot {
      url
      name
    }
  }
}`;
};

const getSingleBiographiesQuery = slug => {
  return `
  {
  biographies (where: {slug: "${slug}", isPublished: true}){
    isPublished
    firstName
    middleName
    lastName
    boldTitle
    membership
    order
    prefix
    suffix
    slug
    title
    content
    category
     tags {
      name
      slug
    }
    alphabetizeBy
     headshot {
      url
      name
    }
  }
}`;
};

const getAllMeetingsQuery = () => {
  return `{
  meetings (sort: "scheduledDate:desc", where: {isPublished: true},limit: ${config.maxResults}) {
    createdAt
    updatedAt
    title
    slug
    scheduledDate
    summary
    category
    content
    meetingMaterial {
      name
      summary
      file {
        name
        hash
        url
      }
    }
     tags {
      name
      slug
    }
  }
}
  `;
};

const getMeetingsByCategoryQuery = category => {
  return `{
  meetings (sort: "scheduledDate:desc", where: {isPublished: true, category: "${category}"},limit: ${config.maxResults}) {
    createdAt
    updatedAt
    title
    slug
    scheduledDate
    summary
    category
    content
    meetingMaterial {
      name
      summary
      file {
        name
        hash
        url
      }
    }
     tags {
      name
      slug
    }
  }
}
  `;
};

const getSingleMeetingQuery = slug => {
  return `
  {
  meetings (sort: "scheduledDate:desc", where: {slug: "${slug}", isPublished: true}) {
   createdAt
    updatedAt
    title
    slug
    scheduledDate
    summary
    category
    content
    meetingMaterial {
      name
      summary
      file {
        name
        hash
        url
      }
    }
    tags {
      name
      slug
    }
  }
}`;
};

const getFrontPagePublicationsQuery = () => {
  return `{
  publications(
    sort: "bannerRank:desc"
    where: { isPublished: true, addToBanner: true }
  ) {
    createdAt
    updatedAt
    title
    year
    isPublished
    slug
    searchMeta
    summary
    category
    addToBanner
    bannerRank
    externalMediaMaterial {
      name
      summary
      url
      thumbnail {
        name
        url
        hash
      }
    }
    mediaMaterial {
      summary
      thumbnail {
        name
        url
      }
      file {
        name
        url
        hash
      }
    }
    
    tags {
      name
      slug
    }
  }
}`;
};

const getAllPublicationsQuery = () => {
  return `
  {
  publications(sort: "year:desc", where: { isPublished: true },limit: ${config.maxResults}) {
    createdAt
    updatedAt
    title
    year
    isPublished
    slug
    searchMeta
    summary
    category
    addToBanner
    externalMediaMaterial {
      name
      summary
      url
      thumbnail {
        name
        url
        hash
      }
    }
    mediaMaterial {
      summary
      thumbnail {
        name
        url
      }
      file {
        name
        url
        hash
      }
    }
    
    tags {
      name
      slug
    }
  }
}`;
};

const getPublicationsByCategoryQuery = category => {
  return `{
  publications (sort: "year:desc", where: {isPublished: true, category: "${category}"},limit: ${config.maxResults}) {
    createdAt
    updatedAt
    title
    slug
    year
    summary
    category
    addToBanner
    isPublished
    externalMediaMaterial {
      name
      summary
      url
      thumbnail {
        name
        url
        hash
      }
    }
    mediaMaterial {
      summary
      thumbnail {
        name
        url
      }
      file {
        name
        url
        hash
      }
    }
     tags {
      name
      slug
    }
  }
}
  `;
};

const getSinglePublicationQuery = slug => {
  return `{
  publications (where: {isPublished: true, slug: "${slug}"}) {
    createdAt
    updatedAt
    title
    slug
    year
    summary
    category
    addToBanner
    isPublished
    externalMediaMaterial {
      name
      summary
      url
      thumbnail {
        name
        url
        hash
      }
    }
    mediaMaterial {
      summary
      thumbnail {
        name
        url
      }
      file {
        name
        url
        hash
      }
    }
     tags {
      name
      slug
    }
  }
}
  `;
};

const getUpcomingMeetingsQuery = targetDate => {
  return `
  {
  meetings(
    sort: "scheduledDate:asc"
    where: { scheduledDate_gte: "${targetDate}", isPublished: true }
  ) {
    scheduledDate
    title
    summary
    content
    isPublished
    slug
    category
  }
}
  `;
};

/**
 * Fetches a single page by slug from the GraphQL API.
 *
 * @async
 * @function
 * @param {Object} params - Parameters object
 * @param {string} params.slug - Page slug identifier
 * @returns {Promise<Array>} Array of page objects or empty array on error
 * @throws {Error} Emits contentServiceError event on failure
 */
const getPage = async ({ slug }) => {
  try {
    slug = xss(slug);
    const page = await queryEndpoint(getPageQuery(slug));
    return page.data.data.pages;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("getPage error", e.toString());
    return [];
  }
};

/**
 * Fetches a single news post by slug from the GraphQL API.
 *
 * @async
 * @function
 * @param {Object} params - Parameters object
 * @param {string} params.slug - Post slug identifier
 * @returns {Promise<Array>} Array of post objects or empty array on error
 * @throws {Error} Emits contentServiceError event on failure
 */
const getPost = async ({ slug }) => {
  try {
    slug = xss(slug);
    const post = await queryEndpoint(getPostQuery(slug));
    return post.data.data.posts;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

/**
 * Fetches a limited number of recent news posts for the front page.
 *
 * @async
 * @function
 * @param {Object} params - Parameters object
 * @param {number} params.limit - Maximum number of posts to retrieve
 * @returns {Promise<Array>} Array of post objects or empty array on error
 * @throws {Error} Emits contentServiceError event on failure
 */
const getFrontPageNews = async ({ limit }) => {
  try {
    limit = xss(limit);
    const news = await queryEndpoint(getFrontPageNewsQuery(limit));
    return news.data.data.posts;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

/**
 * Fetches all published news posts from the GraphQL API.
 *
 * @async
 * @function
 * @returns {Promise<Array>} Array of all news post objects or empty array on error
 * @throws {Error} Emits contentServiceError event on failure
 */
const getAllNews = async () => {
  try {
    const news = await queryEndpoint(getAllNewsQuery());
    return news.data.data.posts;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

/**
 * Fetches all content associated with a specific tag.
 * Returns pages, news, publications, meetings, and biographies tagged with the specified slug.
 *
 * @async
 * @function
 * @param {Object} params - Parameters object
 * @param {string} params.slug - Tag slug identifier
 * @returns {Promise<Array>} Array of tag objects with associated content or empty array on error
 * @throws {Error} Emits contentServiceError event on failure
 */
const getContentByTag = async ({ slug }) => {
  try {
    slug = xss(slug);
    const content = await queryEndpoint(getContentByTagQuery(slug));

    return content.data.data.tags;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

/**
 * Fetches all published sections with their associated pages.
 * Used for building navigation menus and site structure.
 *
 * @async
 * @function
 * @returns {Promise<Array>} Array of section objects with nested pages or empty array on error
 * @throws {Error} Emits contentServiceError event on failure
 */
const getAllSections = async () => {
  try {
    const sections = await queryEndpoint(getAllSectionsQuery());
    return sections.data.data.sections;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getPageBySection = async ({ section, slug }) => {
  try {
    slug = xss(slug);
    section = xss(section);
    const sections = await queryEndpoint(getPageBySectionQuery(section, slug));
    return sections.data.data.sections;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getSiteDescription = async ({ slug }) => {
  try {
    slug = xss(slug);
    const sites = await queryEndpoint(getSiteDescriptionQuery(slug));
    return sites.data.data.sites;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getAllSiteDescriptions = async () => {
  try {
    const sites = await queryEndpoint(getAllSiteDescriptionsQuery());
    return sites.data.data.sites;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getAllBiographies = async () => {
  try {
    const biographies = await queryEndpoint(getAllBiographiesQuery());
    return biographies.data.data.biographies;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getSingleBiography = async ({ slug }) => {
  try {
    slug = xss(slug);
    const biography = await queryEndpoint(getSingleBiographiesQuery(slug));
    return biography.data.data.biographies;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getAllMeetings = async () => {
  try {
    const meetings = await queryEndpoint(getAllMeetingsQuery());
    return meetings.data.data.meetings;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getMeetingsByCategory = async ({ strapiEnumCategory }) => {
  try {
    strapiEnumCategory = xss(strapiEnumCategory);
    // console.log("category: ", strapiEnumCategory);
    const meetings = await queryEndpoint(
      getMeetingsByCategoryQuery(strapiEnumCategory)
    );
    // console.log(meetings.data);
    return meetings.data.data.meetings;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getSingleMeeting = async ({ slug }) => {
  try {
    slug = xss(slug);
    const meeting = await queryEndpoint(getSingleMeetingQuery(slug));
    return meeting.data.data.meetings;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getFrontPagePublications = async () => {
  try {
    const featuredPublications = await queryEndpoint(
      getFrontPagePublicationsQuery()
    );
    // console.log(featuredPublications.data.data.publications);
    return featuredPublications.data.data.publications;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getAllPublications = async () => {
  try {
    const publications = await queryEndpoint(getAllPublicationsQuery());
    return publications.data.data.publications;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getPublicationsByCategory = async ({ strapiEnumCategory }) => {
  try {
    strapiEnumCategory = xss(strapiEnumCategory);
    // console.log("category: ", strapiEnumCategory);
    const publications = await queryEndpoint(
      getPublicationsByCategoryQuery(strapiEnumCategory)
    );
    // console.log(publications.data);
    return publications.data.data.publications;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getSinglePublication = async ({ slug }) => {
  try {
    slug = xss(slug);
    const publication = await queryEndpoint(getSinglePublicationQuery(slug));
    return publication.data.data.publications;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getUpcomingMeetings = async ({ targetDate }) => {
  try {
    const meetings = await queryEndpoint(getUpcomingMeetingsQuery(targetDate));
    // console.table("upcoming meetings: ", meetings.data.data.meetings);
    return meetings.data.data.meetings;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

export {
  getPage,
  getPost,
  getFrontPageNews,
  getAllNews,
  getContentByTag,
  getAllSections,
  getPageBySection,
  getSiteDescription,
  getAllSiteDescriptions,
  getAllBiographies,
  getSingleBiography,
  getAllMeetings,
  getMeetingsByCategory,
  getSingleMeeting,
  getFrontPagePublications,
  getAllPublications,
  getPublicationsByCategory,
  getSinglePublication,
  getUpcomingMeetings
};
