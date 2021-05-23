module.exports = {
    PORT:  8000 ||process.env.PORT,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.NODE_ENV === 'production'?
    'postgres://ueyiglrh:OsZghd9-Jg6-x4W6cvT37GdFHELB3yAO@queenie.db.elephantsql.com:5432/ueyiglrh'
    : `postgresql://amayer@localhost/chores`
  }