import mongoose from "mongoose";

const dataBaseConnection= async()=>{
try {
   const conn= await mongoose.connect(process.env.DB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
} catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1)
}
}
export default dataBaseConnection