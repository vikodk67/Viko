const axios = require("axios");

module.exports = async function (req, res, path) {
  text = req.query.pesan
  if(text==undefined){
    res.render(path+"/views/exam",{name: "chatGPT", desc: "message query is needed, eg /api/chatGPT?pesan=hello"})
  } else {
    
    const response = await axios.get(`https://mfarels.my.id/api/openai?text=`+text)
    return {
    answer: response.data
    }
    // handle success
  }
}