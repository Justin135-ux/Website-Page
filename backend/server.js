const express=require("express")
const cors=require("cors")
const connectDB=require("./config/db")
const userRouter=require("./Routes/userRoutes")
const productRouter=require("./Routes/productRoutes") 
// require('dotenv').config();
// nhbh fwvc gjpl yrpm


const app=express()

const port=4000

app.use(express.json())
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))




connectDB()
// app.use("/uploads",express.static("C:/Users/MERN/sample/backend/public/uploads"))


app.use("/api/product",productRouter)
app.use("/api/user",userRouter)


app.listen(port,()=>console.log("server connected at "+port))