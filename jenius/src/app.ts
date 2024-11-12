import express from 'express'
import cookieParser from "cookie-parser"
import cors from 'cors'
import compression from 'compression'
import { rateLimit } from 'express-rate-limit'
import path from 'path'
import router from './routes/routes'

const app = express()
app.use(cors({
    credentials: true,
    origin: '*'
}));
const limiter = rateLimit({
	windowMs: 1 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
});
app.use(limiter);
app.use(express.json())
app.use(compression({ 
    level: 6,
    threshold: 100*1000,
}))
app.use(cookieParser())
app.use(router)

app.locals.appRoot = path.resolve(__dirname, '..');

export default app;