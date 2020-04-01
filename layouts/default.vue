<template>
  <div>
    <navbar />

    <section>
      <nuxt />
    </section>

    <page-footer />

    <player v-if="$store.state.player.file" />
  </div>
</template>

<script>
import Player from '@/components/Player'
import Navbar from '@/components/Navbar'
import PageFooter from '@/components/PageFooter'

export default {
  components: {
    Player,
    Navbar,
    PageFooter
  }
}
</script>
