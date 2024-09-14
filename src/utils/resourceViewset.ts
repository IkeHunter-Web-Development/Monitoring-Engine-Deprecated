import { type NextFunction, type Request, type Response, Router } from 'express'
import type { Document, Model } from 'mongoose'
import { NotFoundError } from './exceptions'
import { created, errorResponse, ok } from './responses'

const apiRequest = (
  cb: (req: Request, res: Response, next: NextFunction) => Promise<any | void> | any | void,
  onSuccess?: (res: Response, data?: any, showStatus?: boolean) => void
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await cb(req, res, next)
      return onSuccess ? onSuccess(res, data) : ok(res, data)
    } catch (e) {
      console.log('error:', e)
      return errorResponse(e, res, next)
    }
  }
}

export class ResourceViewset<T extends Model<any>, S extends Record<string, any>> {
  constructor(
    public model: T,
    public serializer: (
      obj: Document | Document[] | any
    ) => Record<string, any> | Promise<Record<string, any>>,
    public validator: (data: any) => S
  ) {}

  private apiWrapper = apiRequest

  private async handleCreate(req: Request, res: Response, next: NextFunction) {
    const { body } = req
    const payload = this.validator(body)
    const obj = await this.model.create(payload)

    return this.serializer(obj)
  }
  private async handleList(req: Request, res: Response, next: NextFunction) {
    return this.serializer(await this.model.find({}))
  }
  private async handleGet(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const result = await this.model.findById(id)

    if (!result) throw new NotFoundError(this.model.name, { id })

    return this.serializer(result)
  }
  private async handleUpdate(req: Request, res: Response, next: NextFunction) {
    const { body, params } = req
    const payload = this.validator(body)
    const obj = await this.model.findOneAndUpdate({ _id: params.id }, payload, { new: true })

    if (!obj) throw new NotFoundError(this.model.name, { id: params.id })

    return this.serializer(obj)
  }
  private async handlePartialUpdate(req: Request, res: Response, next: NextFunction) {
    const { body, params } = req
    const payload = this.validator(body)
    const obj = await this.model.findOneAndUpdate({ _id: params.id }, payload, { new: true })

    if (!obj) throw new NotFoundError(this.model.name, { id: params.id })

    return this.serializer(obj)
  }
  private async handleDelete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const result: Document<T> | null = await this.model.findById(id)

    if (!result) throw new NotFoundError(this.model.name, { id })

    await result.deleteOne()

    return this.serializer(result)
  }

  public create = this.apiWrapper(this.handleCreate.bind(this), created)
  public list = this.apiWrapper(this.handleList.bind(this))
  public get = this.apiWrapper(this.handleGet.bind(this))
  public update = this.apiWrapper(this.handleUpdate.bind(this))
  public partialUpdate = this.apiWrapper(this.handlePartialUpdate.bind(this))
  public delete = this.apiWrapper(this.handleDelete.bind(this))

  registerRouter(path = '/'): Router {
    const router = Router()

    router.post(path, this.create)
    router.get(path, this.list)
    router.get(`${path}:id`, this.get)
    router.post(`${path}:id`, this.update)
    router.patch(`${path}:id`, this.partialUpdate)
    router.delete(`${path}:id`, this.delete)

    return router
  }
}
