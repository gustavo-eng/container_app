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


let tasks = JSON.parse(data) || [];

console.log('task 1978 --> ')
console.log(tasks)


module.exports = {

    new(name) {
        let task = {id: ++ids, name: name};
        tasks.push(task);
        let jsonData = JSON.parse(data)
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
        if (pos >= 0) {
            tasks[pos].name = name;
            return tasks[pos];
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