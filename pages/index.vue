<template>
  <div class="section">
    <div class="container">
      <p v-if="counters.files" class="content has-text-centered is-uppercase is-size-7 has-text-grey-light">
        <span>Found</span>
        <strong class="has-text-primary">
          {{ counters.files }}
        </strong>
        <span>songs in</span>
        <strong class="has-text-primary">
          {{ counters.folders }}
        </strong>
        <span>folders</span>

        <loader-icon v-if="isBusy" class="icon is-small spin has-text-grey" :class="[$style.loader]" />
      </p>

      <results />

      <div v-if="isBusy && !isDone" class="content has-text-centered">
        <p class="has-text-primary">
          <loader-icon class="icon is-large spin has-text-primary" />
        </p>

        <p>Fetching songs. Just a moment, please.</p>
      </div>

      <div v-else-if="!isBusy && !isDone" class="content">
        <div class="has-text-centered">
          <music-icon class="icon is-large has-text-primary" />
          <p>Search &amp; download some music!</p>
        </div>
      </div>

      <div v-else-if="isDone && !results.length">
        <div class="content has-text-centered">
          <alert-triangle-icon class="icon is-large has-text-primary" />
          <h2>Hmm... Couldn't find anything.</h2>
          <p>Try some other search terms or something.</p>
        </div>
      </div>

      <hr>

      <tips />
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import { mapState, mapGetters } from 'vuex'
import { MusicIcon, AlertTriangleIcon, LoaderIcon } from 'vue-feather-icons'
import Results from '@/components/Results'
import Tips from '@/components/Tips'

let sse = null

export default {
  name: 'Index',

  components: {
    Results,
    Tips,
    MusicIcon,
    AlertTriangleIcon,
    LoaderIcon
  },

  asyncData (ctx) {
    const data = {
      title: null
    }
    const query = ctx.route.query.q

    if (query && query.trim().length) {
      data.title = query.trim()
      ctx.store.commit('search/setQuery', query)
    }

    return data
  },

  computed: {
    ...mapState({
      status: state => state.search.state,
      results: state => state.search.results,
      counters: state => state.search.counters
    }),
    ...mapGetters('search', [
      'isBusy',
      'isDone'
    ])
  },

  watch: {
    '$route.query.q': {
      async handler (query) {
        this.$store.dispatch('search/resetState')

        window.scrollTo(0, 0)

        if (!query) {
          this.title = null
          return null
        }

        this.title = query

        try {
          await this.search(query)
        } catch (err) {
          this.$buefy.open({
            message: 'Search failed.',
            type: 'is-danger'
          })
        }
      }
    }
  },

  mounted () {
    this.search(this.$route.query.q)
  },

  beforeDestroy () {
    if (sse) {
      sse.close()
    }
  },

  methods: {
    async search (query) {
      if (!query) {
        return null
      }

      this.$store.commit('search/isBusy')

      try {
        sse = await this.$sse('/api/search?' + qs.stringify({ query }), { format: 'json' })
      } catch (err) {
        this.$store.commit('search/isDone')

        return this.$buefy.toast.open('Failed to connect to events server.')
      }

      sse.onError(this.onEventError)
      sse.subscribe('folder', this.onFolder)
      sse.subscribe('done', this.onDone)
    },
    onEventError (err) {
      this.$buefy.toast.open(err.message)
    },
    onFolder (data) {
      this.$store.commit('search/patchCounters', {
        folders: this.counters.folders + 1,
        files: this.counters.files + data.files.length
      })
      this.$store.commit('search/pushResult', data)
    },
    onDone (data) {
      this.$store.commit('search/patchCounters', data)
      this.$store.commit('search/isDone')

      sse.unsubscribe('folder')
      sse.unsubscribe('done')
    }
  },

  head () {
    const head = {}

    if (this.title) {
      head.title = this.title
    }

    return head
  }
}
</script>

<style module>
.loader {
  position: absolute;
  margin-left: 0.25rem;
}
</style>
