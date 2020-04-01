<template>
  <div class="columns is-mobile is-centered">
    <div class="column is-8-mobile is-6-tablet is-4-desktop">
      <div class="box content is-size-7">
        <div class="has-text-centered has-margin-bottom">
          <bell-icon class="icon is-large has-text-primary" />
        </div>

        <p>
          <b class="has-text-primary has-margin-right-small">!</b>
          Search results can be inaccurate after a search has completed, because a user can go offline in the meantime. Try searching again to get fresh results if downloads fail.
        </p>
        <p>
          <b class="has-text-primary has-margin-right-small">!</b>
          Remove special characters from your query. Try using only letters, numbers and spaces.
        </p>
        <p>
          <b class="has-text-primary has-margin-right-small">!</b>
          Certain popular artists won't return any results (e.g., The Beatles, Michael Jackson, Kanye West). Try searching for their album and/or song titles instead.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { BellIcon } from 'vue-feather-icons'

export default {
  components: {
    BellIcon
  }
}
</script>
