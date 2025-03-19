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

//Responda aqui a Etapa 2 do Exercício

import fs from "fs";
import ExcelJS from "exceljs";

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
  try {
    const processes = await db
      .collection("processo")
      .find(
        {},
        {
          projection: {
            _id: 0,
            nP: 1,
            created_at: 1,
            "config_metadata.title": 1,
            timeline: 1, 
          },
        }
      )
      .toArray();

    return processes.map((process) => {
      let lastDestination = "Destino não encontrado";

      if (process.timeline && process.timeline.length > 0) {
        const lastEvent = process.timeline[process.timeline.length - 1];

        // Se houver destino, usa 'to'; senão, usa 'from' como fallback
        const destinationId =
          lastEvent.to?.userId ||
          lastEvent.to?.tag ||
          lastEvent.from?.userId ||
          lastEvent.from?.tag;

        if (destinationId) {
          lastDestination = destinationId;
        } 
      }

      return {
        nP: process.nP,
        created_at: process.created_at,
        title: process.config_metadata?.title,
        lastDestination,
      };
    });

  } catch (error) {
    console.error("Erro ao buscar processos no banco de dados:", error);
    throw new Error("Não foi possível buscar os processos.");
  }
}

// Função para salvar processos em JSON
async function saveAsJson(db) {
  try {
    const listOfProcesses = await fetchProcesses(db);

    if (!listOfProcesses || listOfProcesses.length === 0) {
      console.error("Nenhum processo encontrado para salvar.");
      return;
    }

    fs.writeFileSync(
      "listOfProcesses2.json",
      JSON.stringify(listOfProcesses, null, 2)
    );

    console.log("Arquivo listOfProcesses.json salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao tentar salvar o arquivo JSON:", error);
  }
}

// Função para salvar processos em Excel
async function saveAsExcel(db) {
  try {
    const listOfProcesses = await fetchProcesses(db);

    if (!listOfProcesses || listOfProcesses.length === 0) {
      console.error("Nenhum processo encontrado para salvar.");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("listaProcessos2");

    ws.columns = [
      { header: "nP", key: "nP", width: 15 },
      { header: "Created At", key: "created_at", width: 20 },
      { header: "Title", key: "title", width: 30 },
      { header: "Last Destination", key: "lastDestination", width: 30 },
    ];

    listOfProcesses.forEach((process) => {
      ws.addRow(process);
    });

    await wb.xlsx.writeFile("listaProcessos2.xlsx");
    console.log("Arquivo listaProcessos2.xlsx salvo com sucesso!");

  } catch (error) {
    console.error("Erro ao tentar salvar o arquivo Excel:", error);
  }
}

// Executando as funções
(async () => {
  await withMongoDB(saveAsJson);
  await withMongoDB(saveAsExcel);
})();