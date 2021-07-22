const MoviesDAO = require("../../src/dao/moviesDAO");

describe("db connection", () => {
  beforeAll(() => {
    MoviesDAO.injectDB(global.mflixClient);
  });

  test("can access mflix data", async () => {
    const mflix = global.mflixClient.db(process.env.MFLIX_NS);
    const collections = await mflix.listCollections().toArray();
    const collectionNames = collections.map((elem) => elem.name);
    expect(collectionNames).toContain("movies");
    expect(collectionNames).toContain("comments");
    expect(collectionNames).toContain("users");
  });

  test("can retrieve a movie by id", async () => {
    const id = "573a13a6f29313caabd17bd5";
    const movie = await MoviesDAO.getMovieByID(id);
    expect(movie.title).toEqual("Once Upon a Time in Mexico");
  });

  test("can retrieve first page of movies", async () => {
    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies();
    expect(moviesList.length).toEqual(20);
    expect(totalNumMovies).toEqual(23530);
  });
});
