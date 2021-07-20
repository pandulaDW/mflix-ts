const { ObjectID } = require("bson");

let movies;
let mflix;
const DEFAULT_SORT = [["tomatoes.viewer.numReviews", -1]];

module.exports = class MoviesDAO {
  static async injectDB(conn) {
    if (movies) return;
    try {
      mflix = await conn.db(process.env.MFLIX_NS);
      movies = await conn.db(process.env.MFLIX_NS).collection("movies");
      this.movies = movies; // this is only for testing
    } catch (err) {
      console.error(
        `Unable to establish a collection handle in moviesDAO: ${err}`
      );
    }
  }

  static async getMovies() {}
};
