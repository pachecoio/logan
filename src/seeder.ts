// @ts-ignore
import seeder from "mongoose-seed";

const BASE_PATH = "lib/src/";

const formatPath = (path: any) => `${BASE_PATH}${path}`;

export const Seeder = (uri: any, seeds = []) => {
  return new Promise((resolve) => {
    seeder.connect(uri, function () {
      // Load Mongoose models
      // @ts-ignore
      seeder.loadModels(seeds.map((seed) => formatPath(seed.path)));

      // Clear specified collections
      seeder.clearModels(
        // @ts-ignore
        seeds.filter((seed) => seed.clear),
        function () {
          // Callback to populate DB once collections have been cleared
          seeder.populateModels(seeds, function () {
            seeder.disconnect();
            resolve(null);
          });
        }
      );
    });
  });
};
