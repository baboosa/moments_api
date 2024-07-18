import type { HttpContext } from '@adonisjs/core/http'
import Moment from '../models/moment.js'
import Comment from '../models/comment.js'

export default class CommentsController {
  async store({ request, params, response }: HttpContext) {
    const body = request.body()
    const momentId = params.momentId

    await Moment.findOrFail(momentId)

    body.momentId = momentId
    const comment = await Comment.create(body)

    response.status(201)

    return {
      message: `Comment added successfully!`,
      data: comment,
    }
  }
}
