const search_user={
    template:
    `<div>
      <div v-if="success">
      <div style="max-width: 960px;margin: 0 auto;display: flex;flex-wrap: wrap;background-color: #fff;padding: 20px;border: 1px solid #ccc;position: relative;">
      <div style="display: flex; align-items: center;">
      <div style="margin-right: 50px;">
        <img v-bind:src="profile.p_pic" alt="" style="max-width: 200px; height: 200px; border-radius: 50%; border: 5px solid #ccc;">
      </div>
      <div>
        <div style="font-size: 30px; font-weight: bold; margin: 0 0 10px 0;">{{profile.username}}</div>
        <div style="margin: 0 0 20px 0;">{{profile.bio}}</div>
        <div v-if="profile.follows" style="margin-bottom: 20px;">
          <button @click=unfollow style="background-color: red; cursor: pointer; border-radius: 5px; color:white; border-color: aquamarine;transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;"onmouseover="this.style.transform = 'scale(1.1)'; this.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';"onmouseout="this.style.transform = 'scale(1)'; this.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';">Unollow</button>
        </div>
        <div v-else style="margin-bottom: 20px;">
        <button @click=follow style="background-color: teal; cursor: pointer; border-radius: 5px; color:white; border-color: aquamarine;transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;"onmouseover="this.style.transform = 'scale(1.1)'; this.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';"onmouseout="this.style.transform = 'scale(1)'; this.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';">Follow</button>
      </div> 
      </div>
    </div>
  <div style="display: flex;flex-basis: 100%;margin-bottom: 20px;margin-top:50px;align-items: center;">
    <div style="flex-basis: 33.33%;text-align: center;font-size: 24px;font-weight: bold;">
      <span>Posts<br>{{Object.keys(profile.myposts).length}}</span>
    </div>
    <div style="flex-basis: 33.33%;text-align: center;font-size: 24px;font-weight: bold;cursor:pointer" @click=show_followers>
      <span>Followers<br>{{this.profile.tfollowers}}</span>
    </div>
    <div style="flex-basis: 33.33%;text-align: center;font-size: 24px;font-weight: bold;cursor:pointer"@click=show_follows>
      <span >Following<br>{{this.profile.tfollows}}</span>
    </div>
  </div>
  <div style="flex-basis: 100%;">
    <div style="font-size: 24px;font-weight: bold;margin-top: 10px;margin-bottom:10px">Posts</div>
    <hr>
    <div style="display: flex;flex-wrap: wrap; margin: 0 -10px;">
      <div v-for="i in profile.myposts" style="flex-basis: calc(20% - 20px); margin: 0 10px 20px 10px;">
      <div style="border-radius: 5px; overflow: hidden; position: relative; border: 1px solid #ccc;">
          <img v-bind:src="i['post']" style="width: 150px;height: 200px;object-fit: cover;border:5 px solid #ccc;margin-left:10px">
        </div>
      </div>
      <!-- Add more posts here -->
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
                id:'',
                username:'',
                email:'',
                p_pic:'',
                bio:'',
                myposts:{},
                follows:null,
                tfollowers:0,
                tfollows:0
            },
            profilei:{
               followers:"",
               follower_id:""
            },
            success:true,
            error:'Something went wrong'
        }
    },
    methods:{
       async follow(){
        const res = await fetch("/follower", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              'Access-Control-Allow-Origin': '*',
              'Authentication-Token': localStorage.getItem('auth-token'),
            },
            body: JSON.stringify(this.profilei),
          })
          const data = await res.json()
          if (res.ok) {  
            console.log(data)  
            if(this.profile.follows==1){
              this.profile.follows=0
            }
            else{
              this.profile.follows=1
            }
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
       },
       async unfollow(){
        const res = await fetch(`/follower/${this.profile.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
        })
        const data = await res.json()
        if (res.ok) {  
          console.log(data)  
          if(this.profile.follows==1){
            this.profile.follows=0
          }
          else{
            this.profile.follows=1
          }
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
       },
       show_followers(){
        this.$router.push(`/followers/${this.profile.id}`)
       },
       show_follows(){
        this.$router.push(`/follows/${this.profile.id}`)
       }
    },
    async mounted() {
        const res = await fetch(`/search/${this.$route.params.user_to_search}`, {
          method:"GET",
          headers: 
            {'Content-Type': 'application/json',
            // 'Authentication-Token': localStorage.getItem('auth-token'),
          }
        })
        const data=await res.json()
        if (res.ok){ 
            this.profile.p_pic=data.user.p_pic
            this.profile.username=data.user.username
            this.profile.id=data.user.id
            this.profile.follows=data.follows.follow
            this.profile.email=data.user.email
            this.profile.bio=data.user.bio
            this.profilei.follower_id=data.user.id
            this.profilei.followers=data.user.username
            this.profile.myposts=data["myposts"]
            this.profile.tfollows=data.tfollows.nfollows
            this.profile.tfollowers=data.tfollowers.nfollowers
            

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
export default search_user