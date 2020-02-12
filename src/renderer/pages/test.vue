<template>
  <div class="custom-tree-container">
  <div class="block">
    <button @click="testpage">Test Page</button>
    <p>Using scoped slot</p>
    <el-tree
      :data="tree"
      node-key="id">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</div>
</template>
<script>
  let id = 1000;

  export default {
    data() {
      const tree = [{
        id: 1,
        label: 'Level one 1',
        children: [{
          id: 4,
          label: 'Level two 1-1',
          children: [{
            id: 9,
            label: 'Level three 1-1-1'
          }, {
            id: 10,
            label: 'Level three 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: 'Level one 2',
        children: [{
          id: 5,
          label: 'Level two 2-1'
        }, {
          id: 6,
          label: 'Level two 2-2'
        }]
      }, {
        id: 3,
        label: 'Level one 3',
        children: [{
          id: 7,
          label: 'Level two 3-1'
        }, {
          id: 8,
          label: 'Level two 3-2'
        }]
      }];
      return {
        tree: JSON.parse(JSON.stringify(tree)),
        tree: JSON.parse(JSON.stringify(tree))
      }
    },

    methods: {
      
      remove(node, data) {
        const parent = node.parent;
        console.log(parent)
      },

      testpage(){
      this.$router.push('/member')
    }
    }
  };
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
