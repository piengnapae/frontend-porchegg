<template>
  <div>
    <input type="text" v-model="url">
    <button type="button" @click="greet">SEND</button>
    <div style="border:1px solid #000;">
      {{counter}}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      counter: 0
    }
  },
  methods: {
    greet: function () {
      alert('hello')
    }
  }
}
</script>
