let prompt=document.querySelector("#prompt");
let chatContainer=document.querySelector(".chat-container");
let imgbtn=document.querySelector("#image")
let image=document.querySelector("#image img")
let submitbtn=document.querySelector("#submit")

let imginput=document.querySelector("#image input")
const apiurl="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDgoLdmuvcNpHu25QfIjhFPQ1BsUzJ93ao"
let user={
    message:null,
    file:{
         mime_type:null,
          data: null
    }


}
async  function generateResponse(aiChatBox){
    let text=aiChatBox.querySelector(".ai-chat-area");
    let RequestOption={
       method:"POST",
       headers:{'Content-Type': 'application/json'},
       body:JSON.stringify({
        
            "contents": [{
              "parts":[{"text": user.message},(user.file.data?[{"inline_data":user.file}]:[])]
              }]
             
       })
    }
    try{
        let response= await fetch(apiurl,RequestOption) 
        let data=await response.json()
       let apiresponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
       text.innerHTML=apiresponse;

    }
    catch(error){
console.log(error);
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        image.src=`image.svg`
      image.classList.remove("choose");
       user.file={}

    }

}

function createChat(html,classes){
    let div=document.createElement("div");
    div.innerHTML=html;
    div.classList.add(classes);
    return div;
  
}



 function handlechatResponse(msg){

    user.message=msg
    let html=`<img src="user-img.webp" alt="" id="user-img" width="8%">
<div class="user-chat-area">
    ${user.message}
    ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />`:""}

</div>`
prompt.value=null;
let userChatBox=createChat(html,"user-chat-box")
chatContainer.appendChild(userChatBox);
chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})


setTimeout(() => {
    let html=`<img src="ai-img.webp" alt="" id="ai-img" width="8%">
<div class="ai-chat-area">
</div>`
let aiChatBox=createChat(html,"ai-chat-box");
chatContainer.appendChild(aiChatBox);
generateResponse(aiChatBox);
}, 600);
 }

prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
        handlechatResponse(prompt.value);
    }
    
})
submitbtn.addEventListener("click",()=>{
    handlechatResponse(prompt.value);
})


imginput.addEventListener("change",()=>{
    const file=imginput.files[0];
    if(!file)
        return
    let reader=new FileReader()
    reader.onload=(e)=>{
      let base64string=e.target.result.split(",")[1]
      user.file={
        
            mime_type:file.type,
             data:base64string
       
      }
      
      image.src=`data:${user.file.mime_type};base64,${user.file.data}`
      image.classList.add("choose");
    }
   

    reader.readAsDataURL(file)

})
imgbtn.addEventListener("click",()=>{
    imgbtn.querySelector("input").click();
})