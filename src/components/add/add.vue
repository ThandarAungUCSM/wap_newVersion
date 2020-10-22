<template>
  <div class="add">

  </div>
</template>
<script>
export default {
  data(){
    
  },
  created(){
    	this.axios({
				url: this.$httpConfig.home,
				method: 'post'
			}).then((res) => {
				alert(res.data.message);
			}).catch((err) => {
				console.log(err)
			});
  }
}
</script>
<style>

</style>
