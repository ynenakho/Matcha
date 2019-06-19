import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import profileReducer from './profileReducer';
import profilesReducer from './profilesReducer';
import historyReducer from './historyReducer';
import errorReducer from './errorReducer';
import chatReducer from './chatReducer';

export default combineReducers({
  form: formReducer,
  profile: profileReducer,
  profiles: profilesReducer,
  history: historyReducer,
  auth: authReducer,
  error: errorReducer,
  chat: chatReducer
});
