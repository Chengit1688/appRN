import {UidInterface} from '../Contexts/PropsContext';
import {ActionType, UidStateInterface} from '../Contexts/RtcContext';

export default function DefaultToSpeaker(
  state: UidStateInterface,
  action: ActionType<'DefaultToSpeaker'>,
) {
  let stateUpdate = {};
  const defaultToSpeaker = (user: UidInterface) => {
    if (user.uid === 'local') {
      user.defaultToSpeaker = action.value[0];
    }
    return user;
  };
  stateUpdate = {
    min: state.min.map(defaultToSpeaker),
    max: state.max.map(defaultToSpeaker),
  };
  return stateUpdate;
}
