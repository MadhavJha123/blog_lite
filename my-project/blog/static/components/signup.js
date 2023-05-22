const signup={
    template:`
    <div>
    <div v-if="success">
    <div style="padding: 20px;align-items: center;">
  <form style="margin-left:380px;width: 500px;background-color: whitesmoke;border-radius: 5px;padding: 20px;box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);">
    <h2 style="text-align: center; font-size: 24px;">Sign up</h2>
    
    <label style="display: block;">
      Username:
      <input type="text" id="username" v-model="formData.username" style="width: 90%; padding: 10px; margin-bottom: 7px; font-size: 16px; border: 1px solid #999; border-radius: 5px;" required>
    </label>
    
    <br>
    
    <label style="display: block; ">
      Email:
      <input type="email" id="email" v-model="formData.email" style="width: 90%; padding: 10px; margin-bottom: 7px; font-size: 16px; border: 1px solid #999; border-radius: 5px;"required>
    </label>
    
    <br>
   
    <label style="display: block; ">
      Password:
      <input type="password" id="password"v-model="formData.password" style="width: 90%; padding: 10px; margin-bottom: 7px; font-size: 16px; border: 1px solid #999; border-radius: 5px;" required>
    </label>
   
    <br>
    
    <label style="display: block; ">
      Profile Picture(optional):
      <input type="file"  id="p_pic"  @change="onFileSelected"  style="width: 90%; padding: 10px; margin-bottom: 7px; font-size: 16px; border: 1px solid #999; border-radius: 5px;" >
    </label>
    <br>

    <label style="display: block; ">
      Add Bio(optional):
      <input type="text"  id="bio"  v-model="formData.bio"  style="width: 90%; padding: 10px; margin-bottom: 7px; font-size: 16px; border: 1px solid #999; border-radius: 5px;" >
    </label>
    <br>
    <button type="submit" @click.prevent='register' style="width: 100%; padding: 10px; background: linear-gradient(to bottom, #3922bd, #ad148c);color: #fff; font-size: 16px; border: none; border-radius: 5px; cursor: pointer;">Sign Up</button>
  </form>
</div>
</div>
<div v-else>
<h2 style="color:red">{{error}}</h2>
</div>
</div>
    `,

    data(){
      return{
        formData:{
          username:"",
          email:"",
          password:"",
          p_pic:"",
          bio:""
      },
      success:true,
      error:'thisistheerror'
      }
    },
    methods:{
      async register() {
        const formData = new FormData()
        const res = await fetch("/user", {
          method: "post",
          headers: {
            "Content-Type": "application/json",       
          },
          body: JSON.stringify(this.formData),
           
        })
        const data = await res.json()
        if (res.ok) {                
            console.log(data)
            this.$router.push('/')
        }
        else{
          this.success=false,
          this.error=data.message
        }
    },
    onFileSelected(event) {
      const file = event.target.files[0] // get the first file from the event
      const reader = new FileReader()
      reader.onload = () => {
        this.formData.p_pic = reader.result // store the base64 encoded string or binary blob in the component data
        localStorage.setItem("p_pic",this.formData.p_pic)
        localStorage.setItem("username",this.formData.username)
      }
      reader.readAsDataURL(file) // read the file as a data URL

    },
    },
    
}
export default signup