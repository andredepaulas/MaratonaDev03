//configurando o servidor
const express = require("express")
const server = express()


//configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

//habilitar body do form
server.use(express.urlencoded({ extended: true }))

//config conexão db
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurado a  template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, //boolean
})

// apagar depois 
const donors = []

//configurar a apresentação da página
server.get("/", function(req, res) {
    db.query("select * from donors", function(err, result) {
        if (err) return res.send("Erro no banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })


})

server.post("/", function(req, res) {
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    //validação se campos vazios
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatório")
    }

    ///coloca valores dentro do db
    const query = `INSERT INTO donors("name", "email", "blood")
     VALUES($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {

        //fluxo de erro
        if (err) return res.send("Erro no banco de dados.")

        //fluxo ideal
        return res.redirect("/")
    })


})

//ligar servidor e permitir acesso na porta 5500
server.listen(3000, function() {
    console.log("iniciei o servidor.")
})