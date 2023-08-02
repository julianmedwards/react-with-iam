import express, { Router } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import jsonwebtoken from 'jsonwebtoken'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import crypto from 'crypto'
import db from '../db/db'
import { Client } from '@react-with-iam/types'
import config from '../config'

declare global {
    namespace Express {
        interface User extends Client.User {}
    }
}

// Passport authentication strategies
passport.use(
    new LocalStrategy(function verify(username, password, cb) {
        const getUser = db.users.findOne({
            where: {
                username: username,
            },
        })

        getUser.then(
            (user) => {
                if (user) {
                    // Get hash of req password and compare with hash in db.
                    crypto.pbkdf2(
                        password,
                        user.salt,
                        310000,
                        32,
                        'sha256',
                        function (err, hashedPassword) {
                            if (err) {
                                return cb(err)
                            }
                            if (
                                !crypto.timingSafeEqual(
                                    user.hashedPassword,
                                    hashedPassword
                                )
                            ) {
                                return cb(null, false)
                            }
                            return cb(null, {
                                id: user.id,
                                username: user.username,
                                createdAt: user.createdAt,
                                updatedAt: user.updatedAt,
                            })
                        }
                    )
                } else {
                    return cb(null, false)
                }
            },
            (error) => {
                return cb(error)
            }
        )
    })
)

passport.use(
    'jwt',
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'your_jwt_secret',
            issuer: config.jwtOptions.issuer,
            audience: config.jwtOptions.audience,
        },
        function (jwt_payload, cb) {
            const getUser = db.users.findOne({
                where: {
                    username: jwt_payload.username,
                },
            })

            getUser.then(
                (user) => {
                    if (user) {
                        return cb(null, {
                            id: user.id,
                            username: user.username,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                        })
                    } else {
                        return cb(null, false)
                    }
                },
                (error) => {
                    return cb(error, false)
                }
            )
        }
    )
)

// Auth route handlers
const router: Router = express.Router()

router.post('/login/password', (req, res, next) => {
    // Use Passport local strategy to check username and password.
    passport.authenticate(
        'local',
        { session: false },
        (err: Error, user: Express.User, info: string, status: number) => {
            if (err || !user) {
                console.error(err)
                return res.sendStatus(400)
            }
            req.login(user, { session: false }, (err) => {
                if (err) {
                    console.error(err)
                    res.sendStatus(500)
                }
                // generate a signed json web token with the contents of user
                // object and return it in the response
                const jwt = jsonwebtoken.sign(
                    user,
                    'your_jwt_secret',
                    config.jwtOptions
                )
                return res.json({
                    jwt,
                })
            })
        }
    )(req, res, next)
})

router.post('/signup', async function (req, res, next) {
    // Hash password
    var salt = crypto.randomBytes(16)
    crypto.pbkdf2(
        req.body.password,
        salt,
        310000,
        32,
        'sha256',
        function (err, hashedPassword) {
            if (err) {
                console.error(err)
                res.sendStatus(500)
            }

            const createUser = db.users.create({
                username: req.body.username,
                hashed_password: hashedPassword,
                salt,
            })

            createUser.then(
                (user) => {
                    if (user) {
                        // Don't send hashed password or salt to client!
                        const resUser: Express.User = {
                            username: user.username,
                            id: user.id,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                        }
                        // generate a signed json web token with the contents of
                        // user object and return it in the response
                        const jwt = jsonwebtoken.sign(
                            resUser,
                            'your_jwt_secret',
                            config.jwtOptions
                        )
                        return res.json({
                            jwt,
                        })
                    } else {
                        res.sendStatus(500)
                    }
                },
                (err) => {
                    if (err.name === 'SequelizeUniqueConstraintError') {
                        res.sendStatus(403)
                    } else {
                        console.error(err)
                        res.sendStatus(500)
                    }
                }
            )
        }
    )
})

export default router
