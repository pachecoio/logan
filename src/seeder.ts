// @ts-ignore
import seeder from 'mongoose-seed';

const BASE_PATH = 'dist/src/';

const formatPath = (path: any) => `${BASE_PATH}${path}`;

export class Seed {
  model!: string;
  path!: string;
  clear: boolean = false;
  documents!: any[];
}

/**
 * Function to seed a Mongo database with initial data
 * @param uri : Mongo DB URI
 * @param seeds : List of seed objects
 * @returns null
 */
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
