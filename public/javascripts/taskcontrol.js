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
                    let resp = await taskService.exclui(item.id, localStorage.getItem('token'))
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
            resp = await taskService.altera(hid.value, hnome.value, localStorage.getItem('token'));
        } else {
            resp = await taskService.novo(hnome.value, localStorage.getItem('token'));
        }
        if (resp.status) {
            atualizaTarefas()
            hid.value = '';
            hnome.value = '';
        }
    })

    const form = document.getElementById('login');
    // IDEAL SERIA USAR O o taskservice.login 
    form.addEventListener('submit', async function(e)  {
        e.preventDefault(); // previne que o formulário seja enviado normalmente

        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        const response = await taskService.login(usuario, senha)
        console.log('Impressao do Response em taskcontrol -> ' + response)
        console.log(response)
        // verifica se a resposta foi bem sucedida
        if (!response.status) {
            throw new Error(`Erro ao enviar dados: ${response.status}`);
        }
        
        // extrai o token da resposta da API
        //const data = await response.json();
        const token = response.token;
        // armazena o token no localStorage
        localStorage.setItem('token', token);
        if(response.status) {
            window.location.href = '/task';      
        }
        // redireciona para a página de /task, por exemplo
    });

    //const obj = await taskService.login('abc', 'teste')
})