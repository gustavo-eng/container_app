var express = require('express');
var Task = require("../model/Tasks")
var TaskValidator = require("../validators/TaskValidator")
var router = express.Router();
const jwt = require('jsonwebtoken')

// --- import files ---
var fs = require('fs');
// --- import files ---


let controlaAcesso = function (req, res, next) {
  //let token = req.query.token;
  const token = req.header('Custom-Header');
  console.log('Dentro de controle de acesso, variavel token --> ')
  console.log(token)

  jwt.verify(token, "A1B2C3D4", (err, decoded) => {

    if (!err) {
      req.usuario = decoded.user
      return next()
    } else {
      res.status(403).json({status:false, msg:'Sem permissão'});
    }
  })

}

router.get('/', function(req, res, next) {
  if (Task.list().length == 0) {
    Task.new("Tarefa 1")
    Task.new("Tarefa 2")
  }

  res.json({status: true, list: Task.list()})
});
//it is working
router.get('/files',  function(req, res, next) {
  //console.log('router.get(/files) --> ')
  const data = fs.readFileSync('./files/data.json',   (err, data) => {
    if(err) {
      console.log('nao foi possivel ler o arquivo. ERRO --> ' + err)
      return ;
    } else {
      console.log('foi possivel ler o arquivo')
    }

  })
  //console.log('999 data --> ')
  //console.log(JSON.parse(data))

  try {

    let novoElemento = { "id": 71, "name": "Gustavo Alexandre Dias " };
    let jsonData = JSON.parse(data)

    jsonData.push(novoElemento)

    const novoConteudoJSON = JSON.stringify(jsonData);
    console.log('novoConteudoJSON --> ')

    fs.writeFile('./files/data.json', novoConteudoJSON, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Erro ao escrever no arquivo JSON:', writeErr);
      } else {
        console.log('Novo elemento adicionado com sucesso! kkkkkkkkkkkkkkkkkkkk');
      }
    });


  } catch (parseError) {
    console.log('Erro ao executar funcao erro --> ' + parseError)

  }

  //console.log('data from fs --> ')
  //console.log(JSON.parse(data))

  res.json({msg: "/files!!"})
});


router.get("/:id", TaskValidator.validateId, function(req, res) {
    let obj = Task.getElementById(req.params.id);
    if (!obj) {
        return res.json({status:false, msg:"Tarefa não encontrada"})
    }

    return res.json({status:true, task:obj})
})

router.post("/", controlaAcesso,TaskValidator.validateNome, function (req, res){ //FOI TIRADO PARA TESTE
    res.json({status: true, task:Task.new(req.body.nome)});
})


router.put("/:id", controlaAcesso, TaskValidator.validateId, TaskValidator.validateNome, function(req, res){
  let obj = Task.update(req.params.id, req.body.nome);
  if (!obj) {
    return res.json({status: false, msg: "Falha ao alterar a tarefa"})
  }
  res.json({status: true, task:obj});
})


router.delete("/:id", controlaAcesso, TaskValidator.validateId, function(req, res){
  if (!Task.delete(req.params.id)) {
    return res.json({status: false, msg: "Falha ao excluir a tarefa"});
  }

  res.json({status:true})
})


// obtendo arquivos



module.exports = router;

/*
const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON
const filePath = path.join(__dirname, 'seuarquivo.json'); // Substitua 'seuarquivo.json' pelo caminho correto do seu arquivo JSON

// Objeto que você deseja adicionar ao arquivo
const novoElemento = { "id": 51, "name": "Novo Elemento" };

// Função para ler o arquivo JSON atual
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo JSON:', err);
    return;
  }

  try {
    // Analise o conteúdo atual do arquivo JSON
    const jsonData = JSON.parse(data);

    // Adicione o novo elemento ao objeto JavaScript
    jsonData.push(novoElemento);

    // Converta o objeto JavaScript atualizado de volta para JSON
    const novoConteudoJSON = JSON.stringify(jsonData, null, 2);

    // Escreva o JSON atualizado de volta no arquivo
    fs.writeFile(filePath, novoConteudoJSON, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Erro ao escrever no arquivo JSON:', writeErr);
      } else {
        console.log('Novo elemento adicionado com sucesso!');
      }
    });
  } catch (parseError) {
    console.error('Erro ao analisar o arquivo JSON:', parseError);
  }
});


*/


