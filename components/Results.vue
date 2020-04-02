<template>
  <div>
    <div v-for="(result, resultIndex) in $store.state.search.results" :key="result.id">
      <div class="panel" :class="$style.panel">
        <h2 class="panel-heading">
          <div class="truncate">
            {{ result.folder }}
          </div>
        </h2>

        <div v-for="(file, fileIndex) in result.files" :key="file.id" class="panel-block" :class="[$style['panel-block']]">
          <div v-if="file.progress" :class="[$style.progress]" :style="`width:${file.progress}%`" />

          <button
            class="button"
            :class="[
              $style.button,
              { 'is-danger': file.status === 'error' },
              { 'is-primary': file.status !== 'error' }
            ]"
            @click="download([resultIndex, fileIndex])"
          >
            <refresh-cw-icon v-if="file.status === 'loading' && !file.progress" class="icon spin" />
            <loader-icon v-else-if="file.status === 'loading' && file.progress < 100" class="icon spin" />
            <play-icon v-else-if="file.status === 'done'" class="icon" />
            <alert-triangle-icon v-else-if="file.status === 'error'" class="icon" />
            <download-icon v-else class="icon" />
          </button>

          <div class="truncate">
            <div class="truncate" :class="$style.filename">
              {{ file.name }}.{{ file.ext }}
            </div>

            <div class="is-size-7 has-text-grey">
              <span>
                <span class="has-text-weight-bold" :class="bitrateStyle(file)">
                  {{ displayBitrate(file) }}
                </span>
                <span v-if="isLossy(file)">Kbps</span>
              </span>
              <span>|</span>
              <span>
                <span class="has-text-weight-bold">
                  {{ toMb(file.size) }}
                </span>
                <span>MB</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import { RefreshCwIcon, LoaderIcon, PlayIcon, AlertTriangleIcon, DownloadIcon } from 'vue-feather-icons'

export default {
  components: {
    RefreshCwIcon,
    LoaderIcon,
    PlayIcon,
    AlertTriangleIcon,
    DownloadIcon
  },

  created () {
    this.cache = {}
  },

  methods: {
    toMb (size) {
      return (size / 1024 / 1024).toFixed(1)
    },

    isLossy (file) {
      if (['flac', 'wav', 'aiff'].includes(file.ext)) {
        return false
      }

      return true
    },
    displayBitrate (file) {
      if (['flac', 'wav', 'aiff'].includes(file.ext)) {
        return 'Lossless'
      }

      if (!file.bitrate) {
        return 'Unknown'
      }

      return file.bitrate
    },

    bitrateStyle (file) {
      if (!file.bitrate) {
        if (['flac', 'wav', 'aiff'].includes(file.ext)) {
          return 'has-text-success'
        }

        return null
      }

      if (['ogg', 'mp3', 'm4a'].includes(file.ext)) {
        if (file.bitrate >= 256) {
          return 'has-text-success'
        }

        if (file.bitrate <= 128) {
          return 'has-text-danger'
        }
      }

      return null
    },

    async saveAndPlay (data, track) {
      FileSaver.saveAs(data, `${track.name}.${track.ext}`)

      if (typeof data !== 'string') {
        data = await this.blobToDataUrl(data)
      }

      this.play({
        data,
        name: track.name,
        file: track.file
      })
    },

    play (data) {
      this.$store.commit('player/setTitle', data.name)
      this.$store.commit('player/setFile', data.data)
      this.cache[data.file] = data
    },

    async download ([folderIndex, trackIndex]) {
      const module = this.$store.state.search
      const folder = module.results[folderIndex]
      const track = folder.files[trackIndex]
      const { user, file, size } = track
      const cached = this.cache[file]

      if (track.status && track.status === 'loading') {
        return this.$buefy.toast.open({
          message: 'Still busy downloading.',
          type: 'is-warning'
        })
      }

      if (cached) {
        return this.play(cached)
      }

      this.$store.commit('search/patchFile', [folderIndex, trackIndex, { status: 'loading' }])

      let response

      try {
        response = await this.$axios.$get('/download', {
          params: { user, file },
          responseType: 'blob',
          onDownloadProgress: (event) => {
            const progress = Math.floor((event.loaded / size) * 100)
            this.$store.commit('search/patchFile', [folderIndex, trackIndex, { progress }])
          }
        })
      } catch (err) {
        this.$store.commit('search/patchFile', [folderIndex, trackIndex, { status: 'error' }])
        return this.$buefy.toast.open({
          message: 'Failed to download file.',
          type: 'is-danger'
        })
      }

      this.$store.commit('search/patchFile', [folderIndex, trackIndex, { status: 'done' }])

      return this.saveAndPlay(response, track)
    },

    blobToDataUrl (blob) {
      const reader = new FileReader()
      reader.readAsDataURL(blob)

      return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = () => reject(new Error('Cannot convert blob to data URL.'))
      })
    }
  }
}
</script>

<style module>

.button {
  margin-right: 0.5rem;
  align-self: flex-start;
}

.panel {
  margin-bottom: 1rem;
}

.panel-block {
  position: relative;
}

.filename {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.progress {
  position: absolute;
  height: 100%;
  background-color: rgba(28, 214, 25, 0.2);
  margin-left: -0.75em;
}

.percentage {
  display: inline-block;
  width: 1.5rem;
}

</style>
