<template>
  <div class="container">
    <h2>Container</h2>
  </div>
  <div class="row">
    <table class="table">
      <tbody>
        <tr v-for="user in users" :key="user.userID">
          <td>{{ user.firstname }}</td>
          <td>{{ user.lastname }}</td>
          <td>{{ user.userprofile}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core';
import { useStore } from 'vuex';
export default {
  setup(){
    const store = useStore();
      store.dispatch("fetchUsers");
      const users =
      computed( () => store.state.users);
      return{
        users
      }
  }
}
</script>
