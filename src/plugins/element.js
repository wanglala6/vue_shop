import Vue from 'vue'
import { Button, Form, FormItem, Input, Card } from 'element-ui'
//导入弹框提示组件
import {
    Message, Container, Header, Aside, Main
    , Menu,
    Submenu,

    MenuItem,
    Breadcrumb,
    BreadcrumbItem,

    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox
} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)

Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)





//全局挂载 每个组件都可以访问
Vue.prototype.$message = Message
Vue.prototype.$confirm= MessageBox.confirm
