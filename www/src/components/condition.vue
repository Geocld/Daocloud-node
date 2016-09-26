<style scoped>
	h3 {
		color: red;
	}
	input {
		border: 1px solod #ebebeb;
		padding-left: 3px;
	}
</style>
<template>
  <div class="condition">
  	<h3>search</h3>
    <input type="text" v-model="filterText">
  </div>
</template>

<script>
module.exports = {
  props: ['filterText']
}
</script>
