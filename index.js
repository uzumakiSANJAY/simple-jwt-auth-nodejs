const fastify = require('fastify')();
fastify.register(require('@fastify/jwt'),{
    secret:'mysecret'
})
//authentication decorator
fastify.decorate("authenticate" , async function(req,reply){
    try{
        await req.jwtVerify()
    }
    catch(err){
        console.log(err)
    }
})
//generate token
fastify.get('/generateToken/:id',(req,reply)=>{
    const data = {
        name : req.params.id,
    }
    const token = fastify.jwt.sign(data);
    reply.send({token});
})

//validate token
fastify.get ('/validateToken',{
    onRequest:[fastify.authenticate]
},async function (req,reply){
    return req.user
})

fastify.get('/',async function(req,reply){
    return reply.send("home")
})

fastify.listen({port:3000},err=>{
    if (err){
        throw err
    }
    else{
        console.log("Server is running on the port 3000")
    }
})