const express = require('express')
const path = require('path')
const fetch = require('node-fetch')
const redis = require('./redis-client')

const app = express()

app.use(express.json())

app.post('/data', async (req, res) => {
	// add data here
   const {repo}=req.body;
   const result= await redis.get(repo);
   if(result){
       res.json({ stars:result })
   }
   console.log(repo,"------")
   const response = await fetch(`https://api.github.com/repos/${repo}`).then(t=>t.json())
   console.log(response,"==",response.stargazers_count)
   if(response.stargazers_count !=undefined){
       await redis.setex(repo,60,response.stargazers_count)
   }
	res.json({ stars:response.stargazers_count })
})

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(process.env.PUBLIC_PORT, () => {
	console.log('Server ready')
})
