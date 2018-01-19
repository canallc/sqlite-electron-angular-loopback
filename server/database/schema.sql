--
-- Required by Loopback
--
DROP TABLE IF EXISTS AccessToken;
CREATE TABLE AccessToken (
  id TEXT NOT NULL,
  ttl INTEGER,
  created DATETIME,
  PRIMARY KEY('id')
);
--
-- Required by Loopback
--
DROP TABLE IF EXISTS ACL;
CREATE TABLE ACL (
  model TEXT,
  property TEXT,
  accessType TEXT,
  permission TEXT,
  principalType TEXT,
  principalId TEXT,
  id INTEGER,
  PRIMARY KEY('id')
);

DROP TABLE IF EXISTS Todo;
CREATE TABLE Todo (
  id INTEGER,
  description TEXT,
  isComplete BOOLEAN,
  PRIMARY KEY('id')
)
