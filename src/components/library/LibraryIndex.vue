<template>
  <el-container>
    <!--侧边栏-->
    <el-aside style="width: 200px;margin-top: 20px">
      <switch></switch>
      <!--使用组件, SideMenu 组件在 LibraryIndex 组件中作为一个 子组件 存在，是 LibraryIndex 组件的一部分。在它的标签中，我们用 ref 属性设置了一个引用名。
      这样，我们就可以通过 _this.refs.sideMenu 来引用侧面导航栏的实例，并获取它的 data 了。-->
      <SideMenu @indexSelect="listByCategory" ref="sideMenu"></SideMenu>
    </el-aside>
    <!--主要区域-->
    <el-main>
      <!--使用组件-->
      <books class="books-area" ref="booksArea"></books>
    </el-main>
  </el-container>
</template>

<script>
import SideMenu from './SideMenu'
import Books from './Books'
export default {
  name: 'LibraryIndex',
  components: {SideMenu, Books},
  methods: {
    listByCategory () {
      var _this = this
      var cid = this.$refs.sideMenu.cid // SideMenu 组件中cid
      var url = 'categories/' + cid + '/books'
      this.$axios.get(url).then(resp => {
        if (resp && resp.status === 200) {
          _this.$refs.booksArea.books = resp.data
        }
      })
    }
  }
}

</script>

<style scoped>
  .books-area {
    width: 990px;
    margin-left: auto;
    margin-right: auto;
  }

</style>
