let ids = 0;

var fs = require('fs')

let data = fs.readFileSync('./files/data.json', (err, data) => {
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
        let pos = this.getPositionById(id)
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

        if (pos >= 0) {
            tasks[pos].name = name;

            return tasks[pos];
        }
        return null;
    },
    list() {

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

        try {
            //fs.readFileSync('./files/data.json',   (err, data) => {)
            let jsonData = JSON.parse(data);

            let indexElement = jsonData.findIndex(el => el.id === id);
            console.log(' --- data --- ')
            console.log(jsonData)
            if(indexElement !== -1) {
                jsonData.splice(indexElement, 1);
                let novoConteudoJSON = JSON.stringify(jsonData);
                fs.writeFile('./files/data.json', novoConteudoJSON, 'utf8', (writeErr) => {
                    if (writeErr) {
                      console.error('Erro ao escrever no arquivo JSON:', writeErr);
                    } else {
                      console.log(`Elemento com ID ${id} excluído com sucesso!`);
                    }
                });

            } else {
                console.log('IndexElement foi igual a -1')
            }

        } catch (err) {
            console.log('Erro ao executar a funcao delete (err) --> ' + err)
        }

        if (i >= 0) {
            tasks.splice(i, 1);
            return true;
        }
        return false;
    }

}