<template>
	<v-container>
		<v-card>
			<v-card-title>
				你好,
				<v-card-text>
					{{$store.state.info.username}}
					<v-chip>	
						<v-icon left>mdi-label</v-icon>
						{{permission2str($store.state.info.permission)}}
					</v-chip>
					<v-chip>	
						<v-icon left>mdi-label</v-icon>
						{{$store.state.info.classname}}
					</v-chip>
					<v-chip>	
						<v-icon left>mdi-label</v-icon>
						{{$store.state.info.class}}
					</v-chip>
				</v-card-text>
			</v-card-title>
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
	import dialogs from "../utils/dialogs";
	import permissions from "../utils/permissions";

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
			this.randomThought();
		},
		methods: {
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
			},
			permission2str: function(per){
				switch(per){
					case permissions.secretary:
						return "团支书";
					case permissions.teacher:
						return "教师";
					case permissions.admin:
						return "管理员";
					case permissions.system:
						return "系统";
				}
			}
		},
	};
</script>
