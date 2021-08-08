const MoviesDAO = require("../../src/dao/moviesDAO");

describe("text and subfield search", () => {
  beforeAll(() => {
    MoviesDAO.injectDB(global.mflixClient);
  });

  test("can perform a text search", async () => {
    const filters = { text: "mongo" };
    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
      filters,
    });
    expect(totalNumMovies).toBe(6);
    expect(moviesList.length).toBe(6);
    expect(moviesList[0].title).toBe("Flash Gordon");
  });

  test("can perform a genre search with one genre", async () => {
    const filters = { genre: ["Action"] };
    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
      filters,
    });

    expect(totalNumMovies).toBe(2539);
    expect(moviesList.length).toBe(20);
    expect(moviesList[0].title).toBe("Gladiator");
  });

  test("can perform a genre search with multiple genres", async () => {
    const filters = { genre: ["Mystery", "Thriller"] };
    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
      filters,
    });

    expect(totalNumMovies).toBe(3485);
    expect(moviesList.length).toBe(20);
    expect(moviesList[0].title).toBe("2 Fast 2 Furious");
  });

  test("can perform a cast search with one cast member", async () => {
    const filters = { cast: ["Elon Musk"] };
    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
      filters,
    });

    expect(totalNumMovies).toBe(1);
    expect(moviesList.length).toBe(1);
    expect(moviesList[0].title).toBe("Racing Extinction");
  });

  test("can perform a cast search with multiple cast members", async () => {
    const filters = { cast: ["Robert Redford", "Julia Roberts"] };
    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
      filters,
    });

    expect(totalNumMovies).toBe(61);
    expect(moviesList.length).toBe(20);
    expect(moviesList[0].title).toBe("Pretty Woman");
  });

  test("Can perform a search and return a non-default number of movies per page", async () => {
    const filters = { cast: ["Robert Redford", "Julia Roberts"] };
    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
      filters,
      moviesPerPage: 33,
    });

    expect(moviesList.length).toEqual(33);
    expect(totalNumMovies).toEqual(61);
    const lastMovie = moviesList.slice(-1).pop();
    expect(lastMovie["title"]).toEqual("Sneakers");
  });
});
