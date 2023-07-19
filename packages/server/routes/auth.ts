import express, { Router } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import jsonwebtoken from 'jsonwebtoken'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import crypto from 'crypto'
import db from '../db/db'
import { Client } from '@react-with-iam/types'

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
                                    user.hashed_password,
                                    hashedPassword
                                )
                            ) {
                                return cb(null, false, {
                                    message: 'Incorrect username or password.',
                                })
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
                    return cb(null, false, {
                        message: 'Incorrect username or password.',
                    })
                }
            },
            (error) => {
                return cb(error)
            }
        )
    })
)

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secret',
            issuer: 'localhost',
            audience: 'localhost',
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
                return res.status(400).json({
                    message: 'Something is not right',
                })
            }
            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err)
                }
                // generate a signed json web token with the contents of user
                // object and return it in the response
                const jwt = jsonwebtoken.sign(user, 'your_jwt_secret')
                return res.json({
                    jwt,
                    user: user,
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
                return next(err)
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
                        const clientFacingUser = {
                            username: user.username,
                            id: user.id,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                        }
                        // generate a signed json web token with the contents of
                        // user object and return it in the response
                        const jwt = jsonwebtoken.sign(
                            clientFacingUser,
                            'your_jwt_secret'
                        )
                        return res.json({
                            jwt,
                            user: clientFacingUser,
                        })
                    } else {
                        return next(new Error('Failed to register new user.'))
                    }
                },
                (error) => {
                    if (error.name === 'SequelizeUniqueConstraintError') {
                        res.sendStatus(403)
                    } else {
                        return next(error)
                    }
                }
            )
        }
    )
})

export default router
