<template>
	<v-card>
		<v-card-title>你好,</v-card-title>
		<v-card-text>{{username}}</v-card-text>
	</v-card>
</template>

<script>
import axios from 'axios'
import dialogs from '../utils/dialogs.js'

export default {
  name: 'me',
  data: () => ({
    username:undefined
  }),
  mounted: function(){
		this.pageload()
  },
  methods: {
	pageload(){ 
		this.$store.commit('loading', true)
		axios.post("/userinfo.php")
		.then((response)=>{
			if(response.data.type == "SUCCESS"){
				this.username = response.data.username
			}else if(response.data.type == "ERROR"){
				dialogs.toasts.error(response.data.message)
			}
		})
		.catch((error) => {
			dialogs.toasts.error(error)
		})
		.finally(()=>{
			this.$store.commit('loading', false)
		})
	}
  }
}
</script>
