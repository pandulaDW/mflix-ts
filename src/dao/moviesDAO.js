const { ObjectID } = require("bson");
const { MongoClient, Db, Collection } = require("mongodb");

/**@type {Collection} */
let movies;

/**@type {Db} */
let mflix;

// default sort order
const DEFAULT_SORT = [["tomatoes.viewer.numReviews", -1]];

module.exports = class MoviesDAO {
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
   * @param {Object} filters
   * @param {number} page
   * @param {number} moviesPerPage
   * @returns {}
   */
  static async getMovies({ filters = null, page = 0, moviesPerPage = 20 }) {
    let queryParams = {};
    if (filters) {
      if ("text" in filters) queryParams = this.textSearch;
    }
  }
};

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
 * @property {number} totalNumResults
 */
