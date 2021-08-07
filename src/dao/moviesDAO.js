const { ObjectID } = require("bson");
const { MongoClient, Db, Collection, Cursor } = require("mongodb");

/**@type {Collection} */
let movies;

/**@type {Db} */
let mflix;

// default sort order
const DEFAULT_SORT = [["tomatoes.viewer.numReviews", -1]];

class MoviesDAO {
  /**
   * set the movies variable with movies collection object
   * @param {MongoClient} conn
   */
  static injectDB(conn) {
    if (movies) return;
    try {
      mflix = conn.db(process.env.MFLIX_NS);
      movies = conn.db(process.env.MFLIX_NS).collection("movies");
      this.movies = movies; // this is only for testing
    } catch (err) {
      console.error(
        `Unable to establish a collection handle in moviesDAO: ${err}`
      );
    }
  }

  /**
   * Finds and returns movies matching a given text in their title or description.
   * @param {string} text - The text to match with.
   * @returns {QueryParams} - The QueryParams for text search
   */
  static textSearchQuery(text) {
    const query = { $text: { $search: text } };
    const metaScore = { $meta: "textScore" };
    const sort = [["score", metaScore]];
    const project = { score: metaScore };

    return { query, project, sort };
  }

  /**
   * Finds and returns movies including one or more cast members.
   * @param {string[]|string} cast - The cast members to match with.
   * @returns {QueryParams} = The QueryParams for cast search
   */
  static castSearchQuery(cast) {
    const searchCast = Array.isArray(cast) ? cast : cast.split(", ");
    const query = { cast: { $in: searchCast } };
    const project = {};
    const sort = DEFAULT_SORT;
    return { query, project, sort };
  }

  /**
   * Finds and returns movies matching a one or more genres.
   * @param {string[]|string} genre
   * @returns {QueryParams} = The QueryParams for genre search
   */
  static genreSearchQuery(genre) {
    const searchGenre = Array.isArray(genre) ? genre : genre.split(", ");
    const query = { genre: { $in: searchGenre } };
    const project = {};
    const sort = DEFAULT_SORT;
    return { query, project, sort };
  }

  /**
   * Gets a movie by its id
   * @param {string} id The desired movie id, the _id in Mongo
   * @returns {MflixMovie | null} Returns either a single movie or nothing
   */
  static async getMovieByID(id) {
    try {
      return await movies.findOne({ _id: ObjectID(id) });
    } catch (err) {
      console.error(`Something went wrong in getMovieByID: ${err}`);
      throw err;
    }
  }

  /**
   * Finds and returns the given number of movies using the given filter starting from the page.
   * @param {Object} filters - The search parameters to use in the query.
   * @param {number} page - The page of movies to retrieve.
   * @param {number} moviesPerPage - The number of movies to display per page.
   * @returns {GetMoviesResult}- An object with movie results and total results for the query
   */
  static async getMovies({
    filters = null,
    page = 0,
    moviesPerPage = 20,
  } = {}) {
    let queryParams = {};
    if (filters) {
      if ("text" in filters) queryParams = this.textSearch(filters["text"]);
      else if ("cast" in filters)
        queryParams = this.castSearchQuery(filters["cast"]);
      else if ("genre" in filters)
        queryParams = this.genreSearchQuery(filters["genre"]);
    }
    let { query = {}, project = {}, sort = DEFAULT_SORT } = queryParams;

    /**@type {Cursor} */
    let cursor;
    try {
      cursor = movies.find(query).project(project).sort(sort);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { moviesList: [], totalNumMovies: 0 };
    }

    const displayCursor = cursor.limit(moviesPerPage);

    try {
      const moviesList = await displayCursor.toArray();
      const totalNumMovies = page === 0 ? await movies.count() : 0;
      return { moviesList, totalNumMovies };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { moviesList: [], totalNumMovies: 0 };
    }
  }

  static async getMoviesByCountry(countries) {
    try {
      const cursor = await movies.find(
        { countries: { $in: countries } },
        { projection: { title: 1 } }
      );

      const results = [];

      while (await cursor.hasNext()) {
        const item = await cursor.next();
        results.push(item);
      }

      return results;
    } catch (e) {
      console.error(`unable to find command, ${e}`);
      return [];
    }
  }
}

module.exports = MoviesDAO;

// type defs -----------------------------------
/**
 * A movie from mflix
 * @typedef MflixMovie
 * @property {string} id
 * @property {string} title
 */

/**
 * Result set for getMovies method
 * @typedef GetMoviesResult
 * @property {MflixMovie[]} moviesList
 * @property {number} totalNumMovies
 */

/**
 * This is a parsed query, sort, and project bundle.
 * @typedef QueryParams
 * @property {Object} query - The specified query, transformed accordingly
 * @property {any[]} sort - The specified sort
 * @property {Object} project - The specified project, if any
 */
