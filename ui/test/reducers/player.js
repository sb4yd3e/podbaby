import { assert } from 'chai';
import { Actions } from '../../constants';
import playerReducer from '../../reducers/player';

describe('Player', function () {
  const initialState = {
    podcast: null,
    isPlaying: false,
    currentTime: 0,
  };

  it('Sets the currently playing podcast', function () {
    // time should be reset to 0
    const state = Object.assign({}, initialState, { currentTime: 30 });

    const podcast = {
      id: 100,
      title: 'A podcast',
    };

    const action = {
      type: Actions.CURRENTLY_PLAYING,
      payload: podcast,
    };

    const newState = playerReducer(state, action);

    assert.equal(newState.podcast.id, 100);
    assert.equal(newState.currentTime, 0);
    assert.equal(newState.isPlaying, true);
  });

  it('Bookmarks the podcast', function () {
    const podcast = {
      id: 100,
      title: 'A podcast',
    };

    const state = Object.assign({}, initialState, { podcast });

    const action = {
      type: Actions.ADD_BOOKMARK,
      payload: 100,
    };

    const newState = playerReducer(state, action);

    assert.ok(newState.podcast.isBookmarked);
  });

  it('Does not bookmark the podcast if not the player podcast', function () {
    const podcast = {
      id: 100,
      title: 'A podcast',
    };

    const state = Object.assign({}, initialState, { podcast });

    const action = {
      type: Actions.ADD_BOOKMARK,
      payload: 200,
    };

    const newState = playerReducer(state, action);

    assert.notOk(newState.podcast.isBookmarked);
  });

  it('Does not bookmark the podcast if player empty', function () {
    const action = {
      type: Actions.ADD_BOOKMARK,
      payload: 200,
    };

    const newState = playerReducer(initialState, action);

    assert.equal(newState.podcast, null);
  });

  it('Removes the bookmark from the podcast', function () {
    const podcast = {
      id: 100,
      title: 'A podcast',
      isBookmarked: true,
    };

    const state = Object.assign({}, initialState, { podcast });

    const action = {
      type: Actions.DELETE_BOOKMARK,
      payload: 100,
    };

    const newState = playerReducer(state, action);

    assert.notOk(newState.podcast.isBookmarked);
  });

  it('Does not remove the bookmark from the podcast if not player', function () {
    const podcast = {
      id: 100,
      title: 'A podcast',
      isBookmarked: true,
    };

    const state = Object.assign({}, initialState, { podcast });

    const action = {
      type: Actions.DELETE_BOOKMARK,
      payload: 200,
    };

    const newState = playerReducer(state, action);

    assert.ok(newState.podcast.isBookmarked);
  });

  it('Does not remove the bookmark from the podcast if player empty', function () {
    const action = {
      type: Actions.DELETE_BOOKMARK,
      payload: 200,
    };

    const newState = playerReducer(initialState, action);

    assert.equal(newState.podcast, null);
  });

  it('Updates the current play time', function () {
    const action = {
      type: Actions.PLAYER_TIME_UPDATE,
      payload: 30,
    };

    const newState = playerReducer(initialState, action);

    assert.equal(newState.currentTime, 30);
  });

  it('Reloads the player if none currently playing', function () {
    const action = {
      type: Actions.RELOAD_PLAYER,
      payload: null,
    };

    const newState = playerReducer(initialState, action);

    assert.equal(newState.podcast, null);
    assert.equal(newState.currentTime, 0);
  });

  it('Reloads the player if podcast currently playing', function () {
    const podcast = {
      id: 100,
      title: 'A podcast',
    };

    const action = {
      type: Actions.RELOAD_PLAYER,
      payload: {
        podcast,
        currentTime: 100,
        isPlaying: true,
      },
    };

    const newState = playerReducer(initialState, action);

    assert.equal(newState.podcast.id, podcast.id);
    assert.equal(newState.currentTime, 100);
  });

  it('Closes the player', function () {
    const action = {
      type: Actions.CLOSE_PLAYER,
    };

    const newState = playerReducer(initialState, action);

    assert.equal(newState.podcast, null);
    assert.equal(newState.currentTime, 0);
    assert.notOk(newState.isPlaying);
  });
});
