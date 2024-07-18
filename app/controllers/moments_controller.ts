import type { HttpContext } from '@adonisjs/core/http'
import Moment from '../models/moment.js'
import Application from '@adonisjs/core/services/app'

import { v4 as uuidv4 } from 'uuid'

export default class MomentsController {
  private validateOptions = {
    types: ['image'],
    size: '2mb',
  }
  async store({ request, response }: HttpContext) {
    const body = request.body()

    const image = request.file('image', this.validateOptions)

    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      body.image = imageName
    }

    const moment = await Moment.create(body)

    response.status(201)
    return {
      message: 'Moment created successfully',
      data: moment,
    }
  }

  async index() {
    const moments = await Moment.query().preload('comments')
    return {
      data: moments,
    }
  }

  async show({ params }: HttpContext) {
    const moment = await Moment.findOrFail(params.id)

    await moment.load('comments')

    return {
      data: moment,
    }
  }

  async destroy({ params }: HttpContext) {
    const moment = await Moment.findOrFail(params.id)
    await moment.delete()

    return {
      message: `Deleted memory`,
      data: moment,
    }
  }

  async update({ params, request }: HttpContext) {
    const body = request.body()
    const moment = await Moment.findOrFail(params.id)

    moment.title = body.title
    moment.description = body.description

    if (moment.image !== body.image || !moment.image) {
      const image = request.file('image', this.validateOptions)

      if (image) {
        const imageName = `${uuidv4()}.${image.extname}`
        await image.move(Application.tmpPath('uploads'), {
          name: imageName,
        })

        moment.image = imageName
      }
    }

    await moment.save()

    return {
      message: `Moment updated successfully`,
      data: moment,
    }
  }
}
