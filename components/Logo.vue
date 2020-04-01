<template>
  <span class="brand-logo is-uppercase" :class="$style.logo">
    <img :src="$icon(36)" alt="Soulsearch logo icon" class="logo-icon" :class="[$style.icon]">
    <span class="logo-text" :class="[$style.text]">
      <span class="has-text-primary">
        Soul
      </span>
      <span class="has-text-white-ter">
        search
      </span>
    </span>
  </span>
</template>

<style module>
.logo,
.text {
  display: flex;
  align-items: baseline;
}

.text {
  margin-left: 0.5rem;
  position: relative;
  top: 0.25rem;
}

.icon {
  align-self: center;
}
</style>
