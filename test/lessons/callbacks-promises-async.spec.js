describe("callbacks, promises and async/await", () => {
  /**@type {Collection} */
  let movies;

  beforeAll(async () => {
    movies = await global.mflixClient
      .db(process.env.MFLIX_NS)
      .collection("movies");
  });

  test("callbacks", (done) => {
    movies.findOne({ title: "Once Upon a Time in Mexico" }, (err, doc) => {
      expect(err).toBeNull();
      expect(doc.title).toBe("Once Upon a Time in Mexico");
      expect(doc.cast).toContain("Salma Hayek");
      done();
    });
  });

  test("promises", (done) => {
    movies
      .findOne({ title: "Once Upon a Time in Mexico" })
      .then((doc) => {
        expect(doc.title).toBe("Once Upon a Time in Mexico");
        expect(doc.cast).toContain("Salma Hayek");
        done();
      })
      .catch((err) => {
        expect(err).toBeNull();
        done();
      });
  });

  test("async/await", async () => {
    try {
      const { title, cast } = await movies.findOne({
        title: "Once Upon a Time in Mexico",
      });
      expect(title).toBe("Once Upon a Time in Mexico");
      expect(cast).toContain("Salma Hayek");
    } catch (err) {
      expect(err).toBeNull();
    }
  });
});
