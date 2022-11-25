import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      dbName: 'E-comm'
    })

    console.log('MongoDB connected')
  } catch (err) {
    console.log(`Error: ${err.message}`)
  }
}