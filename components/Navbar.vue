<template>
  <nav class="nav-main" :class="[$style.nav]">
    <div class="container">
      <div class="columns is-mobile is-gapless">
        <div class="column is-narrow">
          <nuxt-link
            to="/"
            class="is-uppercase"
            :class="[$style['logo-link']]"
          >
            <logo />
          </nuxt-link>
        </div>

        <div class="column">
          <search />
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import Logo from '@/components/Logo'
import Search from '@/components/Search'

export default {
  components: {
    Logo,
    Search
  }
}
</script>

<style lang="scss" module>
@import '@/assets/css/custom-variables.scss';

.nav {
  padding: 0.5rem 0;
  background-color: $dark;
  position: relative;
  z-index: 1;
  border-bottom: 1px solid $grey-darker;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.3);
}

.logo-link {
  display: inline-block;
  font-size: 1.25rem;
  line-height: 1.25em;
  vertical-align: middle;
}
</style>
