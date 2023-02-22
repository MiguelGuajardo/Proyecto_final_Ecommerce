const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const nodemailer = require("nodemailer")
const logger = require("../utils/scriptLogger")

const User = require("../model/User")


passport.serializeUser((user,done)=>{
    done(null, user.id);
})
passport.deserializeUser(async(id,done)=>{
    const user = await User.findById(id)
    done(null, user)
})


passport.use("local-register", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback:true,
}, async (req,email,password,done)=>{
    const {alias,edad,direccion,phone,firstName,lastName} = req.body
        req.session.user = alias
        const newUser = new User()
        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.alias = alias;
        newUser.edad = edad;
        newUser.direccion = direccion;
        newUser.phone = phone;
        newUser.creationDate = new Date().toLocaleString();
        newUser.password = newUser.encryptPassword(password);
        await newUser.save()
        sendRegister(email,firstName,lastName,alias,direccion,phone)
        done(null, newUser)
    }
))
passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback:true
}, async(req,email,password,done)=>{
    const user = await User.findOne({email:email})
    if(!user){
        return done(null,false,logger.error({Message:"No User Found"}) )
    }
    if(!user.comparePassword(password)){
        return done(null,false,logger.error({Message:"Incorrect password"}))
    }
    done(null, user)
}))

async function sendRegister(email,firstName,lastName,alias,direccion,phone){

   const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: "vxjwhdkadlunfjnr",
    }
   })

    const mailOptions = {
    from: 'Bikes',
    to: process.env.ADMIN_EMAIL,
    subject: 'Nuevo registro',
    html:`
    <div class="wrapper">
        <div class="right">
            <div class="info">
                <h3>Información</h3>
                <div class="info_data">
                    <div class="data">
                        <h4>Email</h4>
                        <p>${email}</p>
                    </div>
                    <div class="data">
                        <h4>Teléfono</h4>
                        <p>${phone}</p>
                    </div>
                </div>
                <div class="info_data">
                    <div class="data">
                        <h4>Nombre</h4>
                        <p>${firstName}</p>
                    </div>
                    <div class="data">
                        <h4>Apellido</h4>
                        <p>${lastName}</p>
                    </div>
                </div>
                <div class="info_data">
                    <div class="data">
                        <h4>Alias</h4>
                        <p>${alias}</p>
                    </div>
                    <div class="data">
                        <h4>Dirección</h4>
                        <p>${direccion}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}
try {
    const info = await transporter.sendMail(mailOptions)
} catch (error) {
    logger.error(error)
}
}