import home from './components/home.js'
import login from './components/login.js'
import profile from './components/profile.js'
import signup from'./components/signup.js'
import updateuser from './components/updateuser.js'
import deleteuser from './components/deleteuser.js'
import feed from './components/feed.js'
import add_post from './components/add_post.js'
import search_user from './components/search_user.js'
import followers from './components/followers.js'
import follows from './components/follows.js'
import edit_post from './components/edit_post.js'

const routes=[
    {path:'/',component: home},
    {path:'/login',component: login},
    {path:'/profile/:id',component: profile},
    {path:'/signup',component: signup},
    {path:'/updateuser',component:updateuser},
    {path:'/deleteuser',component:deleteuser},
    {path:'/feed/:id',component:feed},
    {path:'/add_post',component:add_post},
    {path:'/search_user/:user_to_search',name:'search_user',component:search_user},
    {path:'/followers/:id',component:followers},
    {path:'/follows/:id',component:follows},
    {path:'/edit_post/:id',component:edit_post}
]
const router= new VueRouter({
    routes,
    base:"/",
})
const app=new Vue({
    el:"#app",
    router,
    methods:{
    //     logout
    async logout(){
        const res= await fetch('/logout')
        if (res.ok){
            localStorage.clear()
            this.$router.push('/')
        }else{
            console.log('could not log out the user')
        }
        
    }
    }
})