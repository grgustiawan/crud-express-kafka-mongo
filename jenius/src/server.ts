import http from 'http'
import dotenv from 'dotenv'
import app from './app'
import os from 'os'
import cluster from  'cluster'

dotenv.config()
const numCPUs = os.cpus().length;
if(cluster.isPrimary){
    console.log(`Master process ${process.pid} is running. Number of CPU : ${numCPUs}`)

    for(let i = 0; i < numCPUs; i++){
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker process ${worker.process.pid} died. Restarting...`)
        cluster.fork()
    })
} else {
    const server = http.createServer(app)
    server.listen(process.env.APP_PORT, () => {
        console.log(`${process.env.APP_NAME} listening on port ${process.env.APP_PORT}. ${process.pid}`);
    })
}