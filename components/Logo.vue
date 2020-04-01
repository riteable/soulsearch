<template>
  <div class="brand-logo is-uppercase" :class="[$style.logo]">
    <img :src="$icon(24)" alt="Soulsearch logo icon" class="logo-icon" :class="[$style.icon]">
    <span class="logo-text" :class="[$style.text, 'has-text-white-ter', 'is-size-6']">
      {{ appName }}
    </span>
  </div>
</template>

<script>
export default {
  computed: {
    appName () {
      return process.env.APP_NAME
    }
  }
}
</script>

<style module>
.logo {
  display: flex;
  align-items: center;
  position: relative;
  top: 0.25rem;
}

.text {
  margin-left: 0.5rem;
  font-weight: 700;
}
</style>
