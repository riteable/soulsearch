import { SEARCH_STATUS_BUSY, SEARCH_STATUS_DEFAULT, SEARCH_STATUS_DONE } from '@/constants'

function defaultCounters () {
  return {
    folders: 0,
    files: 0
  }
}

export const state = () => ({
  status: SEARCH_STATUS_DEFAULT,
  query: null,
  results: [],
  counters: defaultCounters()
})

export const mutations = {
  setStatus (state, status) {
    state.status = status
  },
  isBusy (state) {
    state.status = SEARCH_STATUS_BUSY
  },
  isDone (state) {
    state.status = SEARCH_STATUS_DONE
  },
  setResults (state, results) {
    state.results = results
  },
  pushResult (state, result) {
    state.results.push(result)
  },
  setQuery (state, query) {
    state.query = query
  },
  patchCounters (state, data) {
    state.counters = { ...state.counters, ...data }
  },
  patchFile (state, [folderIndex, fileIndex, data]) {
    const result = state.results[folderIndex]
    const files = result.files
    const file = files[fileIndex]

    files.splice(fileIndex, 1, { ...file, ...data })
    state.results.splice(folderIndex, 1, result)
  },
  resetStatus (state) {
    state.status = SEARCH_STATUS_DEFAULT
  },
  resetQuery (state) {
    state.query = null
  },
  resetResults (state) {
    state.results = []
  },
  resetCounters (state) {
    state.counters = defaultCounters()
  }
}

export const getters = {
  isBusy (state) {
    return state.status === SEARCH_STATUS_BUSY
  },
  isDone (state) {
    return state.status === SEARCH_STATUS_DONE
  }
}

export const actions = {
  resetState (ctx) {
    ctx.commit('resetStatus')
    ctx.commit('resetResults')
    ctx.commit('resetCounters')
  }
}
