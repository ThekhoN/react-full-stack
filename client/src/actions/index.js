import axios from 'axios';
import { FETCH_USER } from './types';

// export const fetchUser = () => {
//   return function(dispatch) {
//     return axios.get('/api/current_user').then(res => {
//       dispatch({ type: FETCH_USER, payload: res.data });
//     });
//   };
// };

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  //   console.log('res.data: ', res.data);
  dispatch({
    type: FETCH_USER,
    payload: res.data
  });
};
