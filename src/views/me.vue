<template>
	<v-container>
		<v-card>
			<v-card-title>你好,</v-card-title>
			<v-card-text>{{$store.state.isLogined}},{{$store.state.info.username}},{{$store.state.info.permission}}</v-card-text>
		</v-card>
		<v-card dark color="primary">
			<v-card-title>
				<v-icon left>mdi-message</v-icon>
				<span class="font-weight-light title">随机感想</span>
			</v-card-title>
			<v-card-text class="headline font-weight-bold">"{{thought.content}}"</v-card-text>
			<v-card-actions>
				<v-list-item class="grow">
					<v-list-item-avatar>
						<v-icon class="elevation-6">mdi-account-circle</v-icon>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title>{{thought.userName}}</v-list-item-title>
					</v-list-item-content>
					<v-tooltip left max-width="300">
						<template v-slot:activator="{ on, attrs }">
							<v-icon class="mr-1" v-bind="attrs" v-on="on">mdi-help-circle</v-icon>
						</template>
						<span>这是在所有感想中随机提取的一条。</span>
					</v-tooltip>
				</v-list-item>
			</v-card-actions>
		</v-card>
	</v-container>
</template>

<script>
	import axios from "axios";
	import dialogs from "../utils/dialogs.js";

	export default {
		name: "me",
		data: () => ({
			thought: {
				userName: undefined,
				userId: undefined,
				content: undefined
			}
		}),
		mounted: function() {
			//this.pageload();
			this.randomThought();
		},
		methods: {
			pageload() {
				this.$store.commit("loading", true);
				//这一段暂时用不着了，因为网络提取改到从$store里面提取了,但是先留着吧
				axios
					.post("/userinfo.php")
					.then((response) => {
						if (response.data.type == "SUCCESS") {
							this.username = response.data.username;
						} else if (response.data.type == "ERROR") {
							dialogs.toasts.error(response.data.message);
						}
					})
					.catch((error) => {
						dialogs.toasts.error(error);
					})
					.finally(() => {
						this.$store.commit("loading", false);
					});
			},
			randomThought: function() {
				this.$store.commit("loading", true);
				axios
					.post("/volunteer/randomThought")
					.then((response) => {
						if (response.data.type == "SUCCESS") {
							this.thought.userName = response.data.userName;
							this.thought.userId = response.data.userId;
							this.thought.content = response.data.content;
						} else if (response.data.type == "ERROR") {
							dialogs.toasts.error(response.data.message);
						}
					})
					.catch((error) => {
						dialogs.toasts.error(error);
					})
					.finally(() => {
						this.$store.commit("loading", false);
					});
			}
		},
	};
</script>
