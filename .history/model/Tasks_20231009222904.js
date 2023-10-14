let ids = 0;

var fs = require('fs')

let data = fs.readFileSync('./files/data.json',   (err, data) => {
    if(err) {
      console.log('nao foi possivel ler o arquivo. ERRO --> ' + err)
      return ;
    } else {
      console.log('foi possivel ler o arquivo')
    }

})

let tasks = JSON.parse(data) || ['teste'];


let jsonData = JSON.parse(data)

module.exports = {

    new(name) { //certo
        let task = {id: ++ids, name: name};
        tasks.push(task);
        jsonData.push(task);
        let newElement = JSON.stringify(jsonData)
        fs.writeFile('./files/data.json', newElement, 'utf8', (writeErr) => {
            if (writeErr) {
              console.error('Erro ao escrever no arquivo JSON:', writeErr);
            } else {
              console.log('Novo elemento adicionado com sucesso!');
            }
        });

        return task;
    },
    update (id, name) {
        console.log('--------------- update -----------------')
        let pos = this.getPositionById(id)
        //Mudar a logica para ficar apenas no sistema de arquivo
        if (pos >= 0) {
            tasks[pos].name = name;
            return tasks[pos];
        }
        //Encontra o elemento com o id correspondente
        let elemento = jsonData.find(el => el.id === id)
        try {
            if(elemento) {
                elemento['name'] = name
                let novoConteudoJSON = JSON.stringify(jsonData)
                fs.writeFile('./files/data.json', novoConteudoJSON, 'utf8', (writeErr) => {
                    if(writeErr) {
                        console.log('Erro ao atualizar arquivo')
                    } else {
                        console.log('Arquivo atualizado com sucesso')
                    }
                })


            } else {
               console.log('erro !elemento')
            }

        } catch (err) {
            console.log('Erro em update -->  '  + err)

        }

        return null;
    },
    list() {
        console.log('Entrou em list() --> tasks')
        console.log(tasks)
        return tasks;
    },
    getElementById(id) {
        let pos = this.getPositionById(id)
        if (pos >= 0) {
            return tasks[pos];
        }
        return null;
    },
    getPositionById(id) {
        for (let i = 0; i<tasks.length; i++) {
            if (tasks[i].id == id) {
                return i;
            }
        }
        return -1;
    },
    delete(id) {
        let i = this.getPositionById(id);
        if (i >= 0) {
            tasks.splice(i, 1);
            return true;
        }
        return false;
    }

}