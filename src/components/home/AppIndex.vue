<template>
  <div>
    Hello World!
    <el-button type="primary" v-on:click="goTest">test</el-button>
    <el-button type="primary" v-on:click="goAdmin">去后台管理</el-button>
  </div>
</template>

<script>
export default {
  name: 'AppIndex',
  methods: {
    goTest () {
      this.$router.replace('/test')
    },
    goAdmin () {
      this.$router.replace('/Admin')
    }
  }
}
</script>

<style scoped>

</style>
