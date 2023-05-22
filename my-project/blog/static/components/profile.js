const profile={
    template:
    `<div>
    <div v-if="success">
    <a href="" @click.prevent="logout"  >logout</a> 
      <div style="max-width: 960px;margin: 0 auto;display: flex;flex-wrap: wrap;background-color: #fff;padding: 20px;border: 1px solid #ccc;position: relative;">
        <div style="display: flex; align-items: center;">
          <div style="margin-right: 50px;">
            <img v-bind:src="profile.p_pic" alt="" style="max-width: 200px; height: 200px; border-radius: 50%; border: 5px solid #ccc;">
          </div>
        <div>
      <div style="font-size: 30px; font-weight: bold; margin: 0 0 10px 0;">{{profile.username}}</div>
      <div style="margin:0 0 20px 0">{{profile.bio}}</div>
      <div style="margin-bottom: 20px;">
        <button @click=update_user() style="background-color: teal; cursor: pointer; border-radius: 5px; color:white; border-color: aquamarine; padding: 10px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;"onmouseover="this.style.transform = 'scale(1.1)'; this.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';"onmouseout="this.style.transform = 'scale(1)'; this.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';">Edit Profile</button>
        <button @click=export_csv(profile.id) style="background-color: blue; cursor: pointer; border-radius: 5px; color:white; border-color: aquamarine; padding: 10px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;"onmouseover="this.style.transform = 'scale(1.1)'; this.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';"onmouseout="this.style.transform = 'scale(1)'; this.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';">Export CSV</button>
      </div>
      </div>
      </div>
      <div style="position: absolute;top: 20px;right: 20px;">
        <button @click=delete_user style="background-color: red;cursor: pointer;border-radius: 5px;border-color: lightcoral;box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;"onmouseover="this.style.transform = 'scale(1.1)'; this.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';"onmouseout="this.style.transform = 'scale(1)'; this.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';">Delete Profile</button>
      </div>
      <div style="display: flex;flex-basis: 100%;margin-bottom: 20px;margin-top:50px;align-items: center;">
        <div style="flex-basis: 33.33%;text-align: center;font-size: 24px;font-weight: bold;">
          <span>Posts<br>{{Object.keys(profile.myposts).length}}</span>
        </div>
        <div style="flex-basis: 33.33%;text-align: center;font-size: 24px;font-weight: bold;">
          <span style="cursor:pointer;" @click=show_followers>Followers<br>{{this.profile.followers}}</span>
        </div>
        <div style="flex-basis: 33.33%;text-align: center;font-size: 24px;font-weight: bold;">
          <span style="cursor:pointer;" @click=show_follows>Following<br>{{this.profile.follows}}</span>
        </div>
      </div>
      <div style="flex-basis:100%">
        <div style="font-size: 24px;font-weight: bold;margin-top: 10px;margin-bottom:10px">Posts</div>
        <hr>
        <div v-for="i in profile.myposts" style="display: flex;flex-direction: column;align-items: center;background-color: gainsboro;">
          <div style="background-color: grey;padding: 10px;margin: 10px 0;width: 50%;">
                <div style="display: flex;justify-content: space-between;margin-bottom: 20px;">
                  <span style="font-weight: bold;">{{i['p_name']}}</span>
                  <span style="font-weight: bold;">{{i['time']}}</span>
                </div>
                <div style="display: flex;margin-top: 5px;">
                <button @click=edit_post(i.id) style="border-radius:10%;background-color:grey;cursor:pointer; transition: all 0.3s;"onmouseover="this.style.backgroundColor='teal'; this.style.fontSize='120%';" onmouseout="this.style.backgroundColor='grey'; this.style.fontSize='100%';" >Edit</button>

                <button @click=delete_post(i.id) style="border-radius:10%;margin-left:5px;cursor:pointer;background-color:grey; transition: all 0.3s;" onmouseover="this.style.backgroundColor='red'; this.style.fontSize='120%';" onmouseout="this.style.backgroundColor='grey'; this.style.fontSize='100%';">Delete</button>

                </div>
                <div style="font-size: 16px;margin-left: 40px;">
                  <img v-bind:src="i['post']" alt="" style="width: 400px;height: 450px;">
                </div>
                <div style="display: flex;margin-top: 10px;">
                  <span style="font-weight: bold;">{{i['caption']}}</span>
                </div>
          </div>
          </div>
         
      </div>
      </div>
    </div> 
   <div v-else>
   {{error}}
   </div>
   </div>
       `,
    data(){
        return {
            profile:{
                id:0,
                username:'',
                email:'',
                password:'',
                p_pic:'',
                bio:'',
                myposts:{},
                followers:0,
                follows:0
            },
            success:true,
            error:'Something went wrong'
        }
    },
    methods:{
       update_user(){
        this.$router.push(`/updateuser`)
       },
       async export_csv(id){
         const res=await fetch(`/export/${id}`, {
          method:"GET",
          headers: 
            {'Content-Type': 'application/json',
            // 'Authentication-Token': localStorage.getItem('auth-token'),
            
          },
          // body: JSON.stringify(this.formData),
        })
        const data=await res.json()
        if (res.ok){ 
            alert("Report has been sent to your mail")
        }
       },

       async logout(){
        const res= await fetch('/logout')
        if (res.ok){
            localStorage.clear()
            this.$router.push('/')
        }else{
            console.log('could not log out the user')
        }
        
    },
       delete_user(){
        let confirm=window.confirm("User will be deleted permanantly")
        if (confirm){
            this.$router.push('/deleteuser')
        }
       },
       show_followers(){
        this.$router.push(`/followers/${this.profile.id}`)
       },
       show_follows(){
        this.$router.push(`/follows/${this.profile.id}`)
       },
       edit_post(id){
        this.$router.push(`/edit_post/${id}`)
       },
       async delete_post(id){
        let confirm=window.confirm("Are you sure! Post will be deleted")
        if (confirm){
          const res = await fetch(`/post/${id}`, {
            method:"DELETE",
            headers: 
              {'Content-Type': 'application/json',
              'Authentication-Token': localStorage.getItem('auth-token'),
              
            },
            // body: JSON.stringify(this.formData),
          })
          const data=await res.json()
          if (res.ok){ 
              console.log(data)
              window.location.reload()
                   
              
          }else if(res.status==401){
              this.success=false
              this.error=data.response.error
          }
          else{
             this.success=false
             this.error=data.message
             console.log(error)
          
            }
        }
       }
    },
    async mounted() {
        if(localStorage.getItem("p_pic")){
            this.profile.p_pic=localStorage.getItem("p_pic")
            this.profile.username=localStorage.getItem("username")
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
            console.log(data)
            this.profile.p_pic=data.user.p_pic
            this.profile.username=data.user.username
            this.profile.id=data.user.id
            this.profile.email=data.user.email
            this.profile.bio=data.user.bio
            this.profile.myposts=data["myposts"]
            this.profile.followers=data.followers.nfollowers
            this.profile.follows=data.follows.nfollows
            
        }else if(res.status==401){
            this.success=false
            this.error=data.response.error
        }
        else{
           this.success=false
           this.error=data.message
           console.log(error)
        }
        
    }
}
export default profile