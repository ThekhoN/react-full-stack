/*
import { fetchUser } from './index';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// helper
const mockResponse = (status, statusText, response) => {
  return new window.Response(response, {
    status: status,
    statusText: statusText,
    headers: {
      'Content-type': 'application/json'
    }
  });
};
*/

import moxios from 'moxios';
import { fetchUser } from './index';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { FETCH_USER } from './types';

const dummyData = {
  googleId: '123',
  _v: 0,
  _id: '123'
};

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
describe('actionCreator fetchUser', () => {
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
  });
  it('returns FETCH_USER with data on success', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: dummyData
      });
    });
    const expectedActions = [{ type: FETCH_USER, payload: dummyData }];
    const store = mockStore({});
    return store.dispatch(fetchUser()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
