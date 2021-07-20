const MoviesDAO = require("../../src/dao/moviesDAO");

describe("db connection", () => {
  test("can access mflix data", async () => {
    const mflix = global.mflixClient.db(process.env.MFLIX_NS);
    const collections = await mflix.listCollections().toArray();
    const collectionNames = collections.map((elem) => elem.name);
    expect(collectionNames).toContain("movies");
    expect(collectionNames).toContain("comments");
    expect(collectionNames).toContain("users");
  });

  test("Can retrieve a movie by id", async () => {
    const id = "573a13a6f29313caabd17bd5";
    const movie = await MoviesDAO.getMovieByID(id);
    expect(movie.title).toEqual("Once Upon a Time in Mexico");
  });
});
