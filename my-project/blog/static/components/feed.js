const feed={
    template:
    `<div>
      <div v-if="success">
        <div style="font-family: sans-serif;">
            <div style="display: flex;justify-content: space-between;align-items: center;padding: 20px;background-color: #988383;">
                <div style="display: flex;align-items: center;gap: 10px;">
                    <img v-bind:src="formData.p_pic" alt="Profile Picture" @click=Myprofile style="width: 80px;height: 80px;border-radius: 50%;cursor: pointer;"/>
                    <h2 @click=Myprofile style="cursor:pointer;"><span>{{formData.username}}</span></h2><br>
                </div>
                <button id="add-post-btn" @click=Addpost style="padding: 10px 20px;border: none;border-radius: 20px;background-color: #28a745;color: #fff;font-size: 16px;cursor: pointer;transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;"onmouseover="this.style.transform = 'scale(1.1)'; this.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';"onmouseout="this.style.transform = 'scale(1)'; this.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';">&#43; Add Post</button>
            </div>
        </div>    
        <div style="display: flex;justify-content: center;margin: 30px 0;">
            <input type="text" name="user_to_search" id="user_to_search" placeholder="Search Users..."  v-model="formData.user_to_search" style="width: 300px;padding: 10px;border: none;border-radius: 20px;box-shadow: 0px 0px 10px #c3c3c3;font-size: 16px;"/>
            <button @click=search_user style="margin-left: 10px;padding: 10px 20px;border: none;border-radius: 20px;background-color: #007bff;color: #fff;font-size: 16px;cursor: pointer;transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;"onmouseover="this.style.transform = 'scale(1.1)'; this.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';"onmouseout="this.style.transform = 'scale(1)'; this.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';">Search</button><br><br>
        </div>
        <div v-if="matching_user" >
          <h3 v-if="empty">No matching users found</h3>
          <div v-else>
            <div v-for="user in formData.find_users" @click=find(user) style="border: 1px solid black;cursor:pointer; padding: 10px; display: inline-block;width:300px;margin-left:auto;margin-right:auto;margin-top:10px">
            <img v-bind:src='user["p_pic"]'  style="width: 50px;height: 50px;border-radius: 50%;cursor: pointer;">
            <span style=" display: inline-block;"><h3 style="cursor:pointer">{{user['username']}}</h3></span></div>
          </div>
        </div>
        
        <h2 style="display: flex;">Your Feed</h2><hr>
        <div v-for="i in formData.all_posts" style="display: flex;flex-direction: column;align-items: center;background-color: gainsboro;">
		      <div style="background-color: grey;padding: 10px;margin: 10px 0;width: 50%;">
			      <div style="display: flex;justify-content: space-between;margin-bottom: 20px;">
              <span @click=seeprofile(i.post_id)  style="cursor:pointer;font-weight:bold">{{i['p_name']}}</span>
              <span style="font-weight: bold;">{{i['time']}}</span>
			      </div>
			      <div style="font-size: 16px;margin-left: 100px;">
			        <img v-bind:src="i['post']" alt="" style="width: 400px;height: 450px;">
			      </div>
            <div style="display: flex;margin-top: 10px;">
			        <span style="font-weight: bold;">{{i['caption']}}</span>
			      </div>
		      </div>
		    </div>
	    </div>
      <div v-else>
        {{error}}
      </div>
    </div>
       `,
    //    
    data(){
        return{
            formData:{
                all_posts:{},
                username:'',
                // find_users:"",
                p_pic:'',
                bio:"",
                user_to_search:"",
                find_users:{}
            },
            success:true,
            error:"This is the error",
            matching_user:false,
            empty:false
        }
    },
    
    methods:{
        Myprofile(){
           this.$router.push(`/profile/${this.$route.params.id}`)
        },
        seeprofile(id){
          this.$router.push(`/profile/${id}`)
        },
        Addpost(){
            this.$router.push(`/add_post`)
        },
        search_user(){
            // this.$router.push(`/search_user/${this.formData.user_to_search}`)
            this.$router.push({ name: 'search_user', params: { user_to_search: this.formData.user_to_search }})
        },
        find(user){
          this.$router.push(`/search_user/${user['username']}`)
        }
    },
    watch: {
      "formData.user_to_search": async function(val) {
        if(val.length>0){
          this.matching_user=true
        }else{
          this.matching_user=false
          this.formData.find_users={}
        }
        const res = await fetch(`/find/${val}`,{
          method:"GET",
          headers: 
            {'Content-Type': 'application/json'
          }
        })
        const data = await res.json()
        if (res.ok) {
          // display users whose usernames start with the given input below the search bar
          this.formData.find_users=data["users"]
          console.log(this.formData.find_users)
          this.empty=false
        } else {
          console.log(data.message)
          this.formData.find_users={}
          this.empty=true
        }
      },
    //   "formData.user_to_search"(val){
    //     if(val.length>0){
    //       this.matching_user=true
    //     }else{
    //       this.matching_user=false
    //     }
    // },
    },
    async mounted() {
        if(localStorage.getItem("p_pic")){
            this.formData.p_pic=localStorage.getItem("p_pic")
            this.formData.username=localStorage.getItem("username")
          }else{
            localStorage.setItem("p_pic",this.formData.p_pic)
            localStorage.setItem("username",this.formData.username)
          }

        const res = await fetch(`/user/${this.$route.params.id}`, {
          method:"GET",
          headers: 
            {'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth-token'),
          }
        })
        const data=await res.json()
        if (res.ok){ 
            this.formData.username=data.user.username
            this.formData.p_pic=data.user.p_pic
            this.formData.bio=data.user.bio
            this.formData.all_posts=data["all_posts"]

        }else if(res.status==401){
            this.success=false
            this.error=data.response.error
        }
        else{
           this.success=false
           this.error=data.message
           console.log(error)
        }
        if(localStorage.getItem("p_pic")){
            this.formData.p_pic=localStorage.getItem("p_pic")
            this.formData.username=localStorage.getItem("username")
          }else{
            localStorage.setItem("p_pic",this.formData.p_pic)
            localStorage.setItem("username",this.formData.username)
          }
    }
}
export default feed