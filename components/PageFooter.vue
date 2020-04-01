<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <a
        href="https://github.com/riteable/soulsearch"
        target="_blank"
        class="button is-small is-info"
      >
        <github-icon class="icon is-small" />
        <span>Source code @ Github</span>
      </a>
    </div>
  </footer>
</template>

<script>
import { GithubIcon } from 'vue-feather-icons'

export default {
  components: {
    GithubIcon
  }
}
</script>
