import { withMongoDB } from "./database.js"; // Importa a função withMongoDB para conexão com o DB
import { saveAsJson } from "./fileUtils.js"; // Importa a função para salvar os processos em JSON
import ExcelJS from "exceljs"; // Importa o módulo para criar e salvar a planilha Excel

// Função para buscar todos os usuários e setores e armazenar em um dicionário
async function fetchUsersAndSectors(db) {
  try {
    const users = await db
      .collection("users")
      .find({}, { projection: { _id: 0, id: 1, name: 1 } })
      .toArray();

    const sectors = await db
      .collection("setores")
      .find({}, { projection: { _id: 0, tag: 1, nome: 1 } })
      .toArray();

    const userMap = Object.fromEntries(
      users.map((user) => [user.id, user.name])
    );

    const sectorMap = Object.fromEntries(
      sectors.map((sector) => [sector.tag, sector.nome])
    );

    return { userMap, sectorMap };

  } catch (error) {
    console.error("Erro ao buscar usuários e setores:", error);
    throw new Error("Não foi possível buscar usuários e setores.");
  }
}

// Função para buscar processos e processar os dados
async function fetchProcesses(db) {
  try {
    const { userMap, sectorMap } = await fetchUsersAndSectors(db);

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
      let lastEvent = "";
      let lastUser = "";
      let lastSector = "";

      if (process.timeline && process.timeline.length > 0) {
        for (let i = process.timeline.length - 1; i >= 0; i--) {
          const event = process.timeline[i];

          // Captura o último evento
          if (!lastEvent && event.data?.action) {
            lastEvent = event.data.action;
          }

          // Captura o último usuário, se existir
          if (!lastUser) {
            if (event.to?.userId && userMap[event.to.userId]) {
              lastUser = userMap[event.to.userId];
            } else if (event.from?.userId && userMap[event.from.userId]) {
              lastUser = userMap[event.from.userId];
            }
          }

          // Captura o último setor, verificando se `to.userId` é um setor
          if (!lastSector) {
            if (event.to?.tag && sectorMap[event.to.tag]) {
              lastSector = sectorMap[event.to.tag];
            } else if (event.from?.tag && sectorMap[event.from.tag]) {
              lastSector = sectorMap[event.from.tag];
            } else if (event.to?.userId && sectorMap[event.to.userId]) {
              lastSector = sectorMap[event.to.userId]; // Caso `userId` represente um setor
            }
          }

          if (lastUser && lastSector && lastEvent) {
            break;
          }
        }
      }

      return {
        nP: process.nP,
        created_at: process.created_at,
        title: process.config_metadata?.title,
        lastEvent,
        lastUser: lastUser || "Desconhecido",
        lastSector: lastSector || "Desconhecido",
      };
    });

  } catch (error) {
    console.error("Erro ao buscar processos no banco de dados:", error);
    throw new Error("Não foi possível buscar os processos.");
  }
}

// Função para salvar processos em Excel
async function saveAsExcel(db) {
  try {
    const listOfProcesses = await fetchProcesses(db);

    if (!listOfProcesses.length) {
      console.error("Nenhum processo encontrado para salvar.");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("listaProcessos4");

    ws.columns = [
      { header: "nP", key: "nP", width: 15 },
      { header: "Created At", key: "created_at", width: 20 },
      { header: "Title", key: "title", width: 30 },
      { header: "Last Event", key: "lastEventAction", width: 30 },
      { header: "Last User", key: "lastUser", width: 30 },
      { header: "Last Sector", key: "lastSector", width: 30 },
    ];

    listOfProcesses.forEach((process) => ws.addRow(process));
    await wb.xlsx.writeFile("listaProcessos4.xlsx");
    console.log("Arquivo listaProcessos4.xlsx salvo com sucesso!");
    
  } catch (error) {
    console.error("Erro ao tentar salvar o arquivo Excel:", error);
  }
}

// Executando as funções
(async () => {
  await withMongoDB(saveAsExcel);
})();

withMongoDB((db) => saveAsJson(db, fetchProcesses, "listOfProcesses4.json"));
