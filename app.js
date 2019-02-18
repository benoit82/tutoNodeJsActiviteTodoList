var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//sauvegarde de la todolist & initialisation
var todolist = [];

server.listen(8080);


/* On affiche la todolist et le formulaire */
    app.get('/', function(req, res) { 
    res.render('todo.ejs', {todolist: todolist});
})


// utilisation de socket.io
io.sockets.on('connection', (socket) => {
    //sur connection, on renvoie la todolist en état sur tous les clients
    // on stock la fonction dans une variable réutilisable
    var reload = () => {
        socket.emit('load_todolist', todolist);
        socket.broadcast.emit('load_todolist', todolist);
    };
    reload();
    
    //si on reçoit une nouvelle tache on l'ajoute et on emet la nouvelle liste à jour
    socket.on('nouvelle_tache', (tache) => {
        todolist.push(tache);
        reload();
    });

    //si on supprime une tache
    socket.on('suppr_tache', (index) => {
        todolist.splice(index, 1);
        reload();
    });
})