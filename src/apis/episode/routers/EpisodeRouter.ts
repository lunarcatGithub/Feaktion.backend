import { Router } from 'express'
import { authToken } from '../../../middleware/tokenVerify'
import EpisodeController from '../controller'
import FeaktionController from '../../feaktion/controller'
import CommentRouter from '../../comment/routers'

const router = Router({
    mergeParams: true
})

router.get('/:episode_id', authToken, EpisodeController.getEpisode)
router.post('/', authToken, EpisodeController.postEpisode)
router.delete('/:episode_id', authToken, FeaktionController.isFeaktionWriter, EpisodeController.deleteEpisode)
router.patch('/:episode_id', FeaktionController.isFeaktionWriter, EpisodeController.updateEpisode)
router.use('/:episode_id/comment', CommentRouter)
router.post('/:episode_id/like', authToken, EpisodeController.addEpisodeLike)
router.delete('/:episode_id/like', authToken, EpisodeController.removeEpisodeLike)

export default router