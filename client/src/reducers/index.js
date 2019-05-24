import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import profileReducer from './profileReducer';
import errorReducer from './errorReducer';

export default combineReducers({
  form: formReducer,
  profile: profileReducer,
  auth: authReducer,
  error: errorReducer
});
