import globalReducer from './global';
import userReducer from './user';
import contactsReducer from './contacts';
import conversationReducer from './conversation';
import circleReducer from './circle';

const rootReducer = {
  global: globalReducer,
  user: userReducer,
  conversation: conversationReducer,
  contacts: contactsReducer,
  circle: circleReducer
  
};

export default rootReducer;
