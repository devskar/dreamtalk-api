import { Dreamer } from '../entity/Dreamer';

export const getAll = () => {
  Dreamer.find().then((dreamer) => {
    return dreamer;
  });
};
