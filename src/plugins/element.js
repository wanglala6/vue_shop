import Vue from 'vue'
import { Button, Form, FormItem, Input } from 'element-ui'
//导入弹框提示组件
import {Message} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//全局挂载 每个组件都可以访问
Vue.prototype.$message=Message
