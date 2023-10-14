import taskService from "./taskservice.js"

let atualizaTarefas = async function() {
    let resp = await taskService.lista()
    if (resp.status) {
        let ul =  document.querySelector("#tarefas");
        ul.innerHTML = "";
        resp.list.forEach((item) => {
            let li = document.createElement("li")
                        
            let edit = document.createElement("button")
            edit.addEventListener("click", function() {
                document.querySelector("#tid").value = item.id
                document.querySelector("#tnome").value = item.name
            })
            edit.className = "btn btn-link"
            edit.innerHTML = "edit"
                        
            let del = document.createElement("button")
            del.innerHTML = "done"
            del.className = "btn btn-link"
            del.addEventListener("click", async function() {
                if (confirm("Deseja finalizar a tarefa?")) {
                    let resp = await taskService.exclui(item.id)
                    if (resp.status) {
                        ul.removeChild(li);
                    }
                }
            })

            li.appendChild(document.createTextNode(item.name + " "))
            li.appendChild(edit)
            li.appendChild(del)
            ul.appendChild(li)
        })
    }
}

window.addEventListener("load", async function() {
    atualizaTarefas()

    document.querySelector("form").addEventListener("submit", async function(evt) {
        evt.preventDefault();
        let hid = document.querySelector("#tid")
        let hnome = document.querySelector("#tnome")
        let resp;
        if (hid.value) {
            resp = await taskService.altera(hid.value, hnome.value);
        } else {
            resp = await taskService.novo(hnome.value);
        }
        if (resp.status) {
            atualizaTarefas()
            hid.value = '';
            hnome.value = '';
        }
    })

    const form = document.querySelector('form');
    // IDEAL SERIA USAR O o taskservice.login 
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // previne que o formulário seja enviado normalmente

        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;

        // envia os dados do formulário para a API
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json' ,
                
            },
            body: JSON.stringify({ usuario, senha })
        });

        // verifica se a resposta foi bem sucedida
        if (!response) {
          throw new Error(`Erro ao enviar dados: ${response.status}`);
        }

        // extrai o token da resposta da API
        const data = await response.json();
        const token = data.token;
        const tokenRecebido = localStorage.getItem('token')
        // armazena o token no localStorage
        localStorage.setItem('token', token);

        // redireciona para a página de /task, por exemplo
        window.location.href = '/task';
    });

    const obj = await taskService.login('abc', 'teste')
    console.log(obj)
})