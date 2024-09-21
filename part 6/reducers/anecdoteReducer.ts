import { createSlice } from '@reduxjs/toolkit';

const initialAnecdotes = [
  { content: 'If it hurts, do it more often', votes: 0, id: 1 },
  { content: 'Adding manpower to a late software project makes it later!', votes: 0, id: 2 },
  { content: 'Premature optimization is the root of all evil.', votes: 0, id: 3 },
  { content: 'Debugging is twice as hard as writing the code in the first place.', votes: 0, id: 4 },
];

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: initialAnecdotes,
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload;
      const anecdoteToVote = state.find(a => a.id === id);
      if (anecdoteToVote) {
        anecdoteToVote.votes += 1;
      }
    },
    addAnecdote(state, action) {
      state.push(action.payload);
    },
  },
});

export const { voteAnecdote, addAnecdote } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
