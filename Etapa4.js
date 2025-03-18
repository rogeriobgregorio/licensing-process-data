// Importa o módulo MongoClient do pacote 'mongodb' e o objeto ObjectId
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

// Define a URL de conexão com o MongoDB e o nome do banco de dados
let MONGODB_URL = 'mongodb+srv://testeAprova:teste123@cluster0.u2gxf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
let MONGO_DB = 'TesteJs';

// Cria uma nova instância do cliente MongoDB
const DBClient = new MongoClient(MONGODB_URL);

// Seleciona o banco de dados
const DB = DBClient.db(MONGO_DB);

//Responda aqui a Etapa 4 do Exercício