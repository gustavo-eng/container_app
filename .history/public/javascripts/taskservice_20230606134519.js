let taskService = {
    lista: async function() {
        const response = await fetch('/api/tasks')
        return await response.json()
    },
    busca: async function(id) {
        const response = await fetch('/api/tasks/' + id)
        return await response.json()
    },
    novo: async function(nome, token) {
        const data = {
            method: 'POST',
            headers: {'Content-type': 'application/json', 'Custom-Header': token},
            body: JSON.stringify({nome: nome})
        }
        const response = await fetch('/api/tasks', data)
        return await response.json()
    },
    altera: async function(id, nome, token) {
        const data = {
            method: 'PUT',
            headers: {'Content-type': 'application/json', 'Custom-Header': token},
            body: JSON.stringify({nome: nome})
        }
        const response = await fetch('/api/tasks/'+id, data)
        return await response.json()
    },
    exclui: async function(id, token) {
        const header =   {
            'Content-type': 'application/json',
            'Custom-Header': token
        }
        const response = await fetch('/api/tasks/'+id, {method: 'DELETE', headers: header})
        return await response.json()
    },
    login: async function (user, senha) {
        const data = {
            method: 'POST',
            headers: {
            'Content-type': 'application/json',
            //'Custom-Header': localStorage.getItem('token')
        },
            body: JSON.stringify({usuario: user, senha: senha})
        }
        const response = await fetch('/', data)
        console.log('return await response --> ')
        console.log(response)
        return await response.json()
    }
}

export default taskService