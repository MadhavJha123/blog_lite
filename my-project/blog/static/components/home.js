const home={
    template:`
    <div>
    <header style="background-color: #007bff;color: #fff;display: flex;justify-content: space-between;align-items: center;padding: 10px;">
        <div style="display: flex;align-items: center;font-size: 24px;">
            <img src="https://th.bing.com/th/id/OIP.JsWv4HTpq4czCQyfeVxdfgHaHv?pid=ImgDet&w=880&h=920&rs=1" alt="Blog Lite" style="height: 50px;width: 50px;">
            Blog Lite
        </div>
        <div>
            <button @click=login style="background-color: #15bd3d;color: #fff;border: none;border-radius: 5px;font-size: 16px;padding: 10px 20px;cursor: pointer;transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;" onmouseover="this.style.transform = 'scale(1.1)'; this.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';" onmouseout="this.style.transform = 'scale(1)'; this.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';" onclick="this.style.transform = 'scale(1)';">Login</button>
            <button @click=signup style="background-color: #15bd3d;color: #fff;border: none;border-radius: 5px;font-size: 16px;padding: 10px 20px;cursor: pointer;transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;" onmouseover="this.style.transform = 'scale(1.1)'; this.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';" onmouseout="this.style.transform = 'scale(1)'; this.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';" onclick="this.style.transform = 'scale(1)';">Signup</button>
        </div>
    </header>
    <div style="display: flex;align-items: center;justify-content: center;flex-direction: column;height: 100vh;background-color: #f8f9fa;">
        <div style="width: 600px;height: 400px;background-image: url('https://image.freepik.com/free-vector/welcome-word-flat-cartoon-people-characters_81522-4207.jpg');background-size: contain;background-repeat: no-repeat;margin-bottom: 5px;"></div>
        <div style="text-align: center;font-size: 24px;margin-top: 0px;">
            Welcome to Blog Lite <br>
            Login or Signup to continue
        </div>
    </div>
  </div>
    `,

  methods:{
     login(){
      this.$router.push("/login")
     },
     signup(){
      this.$router.push("/signup")
     }
  },
  async mounted(){
    const res= await fetch('/logout')
        if (res.ok){
            localStorage.clear()
            this.$router.push('/')
        }else{
            console.log('could not log out the user')
        }

  }
}
export default home