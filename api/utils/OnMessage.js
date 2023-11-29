
const onMessage = async (conn, doc, message,authenticate) => {
    // Ignore non-string messages, i.e. ArrayBuffer sync updates. They are handled by messageListener.
    if (typeof message !== 'string') return

    let json
    try {
      json = JSON.parse(message)
    } catch (e) {
      console.error('string message must be json, e.g. { type: "auth", auth: 12345 }', message)
      conn.send('invalid json')
      return
    }

    /**************************************
    * Authentication
    **************************************/

    if (!json.auth) {
      console.error('auth param required', json)
      conn.send('auth required in every message')
      return
    }

    const authenticated = authenticate(json.auth, { name: conn.docName, params: json })
    console.log(authenticated)
    if (!authenticated) {
      conn.authenticated = false
      console.error('access denied:', json)
      if (conn.readyState === WebSocket.OPEN) {
        conn.send('access-denied')
      }
      conn.close()
    } else if (!conn.authenticated) {
      // first time authentication
      // Does this need to be executed again after a disconnection?
      conn.authenticated = true
      conn.send('authenticated')
      setupWSConnection(conn, conn.req, { docName: conn.docName, gc: conn.gc })
    }

    /**************************************
    * Route handling
    **************************************/

    // noop if request type is auth
    // json.auth is checked in every request (below)
    if (json.type === 'auth') return

    if (!routes) {
      console.error('no routes')
      conn.send('no routes')
      return
    }

    if (!routes[json.type]) {
      console.error('Invalid route', json.type)
      console.info('Valid routes', Object.keys(routes))
      conn.send('invalid route')
      return
    }

    // Note: sending undefined causes an infinite loop on the client
    const result = routes[json.type](json)
    if (result) {
      conn.send(JSON.stringify(result))
    }
  }
module.exports={
    onMessage
}