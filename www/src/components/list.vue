<style scoped>
	h3 {
		color: green;
	}
	ul {
		padding-left: 0;
	}
	ul li {
		list-style: none;
	}
</style>
<template>
  <div class="list">
  	<h3>result</h3>
    <ul>
      <li v-for="item in items">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
module.exports = {
  props: ['items']
}
</script>
