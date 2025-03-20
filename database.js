import { MongoClient } from "mongodb"; // Importa o módulo MongoClient do pacote 'mongodb'

const MONGODB_URL = "mongodb+srv://testeAprova:teste123@cluster0.u2gxf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MONGO_DB = "TesteJs";

const DBClient = new MongoClient(MONGODB_URL);
const DB = DBClient.db(MONGO_DB);

export async function withMongoDB(action) {
  try {
    await DBClient.connect();
    console.log("Conexão com o MongoDB bem-sucedida!");
    await action(DB);

  } catch (erro) {
    console.error("Erro ao interagir com o MongoDB:", erro);

  } finally {
    await DBClient.close();
    console.log("Conexão com o MongoDB fechada.");
  }
}

