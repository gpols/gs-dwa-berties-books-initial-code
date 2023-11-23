module.exports = function (app, shopData) {
  // Handle our routes

  // Route for the home page
  app.get('/', function (req, res) {
    res.render('index.ejs', shopData)
  })

  // Route for the about page
  app.get('/about', function (req, res) {
    res.render('about.ejs', shopData)
  })

  // Route for the search page
  app.get('/search', function (req, res) {
    res.render('search.ejs', shopData)
  })

  // Route for handling search results
  app.get('/search-result', function (req, res) {
    // Get the search keyword from the query parameters
    let searchKeyword = req.query.keyword

    // Search for books with an exact match to the search keyword
    let sqlquery = 'SELECT * FROM books WHERE name LIKE ?' // LIKE  is use to retrieve a partial match
    let queryResult = ['%' + searchKeyword + '%'] // the percent sign is a wildcard character that matches any sequence of characters

    // Execute the SQL query
    db.query(sqlquery, queryResult, (err, result) => {
      if (err) {
        res.redirect('./')
      }
      // Send the search results to the client using a new page
      res.render('result-search.ejs', { result, searchKeyword })
    })
  })

  // Route for the registration page
  app.get('/register', function (req, res) {
    res.render('register.ejs', shopData)
  })

  // Route for handling registration form submission
  app.post('/registered', function (req, res) {
    // saving data in database
    res.send(
      ' Hello ' +
        req.body.first +
        ' ' +
        req.body.last +
        ' you are now registered!  We will send an email to you at ' +
        req.body.email
    )
  })

  // Route for displaying a list of books
  app.get('/list', function (req, res) {
    let sqlquery = 'SELECT * FROM books' // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect('./')
      }
      let newData = Object.assign({}, shopData, { availableBooks: result })
      console.log(newData)
      res.render('list.ejs', newData)
    })
  })

  // Route for adding a new book
  app.get('/addbook', function (req, res) {
    res.render('addbook.ejs', shopData)
  })

  // Route for handling the submission of a new book form
  app.post('/bookadded', function (req, res) {
    // saving data in database
    let sqlquery = 'INSERT INTO books (name, price) VALUES (?,?)'
    // create new data with input
    let newrecord = [req.body.name, req.body.price]
    // execute sql query
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message)
      } else {
        res.send(
          ' This book is added to database, name: ' +
            req.body.name +
            ' price ' +
            req.body.price
        )
      }
    })
  })

  // Route for displaying a list of books with prices under 20
  app.get('/bargain', function (req, res) {
    let sqlquery = 'SELECT * FROM books WHERE price < 20' // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect('./')
      }
      // creates new object with results and render to a new page
      let newData = Object.assign({}, shopData, { availableBooks: result })
      console.log(newData)
      res.render('bargain.ejs', newData)
    })
  })
}
