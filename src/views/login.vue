<template>
    <v-card class="d-flex mb-6 align-center justify-center" outlined color="rgba(255, 255, 255, 0)">
        <v-card class="mx-auto" width="50%" max-width="500" min-width="250">
            <v-card-title
                class="headline primary white--text"
                style="backdrop-filter: blur(2px);"
            >登录</v-card-title><br>
            <v-card-text>
                <v-text-field type="username" v-model="form.username" label="用户ID/邮箱" />
                <v-text-field type="password" v-model="form.password" label="密码" />
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary">登录</v-btn>
            </v-card-actions>
        </v-card>
    </v-card>
</template>

<script>
const { BrowserWindow } = window.require('electron').remote;
export default {
  name: 'login',
  data: () => ({
    form: {
      username: undefined,
      password: undefined
    },
    win: {
        height: BrowserWindow.height,
    }
  }),
}
</script>
