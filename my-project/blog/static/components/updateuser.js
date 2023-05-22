const updateuser={
    template:`
    <div style="padding: 20px;align-items: center;">
    <div v-if="success">
      <form action="" style="margin: 100px auto;width: 350px;background-color: whitesmoke;border-radius: 5px;padding: 20px;box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);"> 
        <h2 style="text-align: center; font-size: 24px;">Update Username</h2><hr>
        <label for="username" style="font-size: 18px;">New Username</label><br>
        <input type="text" id="username" v-model="FormData.username" required style="width: 90%; padding: 10px; margin-bottom: 20px; font-size: 16px; border: 1px solid #999; border-radius: 5px;"><br>
        <label for="o_password" style="font-size: 18px;">Enter Password</label><br>
        <input type="password" id="o_password" v-model="FormData.o_password" required style="width: 90%; padding: 10px; margin-bottom: 20px; font-size: 16px; border: 1px solid #999; border-radius: 5px;"><br>
        <button @click.prevent="update" style="width: 100%; padding: 10px; background: linear-gradient(to bottom, #3922bd, #ad148c);color: #fff; font-size: 16px; border: none; border-radius: 5px; cursor: pointer;">Update</button>  
      </form> 
    </div>
    <div v-else>
      <h2 style="color: red; text-align: center; font-size: 20px;">{{error}}</h2>
    </div>
  </div>
    `,
    data(){
        return{
            FormData:{
                username:"",
                o_password:"",
                
            },
            success:true,
            error:"thisistheerror"
        }
    },
    methods:{
        async update(){
            const res=await fetch('/user',{
            method:"PUT",
            headers: 
            {'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
          body: JSON.stringify(this.FormData),
        })
        const data = await res.json()
        if (res.ok) { 
            alert("User updated")
            const res=await fetch('/logout')
              if (res.ok){
                  localStorage.clear()
                  this.$router.push('/')
              }else{
                  console.log('could not log out the user')
              }
            }
        else{
          this.success=false,
          this.error=data.message
        }   
        }
    }
}
export default updateuser