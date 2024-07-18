/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
//import CommentsController from 'app/controllers/comments_controller.js'
const CommentsController = () => import('#controllers/comments_controller')
const MomentsController = () => import('#controllers/moments_controller')

router
  .group(() => {
    router.get('/', async () => {
      return {
        hello: 'world',
      }
    })

    //router.post('/moments', async () => {
    //  const momentsController = new MomentsController()
    //  return momentsController.store()
    //})

    router.resource('moments', MomentsController).apiOnly()
    router.post('moments/:momentId/comments', [CommentsController, 'store'])
  })
  .prefix('/api')
