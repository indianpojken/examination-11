import { Lane, laneModel } from '../models/lane.model';
import { NUMBER_OF_LANES } from '../misc/constants.misc';

export async function initiateLanes() {
  if (!(await laneModel.count())) {
    const lanes = Array(NUMBER_OF_LANES)
      .fill(0)
      .map((_, index): Lane => ({ number: index + 1 }));

    await laneModel.insertMany<Lane[]>(lanes);
  }
}
