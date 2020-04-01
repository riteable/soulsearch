<template>
  <div class="has-text-centered" :class="[$style.player]">
    <div v-if="$store.state.player.title" :class="[$style.title]">
      <div class="tags has-addons">
        <span class="tag is-primary">{{ $store.state.player.title }}</span>
        <a class="tag is-delete" @click="close" />
      </div>
    </div>

    <audio :class="[$style.audio]" controls>
      <source :src="$store.state.player.file">
    </audio>
  </div>
</template>

<script>
export default {
  methods: {
    close () {
      this.$store.commit('player/setFile', null)
    }
  }
}
</script>

<style module>
.player {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 0.5rem;
}

.title:not(:last-child) {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  margin-bottom: 0.25rem;
}

.audio {
  display: block;
  width: 100%
}

.close {
  position: absolute;
  right: 0.75em;
}
</style>
