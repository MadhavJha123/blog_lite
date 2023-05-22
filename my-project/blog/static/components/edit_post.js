const edit_post={
    template:`
    <div>
      <div v-if="success"> 
      <button @click=goback style="background-color: #007bff;color: #fff;border: none;border-radius: 20px;padding: 10px 20px;font-size: 16px;cursor: pointer;width: 100px;">Go back</button>
        <div style="margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;height: 100vh;">
          <form style="display: flex;flex-direction: column;justify-content: center;align-items: center;background-color: #f0f0f0;border-radius: 10px;padding: 20px;box-shadow: 0px 0px 10px #c3c3c3;">
          <h1 style="font-family: sans-serif;font-size: 24px;margin-bottom: 20px;">Edit Post</h1>
          <div class="post-form">
            
            <div>       
              <input type="file" id="post-image" @change="onFileSelected">
              <img v-bind:src="formData.post" style="width: 150px;height: 150px;border-radius: 50%;"/>
            </div><br><br>
            <div>
              <label for="post-caption">Caption(optional)</label>
              <textarea v-model="formData.caption">
              
              </textarea>
            </div><br><br>
            <button type="submit" @click.prevent='addpost' style="background: linear-gradient(to bottom, #3922bd, #ad148c);color: #fff;border: none;border-radius: 20px;padding: 10px 20px;font-size: 16px;cursor: pointer;width: 150px;margin: 20px auto;display: block;transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;"onmouseover="this.style.transform = 'scale(1.1)'; this.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';"onmouseout="this.style.transform = 'scale(1)'; this.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';">Update</button>
              
          </div>
          </form>
        </div>         
      </div>
      <div v-else>
        {{error}}
      </div>
    </div>
       `,

    data(){
        return{
            formData:{
                post:'',
                caption:"",
                
            },
            success:true,
            error:"This is the error",
        }
    },
    methods:{
    async addpost() {
        const res = await fetch(`/post/${this.$route.params.id}`, {
          method:"PUT",
          headers: 
            {'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth-token'),
            
          },
          body: JSON.stringify(this.formData),
        })
        const data=await res.json()
        if (res.ok){ 
            alert("Post updated")
            const id=localStorage.getItem('id')
            this.$router.push(`/feed/${id}`)
            
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
       onFileSelected(event) {
        const file = event.target.files[0] // get the first file from the event
        const reader = new FileReader()
        reader.onload = () => {
          this.formData.post = reader.result // store the base64 encoded string or binary blob in the component data
        }
        reader.readAsDataURL(file) // read the file as a data URL
      },   
      goback(){
        this.$router.push(``)
      }
    }
}
export default edit_post