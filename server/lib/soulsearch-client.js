const EventEmitter = require('events')
const path = require('path')
const os = require('os')
const { nanoid } = require('nanoid')
const mime = require('mime')
const normalizePath = require('normalize-path')
const slsk = require('slsk-client')

class Emitter extends EventEmitter {}

function soulsearch (options = {}) {
  const _defaults = {
    user: null,
    pass: null,
    extensions: []
  }

  const _opts = { ..._defaults, ...options }
  let _client = null
  const _queries = {}

  const emitter = new Emitter()

  function _connect (opts) {
    if (typeof opts === 'undefined') {
      opts = {
        user: _opts.user,
        pass: _opts.pass
      }
    }

    if (_client) {
      return _client
    }

    _client = new Promise((resolve, reject) => {
      slsk.connect(opts, (err, client) => {
        if (err) {
          return reject(err)
        }

        return resolve(client)
      })
    })

    return _client
  }

  function _initQuery (query, opts = {}) {
    const id = nanoid()

    _queries[id] = {}

    _initQueryEmitter(id)
    _initQueryFolder(id)
    _initQueryResults(id)
    _initQueryCounters(id)
    _setQueryLimit(id, opts.limit)

    return id
  }

  function _isQueryInitialized (id) {
    return typeof _queries[id] !== 'undefined'
  }

  function _initQueryEmitter (id) {
    _queries[id].emitter = new Emitter()
  }

  function _initQueryFolder (id) {
    _queries[id].folder = null
  }

  function _initQueryResults (id) {
    _queries[id].results = {}
  }

  function _initQueryCounters (id) {
    _queries[id].counters = {
      files: 0,
      folders: 0
    }
  }

  function _getQueryLimit (id) {
    return _queries[id].limit
  }

  function _setQueryLimit (id, limit) {
    if (limit && parseInt(limit, 10)) {
      _queries[id].limit = limit
    } else {
      _queries[id].limit = 0
    }
  }

  function _getQueryEmitter (id) {
    return _queries[id].emitter
  }

  function _getQueryFolder (id) {
    if (typeof _queries[id] === 'undefined') {
      return null
    }

    return _queries[id].folder
  }

  function _setQueryFolder (id, folder) {
    _queries[id].folder = folder
  }

  function _isQueryFolderSet (id, folder) {
    return _queries[id].folder === folder
  }

  function _getResultsFolder (id) {
    const folder = _getQueryFolder(id)

    if (!folder) {
      return null
    }

    return _queries[id].results[folder]
  }

  function _setResultsFolder (id, folder, data) {
    _queries[id].results[folder] = data
  }

  function _isResultsFolderSet (id, folder) {
    return typeof _queries[id].results[folder] !== 'undefined'
  }

  function _addResultsFile (id, folder, data) {
    _incrementCounter('files', id)

    _queries[id].results[folder].files.push(data)
  }

  function _getResultsCounters (id) {
    return _queries[id].counters
  }

  function _getFolderCount (id) {
    return _queries[id].counters.folders
  }

  function _incrementCounter (counter, id) {
    _queries[id].counters[counter]++
  }

  function _isExtensionAllowed (ext) {
    if (!_opts.extensions.length) {
      return true
    }

    return _opts.extensions.includes(ext)
  }

  function _emit (evt, id, data) {
    const emitter = _getQueryEmitter(id)

    return emitter.emit(evt, data)
  }

  function _cleanup (id) {
    if (!_isQueryInitialized(id)) {
      return null
    }

    const counters = _getResultsCounters(id)
    _emit('done', id, counters)

    delete _queries[id]
  }

  function _getDisplayFolder (folder) {
    const parts = folder.split('/')
    const filtered = []

    for (let i = 0; i < parts.length; i++) {
      if (i === 0) {
        continue
      }

      const part = parts[i].toLowerCase()

      if (part.includes('@@')) {
        continue
      }

      if (i > 0 && ['users', 'home'].includes(parts[i - 1].toLowerCase())) {
        continue
      }

      if (part.includes('soulseek') || part.includes('slsk')) {
        continue
      }

      filtered.push(parts[i])
    }

    return filtered.slice(-2).join('/')
  }

  function _handleResult (id) {
    return (result) => {
      if (!_isQueryInitialized(id)) {
        return null
      }

      if (!result.slots) {
        return null
      }

      const filePath = normalizePath(result.file)
      const { dir, name, ext } = path.parse(filePath)
      const extension = ext.substring(1)

      if (!_isExtensionAllowed(extension)) {
        return null
      }

      const currentFolder = _getQueryFolder(id)

      if (currentFolder !== dir) {
        _incrementCounter('folders', id)

        if (currentFolder && _isQueryFolderSet(id, currentFolder)) {
          _emit('folder', id, _getResultsFolder(id))
        }

        const limit = _getQueryLimit(id)

        if (limit && _getFolderCount(id) >= limit) {
          return _searchComplete(id)
        }

        _setQueryFolder(id, dir)
      }

      if (!_isResultsFolderSet(id, dir)) {
        _setResultsFolder(id, dir, {
          speed: result.speed,
          folder: _getDisplayFolder(dir),
          files: []
        })
      }

      _addResultsFile(id, dir, {
        name,
        file: result.file,
        size: result.size,
        user: result.user,
        bitrate: result.bitrate,
        ext: extension,
        mime: mime.getType(extension)
      })
    }
  }

  function _searchComplete (id) {
    const folder = _getResultsFolder(id)

    if (folder) {
      _emit('folder', id, folder)
    }

    return _cleanup(id)
  }

  async function search (query, opts = {}) {
    const client = await _connect()
    const queryId = _initQuery(query, opts)
    const emitter = _getQueryEmitter(queryId)
    const listener = `found:${query}`

    client.search({
      req: query,
      timeout: opts.timeout || 4000
    }, (err) => {
      if (err) {
        _emit('error', queryId, err)

        _cleanup(queryId)

        return client.removeAllListeners()
      }

      _searchComplete(queryId)

      return client.removeAllListeners(listener)
    })

    client.on(listener, _handleResult(queryId))

    return emitter
  }

  async function download (file, filepath) {
    const client = await _connect()
    const data = {
      file,
      path: filepath || path.join(os.tmpdir(), 'soulsearch', nanoid())
    }

    return new Promise((resolve, reject) => {
      client.downloadStream(data, (err, stream) => {
        if (err) {
          return reject(err)
        }

        return resolve(stream)
      })
    })
  }

  return {
    search,
    download,
    emitter
  }
}

module.exports = soulsearch
