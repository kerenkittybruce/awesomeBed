import { createStore } from 'vuex';
import axios from 'axios';
const renderURL = "https://last-revision.onrender.com";

export default createStore({
  state: {
    users: null,
    user: null,
    products: null,
    showSpinner: true,
    message: null
  },
  getters: {
  },
  mutations: {
    setUsers(state, values){
      state.users = values
    },
    setUser(state, value){
      state.user = value
    },
    setMessage(state, value){
      state.message = value
    }
  },
  actions: {
    fetchUsers(context){
      const res = await axios.get(`${renderURL}users`);
      const (results, err) = res.data;
      if(results){
        context.commit('setUsers', results);
      } else {
        context.commit('setMessage', err);
      }
    }
  },
  modules: {
  }
})
