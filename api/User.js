const express = require('express');
const router = express.Router();

//mongodb user model
const User = require('./../models/User');

//Password handler
const bcrypt = require('bcrypt');

//Signup
router.post('/signup', (req, res) => {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (name == "" || email == "" || password == "") {
        res.json({
            status: "FALHA",
            message: "Campos vazios"
        })
    } else if (!/^[a-zA-Z]*$/.test(name)) {
        res.json({
            status: "FALHA",
            message: "Nome inválido"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FALHA",
            message: "Email inválido"
        })
    } else if (password.length < 8) {
        res.json({
            status: "FALHA",
            message: "Senha muito curta"
        })
    } else {
        //Checking if user already exists
        User.find({ email }).then(result => {
            if (result.length) {
                //If user already exists
                res.json({
                    status: "FALHA",
                    message: "Já existe usuário com este email"
                })
            } else {
                //Password handling
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword
                    });

                    newUser.save()
                        .then(result => {
                            res.json({
                                status: "SUCESSO",
                                message: "Cadastro bem-sucedido",
                                data: result
                            })
                                .catch(err => {
                                    res.json({
                                        status: "FALHA",
                                        message: "Um erro ocorreu ao salvar conta do usuário"
                                    });
                                });
                        })
                })
                    .catch(err => {
                        res.json({
                            status: "FALHA",
                            message: "Um erro ocorreu ao processar senha"
                        });
                    })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FALHA",
                message: "An error occured while checking for existing user"
            })
        })
    }
})

//Signin
router.post('/signin', (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
        res.json({
            status: "FALHA",
            message: "Credenciais vazias"
        })
    } else {
        //Check if user exists
        User.find({ email })
            .then(data => {
                if (data.length) {
                    const hashedPassword = data[0].password;
                    bcrypt.compare(password, hashedPassword).then(result => {
                        if (result) {
                            res.json({
                                status: "SUCESSO",
                                message: "Login completo",
                                userId: data[0]._id,
                                name: data[0].name,
                                email: data[0].email
                            })
                        } else {
                            res.json({
                                status: "FALHA",
                                message: "Senha inválida"
                            })
                        }
                    })
                        .catch(err => {
                            res.json({
                                status: "FALHA",
                                message: "Um erro ocorreu ao comparar senhas",
                            })
                        })
                } else {
                    res.json({
                        status: "FALHA",
                        message: "Credenciais inválidas",
                    })
                }
            })
            .catch(err => {
                res.json({
                    status: "FALHA",
                    message: "Um erro ocorreu ao checar por usuário existente",
                })
            })
    }
})

// Buscar amigo
router.post('/add/:userId/:friendName', async (req, res) => {
  const { userId, friendName } = req.params;

  try {
    const user = await User.findById(userId);
    const friend = await User.findOne({ name: friendName });

    if (!user || !friend) return res.status(404).json({ message: 'Usuário não encontrado' });
    if (user.friends.includes(friend._id)) return res.status(400).json({ message: 'Já são amigos' });

    user.friends.push(friend._id);
    await user.save();

    res.json({ message: 'Amigo adicionado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

//Listar todos os usuários
router.get('/', async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
})


//Obter perfil de usuário
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-password').populate('friends', 'name email');

    if (!user) return res.status(404).send('Usuário não encontrado');

    res.json(user);
})

module.exports = router;