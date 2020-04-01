export const state = () => ({
  title: null,
  file: null
})

export const mutations = {
  setTitle (state, title) {
    state.title = title
  },
  setFile (state, file) {
    state.file = file
  }
}
