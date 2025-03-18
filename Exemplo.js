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

// Seleciona a coleção 'processo' dentro do banco de dados
const processCollection = DB.collection('processo');

// Define o termo de busca para encontrar um documento específico pelo seu ObjectId
let find = { _id: new ObjectId('66f5d460792e15ca0fa30ac1') };

// ********************************************************************************************************************************************************************************************************************
//      Outros exemplos de termos de busca
//      find = {}; -> Busca todos os documentos
//      find = {"config_metadata.id": "a556fceb80fb9491a7d82770"} -> Busca documentos que possuem o assunto Certificado de Conclusão que possui o Id 'a556fceb80fb9491a7d82770'
//      find = {"config_metadata.id": {$in:["a556fceb80fb9491a7d82770","fadcc36e8b8483da27a62af5"]}} -> Busca documentos que possuem o assunto Certificado de Conclusão ou Apostilamento
//      find = {timeline: {$elemMatch: {"data.action":"Processo Criado"}}}; -> Busca documentos que possuem um elemento na array 'timeline' que possui o campo 'data.action' com valor 'Processo Criado'
//
// ********************************************************************************************************************************************************************************************************************

// Função assíncrona que executa a consulta no banco de dados
async function run() {
  // Conecta ao cliente MongoDB
  await DBClient.connect();

  // Realiza a busca na coleção 'processo' e converte o resultado para um array
  const findResult = await processCollection.find(find).toArray();

  // Itera sobre os resultados da busca
  for (let i = 0; i < findResult.length; i++) {
    const processo = findResult[i];
    // Imprime o campo 'nP' de cada documento encontrado
    console.log({ nP: processo.nP });
    console.log(processo.timeline);
  }

  // Fecha a conexão com o cliente MongoDB
  await DBClient.close();
}

// Executa a função 'run' e captura qualquer erro, imprimindo-o no console
run().catch(console.dir);
