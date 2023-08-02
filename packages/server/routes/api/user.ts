import express from 'express'
import { Router } from 'express'
import db from '../../db/db'
import passport from 'passport'

const router: Router = express.Router()

router.get(
    '/:userId/ticker',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const getUser = db.users.findOne({ where: { id: req.params.userId } })

        getUser.then(
            async (user) => {
                if (user) {
                    res.send({ tickerValue: user.tickerValue })
                } else {
                    res.sendStatus(404)
                }
            },
            (err: Error) => {
                console.error(err)
                res.sendStatus(500)
            }
        )
    }
)

router.patch(
    '/:userId/ticker',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const getUser = db.users.findOne({ where: { id: req.params.userId } })

        getUser.then(
            async (user) => {
                if (user) {
                    await user.update({ tickerValue: (user.tickerValue += 1) })
                    res.sendStatus(200)
                } else {
                    res.sendStatus(404)
                }
            },
            (err: Error) => {
                console.error(err)
                res.sendStatus(500)
            }
        )
    }
)

export default router
