const follows={
  template:
  `<div>
    <div v-if="success">
    <div style="justify-content: space-between;padding: 10px;">
      <h2>People {{c_user}} Follows</h2>
      <div v-if="this.c_user===this.formData.name">
        <div v-for="i in formData.follows">
            <div style="width: calc(100% - 10px);display:block; border-top: 50px;margin-bottom: 10px;border: 1px solid black;padding: 10px;position: relative;">
              <span @click=find(i.username) style="cursor:pointer"><img v-bind:src="i.p_pic" alt="" srcset="" height="50px" width="50px" style="border-radius: 50%;border-color: blue;border-width: 3px;"></span>
              <h2 @click=find(i.username) style="cursor:pointer"><span>{{i.username}}</span></h2>
              <button  @click=unfollow(i.id) style="background-color: rgb(48, 91, 231);color: white;border: none;display:inline-block;padding:8px;cursor: pointer;position:relative;top: 0;right: 0;border-color: grey;border-radius: 5px;">Unfollow</button>
            </div>
        </div>
      </div>
      <div v-else>
          <div v-for="i in formData.follows">
          <div style="width: calc(100% - 10px);display:block; border-top: 50px;margin-bottom: 10px;border: 1px solid black;padding: 10px;position: relative;">
            <span @click=find(i.username) style="cursor:pointer"><img v-bind:src="i.p_pic" alt="" srcset="" height="50px" width="50px" style="border-radius: 50%;border-color: blue;border-width: 3px;"></span>
            <h2 @click=find(i.username) style="cursor:pointer"><span>{{i.username}}</span></h2>
          </div>
          </div>
      </div>
  </div>
  </div>
    <div v-else>
      <h3 style="background-color:red">{{error}}</h3>
    </div>
  </div>
     `,
  //    
  data(){
      return{
          formData:{
              follows:{},
              name:""
          },
          c_user:"",
          success:true,
          error:"This is the error",
      }
  },
  
  methods:{
      find(user){
        this.$router.push(`/search_user/${user}`)
      },
      async unfollow(id){
        const res = await fetch(`/follower/${id}`, {
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
  },
  async mounted() {
      const res = await fetch(`/follows/${this.$route.params.id}`, {
        method:"GET",
        headers: 
          {'Content-Type': 'application/json',
        }
      })
      const data=await res.json()
      if (res.ok){ 
          this.formData.follows=data.follows
          this.formData.name=data.name
          this.c_user=localStorage.getItem("username")
          console.log(data)
      }else if(res.status==401){
          this.success=false
          this.error=data.response.error
      }
      else if (res.status==400){
         this.success=false
         this.error=data.message
         console.log(error)
      }
  }
}
export default follows