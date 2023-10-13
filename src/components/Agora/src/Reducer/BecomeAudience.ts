import {UidStateInterface} from '../Contexts/RtcContext';

export default function BecomeAudience(state: UidStateInterface) {
  if (state.max[0].uid === 'local' && state.min.length !== 0) {
    let stateUpdate = {};
    let minUpdate = [...state.min];
    stateUpdate = {
      max: [minUpdate.pop()],
      min: [...minUpdate, state.max[0]],
    };
    return stateUpdate;
  } else {
    return state;
  }
}
