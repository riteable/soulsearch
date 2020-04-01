<template>
  <div class="section">
    <div class="content has-text-centered">
      <alert-triangle-icon class="icon is-large has-text-primary" />

      <h2>
        <span v-if="error.statusCode === 404">
          Hmm. Cannot find that page.
        </span>
        <span v-else>
          Oops! Something went wrong.
        </span>
      </h2>

      <p v-if="[404, 500].includes(error.statusCode)">
        Sorry about that. Try the search or go to
        <nuxt-link to="/">
          home.
        </nuxt-link>
      </p>
      <p v-else class="has-text-danger">
        {{ error.message }}
      </p>
    </div>
  </div>
</template>

<script>
import { AlertTriangleIcon } from 'vue-feather-icons'

export default {
  components: {
    AlertTriangleIcon
  },

  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
