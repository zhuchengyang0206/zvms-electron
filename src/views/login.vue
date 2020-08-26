<template>
    <v-card
        id="bgcard"
        class="d-flex mb-6 align-center justify-center"
        outlined
        color="rgba(255, 255, 255, 0)"
        :height="winheight"
        >
        <v-card class="mx-auto" width="50%" max-width="500" min-width="250">
            <v-card-title
                class="headline primary white--text"
                style="backdrop-filter: blur(2px);"
            >登录</v-card-title><br>
            <v-card-text>
              <v-form ref="form">
                <v-text-field type="username" v-model="form.userid" :rules="rules" label="用户ID" />
                <v-text-field type="password" v-model="form.password" :rules="rules" label="密码" @keyup.native.enter="login" />
              </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" block :loading="$store.state.isLoading" @click="login">登录</v-btn>
            </v-card-actions>
        </v-card>
    </v-card>
</template>

<script>
import dialogs from '../utils/dialogs.js'
import {NOTEMPTY} from '../utils/validation.js'
import axios from 'axios'
import qs from 'querystring'

export default {
  name: 'login',
  data: () => ({
    form: {
      userid: undefined,
      password: undefined
    },
    rules: [NOTEMPTY()],
    winheight: document.documentElement.clientHeight - 100
  }),
  methods: {
    async login(){
      //this.$store.commit('loading', true)
      var axiospost = axios.create({
        transformRequest: [function (data){
          data = qs.stringify(data);
          return data;
        }],
        headers:{
          'Content-Type':'application/x-www-form-urlencoded'
        }
      })
      if(this.$refs.form.validate()){   
        axiospost.post("/login.php" ,this.form)
          .then(function(response){
            if(response.data.type == "SUCCESS")
              dialogs.toasts.success(response.data.message)
            else
              dialogs.toasts.error(response.data.message)
          })
          .catch(function(error){
            dialogs.toasts.error(error)
          })
          //.finally(this.$store.commit('loading', false))
      }
      //this.$store.commit('loading', false)
    }
  }
}
</script>
