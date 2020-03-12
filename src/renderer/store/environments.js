export const state = () => ({
  environment: {}
})

export const mutations = {
  setEnvironment (state, value) {
    state.environment = {...value}
  }
}
// export const actions
// export const modules
