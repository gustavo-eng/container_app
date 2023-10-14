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
  console.log(`dentro de /files  gustavo -------------`)

  fs.readFileSync('./files/teste.json',   (err, data) => {
    console.log('fs.readFile (data) -->  ')
    console.logO(data)

  })




  //fs.readFileSync()
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


