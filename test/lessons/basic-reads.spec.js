describe("basic reads", () => {
  /**@type {Collection} */
  let movies;

  beforeAll(async () => {
    movies = await global.mflixClient
      .db(process.env.MFLIX_NS)
      .collection("movies");
  });

  test("findOne", async () => {
    try {
      const { title, year, cast } = await movies.findOne({
        cast: "Salma Hayek",
      });

      expect(title).toBe("Roadracers");
      expect(year).toBe(1994);
      expect(cast).toContain("David Arquette");

      // check for null results
      const result = await movies.findOne({ cast: "some dummy" });
      expect(result).toBeNull();
    } catch (err) {
      expect(err).toBeNull();
    }
  });

  test("project", async () => {
    try {
      const result = await movies.findOne(
        {
          cast: "Salma Hayek",
        },
        { projection: { title: 1, year: 1, _id: 0 } }
      );
      expect(result).toEqual({ title: "Roadracers", year: 1994 });
    } catch (err) {
      expect(err).toBeNull();
    }
  });

  test("all", async () => {
    const result = await movies.find({
      cast: { $all: ["Salma Hayek", "Johnny Depp"] },
    });

    const { title, year, cast } = await result.next();
    expect(result).not.toBeNull();

    expect(title).toBe("Once Upon a Time in Mexico");
    expect(year).toBe(2003);
    expect(cast).toContain("Mickey Rourke");
  });
});
