const login={
    template:`
    <div v-if=success>
    <form action='' style="margin: 100px auto;width: 350px;background-color: whitesmoke;border-radius: 5px;padding: 20px;box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);">
      <h2 style="text-align:center;margin-bottom: 30px;">Login</h2>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <span><i class="fa fa-envelope"></i></span>
        <input type='text' name='email' id='email' placeholder='email'  v-model="formData.email" style="padding: 8px; font-size: 16px; color: black;border-radius: 5px; border: 2px solid #ccc; width: 100%;background-color: white;">
        
      </div><br>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <span><i class="fa fa-lock"></i></span>
        <input type='password' name='password'  id='password' placeholder='password' v-model="formData.password"style="padding: 8px; font-size: 16px; border-radius: 5px; border: 2px solid #ccc; width: 100%;background-color: white;" >
        <p v-if="e_error" style="font-weight: bold;color:red">{{e_error}}</p>
        <p v-if="p_error" style="font-weight: bold;color:red">{{p_error}}</p>
      </div><br>
      <button @click.prevent='loginUser' style="display: block; margin: 0 auto; background: linear-gradient(to bottom, #3922bd, #ad148c);color: #fff;padding: 7px 20px;border-radius: 10px;border: none;font-size: 18px;cursor: pointer;transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;"onmouseover="this.style.transform = 'scale(1.1)'; this.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';"onmouseout="this.style.transform = 'scale(1)'; this.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';"> Login</button>
    </form>
  </body>
    </div>
    
    </div>
   
    `,

    data(){
        return{
            formData:{
                email:"",
                password:"",
                
            },
            success:true,
            // error:"This is the error",
            e_error:"",
            p_error:"",
        }
    },
    methods:{
        async loginUser() {
            const res = await fetch("/login?include_auth_token", {
              method: "post",
              headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(this.formData),
            })
            const data = await res.json()
            if (res.ok) {  
              localStorage.clear()
              const id=data.response.user.id       
              localStorage.setItem(
                'auth-token',
                data.response.user.authentication_token)
              localStorage.setItem('id',id)  
              console.log(data)
                this.$router.push(`/feed/${id}`)
            }else if(data.response.errors.password){
              // this.success=false,
              this.e_error=""
              this.p_error="Invalid password"
              // alert("Invalid password")
        }else if(data.response.errors.email){
          // this.success=false,
          this.p_error=""
          this.e_error="Specified user does not exist"
          // alert("This user does not exist")
      
      }
        }
    },
  }
 

export default login