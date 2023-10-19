var express = require('express');
var Task = require("../model/Tasks")
var TaskValidator = require("../validators/TaskValidator")
var router = express.Router();
const jwt = require('jsonwebtoken')


var fs = require('fs');

let controlaAcesso = function (req, res, next) {

  const token = req.header('Custom-Header');


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
    Task.new("Atividade 1")
    Task.new("Atividade 2")
  }

  res.json({status: true, list: Task.list()})
});

router.get('/files',  function(req, res, next) {

  const data = fs.readFileSync('./files/data.json',   (err, data) => {
    if(err) {
      console.log('nao foi possivel ler o arquivo. ERRO --> ' + err)
      return ;
    } else {
      console.log('foi possivel ler o arquivo')
    }

  })


  try {

    let novoElemento = { "id": 71, "name": "Gustavo Alexandre Dias " };
    let jsonData = JSON.parse(data)

    jsonData.push(novoElemento)

    const novoConteudoJSON = JSON.stringify(jsonData);


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

  res.json({msg: "/files!!"})
});
// rota teste ====


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




module.exports = router;




