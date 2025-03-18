# Exercício

O exercício simulará o levantamento de dados de processos de licenciamento existente no sistema Aprova Digital.

O exercício será dividido em várias partes simulando a evolução de uma demanda corriqueira do setor de levantamento de dados, aumentando a complexidade para cada parte.

Cada etapa do exercício pode ser construída a partir da anterior por exemplo ao terminar a etapa 3 o começo da etapa 4 parte de onde a 3 começou então basta tirar uma copia da ultima solução para usar como ponto de partida.

Para iniciar o teste, você deverá criar um <b>repositório privado</b> a partir do template deste repositório.

Ao concluir o teste, dê permissão de visualização para os seguintes usuários:

- <b>aalevictor</b>
- <b>FelipeNavarroPimenta</b>

O prazo para conclusão do exercício é de 1 semana.

## Etapa 1

Crie um script que liste todos os seguintes dados dos processos consultados:

- Crie o campo Número de Protocolo (`PROCESSO.nP`)
- Crie o campo Data de Criação (`PROCESSO.created_at`)
- Crie o campo Assunto do Processo (`PROCESSO.config_metadata.title`)

<details>
  <summary>Opcional</summary>

Salve a o resultado da sua busca em um arquivo:

- Do excel para simular o arquivo que seria entregue ao cliente final.
- JSON para facilitar a leitura durante seus testes.

</details>

## Etapa 2

Após terminar a primeira parte, simulando uma mudança de pedido, foi incluída a necessidade de listar o destino do último evento do histórico (`PROCESSO.timeline`):

- Crie o campo Último Destino (`PROCESSO.timeline.$.to.userId`) -> $ representa uma posição do array

Nos casos em que não houver destino, deve ser exibida a origem. (`PROCESSO.timeline.$.from.userId`)

<details>
  <summary>Descrição Timeline</summary>

O campo `timeline` do processo é um vetor que descreve os eventos que ocorreram com o processo desde sua criação até a conclusão.
Caso o evento não transfira o processo de um lugar para outro, a informação de quem disparou o evento estará no campo `from`. Se o evento transferir o processo de lugar, haverá também um campo `to` que indica o destinatário.
Vale observar que tanto a `origem` quanto o `destinatário` podem ser `usuários` ou `setores`.

</details>

## Etapa 3

Após terminar a segunda parte, foi mencionado que o cliente final não quer ids, mas sim os nomes dos destinos. Existem 2 tipos de destinos, usuários e setores. Os usuários são identificados pelo id contendo `auth0|` no início.

- Realize buscas adicionais para encontrar o nome do usuário ou setor do último evento do histórico
- Substitua o valor do campo Último Destino pelo nome do usuário ou setor -> (`USUARIO.name`) ou (`SETOR.nome`)
- Coleção de usuários: `users`
- Coleção de setores: `setores`
- Relação (`PROCESSO.timeline.$.to.userId`) -> (`USUARIO.id`) ou (`SETOR.tag`)

<details>
  <summary>Desafio adicional após resolver o exercício (Opcional)</summary>

Se você utilizou a seguinte estrutura para resolver o exercício acima:

```javascript
for (let i = 0; i < findResult.length; i++) {
  const processo = findResult[i];
  for (let j = 0; j < processo.timeline.length; j++) {
    const event = processo.timeline[j];
    //...
    const findUserResult = await userCollection.findOne(find);
    //...
  }
}
```

Realizando a chamada no banco para verificar o `usuario` dentro do `for` que itera o timeline ou mesmo o for que itera o `processo`.
Isso pode trazer problemas de lentidão.
Cada processo pode chegar a ter 100 ou mais eventos em seu histórico e o total de processos no sistema passa de 50.000.
Portanto se fossem retornados apenas 1000 processos isso já resultaria num dos piores casos em por volta de 10000 chamadas no banco de dados somente para recuperar os nomes dos setores e usuários assumindo 1 chamada por evento no histórico.

Tente mudar a implementação da sua solução para reduzir a quantidade de chamadas necessárias no banco para concluir o levantamento do relatório.

</details>

<details>
<summary>Ajuda com o desafio adicional (Dica caso não consiga pensar em uma solução)</summary>

Existem várias formas de resolver o problema, porém citarei 2 que já utilizei no passado:

- **Solução 1:**

  - **Pró:** Mais simples de implementar.
  - **Con:** Dependendo do tamanho da coleção a ser consultada, pode ocasionar estouro de memória.
  - **Descrição:** Para que não seja necessário consultar o banco de dados para cada evento, basta que no começo da execução se consulte a coleção inteira e salve em uma variável que será consultada em tempo de execução.
  - **Observação:** Para diminuir as chances de estouro de memória, é importante restringir as informações retornadas a somente o necessário usando o termo `$project` do MongoDB.

- **Solução 2:**
  - **Pró:** Limita a quantidade de memória utilizada à quantidade exata de itens necessários para atender à consulta.
  - **Con:** Implementação mais complexa e realiza pelo menos uma chamada para cada item a ser consultado, o que gera mais consultas que a solução anterior.
  - **Descrição:** Ao invés de trazer a coleção toda no início da execução, cria-se uma lista vazia que irá conter os resultados das buscas. Quando precisar realizar uma consulta, antes de chamar o banco, verifica-se se a resposta já não está na lista. Se estiver na lista, pega-se o valor da lista; caso não exista, realiza-se a chamada ao banco e adiciona-se a resposta da consulta na lista.

</details>

## Etapa 4

Por fim, foi solicitado que seja listado o nome do último evento do histórico e que, em vez de simplesmente listar o último destino, desejam que seja listado o último usuário e o último setor em que o processo passou:

- Remova o campo Último Destino
- Crie o campo Último Evento (`PROCESSO.timeline.$.data.action`)
- Crie o campo Último Usuário
- Crie o campo Último Setor

<details>
  <summary>Dica</summary>

Cuidado com os eventos do histórico. É importante lembrar que cada evento pode ter tanto um destinatário quanto uma origem, e cada um desses pode ser um usuário ou setor. Será necessário percorrer o histórico até que todos os campos sejam preenchidos.

</details>
