const express = require('express')
const cors = require('cors')
const connection = require('./db_config')
const app = express()

app.use(cors())
app.use(express.json())

const port = 3030

//cadastro de user
app.post('/cadastro', (req, res) => {
    const { username, password, email, placa, cor, modelo } = req.body
    const query = 'INSERT INTO users (username, password, email, placa, cor, modelo) VALUES (?, ?, ?, ?, ?, ?)'
    connection.query(query, [username, password, email, placa, cor, modelo], (err, result) => {
        if(err){
            return res.status(500).json({success: false, message: "Erro ao cadastrar usuario"})
        }
        res.json({success: true, message: "Usuário cadastrado com sucesso"})
    })
})

//login de user
app.post('/login', (req, res) => {
    const {email, password} = req.body
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?'
    connection.query(query, [email, password], (err, results) =>{
        if(err){
            return res.status(500).json({success: false, message: 'Erro no server.'})
        }
        if (results.length > 0){
            res.json({success: true, message: 'Login bem-sucedido!', user: results[0]})
        } else {
            res.json({success: false, message: 'Usuário ou senha incorretos!'})
        }
    })
})

//listar vagas
app.get('/vagas', (req, res) => {
    const query = `
        SELECT 
            v.id, v.numero, v.bloco, v.preferencial, 
            IF(v.preferencial = TRUE, 1, 0) AS preferencial_int, 
            v.disponivel, 
            (SELECT vo.user_id FROM vagas_ocupadas vo WHERE vo.vaga_id = v.id ORDER BY vo.id DESC LIMIT 1) AS ocupante_id
        FROM vagas v
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar vagas no backend:", err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar vagas', error: err.message });
        }
        console.log("Vagas enviadas pelo backend:", JSON.stringify(results.slice(0,2), null, 2));
        res.json({ success: true, vagas: results });
    });
});

app.post('/vagas/:vagaId/ocupar', (req, res) => {
    const { vagaId } = req.params
    const { userId } = req.body
    const queryOcupar = 'INSERT INTO vagas_ocupadas (vaga_id, user_id, data_entrada) VALUES (?, ?, NOW())'
    const queryAtualizarVaga = 'UPDATE vagas SET disponivel = FALSE WHERE id = ?'

    connection.beginTransaction((err) => {
        if (err){
            return res.status(500).json({success: false, message: 'Erro ao iniciar transação'})
        }

        connection.query(queryOcupar, [vagaId, userId], (err, result) => {
            if(err) {
                return connection.rollback(() => {
                    res.status(500).json({ success: false, message: 'Erro ao ocupar vaga'})
                })
            }

            connection.query(queryAtualizarVaga, [vagaId], (err) => {
                if(err){
                    return connection.rollback(() => {
                        res.status(500).json({ success: false, message: 'Erro ao atualizar vaga.'})
                    })
                }

                connection.commit((err) => {
                    if(err){
                        return connection.rollback(() =>{
                            res.status(500).json({ success: false, message: 'Erro ao finalizar transação.' })
                        })
                    }
                    res.json({ success: true, message: 'Vaga ocupada com sucesso!' })
                })
            })
        })
    })
})

app.delete('/vagas/:vagaId/desocupar', (req, res) => {
    const { vagaId } = req.params
    const queryDesocupar = 'DELETE FROM vagas_ocupadas WHERE vaga_id = ?'
    const queryAtualizarVaga = 'UPDATE vagas SET disponivel = TRUE WHERE id = ?'

    connection.beginTransaction((err) => {
        if (err){
            return res.status(500).json({success: false, message: 'Erro ao iniciar transação'})
        }

        connection.query(queryDesocupar, [vagaId], (err, result) => {
            if(err) {
                return connection.rollback(() => {
                    res.status(500).json({ success: false, message: 'Erro ao desocupar vaga'})
                })
            }

            connection.query(queryAtualizarVaga, [vagaId], (err) => {
                if(err){
                    return connection.rollback(() => {
                        res.status(500).json({ success: false, message: 'Erro ao atualizar vaga.'})
                    })
                }

                connection.commit((err) => {
                    if(err){
                        return connection.rollback(() =>{
                            res.status(500).json({ success: false, message: 'Erro ao finalizar transação.' })
                        })
                    }
                    res.json({ success: true, message: 'Vaga desocupada com sucesso!' })
                })
            })
        })
    })
})

app.put('/editar/:id', (req, res) => {
    const {id} = req.params
    const {username, email, password, placa, cor, modelo} = req.body
    let query = 'UPDATE users SET username = ?, email = ?, placa = ?, cor = ?, modelo =? WHERE id = ?'
    let values = [username, email, placa, cor, modelo, id]

    if(password){
        query = 'UPDATE users SET username = ?, password = ?, email = ?, placa = ?, cor = ?, modelo =? WHERE id = ?'
        values = [username, password, email, placa, cor, modelo, id]
    }

    connection.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json ({ success: false, message: 'Erro ao atualizar usuario' })
        }

        connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
            if(err){
                return res.status(500).json({success: false, message: 'Erro ao buscar o usuário'})
            }
            res.json({success: true, message: 'Cadastro atualizado com sucesso', user: results[0]})
        })
    })

})

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))