const deleteuser={
  template:`
  <h2>{{this.msg}}</h2>
  `,
  data(){
     return{
      msg:""
     }
  },
    async mounted(){
        const res=await fetch('/user',{
        method:"DELETE",
        headers: 
        {
        'Authentication-Token': localStorage.getItem('auth-token'),
      },
    })
    if (res.ok) {  
        const data = await res.json()     
        localStorage.clear()
        this.msg="User deleted"
        alert("User deleted")
        this.$router.push(`/`)
    }
    else{
      this.msg="something went wrong"
    }   
    }
    }

export default deleteuser