class MongooseRepository {
  constructor(Model) {
    this.collection = Model
  }

  /**
   * @returns {Promise<*>}
   */
  async count() {
    return this.collection.estimatedDocumentCount()
  }

  /**
   * @param {object} query
   * @param {boolean|undefined} multiple
   * @param {boolean|undefined} count
   * @param {boolean|undefined} lean
   * @param {object|undefined} select
   * @param {object|undefined} populate
   * @param sort
   * @param {int} offset
   * @param {int} limit
   * @returns {Promise<*>}
   */
  async find(
    query = {},
    { multiple = true, count, lean, select, populate, sort, offset, limit } = {}
  ) {
    const results = multiple
      ? this.collection.find(query, select)
      : this.collection.findOne(query, select)

    if (populate) {
      results.populate(populate)
    }

    if (sort) {
      results.sort(sort)
    }
    if (limit) {
      results.limit(limit)
    }
    if (offset) {
      results.skip(offset)
    }

    if (count) {
      return results.countDocuments().exec()
    }
    if (lean) {
      return results.lean().exec()
    }

    return results.exec()
  }

  /**
   * @param id
   * @param {object} select
   * @param {object} populate
   * @param {boolean} lean
   * @returns {Promise<*>}
   */
  async findById(id, { select, populate, lean } = {}) {
    const result = this.collection.findById(id)

    if (populate) {
      result.populate(populate)
    }
    if (select) {
      result.select(select)
    }
    return lean ? result.lean().exec() : result.exec()
  }

  /**
   * @param ids
   * @param {object} searchProps
   * @returns {Promise<*>}
   */
  async findByIds(ids, searchProps) {
    return this.find({ _id: { $in: ids } }, searchProps)
  }

  /**
   * @param {object} select
   * @param {object} populate
   * @param {boolean} lean
   * @returns {Promise<*>}
   */
  async findAll({ select, populate, lean } = {}) {
    const result = this.collection.find({})

    if (populate) {
      result.populate(populate)
    }
    if (select) {
      result.select(select)
    }
    return lean ? result.lean().exec() : result.exec()
  }

  /**
   * @param {object|Entity} document
   * @returns {Promise<*>}
   */
  async create(document) {
    const model = this.collection(document)
    return model.save()
  }

  /**
   * @param {object} query
   * @returns {Promise<*>}
   */
  async deleteMany(query) {
    return this.collection.deleteMany(query).exec()
  }

  /**
   * @param {array<object|Entity>} documents
   * @returns {Promise<void>}
   */
  async createMany(documents) {
    return this.collection.insertMany(documents)
  }

  /**
   * @param {object|Entity} document

   * @param {object} body
   * @returns {Promise<*>}
   */
  async update(document, body = {}) {
    if (document instanceof this.collection) {
      return document.save()
    }
    const id = typeof document._id !== "undefined" ? document._id : document

    return this.collection.findByIdAndUpdate(id, body, { new: true })
  }

  /**
   * @param {object|Entity} document
   * @returns {Promise<*>}
   */
  async remove(document) {
    const reloadedDocument = await this.reload(document)
    return reloadedDocument.remove()
  }

  /**
   * @param {object} query
   * @returns {Promise<*>}
   */
  async deleteOne(query) {
    return this.collection.deleteOne(query)
  }

  /**
   * @param {object|Entity} document
   * @param {object} select
   * @param {object} populate
   * @param {boolean} lean
   * @returns {Promise<*>}
   */
  async reload(document, { select, populate, lean } = {}) {
    // Document is already reloaded
    if (!select && !populate && !lean && document instanceof this.collection) {
      return document
    }

    return typeof document._id !== "undefined"
      ? this.findById(document._id, { select, populate, lean })
      : this.findById(document, { select, populate, lean })
  }
}

module.exports = MongooseRepository
