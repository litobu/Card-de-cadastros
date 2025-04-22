document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('userForm');
    const btnLimpar = document.getElementById('btnLimpar');
    const cepInput = document.getElementById('cep');
    const usersContainer = document.getElementById('usersContainer');
    
    // Carrega usuários ao iniciar
    loadUsers();
    
    // Evento para buscar CEP
    cepInput.addEventListener('blur', function() {
        const cep = this.value.replace(/\D/g, '');
        
        if (cep.length !== 8) {
            alert('CEP deve conter 8 dígitos');
            return;
        }
        
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    alert('CEP não encontrado');
                    return;
                }
                
                document.getElementById('logradouro').value = data.logradouro;
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
                document.getElementById('numero').focus();
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
                alert('Erro ao buscar CEP');
            });
    });
    
    // Evento de submit do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const user = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            cep: document.getElementById('cep').value,
            logradouro: document.getElementById('logradouro').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            id: Date.now() // ID único baseado no timestamp
        };
        
        saveUser(user);
        form.reset();
        loadUsers();
    });
    
    // Evento para limpar formulário
    btnLimpar.addEventListener('click', function() {
        form.reset();
    });
    
    // Função para salvar usuário no localStorage
    function saveUser(user) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Função para carregar usuários do localStorage
    function loadUsers() {
        usersContainer.innerHTML = '';
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.length === 0) {
            usersContainer.innerHTML = '<p>Nenhum usuário cadastrado ainda.</p>';
            return;
        }
        
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <h3>${user.nome}</h3>
                <p><strong>E-mail:</strong> ${user.email}</p>
                <p><strong>Telefone:</strong> ${user.telefone || 'Não informado'}</p>
                <p><strong>Endereço:</strong> ${user.logradouro}, ${user.numero}${user.complemento ? ', ' + user.complemento : ''}</p>
                <p><strong>Bairro:</strong> ${user.bairro}</p>
                <p><strong>Cidade/UF:</strong> ${user.cidade}/${user.estado}</p>
                <p><strong>CEP:</strong> ${user.cep}</p>
                <button onclick="deleteUser(${user.id})" class="btn-clear" style="margin-top: 10px;">Excluir</button>
            `;
            usersContainer.appendChild(userCard);
        });
    }
    
    // Função global para deletar usuário
    window.deleteUser = function(id) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(user => user.id !== id);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
    };
});