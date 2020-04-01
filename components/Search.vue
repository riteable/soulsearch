<template>
  <form action="/" class="form" :class="[$style.form]">
    <b-field>
      <div class="control is-expanded">
        <b-input v-model="query" name="q" placeholder="Search music..." />
      </div>
      <div v-if="query" class="control">
        <button type="button" class="button is-primary" @click.prevent="clear">
          <x-icon class="icon" />
        </button>
      </div>
    </b-field>
  </form>
</template>

<script>
import { XIcon } from 'vue-feather-icons'

export default {
  components: {
    XIcon
  },

  computed: {
    query: {
      get () { return this.$store.state.search.query },
      set (query) { this.$store.commit('search/setQuery', query) }
    }
  },

  watch: {
    '$route.query.q' (query) {
      this.query = query
    }
  },

  created () {
    this.query = this.$route.query.q
  },

  methods: {
    clear () {
      this.query = null
    }
  }
}
</script>

<style module>
.form {
  width: 100%;
}
</style>
