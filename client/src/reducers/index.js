import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import profileReducer from './profileReducer';
import profilesReducer from './profilesReducer';
import errorReducer from './errorReducer';

export default combineReducers({
  form: formReducer,
  profile: profileReducer,
  profiles: profilesReducer,
  auth: authReducer,
  error: errorReducer
});
