import { Application } from './../node_modules/@types/express-serve-static-core/index.d';
import express, { NextFunction, Request, Response } from 'express';
import { UsersRoutes } from './routes/users.routes';

const app:Application = express();

app.use(express.json()); // Receber tudo em json
app.use(express.urlencoded({extended: true})); // Conversão das URL


const usersRoutes = new UsersRoutes().getRoutes();


app.use('/users', usersRoutes);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if(err instanceof Error) {
        return response.status(400).json({message: err.message});
    }
    return response.status(500).json({message: 'Internal Server Error'});
});


app.listen(3001, () => console.log('Server is running'));