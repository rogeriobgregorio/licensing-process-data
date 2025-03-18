// Importa o módulo MongoClient do pacote 'mongodb' e o objeto ObjectId
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

// Define a URL de conexão com o MongoDB e o nome do banco de dados
let MONGODB_URL = "mongodb+srv://testeAprova:teste123@cluster0.u2gxf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let MONGO_DB = "TesteJs";

// Cria uma nova instância do cliente MongoDB
const DBClient = new MongoClient(MONGODB_URL);

// Seleciona o banco de dados
const DB = DBClient.db(MONGO_DB);

//Responda aqui a Etapa 1 do Exercício

import fs from "fs"; // Importa o módulo de sistema de arquivos
import ExcelJS from "exceljs"; // Importa o módulo para criar e salvar a planilha Excel

// Função para conectar ao MongoDB, executar uma ação e fechar a conexão
async function withMongoDB(action) {
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

// Função para buscar processos no banco de dados
async function fetchProcesses(db) {
  return await db
    .collection("processo")
    .find(
      {},
      {
        projection: {
          _id: 0,
          nP: 1,
          created_at: 1,
          "config_metadata.title": 1,
        },
      }
    )
    .toArray();
}

// Função para salvar processos em JSON
async function saveAsJson(db) {
  const listOfProcesses = await fetchProcesses(db);
  fs.writeFileSync(
    "listOfProcesses.json",
    JSON.stringify(listOfProcesses, null, 2)
  );
  console.log("Arquivo listOfProcesses.json salvo com sucesso!");
}

// Função para salvar processos em Excel
async function saveAsExcel(db) {
  const listOfProcesses = await fetchProcesses(db);

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("listaProcessos");

  ws.columns = [
    { header: "nP", key: "nP", width: 15 },
    { header: "Created At", key: "created_at", width: 20 },
    { header: "Title", key: "title", width: 30 },
  ];

  listOfProcesses.forEach((process) => {
    ws.addRow({
      nP: process.nP,
      created_at: process.created_at,
      title: process.config_metadata?.title,
    });
  });

  await wb.xlsx.writeFile("listaProcessos.xlsx");
  console.log("Arquivo listaProcessos.xlsx salvo com sucesso!");
}

// Executando as funções
(async () => {
  await withMongoDB(saveAsJson);
  await withMongoDB(saveAsExcel);
})();