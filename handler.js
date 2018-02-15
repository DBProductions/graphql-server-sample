module.exports = class {
  /**
   * Set connection and users
   * @param {Array} users
   */
  constructor(connection, users) {
    this.connection = connection;
    this.users = [];
    users.forEach((val) => {
      this.users.push({
        id: val.id,
        email: val.email,
        age: val.age,
        company: {
          id: val.cid,
          name: val.compname,
        },
      });
    });
  }
  /**
   * set company for user
   * @param {String} company
   */
  async setCompany(company) {
    return new Promise((resolve, reject) => {
      const companyInDb = `SELECT * FROM companies WHERE name="${company}";`;
      this.connection.query(companyInDb, (selectError, selectResults) => {
        if (selectError) {
          reject(selectError);
        }
        if (selectResults.length > 0) {
          resolve(selectResults[0].id);
        } else {
          const addCompanySql = `INSERT INTO companies (name) VALUES("${company}");`;
          this.connection.query(addCompanySql, (insertError, insertResults) => {
            if (insertError) {
              reject(insertError);
            }
            resolve(insertResults.insertId);
          });
        }
      });
    });
  }
  /**
   * add a new user
   * @param {String} email
   * @param {String} age
   */
  async addUser(args) {
    return new Promise((resolve, reject) => {
      const { email, age, company } = args;
      this.setCompany(company).then((val) => {
        const sql = `INSERT INTO users (email, age, company) VALUES("${email}", ${age}, ${val});`;
        this.connection.query(sql, (error, results) => {
          if (error) {
            reject(error);
          }
          const newUser = {
            id: results.insertId,
            email,
            age,
            company: {
              id: val,
              name: company,
            },
          };
          this.users.push(newUser);
          resolve(newUser);
        });
      });
    });
  }
  /**
   * get all users
   */
  getAllUsers() {
    return this.users;
  }
  /**
   * get an user by email
   * @param {String} email
   */
  getUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }
  /**
   * get an user by id
   * @param {Int} id
   */
  getUserById(id) {
    return this.users.find(user => user.id === Number(id));
  }
  /**
   * update an user
   * @param {Object} args
   */
  async updateUser(args) {
    return new Promise((resolve, reject) => {
      const {
        id,
        email,
        age,
        company,
      } = args;
      this.setCompany(company).then((val) => {
        const sql = `UPDATE users SET email="${email}", age=${age}, company="${val}" WHERE id=${id};`;
        this.connection.query(sql, (error) => {
          if (error) {
            reject(error);
          }
          const user = this.getUserById(id);
          if (!user) {
            reject(new Error('user not found'));
          } else {
            user.email = email;
            user.age = age;
            user.company = {
              id: val,
              name: company,
            };
            resolve(user);
          }
        });
      });
    });
  }
  /**
   * delete an user
   * @param {Int} id
   */
  async deleteUser(args) {
    return new Promise((resolve, reject) => {
      const { id } = args;
      const sql = `DELETE FROM users WHERE id=${id};`;
      this.connection.query(sql, (error) => {
        if (error) {
          reject(error);
        }
        const user = this.getUserById(id);
        const index = this.users.findIndex(u => u.id === id);
        if (index > -1) {
          this.users.splice(index, 1);
        }
        resolve(user);
      });
    });
  }
};
