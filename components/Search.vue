<template>
  <form :class="['form', $style.form]" @submit.prevent="updateParam">
    <b-field>
      <div class="control is-expanded">
        <b-input v-model="query" :name="param" placeholder="Search music..." />
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

  props: {
    param: {
      type: String,
      default: 'q'
    }
  },

  computed: {
    query: {
      get () { return this.$store.state.search.query },
      set (query) { this.$store.commit('search/setQuery', query) }
    }
  },

  methods: {
    updateParam () {
      this.$router.replace({
        query: {
          ...this.$route.query,
          q: this.query
        }
      })
    },
    clear () {
      this.$store.commit('search/resetQuery')
    }
  }
}
</script>

<style module>
.form {
  width: 100%;
}
</style>
